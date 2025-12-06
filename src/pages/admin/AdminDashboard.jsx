import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes, FaCamera } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isSignedIn } = useUser();
  const [phones, setPhones] = useState([]);
  const [activeTab, setActiveTab] = useState("phones");
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Initial state includes specs and empty coverImage
  const [newPhoneData, setNewPhoneData] = useState({
    name: "", 
    price: "", 
    category: "iphone", 
    coverImage: "", 
    latest: true, 
    recommend: false, 
    description: "", 
    year: "2024",
    specs: {
      display: "",
      processor: "",
      ram: "",
      storage: "",
      battery: "",
      camera: ""
    }
  });

  // REPLACE WITH YOUR ADMIN EMAIL
  const ADMIN_EMAIL = "mooneweea@gmail.com"; 
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    fetch("http://localhost:5000/api/phones")
      .then(res => res.json())
      .then(data => setPhones(data))
      .catch(err => console.error(err));
  }, []);

  if (!isSignedIn || !isAdmin) return <Navigate to="/dashboard" />;

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the Base64 string as the coverImage
        setNewPhoneData({ ...newPhoneData, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ACTIONS ---

  const handleDelete = async (id) => {
    if(window.confirm("Delete this phone?")) {
        try {
            await fetch(`http://localhost:5000/api/phones/${id}`, { method: 'DELETE' });
            setPhones(phones.filter(p => p._id !== id));
        } catch (error) { console.error(error); }
    }
  };

  const handleEdit = (phone) => {
    setEditId(phone._id);
    setEditFormData(phone);
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/phones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const updatedPhone = await res.json();
      setPhones(phones.map(p => p._id === id ? updatedPhone : p));
      setEditId(null);
    } catch (error) { console.error(error); }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/phones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoneData)
      });
      if (!res.ok) throw new Error("Failed to save");
      
      const savedPhone = await res.json();
      setPhones([...phones, savedPhone]);
      setIsAddModalOpen(false);
      
      // Reset form
      setNewPhoneData({
        name: "", price: "", category: "iphone", coverImage: "", 
        latest: true, recommend: false, description: "", year: "2024",
        specs: { display: "", processor: "", ram: "", storage: "", battery: "", camera: "" }
      });
      alert("Phone Added Successfully!");
    } catch (error) { 
      console.error(error);
      alert("Error adding phone. Make sure the image isn't too large."); 
    }
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setNewPhoneData(prev => ({
      ...prev,
      specs: { ...prev.specs, [name]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <div className="w-64 bg-[#1f2937] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-[#667eea]">Admin</h2>
        <button onClick={() => setActiveTab("phones")} className="w-full text-left p-3 bg-[#667eea] rounded-lg">Manage Phones</button>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Phones</h1>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaPlus /> Add New Phone
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 border-b">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {phones.map((phone) => (
                        <tr key={phone._id} className="hover:bg-gray-50">
                            <td className="p-4">{phone.name}</td>
                            <td className="p-4">${phone.price}</td>
                            <td className="p-4 capitalize">{phone.category}</td>
                            <td className="p-4 flex gap-2 justify-end">
                                <button onClick={() => handleDelete(phone._id)} className="text-red-500 p-2"><FaTrash/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* ADD PHONE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={20}/></button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Phone</h2>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1 text-gray-700">Phone Name</label>
                  <input required className="w-full border border-gray-300 p-2 rounded-lg" value={newPhoneData.name} onChange={e => setNewPhoneData({...newPhoneData, name: e.target.value})} placeholder="e.g. iPhone 15 Pro" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Price ($)</label>
                  <input required type="number" className="w-full border border-gray-300 p-2 rounded-lg" value={newPhoneData.price} onChange={e => setNewPhoneData({...newPhoneData, price: e.target.value})} placeholder="999" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Category</label>
                  <select className="w-full border border-gray-300 p-2 rounded-lg bg-white" value={newPhoneData.category} onChange={e => setNewPhoneData({...newPhoneData, category: e.target.value})}>
                    <option value="iphone">iPhone</option>
                    <option value="samsung">Samsung</option>
                    <option value="oneplus">OnePlus</option>
                    <option value="google">Google</option>
                  </select>
                </div>

                {/* --- CAMERA UPLOAD INPUT --- */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1 text-gray-700">Phone Image (Camera/Upload)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors">
                      <FaCamera />
                      <span>Take Photo / Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                    {newPhoneData.coverImage && (
                      <div className="h-16 w-16 border rounded-lg overflow-hidden relative">
                         <img src={newPhoneData.coverImage} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Year</label>
                  <input type="number" className="w-full border border-gray-300 p-2 rounded-lg" value={newPhoneData.year} onChange={e => setNewPhoneData({...newPhoneData, year: e.target.value})} />
                </div>
              </div>

              {/* Specs Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-bold text-[#667eea] mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['ram', 'storage', 'processor', 'display', 'battery', 'camera'].map((field) => (
                    <div key={field}>
                        <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">{field}</label>
                        <input name={field} className="w-full border border-gray-300 p-2 rounded-lg" value={newPhoneData.specs[field]} onChange={handleSpecChange} placeholder={field} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Description</label>
                <textarea className="w-full border border-gray-300 p-2 rounded-lg" rows="3" value={newPhoneData.description} onChange={e => setNewPhoneData({...newPhoneData, description: e.target.value})} />
              </div>

              <button className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Save Phone
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;