import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCamera, FaUserShield, FaMobileAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("phones");
  const [phones, setPhones] = useState([]);
  const [admins, setAdmins] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  
  // NEW: Track if we are checking permissions
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- PERMISSION LOGIC ---
  const MAIN_ADMIN_EMAIL = "mooneweea@gmail.com"; 
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isMainAdmin = userEmail === MAIN_ADMIN_EMAIL;
  // We calculate isSubAdmin later after fetching

  const [formData, setFormData] = useState({
    name: "", price: "", category: "iphone", coverImage: "", 
    latest: true, recommend: false, description: "", year: "2024",
    specs: { display: "", processor: "", ram: "", storage: "", battery: "", camera: "" },
    stores: []
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // 1. Fetch Phones
    fetch("http://localhost:5000/api/phones")
      .then(res => res.json())
      .then(data => setPhones(data))
      .catch(err => console.error("Phones Error:", err));

    // 2. Fetch Admins & Update Loading State
    fetch("http://localhost:5000/api/admins")
      .then(res => res.json())
      .then(data => {
        setAdmins(data);
        setCheckingAuth(false); // <--- STOP LOADING HERE
      })
      .catch(err => {
        console.error("Admins Error:", err);
        setCheckingAuth(false);
      });
  }, [isLoaded, isSignedIn]);

  // --- LOADING GUARD ---
  if (!isLoaded || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Verifying Admin Access...</div>
      </div>
    );
  }

  // --- ACCESS CHECK ---
  // Now we check permissions safely because 'admins' is fully loaded
  const isSubAdmin = admins.some(a => a.email === userEmail);
  const hasAccess = isMainAdmin || isSubAdmin;

  if (!isSignedIn || !hasAccess) {
    return <Navigate to="/dashboard" />;
  }

  // --- HANDLERS (Same as before) ---
  const handleOpenAdd = () => { setEditingId(null); setFormData({
    name: "", price: "", category: "iphone", coverImage: "", 
    latest: true, recommend: false, description: "", year: "2024",
    specs: { display: "", processor: "", ram: "", storage: "", battery: "", camera: "" },
    stores: []
  }); setIsModalOpen(true); };
  
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
      },
      stores: phone.stores || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this phone permanently?")) {
        await fetch(`http://localhost:5000/api/phones/${id}`, { method: 'DELETE' });
        setPhones(phones.filter(p => p._id !== id));
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

  const handleStoreChange = (index, field, value) => {
    const updatedStores = [...formData.stores];
    updatedStores[index][field] = value;
    setFormData({ ...formData, stores: updatedStores });
  };
  const addStore = () => setFormData({ ...formData, stores: [...formData.stores, { name: "", price: "", url: "" }] });
  const removeStore = (index) => setFormData({ ...formData, stores: formData.stores.filter((_, i) => i !== index) });

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

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    try {
        const res = await fetch("http://localhost:5000/api/admins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: newAdminEmail })
        });
        const data = await res.json();
        if (res.ok) {
            setAdmins([...admins, data]);
            setNewAdminEmail("");
            alert("New Admin Added!");
        } else {
            alert("Failed: " + (data.error || "Unknown Error"));
        }
    } catch (err) { alert("Network Error"); }
  };

  const handleRemoveAdmin = async (id) => {
    if (window.confirm("Remove access?")) {
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
            {/* TAB 1: MANAGE PHONES (Visible to Everyone) */}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        
        {/* VIEW: MANAGE PHONES */}
        {activeTab === "phones" && (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Phone Inventory</h1>
                    <button onClick={handleOpenAdd} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md">
                      <FaPlus /> Add New Phone
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {phones.map((phone) => (
                                <tr key={phone._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{phone.name}</td>
                                    <td className="p-4 font-bold text-[#667eea]">${phone.price}</td>
                                    <td className="p-4 flex gap-3 justify-end">
                                        <button onClick={() => handleOpenEdit(phone)} className="text-blue-500 p-2"><FaEdit /></button>
                                        <button onClick={() => handleDelete(phone._id)} className="text-red-500 p-2"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* VIEW: MANAGE ROLES (Only Main Admin) */}
        {activeTab === "roles" && isMainAdmin && (
            <div className="max-w-4xl mx-auto">
                 <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Admin Access</h1>
                 
                 {/* Add Admin */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h3 className="font-bold mb-4">Add New Admin</h3>
                    <form onSubmit={handleAddAdmin} className="flex gap-4">
                        <input type="email" placeholder="Email..." className="flex-1 border p-3 rounded-lg" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} required />
                        <button type="submit" className="bg-[#667eea] text-white px-6 py-3 rounded-lg font-bold">Grant Access</button>
                    </form>
                 </div>

                 {/* List Admins */}
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="p-2 font-bold bg-blue-50 mb-2 rounded text-blue-800">You (Super Admin): {MAIN_ADMIN_EMAIL}</div>
                    {admins.map((admin) => (
                        <div key={admin._id} className="flex justify-between items-center p-3 border-b last:border-0">
                            <span>{admin.email}</span>
                            <button onClick={() => handleRemoveAdmin(admin._id)} className="text-red-500 text-sm font-bold">Remove</button>
                        </div>
                    ))}
                 </div>
            </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl relative h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4"><FaTimes size={24}/></button>
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
                
                {/* Store Links Section */}
                <div className="border p-4 rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Store Links</h3>
                    {formData.stores.map((store, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input placeholder="Store Name" value={store.name} onChange={(e) => handleStoreChange(index, "name", e.target.value)} className="border p-2 rounded w-1/3" />
                            <input placeholder="Price" value={store.price} onChange={(e) => handleStoreChange(index, "price", e.target.value)} className="border p-2 rounded w-1/4" />
                            <input placeholder="URL" value={store.url} onChange={(e) => handleStoreChange(index, "url", e.target.value)} className="border p-2 rounded flex-1" />
                            <button type="button" onClick={() => removeStore(index)} className="text-red-500"><FaTrash /></button>
                        </div>
                    ))}
                    <button type="button" onClick={addStore} className="text-blue-600 font-bold text-sm">+ Add Store</button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(formData.specs).map(key => (
                    <input key={key} placeholder={key} className="border p-2 rounded" value={formData.specs[key]} onChange={handleSpecChange} name={key} />
                  ))}
                </div>
                <textarea placeholder="Description" className="w-full border p-2 rounded" rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
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