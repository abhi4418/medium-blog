import { SignupInput } from "@abhishekg202004/medium-common"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { clearUserIdCache } from "../utils/auth"

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate() ;
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: "",
    })

    async function sendRequest(){
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup" ? "signup" : "signin"}` , postInputs) ;
            const jwt = response.data.jwt;
            localStorage.setItem("token", jwt);
            clearUserIdCache(); // Clear cache so new user ID is fetched
            navigate('/blogs') ;
        }
        catch(e){
            //alert that the request failed
            // give a toast
            alert("Request failed") ;
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col bg-gray-50">
            <div className="flex justify-center">
                <div className="px-10 w-full max-w-md">
                    <div className="mb-8">
                        <Link to="/blogs" className="text-3xl font-bold text-gray-900 mb-2 block">
                            Inkwell
                        </Link>
                        <div className="text-3xl font-extrabold text-gray-900 mb-2">
                            {type === "signup" ? "Create an Account" : "Welcome Back"}
                        </div>

                        <div className="text-slate-600">
                            {type==="signin"? "Don't have an account?" : "Already have an account?"}
                            <Link className="pl-2 text-blue-600 hover:text-blue-700 font-medium" to={type==="signin" ? "/signup" :"/signin"}>
                            {type==="signin"? "Sign up" : "Sign in"} 
                            </Link>
                        </div>
                    </div>

                    <div className="pt-4">
                        {type==="signup"?<LabelledInput
                            label="Name"
                            placeholder="Ankur Yadav..."
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value,
                                })
                            }}
                        />:null}

                        <LabelledInput
                            label="Email"
                            placeholder="abc@gmail.com"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    email: e.target.value,
                                })
                            }}
                        />

                        <LabelledInput
                            label="Password"
                            type={"password"}
                            placeholder="123456"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    password: e.target.value,
                                })
                            }}
                        />

                        <button
                            onClick={sendRequest}
                            type="button"
                            className="text-white w-full mt-8 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                        >
                            {type==="signup" ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label: string
    placeholder: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
}

function LabelledInput({
    label,
    placeholder,
    onChange,
    type,
}: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-black text-semibold pt-4">
                {label}
            </label>
            <input
                onChange={onChange}
                type={type || "text"}
                id="first_name"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors"
                placeholder={placeholder}
                required
            />
        </div>
    )
}
