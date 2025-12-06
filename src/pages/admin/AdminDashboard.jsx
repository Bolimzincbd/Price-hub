import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isSignedIn } = useUser();
  const [phones, setPhones] = useState([]);
  const [activeTab, setActiveTab] = useState("phones");
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPhoneData, setNewPhoneData] = useState({
    name: "", price: "", category: "iphone", coverImage: "apple-iphone-11.jpg", 
    latest: true, recommend: false, description: "", year: "2024"
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

  // --- ACTIONS ---

  // DELETE
  const handleDelete = async (id) => {
    if(window.confirm("Delete this phone?")) {
        try {
            await fetch(`http://localhost:5000/api/phones/${id}`, { method: 'DELETE' });
            setPhones(phones.filter(p => p._id !== id));
        } catch (error) { console.error(error); }
    }
  };

  // EDIT START
  const handleEdit = (phone) => {
    setEditId(phone._id);
    setEditFormData(phone);
  };

  // EDIT SAVE (PUT)
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

  // ADD NEW (POST)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/phones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoneData)
      });
      const savedPhone = await res.json();
      setPhones([...phones, savedPhone]);
      setIsAddModalOpen(false);
      alert("Phone Added Successfully!");
    } catch (error) { console.error(error); }
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
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
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
                            <td className="p-4">
                                {editId === phone._id ? (
                                    <input 
                                      className="border p-1 rounded w-full" 
                                      value={editFormData.name} 
                                      onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                                    />
                                ) : phone.name}
                            </td>
                            <td className="p-4">
                                {editId === phone._id ? (
                                    <input 
                                      type="number"
                                      className="border p-1 rounded w-24" 
                                      value={editFormData.price} 
                                      onChange={e => setEditFormData({...editFormData, price: e.target.value})} 
                                    />
                                ) : `$${phone.price}`}
                            </td>
                            <td className="p-4 capitalize">
                                {editId === phone._id ? (
                                    <input 
                                      className="border p-1 rounded w-full" 
                                      value={editFormData.category} 
                                      onChange={e => setEditFormData({...editFormData, category: e.target.value})} 
                                    />
                                ) : phone.category}
                            </td>
                            <td className="p-4 flex gap-2 justify-end">
                                {editId === phone._id ? (
                                    <button onClick={() => handleSave(phone._id)} className="text-green-600 p-2"><FaSave/></button>
                                ) : (
                                    <button onClick={() => handleEdit(phone)} className="text-gray-500 p-2"><FaEdit/></button>
                                )}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={20}/></button>
            <h2 className="text-2xl font-bold mb-6">Add New Phone</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Name</label>
                <input required className="w-full border p-2 rounded" value={newPhoneData.name} onChange={e => setNewPhoneData({...newPhoneData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Price</label>
                  <input required type="number" className="w-full border p-2 rounded" value={newPhoneData.price} onChange={e => setNewPhoneData({...newPhoneData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select className="w-full border p-2 rounded" value={newPhoneData.category} onChange={e => setNewPhoneData({...newPhoneData, category: e.target.value})}>
                    <option value="iphone">iPhone</option>
                    <option value="samsung">Samsung</option>
                    <option value="oneplus">OnePlus</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-[#667eea] text-white py-3 rounded-lg font-bold hover:bg-[#5a6fd6]">Add Phone</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;