import { Link } from "react-router-dom";

interface BlogCardProps {
    authorName : string ;
    title : string ;
    content : string ;
    publishedDate : string ;
    id : string ;
}

export const BlogCard = ({authorName , title , content , publishedDate , id} : BlogCardProps) => {
  return (
    <Link to ={`/blog/${id}`}>
        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4 cursor-pointer border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
                <Avatar name={authorName} />
                <div className="font-medium text-sm text-gray-700"> {authorName} </div>
                <Circle />
                <div className="text-xs text-slate-500"> {publishedDate} </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                {title}
            </div>

            <div className="text-gray-600 mb-4 leading-relaxed">
                {content.slice(0 , 150) + (content.length > 150 ? "..." : "")}
            </div>

            <div className="text-slate-500 text-sm">
                {`${Math.ceil(content.length / 100)} minute(s) read`}
            </div>
        </div>
    </Link>
  )
}

export function Circle(){
    return <div className="h-1 w-1 rounded-full bg-slate-500">
    </div>
}

export function Avatar({name , size = "small"} : {name : string , size?: "small" | "big"}){
    return <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 ${size==='small'? "w-6 h-6" : "w-10 h-10"}`}>
        <span className={`${size==='small' ? "text-xs" : "text-md"} text-gray-600 dark:text-gray-300`}>{name[0].toUpperCase()}</span>
    </div>   
}

