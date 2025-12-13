import React from 'react';
import { SignIn } from "@clerk/clerk-react"; // Import Clerk Component

const Login = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Keep your existing Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-br from-[#667eea]/20 to-[#764ba2]/20 blur-3xl opacity-50"></div>
      </div>

      {/* Clerk Login Component */}
      <SignIn 
        signUpUrl="/signup" 
        forceRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-white rounded-2xl shadow-2xl border border-gray-100",
            headerTitle: "text-2xl font-bold text-gray-800",
            headerSubtitle: "text-gray-500",
            formButtonPrimary: "bg-linear-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg transition-all",
            footerActionLink: "text-[#667eea] font-bold hover:underline"
          }
        }}
      />
    </div>
  );
};

export default Login;