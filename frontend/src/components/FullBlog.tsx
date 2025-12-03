import { Blog } from "../hooks"
import { AppBar } from "./AppBar"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate, useParams } from "react-router-dom"
import { Avatar } from "./BlogCard"
import { getUserIdFromToken } from "../utils/auth"
import { useEffect, useState } from "react"

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    useEffect(() => {
        getUserIdFromToken().then(setCurrentUserId)
    }, [])

    const isAuthor = currentUserId === blog.authorId

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }
        return date.toLocaleDateString('en-US', options)
    }

    const handleEdit = () => {
        if (!id) return
        navigate(`/blog/${id}/edit`)
    }

    const handleDelete = async () => {
        if (!id) return
        // simple confirm before delete
        const confirmed = window.confirm("Are you sure you want to delete this post?")
        if (!confirmed) return

        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token") || "",
                },
            })
            navigate("/blogs")
        } catch (error) {
            alert("Failed to delete post. You may not have permission.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar />
            <div className="flex justify-center py-8">
                <div className="grid grid-cols-12 px-4 md:px-10 w-full max-w-screen-xl gap-8">
                    <div className="col-span-12 md:col-span-8">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <div className="text-4xl font-extrabold text-gray-900 mb-3">
                                        {blog.title}
                                    </div>
                                    <div className="text-slate-500 text-sm">
                                        Posted on {formatDate(blog.createdAt)}
                                    </div>
                                </div>
                                {isAuthor && (
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={handleEdit}
                                            className="px-4 py-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 text-sm font-medium rounded-lg border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="pt-6 border-t border-gray-200">
                                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {blog.content}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <Avatar size="big" name={blog.author.name || "Anonymous"} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-slate-600 uppercase tracking-wide mb-1">
                                        Author
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 mb-2">
                                        {blog.author.name || "Anonymous"}
                                    </div>
                                    <div className="text-sm text-slate-500 leading-relaxed">
                                        Writer sharing thoughts and stories through Inkwell
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
