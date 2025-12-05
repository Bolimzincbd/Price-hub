import React from "react";

const About = () => {
  return (
    <div className="py-12 px-4 max-w-screen-xl mx-auto font-sans">
      {/* Hero Section */}
      <div className="text-center mb-20 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-6 tracking-tight">
          About PriceHub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your ultimate destination for comparing smartphone prices, specs, and features. 
          We help you find the best deals from top retailers so you can make informed decisions.
        </p>
      </div>

      {/* Stats/Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          { title: "10K+", desc: "Phones Listed", icon: "📱" },
          { title: "Real-time", desc: "Price Updates", icon: "⚡" },
          { title: "Trusted", desc: "Reviews & Ratings", icon: "⭐" }
        ].map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-3xl p-8 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex-1 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="opacity-90 leading-relaxed text-lg md:text-xl font-light">
            At PriceHub, we believe technology should be accessible to everyone at the best price. 
            Our algorithm scans thousands of stores to bring you the lowest prices and best deals on the latest smartphones.
          </p>
        </div>
        <div className="flex-1 flex justify-center relative z-10">
           <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-inner transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="h-48 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center text-6xl shadow-sm">
                🚀
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;