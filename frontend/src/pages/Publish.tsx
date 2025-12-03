import { AppBar } from "../components/AppBar"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Publish = () => {
    const navigate = useNavigate() ;
    const [title , setTitle] = useState("") ;
    const [content , setContent] = useState("") ;
    const [publishing, setPublishing] = useState(false)
    
    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar />
            <div className="flex justify-center w-full pt-8 pb-16">
                <div className="max-w-screen-lg w-full px-4">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                        <p className="text-gray-600 text-sm mt-1">Share your thoughts with the world</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <input
                            onChange={(e)=> setTitle(e.target.value)}
                            type="text"
                            value={title}
                            className="bg-white border border-gray-300 text-gray-900 text-xl font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-4"
                            placeholder="Title"
                        />
                        <TextEditor onChange={(e)=> setContent(e.target.value)} value={content} />
                        <button
                            onClick={async () => {
                                if (!title.trim() || !content.trim()) {
                                    alert("Please fill in both title and content")
                                    return
                                }
                                try {
                                    setPublishing(true)
                                    const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                                        title,
                                        content,
                                    } , {
                                        headers : {
                                            Authorization : localStorage.getItem("token") || ""
                                        }
                                    })

                                    navigate(`/blog/${response.data.id}`)
                                } catch (error) {
                                    alert("Failed to publish post. Please try again.")
                                } finally {
                                    setPublishing(false)
                                }
                            }}
                            type="submit"
                            disabled={publishing}
                            className="mt-6 px-6 py-2.5 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-60 transition-colors"
                        >
                            {publishing ? "Publishing..." : "Publish post"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TextEditor({onChange, value} : {onChange : (e : React.ChangeEvent<HTMLTextAreaElement>) => void, value: string}) {
    return (
        <div className="w-full">
            <textarea
                onChange={onChange}
                value={value}
                id="editor"
                rows={16}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg resize-none"
                placeholder="Write your article here..."
                required
            />
        </div>
    )
}
