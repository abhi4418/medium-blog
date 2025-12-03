import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./BlogCard"
import { getUserIdFromToken, logout } from "../utils/auth"
import { useEffect, useState } from "react"

export const AppBar = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getUserIdFromToken().then(setUserId)
  }, [])

  const handleLogout = () => {
    logout()
    setUserId(null)
    navigate('/signin')
  }
  
  return (
    <div className="border-b bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-4 flex justify-between items-center">
        <Link className="flex flex-col justify-center cursor-pointer" to={'/blogs'}>
          <span className="text-2xl font-bold text-gray-900">Inkwell</span>
        </Link>

        <div className="flex items-center gap-4">
          {userId && (
            <>
              <Link to={'/my-posts'}>
                <button 
                  type="button" 
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  My Posts
                </button>
              </Link>
              <Link to={'/publish'}>
                <button 
                  type="button" 
                  className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                >
                  New Post
                </button>
              </Link>
              <button
                onClick={handleLogout}
                type="button"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </>
          )}
          <Avatar size="big" name="User" />
        </div>
      </div>
    </div>
  )
}