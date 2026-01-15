import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { getImgUrl } from "../../utils/getImgUrl";
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaExchangeAlt, 
  FaStore, 
  FaCheckCircle 
} from "react-icons/fa";

const PhoneDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("specs");
  
  // Feature States
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Notification State
  const [toastMessage, setToastMessage] = useState("");

  // 1. Fetch Phone Data
  useEffect(() => {
    fetch(`http://localhost:5000/api/phones/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPhone(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

  // 2. Check Wishlist Status
  useEffect(() => {
    if (user && phone?._id) {
        fetch(`http://localhost:5000/api/wishlist/${user.id}`)
            .then(res => res.json())
            .then(data => {
                const exists = data.some(item => {
                    const itemId = item.phoneId?._id || item.phoneId;
                    return String(itemId) === String(phone._id);
                });
                setInWishlist(exists);
            })
            .catch(err => console.error(err));
    }
  }, [user, phone]);

  const showNotification = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleWishlist = async () => {
    if (!user) return showNotification("Please login to use wishlist");
    
    const previousState = inWishlist;
    setInWishlist(!previousState);

    try {
        let res;
        if (previousState) {
            res = await fetch(`http://localhost:5000/api/wishlist/${user.id}/${phone._id}`, { method: "DELETE" });
        } else {
            res = await fetch(`http://localhost:5000/api/wishlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, phoneId: phone._id })
            });
        }
        if (!res.ok) throw new Error("Failed to update wishlist");
        const data = await res.json();
        showNotification(previousState ? "Removed from Wishlist" : "Added to Wishlist");
    } catch (err) { 
        console.error(err); 
        setInWishlist(previousState);
        showNotification("Error updating wishlist");
    }
  };

  const handleAddToCompare = () => {
    const currentList = JSON.parse(localStorage.getItem("compareList")) || [];
    if (currentList.some(p => p._id === phone._id)) {
        showNotification("Already in comparison list");
        return;
    }
    if (currentList.length >= 3) {
        showNotification("Comparison list is full (Max 3)");
        return;
    }
    const newList = [...currentList, phone];
    localStorage.setItem("compareList", JSON.stringify(newList));
    showNotification("Added to Compare!");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    
    const userName = user.fullName || user.firstName || "Anonymous";

    try {
        const res = await fetch(`http://localhost:5000/api/phones/${phone._id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: userName,
                rating: Number(reviewForm.rating),
                comment: reviewForm.comment
            })
        });
        if (!res.ok) throw new Error("Failed to submit review");

        const updatedPhone = await res.json();
        setPhone(updatedPhone);
        setReviewForm({ rating: 5, comment: "" });
        showNotification("Review Submitted!");
    } catch (err) { 
        console.error(err); 
        showNotification("Failed to submit review");
    }
    setSubmittingReview(false);
  };

  const scrollToStores = () => {
    setActiveTab("stores");
    document.getElementById("tabs-section")?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !phone) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="py-12 px-4 max-w-screen-xl mx-auto font-sans relative">
      
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 animate-bounce transition-all">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-gray-700">
            <FaCheckCircle className="text-green-400 text-lg" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-[#667eea]">Home</Link> / <span className="font-semibold text-gray-800">{phone.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] rounded-3xl p-8 flex items-center justify-center min-h-[400px] shadow-inner relative group">
          <button 
            onClick={toggleWishlist}
            className="absolute top-6 right-6 p-4 bg-white rounded-full shadow-xl text-2xl transition-all hover:scale-110 z-20 hover:bg-red-50 cursor-pointer border border-gray-100"
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {inWishlist ? <FaHeart className="text-red-500"/> : <FaRegHeart className="text-gray-400"/>}
          </button>
          <img src={getImgUrl(phone.coverImage)} alt={phone.name} className="max-h-[350px] w-auto object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f1419] mb-4">{phone.name}</h1>
          <div className="flex items-center gap-3 mb-6">
             <div className="text-3xl font-bold text-[#667eea]">${phone.price}</div>
             {phone.latest && <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Latest</span>}
          </div>
          
          <div className="flex gap-4 mb-8">
            <button onClick={scrollToStores} className="flex-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <FaShoppingCart /> Buy Now
            </button>
            <button onClick={handleAddToCompare} className="flex-1 bg-white text-[#667eea] border-2 border-[#667eea] font-bold py-4 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <FaExchangeAlt /> Compare
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold mb-4 text-gray-700">Quick Specs</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400 block text-xs uppercase font-bold">Processor</span> <span className="font-semibold">{phone.specs?.processor || "N/A"}</span></div>
                <div><span className="text-gray-400 block text-xs uppercase font-bold">RAM</span> <span className="font-semibold">{phone.specs?.ram || "N/A"}</span></div>
                <div><span className="text-gray-400 block text-xs uppercase font-bold">Storage</span> <span className="font-semibold">{phone.specs?.storage || "N/A"}</span></div>
                <div><span className="text-gray-400 block text-xs uppercase font-bold">Camera</span> <span className="font-semibold">{phone.specs?.camera || "N/A"}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div id="tabs-section">
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
          {['specs', 'reviews', 'stores'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-[#667eea] text-[#667eea]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {tab === 'specs' ? 'Specifications' : tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm min-h-[300px]">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 animate-fade-in">
                {Object.entries(phone.specs || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 capitalize font-medium">{key}</span>
                    <span className="font-semibold text-gray-900 text-right">{value}</span>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                <SignedIn>
                    <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-bold mb-2">Rating</label>
                                <select 
                                    value={reviewForm.rating} 
                                    onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#667eea] outline-none"
                                >
                                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                </select>
                            </div>
                            <div className="col-span-3">
                                <label className="block text-sm font-bold mb-2">Comment</label>
                                <input 
                                    value={reviewForm.comment}
                                    onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#667eea] outline-none" 
                                    placeholder="Share your thoughts..." 
                                    required
                                />
                            </div>
                        </div>
                        <button disabled={submittingReview} type="submit" className="bg-[#667eea] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5a6fd6] transition-colors shadow-md cursor-pointer disabled:opacity-50">
                            {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </SignedIn>
                <SignedOut>
                    <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-300">
                        <p className="mb-4 text-gray-500 font-medium">Please login to share your experience</p>
                        <SignInButton mode="modal">
                            <button className="text-[#667eea] font-bold hover:underline cursor-pointer">Login to Review</button>
                        </SignInButton>
                    </div>
                </SignedOut>
              </div>

              <h3 className="text-xl font-bold mb-6">User Reviews ({phone.reviews?.length || 0})</h3>
              <div className="space-y-6">
                {phone.reviews?.length > 0 ? (
                    phone.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 text-xs">
                                    {review.user ? review.user.charAt(0) : "A"}
                                </div>
                                <span className="font-bold text-gray-800">{review.user || "Anonymous"}</span>
                            </div>
                            <span className="text-yellow-400 text-sm">{"★".repeat(review.rating)}<span className="text-gray-200">{"★".repeat(5-review.rating)}</span></span>
                        </div>
                        <p className="text-gray-600 ml-10 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">No reviews yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="space-y-4 animate-fade-in">
                {phone.stores?.length > 0 ? (
                    phone.stores.map((store, index) => (
                        <div key={index} className="flex flex-col sm:flex-row justify-between items-center p-5 border border-gray-200 rounded-xl bg-white hover:border-[#667eea] group transition-all shadow-sm">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                            <div className="bg-gray-50 p-3 rounded-lg text-2xl text-[#667eea]"><FaStore/></div>
                            <span className="font-bold text-lg text-gray-800">{store.name}</span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            <span className="font-bold text-2xl text-[#667eea]">${store.price}</span>
                            <a 
                                href={store.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#667eea] transition-all shadow-md transform active:scale-95"
                            >
                                Visit Store
                            </a>
                        </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        <p>No store listings available for this device.</p>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;