import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { decode, sign, verify } from "hono/jwt"
import { signupInput , signinInput } from "@abhishekg202004/medium-common"

export const userRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string ,
        JWT_SECRET : string 
    },
    Variables : {
        userId : string
    }
}>() ;

userRouter.post("/signup", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const {success} = signupInput.safeParse(body) ;
    if(!success){
        c.status(411); 
        return c.json({
            message : "Inputs not correct"
        })
    }

    try {
        //TODO - zod and hash the password
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name : body.name
            },
        })

        const token = await sign({
                id: user.id,
            },
            c.env.JWT_SECRET
        )

        return c.json({
            jwt: token,
        })
    } catch (e) {
        c.status(403)
        return c.json({ error: "error while signing up" })
    }
})

userRouter.post("/signin", async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const body = await c.req.json() ;
    const {success} = signinInput.safeParse(body) ;
    if(!success){
        c.status(411) ;
        return c.json({
            message : "Inputs not correct"
        })
    }
    const user = await prisma.user.findUnique({
        where:{
            email : body.email ,
            password : body.password 
        }
    })

    if(!user){
        c.status(403) ; // unauthorized
        return c.json({error : "user not found"}) ;
    }

    const jwt = await sign({id : user.id} , c.env.JWT_SECRET) ;
    return c.json({jwt})
})

// Get current user info (requires authentication)
userRouter.get("/me", async (c) => {
    const authHeader = c.req.header("authorization") || ""
    
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET)
        
        if (!user || !user.id) {
            c.status(403)
            return c.json({
                message: "You are not logged in",
            })
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const userData = await prisma.user.findUnique({
            where: {
                id: user.id as string,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        if (!userData) {
            c.status(404)
            return c.json({
                message: "User not found",
            })
        }

        return c.json({
            id: userData.id,
            name: userData.name,
            email: userData.email,
        })
    } catch (e) {
        c.status(403)
        return c.json({
            message: "You are not logged in",
        })
    }
})