import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { AppBar } from "../components/AppBar"
import { BACKEND_URL } from "../config"
import { useBlog } from "../hooks"
import { Spinner } from "../components/Spinner"
import { getUserIdFromToken } from "../utils/auth"

export const EditBlog = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { blog, loading } = useBlog({ id: id || "" })
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        getUserIdFromToken().then(setCurrentUserId)
    }, [])

    useEffect(() => {
        if (blog && currentUserId !== null) {
            // Check if user is the author
            if (currentUserId !== blog.authorId) {
                navigate(`/blog/${id}`)
                return
            }
            setTitle(blog.title)
            setContent(blog.content)
        }
    }, [blog, currentUserId, id, navigate])

    if (loading || !blog) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppBar />
                <div className="h-screen flex flex-col justify-center items-center">
                    <Spinner />
                </div>
            </div>
        )
    }

    // Double check authorization
    if (currentUserId !== blog.authorId) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar />
            <div className="flex justify-center w-full pt-8 pb-16">
                <div className="max-w-screen-lg w-full px-4">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                        <p className="text-gray-600 text-sm mt-1">Make changes to your post</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className="bg-white border border-gray-300 text-gray-900 text-xl font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-4"
                            placeholder="Title"
                        />
                        <TextEditor
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={async () => {
                                    if (!id) return
                                    try {
                                        setSaving(true)
                                        await axios.put(
                                            `${BACKEND_URL}/api/v1/blog`,
                                            {
                                                id,
                                                title,
                                                content,
                                            },
                                            {
                                                headers: {
                                                    Authorization:
                                                        localStorage.getItem("token") || "",
                                                },
                                            },
                                        )
                                        navigate(`/blog/${id}`)
                                    } catch (error) {
                                        alert("Failed to save changes. You may not have permission.")
                                    } finally {
                                        setSaving(false)
                                    }
                                }}
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-60 transition-colors"
                            >
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                            <button
                                onClick={() => navigate(`/blog/${id}`)}
                                type="button"
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TextEditor({
    value,
    onChange,
}: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
    return (
        <div className="w-full">
            <textarea
                value={value}
                onChange={onChange}
                id="editor"
                rows={16}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg resize-none"
                placeholder="Write your article here..."
                required
            />
        </div>
    )
}


