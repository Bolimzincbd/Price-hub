import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaUser } from "react-icons/fa";
import config from '../../config';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.baseURL}/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Article...</div>;
  if (!blog) return <div className="text-center py-20 text-gray-500">Article not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <FaArrowLeft /> Back to Home
      </Link>

      {/* Category Badge */}
      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
        {blog.category}
      </span>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
        {blog.title}
      </h1>

      {/* Meta Data */}
      <div className="flex items-center gap-6 text-gray-500 text-sm mb-8 border-b border-gray-100 pb-8">
        <div className="flex items-center gap-2">
          <FaUser /> {blog.author}
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Main Image */}
      {blog.image && (
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10 shadow-lg"
        />
      )}

      {/* Content Body */}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>
    </div>
  );
};

export default BlogDetail;