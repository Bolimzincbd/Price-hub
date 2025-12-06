import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FaEdit, FaLink, FaChartLine, FaTrash, FaSave } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [phones, setPhones] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [editId, setEditId] = useState(null);

  // Mock data for traffic
  const trafficData = [
    { name: 'Mon', visits: 4000 },
    { name: 'Tue', visits: 3000 },
    { name: 'Wed', visits: 2000 },
    { name: 'Thu', visits: 2780 },
    { name: 'Fri', visits: 1890 },
    { name: 'Sat', visits: 2390 },
    { name: 'Sun', visits: 3490 },
  ];

  // Example Delete Function in AdminDashboard.jsx
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure?")) {
        try {
            await fetch(`http://localhost:5000/api/phones/${id}`, { method: 'DELETE' });
            setPhones(phones.filter(p => p._id !== id));
        } catch (error) {
            console.error("Error deleting phone:", error);
        }
    }
  };
  
  // Basic admin check - In production use Public Metadata
  const isAdmin = user?.publicMetadata?.role === "admin" || user?.primaryEmailAddress?.emailAddress?.includes("admin");

  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleEdit = (id) => setEditId(id);
  
  const handleSave = (id) => {
    // In a real app, this would send a PUT request to backend
    setEditId(null);
    alert("Saved successfully! (Changes are local only for this demo)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1f2937] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-[#667eea]">Admin Panel</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full text-left p-3 rounded-lg ${activeTab === "overview" ? "bg-[#667eea]" : "hover:bg-gray-700"}`}>Overview</button>
          <button onClick={() => setActiveTab("phones")} className={`w-full text-left p-3 rounded-lg ${activeTab === "phones" ? "bg-[#667eea]" : "hover:bg-gray-700"}`}>Manage Phones</button>
          <button onClick={() => setActiveTab("users")} className={`w-full text-left p-3 rounded-lg ${activeTab === "users" ? "bg-[#667eea]" : "hover:bg-gray-700"}`}>Users</button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
            <div className="flex items-center gap-2">
                <img src={user.imageUrl} className="w-10 h-10 rounded-full" alt="Admin" />
                <span className="font-semibold">{user.fullName}</span>
            </div>
        </div>

        {activeTab === "overview" && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 mb-1">Total Visits</div>
                        <div className="text-3xl font-bold text-[#667eea]">24,592</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 mb-1">Active Phones</div>
                        <div className="text-3xl font-bold text-[#764ba2]">{phones.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 mb-1">User Signups</div>
                        <div className="text-3xl font-bold text-green-500">1,204</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaChartLine /> Traffic Overview</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trafficData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="visits" fill="#667eea" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {activeTab === "phones" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b">
                        <tr>
                            <th className="p-4">Phone Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Store Link</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {phones.map((phone) => (
                            <tr key={phone._id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">
                                    {editId === phone._id ? <input type="text" defaultValue={phone.name} className="border p-1 rounded w-full" /> : phone.name}
                                </td>
                                <td className="p-4 text-[#667eea] font-bold">
                                     {editId === phone._id ? <input type="number" defaultValue={phone.price} className="border p-1 rounded w-20" /> : `$${phone.price}`}
                                </td>
                                <td className="p-4 capitalize">
                                     {editId === phone._id ? <input type="text" defaultValue={phone.category} className="border p-1 rounded w-full" /> : phone.category}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-blue-500 hover:underline cursor-pointer">
                                        <FaLink /> Manage Links ({phone.stores?.length || 0})
                                    </div>
                                </td>
                                <td className="p-4 flex gap-2 justify-end">
                                    {editId === phone._id ? (
                                        <button onClick={() => handleSave(phone._id)} className="p-2 text-green-600 hover:bg-green-50 rounded"><FaSave /></button>
                                    ) : (
                                        <button onClick={() => handleEdit(phone._id)} className="p-2 text-gray-500 hover:bg-gray-100 rounded"><FaEdit /></button>
                                    )}
                                    <button onClick={() => handleDelete(phone._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;