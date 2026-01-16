import React, { useEffect, useState } from "react";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Phonecard from "../card/Phonecard";
import config from '../../config';


const UserDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- AUTO REDIRECT ADMINS ---
  useEffect(() => {
    if (isLoaded && user) {
        const email = user.primaryEmailAddress.emailAddress;
        
        // 1. Check Main Admin
        if (email === "mooneweea@gmail.com") {
            navigate("/admin-dashboard");
            return;
        }

        // 2. Check Sub Admin
        fetch(`${config.baseURL}/api/admins`)
            .then(res => res.json())
            .then(data => {
                if (data.some(admin => admin.email === email)) {
                    navigate("/admin-dashboard");
                }
            })
            .catch(err => console.error(err));
    }
  }, [isLoaded, user, navigate]);

  // --- FETCH WISHLIST ---
  useEffect(() => {
    if (user) {
      fetch(`${config.baseURL}/api/wishlist/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setWishlist(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching wishlist:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const removeFromWishlist = async (wishlistItemId) => {
    if(!window.confirm("Remove this phone from wishlist?")) return;
    try {
        const res = await fetch(`${config.baseURL}/api/wishlist/item/${wishlistItemId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete");
        setWishlist(wishlist.filter(item => item._id !== wishlistItemId));
    } catch (err) { console.error(err); alert("Failed to remove item."); }
  };

  return (
    <div className="max-w-screen-2xl mx-auto py-12 px-6 font-sans">
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl p-8 mb-12 text-white flex flex-col md:flex-row items-center gap-6 shadow-lg">
        <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white/30" />
        <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Hello, {user.firstName}!</h1>
            <p className="opacity-90">Member since {new Date(user.createdAt).getFullYear()}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">My Wishlist ({wishlist.length})</h2>
      
      {loading ? (
        <div className="text-center py-10">Loading wishlist...</div>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
                if (!item.phoneId) return null;
                return (
                    <div key={item._id} className="relative group">
                        <div className="h-[420px]">
                            <Phonecard phone={item.phoneId} />
                        </div>
                    </div>
                );
            })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty.</p>
            <a href="/phones" className="text-[#667eea] font-bold hover:underline">Browse Phones</a>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;