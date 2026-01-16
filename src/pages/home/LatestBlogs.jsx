import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data.slice(0, 3))) // Only show top 3
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Latest from our blogs
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link to={`/blogs/${blog._id}`} key={blog._id}>
            <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group h-full flex flex-col">
              {/* Image */}
              <div className="h-48 overflow-hidden relative bg-gray-200">
                {blog.image ? (
                   <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0f1419] text-xs font-bold px-3 py-1 rounded-full">
                    {blog.category}
                </span>
              </div>
              
              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-[#536471] mb-3">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-[#0f1419] mb-2 group-hover:text-[#667eea] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-[#536471] text-sm line-clamp-2 mb-4 flex-1">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center text-[#667eea] font-medium text-sm group-hover:underline mt-auto">
                  Read Article
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestBlogs;