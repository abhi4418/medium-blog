import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { decode, sign, verify } from "hono/jwt"
import { createBlogInput , updateBlogInput } from "@abhishekg202004/medium-common"

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL : string ,
        JWT_SECRET : string 
    } ,
    Variables : {
        userId : string
    }
}>() ;


// return the userId of the logged in user , else block them from the website
blogRouter.use("/*" , async (c , next)=>{
    const authHeader = c.req.header("authorization") || ""  ;
    try{
    const user = await verify(authHeader , c.env.JWT_SECRET) ;
    if(user){
        c.set("userId" , user.id) ;
        await next() ;
    }
    else {
        c.status(403) ;
        return c.json({
            message : "You are not logged in"
        })
    }
    }
    catch(e){
        c.status(403) ;
        return c.json({
            message : "You are not logged in" 
        })
    }
})

blogRouter.post("/", async (c) => {
    // create a blog post
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json() ;
    const {success} = createBlogInput.safeParse(body) ;
    if(!success){
        c.status(411) ;
        return c.json({
            message : "Inputs not correct"
        })
    }
    const authorId = c.get("userId") ;

    const blog = await prisma.post.create({
        data : {
            title : body.title ,
            content : body.content ,
            authorId : authorId
        }
    })

    return c.json({
        id : blog.id
    })
})

blogRouter.put("/", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json() ;
    const {success} = updateBlogInput.safeParse(body) ;
    if(!success){
        c.status(411) ;
        return c.json({
            message : "Inputs not correct"
        })
    }
    const blog = await prisma.post.update({
        data : {
            title : body.title ,
            content : body.content
        } , 
        where : {
            id : body.id
        }
    })

    return c.json({
        id : blog.id
    })
})

//TODO - pagination
blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.post.findMany({
        select :{
            content : true ,
            title : true ,
            id : true ,
            author : {
                select : {
                    name : true
                }
            } 
        }
    }) ;
     
    return c.json({
        blogs
    })
})


blogRouter.get("/:id", async (c) => {
    const id = c.req.param("id") ;
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
            where : {
                id
            } , 
            select :{
                title : true ,
                content : true ,
                id : true ,
                author : {
                    select : {
                        name : true 
                    }
                }
            }
        })
        return c.json({
            blog
        })
    }
    catch(e){
        c.status(411) ;
        return c.json({
            message : "Error while fetching the blog post"
        })
    }   
})
