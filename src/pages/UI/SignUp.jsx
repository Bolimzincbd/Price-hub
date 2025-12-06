import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-br from-[#667eea]/20 to-[#764ba2]/20 blur-3xl opacity-50"></div>
      </div>

      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#667eea] to-[#764ba2]"></div>

        <div className="text-center mb-8">
          <div className="text-3xl font-bold bg-linear-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
            PriceHub
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500">Join us to compare and save</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              placeholder="Create a password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 rounded text-[#667eea] focus:ring-[#667eea] border-gray-300" />
            <span className="text-gray-600 text-sm">
              I agree to the <a href="#" className="text-[#667eea] font-semibold hover:underline">Terms & Conditions</a>
            </span>
          </div>

          <button className="w-full bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-bold py-3.5 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-[#667eea] font-bold hover:underline">Login</Link>
        </div>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-gray-400 text-sm font-medium">Or register with</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            <FcGoogle className="text-xl" />
            <span>Google</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            <FaApple className="text-xl" />
            <span>Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;