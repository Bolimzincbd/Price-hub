import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCamera } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isSignedIn } = useUser();
  const [phones, setPhones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we are editing or adding

  // Initial State for resetting the form
  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);

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

  // --- HANDLERS ---

  // Open Modal for NEW Phone
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open Modal for EDITING Phone
  const handleOpenEdit = (phone) => {
    setEditingId(phone._id);
    setFormData({
      name: phone.name,
      price: phone.price,
      category: phone.category,
      coverImage: phone.coverImage || "",
      latest: phone.latest || false,
      recommend: phone.recommend || false,
      description: phone.description || "",
      year: phone.year || "",
      specs: {
        display: phone.specs?.display || "",
        processor: phone.specs?.processor || "",
        ram: phone.specs?.ram || "",
        storage: phone.specs?.storage || "",
        battery: phone.specs?.battery || "",
        camera: phone.specs?.camera || "",
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this phone permanently?")) {
        try {
            await fetch(`http://localhost:5000/api/phones/${id}`, { method: 'DELETE' });
            setPhones(phones.filter(p => p._id !== id));
        } catch (error) { console.error(error); }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [name]: value }
    }));
  };

  // Unified Submit Handler (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine URL and Method based on editingId
    const url = editingId 
      ? `http://localhost:5000/api/phones/${editingId}`
      : 'http://localhost:5000/api/phones';
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to save");
      
      const savedPhone = await res.json();

      // Update Local State
      if (editingId) {
        setPhones(phones.map(p => p._id === editingId ? savedPhone : p));
      } else {
        setPhones([...phones, savedPhone]);
      }

      setIsModalOpen(false);
      alert(editingId ? "Phone Updated Successfully!" : "Phone Added Successfully!");
    } catch (error) { 
      console.error(error);
      alert("Error saving phone. Ensure image size is not too large."); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#1f2937] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-[#667eea]">Admin Panel</h2>
        <div className="space-y-2">
          <button className="w-full text-left p-3 bg-[#667eea] rounded-lg font-medium">Manage Phones</button>
          {/* Add more sidebar items here later */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Phone Inventory</h1>
            <button onClick={handleOpenAdd} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md transition-all">
              <FaPlus /> Add New Phone
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                        <th className="p-4 font-semibold">Product Name</th>
                        <th className="p-4 font-semibold">Price</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {phones.map((phone) => (
                        <tr key={phone._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">{phone.name}</td>
                            <td className="p-4 text-[#667eea] font-bold">${phone.price}</td>
                            <td className="p-4 capitalize text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wide font-bold">{phone.category}</span>
                            </td>
                            <td className="p-4 flex gap-3 justify-end">
                                <button 
                                  onClick={() => handleOpenEdit(phone)} 
                                  className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <FaEdit size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(phone._id)} 
                                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <FaTrash size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* UNIFIED ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl relative shadow-2xl animate-fade-in">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><FaTimes size={24}/></button>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
              {editingId ? "Edit Phone" : "Add New Phone"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold mb-2 text-gray-700">Phone Name</label>
                  <input required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. iPhone 15 Pro" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold mb-2 text-gray-700">Price ($)</label>
                  <input required type="number" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="999" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Category</label>
                  <select className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-[#667eea] focus:outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="iphone">iPhone</option>
                    <option value="samsung">Samsung</option>
                    <option value="oneplus">OnePlus</option>
                    <option value="google">Google</option>
                    <option value="xiaomi">Xiaomi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Release Year</label>
                  <input type="number" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>

                {/* Flags */}
                <div className="col-span-2 flex gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-[#667eea]" checked={formData.latest} onChange={e => setFormData({...formData, latest: e.target.checked})} />
                    <span className="font-medium text-gray-700">Mark as Latest</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-[#667eea]" checked={formData.recommend} onChange={e => setFormData({...formData, recommend: e.target.checked})} />
                    <span className="font-medium text-gray-700">Mark as Recommended</span>
                  </label>
                </div>

                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2 text-gray-700">Phone Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg border border-gray-300 transition-colors w-fit">
                      <FaCamera />
                      <span>{formData.coverImage ? "Change Image" : "Upload Image"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                    {formData.coverImage && (
                      <div className="h-20 w-20 border rounded-lg overflow-hidden relative shadow-sm bg-white p-1">
                         <img src={formData.coverImage} alt="Preview" className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs Section */}
              <div className="border-t border-gray-200 pt-6 mt-2">
                <h3 className="text-lg font-bold text-[#667eea] mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['ram', 'storage', 'processor', 'display', 'battery', 'camera'].map((field) => (
                    <div key={field}>
                        <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wide">{field}</label>
                        <input 
                          name={field} 
                          className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none" 
                          value={formData.specs[field]} 
                          onChange={handleSpecChange} 
                          placeholder={`Enter ${field}`} 
                        />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Description</label>
                <textarea 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none" 
                  rows="3" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Brief description of the phone..."
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:opacity-95 transition-all"
                >
                  {editingId ? "Update Phone" : "Save Phone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;