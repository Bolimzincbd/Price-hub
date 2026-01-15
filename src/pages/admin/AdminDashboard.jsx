import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCamera, FaUserShield, FaMobileAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("phones"); // 'phones' or 'roles'
  const [phones, setPhones] = useState([]);
  const [admins, setAdmins] = useState([]); // List of Sub-Admins
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State for new admin
  const [newAdminEmail, setNewAdminEmail] = useState("");

  // --- PERMISSION LOGIC ---
  const MAIN_ADMIN_EMAIL = "mooneweea@gmail.com"; 
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const isMainAdmin = userEmail === MAIN_ADMIN_EMAIL;
  // Check if current user is Main Admin OR is in the Sub-Admin list
  const isSubAdmin = admins.some(a => a.email === userEmail);
  const hasAccess = isMainAdmin || isSubAdmin;

  // Initial Form State
  const initialFormState = {
    name: "", price: "", category: "iphone", coverImage: "", 
    latest: true, recommend: false, description: "", year: "2024",
    specs: { display: "", processor: "", ram: "", storage: "", battery: "", camera: "" }
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // 1. Fetch Phones
    fetch("http://localhost:5000/api/phones")
      .then(res => res.json())
      .then(data => setPhones(data))
      .catch(err => console.error(err));

    // 2. Fetch Admins
    fetch("http://localhost:5000/api/admins")
      .then(res => res.json())
      .then(data => setAdmins(data))
      .catch(err => console.error(err));
  }, [isLoaded, isSignedIn]);


  // --- SECURITY CHECK ---
  if (!isLoaded) return <div>Loading...</div>;
  // If not main admin and no admins loaded yet, wait slightly
  if (isSignedIn && admins.length === 0 && !isMainAdmin) { /* waiting */ }
  
  if (!isSignedIn || !hasAccess) return <Navigate to="/dashboard" />;


  // --- HANDLERS (PHONES) ---
  const handleOpenAdd = () => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); };
  
  const handleOpenEdit = (phone) => {
    setEditingId(phone._id);
    setFormData({
      ...phone,
      coverImage: phone.coverImage || "",
      specs: { 
        display: phone.specs?.display || "", 
        processor: phone.specs?.processor || "", 
        ram: phone.specs?.ram || "", 
        storage: phone.specs?.storage || "", 
        battery: phone.specs?.battery || "", 
        camera: phone.specs?.camera || "" 
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this phone permanently?")) {
        await fetch(`http://localhost:5000/api/phones/${id}`, { method: 'DELETE' });
        setPhones(phones.filter(p => p._id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/api/phones/${editingId}` : 'http://localhost:5000/api/phones';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
        const savedPhone = await res.json();
        setPhones(editingId ? phones.map(p => p._id === editingId ? savedPhone : p) : [...phones, savedPhone]);
        setIsModalOpen(false);
        alert("Success!");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, coverImage: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, specs: { ...prev.specs, [name]: value } }));
  };

  // --- HANDLERS (ROLES) ---
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    const res = await fetch("http://localhost:5000/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail })
    });

    if (res.ok) {
        const newAdmin = await res.json();
        setAdmins([...admins, newAdmin]);
        setNewAdminEmail("");
        alert("New Admin Added!");
    } else {
        alert("Failed. Email might already exist.");
    }
  };

  const handleRemoveAdmin = async (id) => {
    if (window.confirm("Remove access for this user?")) {
        await fetch(`http://localhost:5000/api/admins/${id}`, { method: 'DELETE' });
        setAdmins(admins.filter(a => a._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#1f2937] text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-[#667eea]">Admin Panel</h2>
            <p className="text-xs text-gray-400 mt-1">Hello, {user.firstName}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {/* TAB 1: MANAGE PHONES */}
            <button 
                onClick={() => setActiveTab("phones")}
                className={`w-full text-left p-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === "phones" ? "bg-[#667eea] text-white" : "text-gray-400 hover:bg-gray-800"}`}
            >
                <FaMobileAlt /> Manage Phones
            </button>

            {/* TAB 2: MANAGE ROLES (Visible ONLY to Main Admin) */}
            {isMainAdmin && (
                <button 
                    onClick={() => setActiveTab("roles")}
                    className={`w-full text-left p-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === "roles" ? "bg-[#667eea] text-white" : "text-gray-400 hover:bg-gray-800"}`}
                >
                    <FaUserShield /> Manage Roles
                </button>
            )}
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        
        {/* --- VIEW: MANAGE PHONES --- */}
        {activeTab === "phones" && (
            <div>
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
                                    <td className="p-4 font-medium">{phone.name}</td>
                                    <td className="p-4 text-[#667eea] font-bold">${phone.price}</td>
                                    <td className="p-4 capitalize text-gray-600">
                                      <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wide font-bold">{phone.category}</span>
                                    </td>
                                    <td className="p-4 flex gap-3 justify-end">
                                        <button onClick={() => handleOpenEdit(phone)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><FaEdit size={18} /></button>
                                        <button onClick={() => handleDelete(phone._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><FaTrash size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- VIEW: MANAGE ROLES (Only Main Admin) --- */}
        {activeTab === "roles" && isMainAdmin && (
            <div className="max-w-4xl mx-auto">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Admin Access</h1>
                    <p className="text-gray-500">Grant permission to your friends. They will NOT see this tab.</p>
                </div>

                {/* Add New Admin Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h3 className="font-bold text-lg mb-4">Add New Admin</h3>
                    <form onSubmit={handleAddAdmin} className="flex gap-4">
                        <input 
                            type="email" 
                            placeholder="Enter friend's email address..." 
                            className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] outline-none"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-[#667eea] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#5a6fd6]">
                            Grant Access
                        </button>
                    </form>
                </div>

                {/* List of Admins */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-700">
                        Authorized Users ({admins.length + 1})
                    </div>
                    <div className="divide-y divide-gray-100">
                        {/* Main Admin (You) */}
                        <div className="p-4 flex justify-between items-center bg-blue-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">M</div>
                                <div>
                                    <p className="font-bold text-gray-800">{MAIN_ADMIN_EMAIL}</p>
                                    <p className="text-xs text-blue-600 font-bold uppercase">Super Admin (You)</p>
                                </div>
                            </div>
                        </div>

                        {/* Sub Admins */}
                        {admins.map((admin) => (
                            <div key={admin._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                        {admin.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{admin.email}</p>
                                        <p className="text-xs text-gray-500">Editor Role</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRemoveAdmin(admin._id)}
                                    className="text-red-500 hover:bg-red-50 px-3 py-1 rounded border border-transparent hover:border-red-200 text-sm font-medium transition-all"
                                >
                                    Remove Access
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* MODAL FOR ADD/EDIT PHONES */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl relative shadow-2xl animate-fade-in">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={24}/></button>
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Phone" : "Add Phone"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Name" className="border p-2 rounded" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required/>
                    <input placeholder="Price" type="number" className="border p-2 rounded" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required/>
                </div>
                
                <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="iphone">iPhone</option>
                    <option value="samsung">Samsung</option>
                    <option value="oneplus">OnePlus</option>
                </select>

                {/* Flags */}
                <div className="flex gap-4">
                  <label className="flex gap-2"><input type="checkbox" checked={formData.latest} onChange={e => setFormData({...formData, latest: e.target.checked})} /> Latest</label>
                  <label className="flex gap-2"><input type="checkbox" checked={formData.recommend} onChange={e => setFormData({...formData, recommend: e.target.checked})} /> Recommended</label>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(formData.specs).map(key => (
                    <input key={key} placeholder={key} className="border p-2 rounded" value={formData.specs[key]} onChange={handleSpecChange} name={key} />
                  ))}
                </div>

                <textarea placeholder="Description" className="w-full border p-2 rounded" rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
                
                {/* Image */}
                <input type="file" onChange={handleImageUpload} />

                <button type="submit" className="w-full bg-[#667eea] text-white p-3 rounded font-bold">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;