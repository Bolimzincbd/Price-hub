import React from "react";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

const UserDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  // Redirect admin to admin dashboard if they try to access user dashboard
  const isAdmin = user?.publicMetadata?.role === "admin" || user?.primaryEmailAddress?.emailAddress?.includes("admin");
  if (isAdmin) {
      window.location.href = "/admin-dashboard";
      return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex items-center gap-8">
        <img src={user.imageUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#667eea]" />
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.firstName}!</h1>
            <p className="text-gray-500 mt-2">Manage your saved phones and comparisons here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#667eea] transition-colors cursor-pointer">
            <h3 className="text-xl font-bold mb-2">My Wishlist</h3>
            <p className="text-gray-500">You have 0 saved items.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#667eea] transition-colors cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Recent Comparisons</h3>
            <p className="text-gray-500">View your last comparison history.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;