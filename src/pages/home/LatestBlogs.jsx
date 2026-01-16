import React from "react";
import { Link } from "react-router-dom";

// Importing specific images from your assets to use as blog thumbnails
import blogImg1 from "../../assets/phones/apple-iphone-13-pro.jpg";
import blogImg2 from "../../assets/phones/samsung-galaxy-s23-ultra.jpg";
import blogImg3 from "../../assets/phones/oneplus-11.jpg";

const blogs = [
  {
    id: 1,
    title: "The Future of 5G Smartphones",
    excerpt: "Explore how 5G technology is transforming the mobile industry and what it means for your next device upgrade.",
    date: "Oct 15, 2023",
    image: blogImg1,
    category: "Technology"
  },
  {
    id: 2,
    title: "Camera Wars: Pixel vs iPhone vs Galaxy",
    excerpt: "A deep dive into the camera capabilities of the leading flagship phones. Which one takes the crown for photography?",
    date: "Oct 10, 2023",
    image: blogImg2,
    category: "Reviews"
  },
  {
    id: 3,
    title: "Top 5 Budget Phones for 2024",
    excerpt: "You don't need to break the bank to get a great phone. Here are our top picks for budget-friendly devices this year.",
    date: "Oct 5, 2023",
    image: blogImg3,
    category: "Guides"
  }
];

const LatestBlogs = () => {
  return (
    <div className="py-10 px-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Latest from our blogs
        </div>
        
        <Link to="/blogs" className="text-[#536471] hover:text-[#667eea] cursor-pointer transition-colors font-medium">
          View All →
        </Link>
      </div>

      {/* Grid Layout for Blogs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group">
            {/* Image Container */}
            <div className="h-48 overflow-hidden relative">
                <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0f1419] text-xs font-bold px-3 py-1 rounded-full">
                    {blog.category}
                </span>
            </div>
            
            {/* Content Container */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-[#536471] mb-3">
                <span>{blog.date}</span>
                <span>•</span>
                <span>5 min read</span>
              </div>
              
              <h3 className="text-lg font-bold text-[#0f1419] mb-2 group-hover:text-[#667eea] transition-colors line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-[#536471] text-sm line-clamp-2 mb-4">
                {blog.excerpt}
              </p>
              
              <div className="flex items-center text-[#667eea] font-medium text-sm group-hover:underline">
                Read Article
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlogs;