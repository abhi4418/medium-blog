import { AppBar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { Blog } from "../hooks"
import { useNavigate } from "react-router-dom"

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    return date.toLocaleDateString('en-US', options)
}

export const MyPosts = () => {
    const [loading, setLoading] = useState(true)
    const [blogs, setBlogs] = useState<Blog[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/signin")
            return
        }

        axios.get(`${BACKEND_URL}/api/v1/blog/my-posts`, {
            headers: {
                Authorization: token,
            },
        })
            .then(res => {
                setBlogs(res.data.blogs)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [navigate])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppBar />
                <div className="flex justify-center py-8">
                    <div className="w-full max-w-screen-md px-4">
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar />
            <div className="flex justify-center py-8">
                <div className="w-full max-w-screen-md px-4">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
                        <p className="text-gray-600">Manage and view all your published posts</p>
                    </div>
                    {blogs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 text-lg mb-4">You haven't published any posts yet.</p>
                            <button
                                onClick={() => navigate("/publish")}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Your First Post
                            </button>
                        </div>
                    ) : (
                        blogs.map(blog => (
                            <BlogCard
                                key={blog.id}
                                authorName={blog.author.name || "Anonymous"}
                                title={blog.title}
                                content={blog.content}
                                id={blog.id}
                                publishedDate={formatDate(blog.createdAt)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

