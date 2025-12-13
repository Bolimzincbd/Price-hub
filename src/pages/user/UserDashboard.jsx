import React, { useEffect, useState } from "react";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import Phonecard from "../card/Phonecard";

const UserDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Wishlist
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/wishlist/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // data is array of wishlist items: { _id, phoneId: { ...phoneData }, userId }
          setWishlist(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  // Admin Redirect
  const ADMIN_EMAIL = "mooneweea@gmail.com"; 
  if (user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      window.location.href = "/admin-dashboard";
      return null;
  }

  const removeFromWishlist = async (phoneId) => {
    try {
        await fetch(`http://localhost:5000/api/wishlist/${user.id}/${phoneId}`, { method: 'DELETE' });
        setWishlist(wishlist.filter(item => item.phoneId._id !== phoneId));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-screen-2xl mx-auto py-12 px-6">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl p-8 mb-12 text-white flex items-center gap-6 shadow-lg">
        <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white/30" />
        <div>
            <h1 className="text-3xl font-bold">Hello, {user.firstName}!</h1>
            <p className="opacity-90">Member since {new Date(user.createdAt).getFullYear()}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist ({wishlist.length})</h2>
      
      {loading ? (
        <p>Loading wishlist...</p>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
                <div key={item._id} className="relative group">
                    <button 
                        onClick={() => removeFromWishlist(item.phoneId._id)}
                        className="absolute top-2 right-2 z-20 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                        title="Remove"
                    >
                        ✕
                    </button>
                    <div className="h-[420px]">
                        <Phonecard phone={item.phoneId} />
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty.</p>
            <a href="/#browse" className="text-[#667eea] font-bold hover:underline">Browse Phones</a>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;