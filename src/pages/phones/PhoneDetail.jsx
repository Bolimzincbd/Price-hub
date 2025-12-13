import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { getImgUrl } from "../../utils/getImgUrl";
import { FaHeart, FaRegHeart, FaShoppingCart, FaExchangeAlt, FaStore } from "react-icons/fa";

const PhoneDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("specs");
  
  // States for new features
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/phones/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPhone(data);
        setLoading(false);
        // Check wishlist status if user is logged in
        if (user) checkWishlistStatus(data._id);
      })
      .catch((error) => console.error("Error:", error));
  }, [id, user]);

  const checkWishlistStatus = async (phoneId) => {
    if (!user) return;
    try {
        const res = await fetch(`http://localhost:5000/api/wishlist/${user.id}`);
        const data = await res.json();
        const exists = data.some(item => item.phoneId._id === phoneId || item.phoneId === phoneId);
        setInWishlist(exists);
    } catch(err) { console.error(err); }
  };

  const toggleWishlist = async () => {
    if (!user) return alert("Please login to use wishlist");
    
    try {
        if (inWishlist) {
            await fetch(`http://localhost:5000/api/wishlist/${user.id}/${phone._id}`, { method: "DELETE" });
            setInWishlist(false);
        } else {
            await fetch(`http://localhost:5000/api/wishlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, phoneId: phone._id })
            });
            setInWishlist(true);
        }
    } catch (err) { console.error(err); }
  };

  const handleAddToCompare = () => {
    const currentList = JSON.parse(localStorage.getItem("compareList")) || [];
    if (currentList.some(p => p._id === phone._id)) {
        alert("Already in comparison list");
        return;
    }
    if (currentList.length >= 3) {
        alert("Comparison list full (Max 3)");
        return;
    }
    const newList = [...currentList, phone];
    localStorage.setItem("compareList", JSON.stringify(newList));
    alert("Added to Compare! Go to the Compare page to view.");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    try {
        const res = await fetch(`http://localhost:5000/api/phones/${phone._id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: user.fullName || user.firstName,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            })
        });
        const updatedPhone = await res.json();
        setPhone(updatedPhone);
        setReviewForm({ rating: 5, comment: "" });
    } catch (err) { console.error(err); }
    setSubmittingReview(false);
  };

  // Scroll to stores section
  const scrollToStores = () => {
    setActiveTab("stores");
    document.getElementById("tabs-section").scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !phone) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="py-12 px-4 max-w-screen-xl mx-auto font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left: Image */}
        <div className="bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] rounded-3xl p-8 flex items-center justify-center min-h-[400px] shadow-inner relative">
          <button 
            onClick={toggleWishlist}
            className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg text-xl transition-all hover:scale-110 z-10"
          >
            {inWishlist ? <FaHeart className="text-red-500"/> : <FaRegHeart className="text-gray-400"/>}
          </button>
          <img src={getImgUrl(phone.coverImage)} alt={phone.name} className="max-h-[350px] w-auto object-contain mix-blend-multiply drop-shadow-2xl" />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f1419] mb-4">{phone.name}</h1>
          <div className="text-3xl font-bold text-[#667eea] mb-6">${phone.price}</div>
          
          <div className="flex gap-4 mb-8">
            <button onClick={scrollToStores} className="flex-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <FaShoppingCart /> Buy Now
            </button>
            <button onClick={handleAddToCompare} className="flex-1 bg-white text-[#667eea] border-2 border-[#667eea] font-bold py-4 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              <FaExchangeAlt /> Compare
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold mb-4 text-gray-700">Quick Specs</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400 block text-xs uppercase">Processor</span> <span className="font-semibold">{phone.specs?.processor}</span></div>
                <div><span className="text-gray-400 block text-xs uppercase">RAM</span> <span className="font-semibold">{phone.specs?.ram}</span></div>
                <div><span className="text-gray-400 block text-xs uppercase">Storage</span> <span className="font-semibold">{phone.specs?.storage}</span></div>
                <div><span className="text-gray-400 block text-xs uppercase">Camera</span> <span className="font-semibold">{phone.specs?.camera}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div id="tabs-section">
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {['specs', 'reviews', 'stores'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? "border-[#667eea] text-[#667eea]" : "border-transparent text-gray-400"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {/* SPECS TAB */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {Object.entries(phone.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 capitalize">{key}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                <SignedIn>
                    <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-xl">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Rating</label>
                            <select 
                                value={reviewForm.rating} 
                                onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}
                                className="w-full p-2 border rounded-lg"
                            >
                                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Comment</label>
                            <textarea 
                                value={reviewForm.comment}
                                onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                                className="w-full p-3 border rounded-lg" 
                                rows="3" 
                                placeholder="Share your thoughts..." 
                                required
                            />
                        </div>
                        <button disabled={submittingReview} type="submit" className="bg-[#667eea] text-white px-6 py-2 rounded-lg font-bold">
                            {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </SignedIn>
                <SignedOut>
                    <div className="bg-gray-50 p-6 rounded-xl text-center">
                        <p className="mb-4 text-gray-500">Please login to write a review</p>
                        <SignInButton mode="modal">
                            <button className="text-[#667eea] font-bold hover:underline">Login Now</button>
                        </SignInButton>
                    </div>
                </SignedOut>
              </div>

              <h3 className="text-xl font-bold mb-6">User Reviews ({phone.reviews?.length || 0})</h3>
              <div className="space-y-6">
                {phone.reviews?.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">{review.user}</span>
                        <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* STORES TAB */}
          {activeTab === 'stores' && (
            <div className="space-y-4">
                {phone.stores?.map((store, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-white hover:border-[#667eea] group transition-all">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-lg text-2xl text-gray-600"><FaStore/></div>
                        <span className="font-bold text-lg">{store.name}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-bold text-xl text-[#667eea]">${store.price}</span>
                        <a 
                            href={store.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#667eea] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#5a6fd6] transition-colors"
                        >
                            Go to Store
                        </a>
                      </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;