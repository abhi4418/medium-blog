import { AppBar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks"

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    return date.toLocaleDateString('en-US', options)
}

export const Blogs = () => {
  const {loading , blogs} = useBlogs() ;
  if(loading){
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar />
        <div className="flex justify-center py-8">
          <div className="w-full max-w-screen-md">
            <BlogSkeleton />
            <BlogSkeleton />
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
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No posts yet. Be the first to publish!</p>
            </div>
          ) : (
            blogs.map(blog =>(
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