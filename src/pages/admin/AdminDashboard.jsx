import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUserShield, FaMobileAlt, FaNewspaper } from "react-icons/fa";
import config from '../../config';

const AdminDashboard = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("phones");
  const [phones, setPhones] = useState([]);
  const [blogs, setBlogs] = useState([]); // <--- NEW: Blogs State
  const [admins, setAdmins] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- FORM DATA STATE ---
  const [phoneForm, setPhoneForm] = useState({
    name: "", price: "", category: "iphone", coverImage: "", 
    latest: true, recommend: false, description: "", year: "2024",
    specs: { display: "", processor: "", ram: "", storage: "", battery: "", camera: "" },
    stores: []
  });

  const [blogForm, setBlogForm] = useState({
    title: "", excerpt: "", content: "", category: "Technology", image: ""
  });

  const MAIN_ADMIN_EMAIL = "mooneweea@gmail.com"; 
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isMainAdmin = userEmail === MAIN_ADMIN_EMAIL;

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Fetch Phones
    fetch(`${config.baseURL}/api/phones`)
      .then(res => res.json())
      .then(data => setPhones(data))
      .catch(err => console.error("Phones Error:", err));

    // Fetch Blogs
    fetch(`${config.baseURL}/api/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error("Blogs Error:", err));

    // Fetch Admins
    fetch(`${config.baseURL}/api/admins`)
      .then(res => res.json())
      .then(data => {
        setAdmins(data);
        setCheckingAuth(false);
      })
      .catch(err => {
        console.error("Admins Error:", err);
        setCheckingAuth(false);
      });
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Verifying Admin Access...</div>
      </div>
    );
  }

  const isSubAdmin = admins.some(a => a.email === userEmail);
  const hasAccess = isMainAdmin || isSubAdmin;

  if (!isSignedIn || !hasAccess) {
    return <Navigate to="/dashboard" />;
  }

  // --- HANDLERS ---

  const handleOpenAdd = () => {
    setEditingId(null);
    if (activeTab === "phones") {
        setPhoneForm({
            name: "", price: "", category: "iphone", coverImage: "", 
            latest: true, recommend: false, description: "", year: "2024",
            specs: { display: "", processor: "", ram: "", storage: "", battery: "", camera: "" },
            stores: []
        });
    } else if (activeTab === "blogs") {
        setBlogForm({ title: "", excerpt: "", content: "", category: "Technology", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    if (activeTab === "phones") {
        setPhoneForm({
            ...item,
            coverImage: item.coverImage || "",
            specs: { 
                display: item.specs?.display || "", 
                processor: item.specs?.processor || "", 
                ram: item.specs?.ram || "", 
                storage: item.specs?.storage || "", 
                battery: item.specs?.battery || "", 
                camera: item.specs?.camera || "" 
            },
            stores: item.stores || []
        });
    } else if (activeTab === "blogs") {
        setBlogForm(item);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if(type === 'phone') setPhoneForm({ ...phoneForm, coverImage: reader.result });
        if(type === 'blog') setBlogForm({ ...blogForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this item permanently?")) {
        const endpoint = activeTab === "phones" ? "phones" : "blogs";
        await fetch(`${config.baseURL}/api/${endpoint}/${id}`, { method: 'DELETE' });
        
        if (activeTab === "phones") setPhones(phones.filter(p => p._id !== id));
        if (activeTab === "blogs") setBlogs(blogs.filter(b => b._id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === "phones" ? "phones" : "blogs";
    const bodyData = activeTab === "phones" ? phoneForm : blogForm;
    const url = editingId ? `${config.baseURL}/api/${endpoint}/${editingId}` : `${config.baseURL}/api/${endpoint}`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    if (res.ok) {
        const savedItem = await res.json();
        if (activeTab === "phones") {
            setPhones(editingId ? phones.map(p => p._id === editingId ? savedItem : p) : [...phones, savedItem]);
        } else {
            setBlogs(editingId ? blogs.map(b => b._id === editingId ? savedItem : b) : [...blogs, savedItem]);
        }
        setIsModalOpen(false);
    }
  };

  // --- PHONE STORE HANDLERS ---
  const handleStoreChange = (index, field, value) => {
    const updatedStores = [...phoneForm.stores];
    updatedStores[index][field] = value;
    setPhoneForm({ ...phoneForm, stores: updatedStores });
  };
  const addStore = () => setPhoneForm({ ...phoneForm, stores: [...phoneForm.stores, { name: "", price: "", url: "" }] });
  const removeStore = (index) => setPhoneForm({ ...phoneForm, stores: phoneForm.stores.filter((_, i) => i !== index) });
  
  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setPhoneForm(prev => ({ ...prev, specs: { ...prev.specs, [name]: value } }));
  };

  // --- ADMIN HANDLERS ---
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    try {
        const res = await fetch(`${config.baseURL}/api/admins`, {
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
        await fetch(`${config.baseURL}/api/admins/${id}`, { method: 'DELETE' });
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
            <button 
                onClick={() => setActiveTab("phones")}
                className={`w-full text-left p-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === "phones" ? "bg-[#667eea] text-white" : "text-gray-400 hover:bg-gray-800"}`}
            >
                <FaMobileAlt /> Manage Phones
            </button>

            {/* NEW BLOG TAB */}
            <button 
                onClick={() => setActiveTab("blogs")}
                className={`w-full text-left p-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === "blogs" ? "bg-[#667eea] text-white" : "text-gray-400 hover:bg-gray-800"}`}
            >
                <FaNewspaper /> Manage Blogs
            </button>

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

        {/* VIEW: MANAGE BLOGS (NEW) */}
        {activeTab === "blogs" && (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
                    <button onClick={handleOpenAdd} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md">
                      <FaPlus /> Add New Blog
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-xl shadow border p-4 flex flex-col">
                            {blog.image && <img src={blog.image} className="h-32 w-full object-cover rounded mb-3" alt="blog"/>}
                            <h3 className="font-bold text-lg mb-1">{blog.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{blog.excerpt}</p>
                            <div className="flex justify-between mt-auto pt-3 border-t">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{blog.category}</span>
                                <div className="flex gap-3">
                                    <button onClick={() => handleOpenEdit(blog)} className="text-blue-500"><FaEdit /></button>
                                    <button onClick={() => handleDelete(blog._id)} className="text-red-500"><FaTrash /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* VIEW: MANAGE ROLES (Only Main Admin) */}
        {activeTab === "roles" && isMainAdmin && (
            <div className="max-w-4xl mx-auto">
                 <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Admin Access</h1>
                 
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h3 className="font-bold mb-4">Add New Admin</h3>
                    <form onSubmit={handleAddAdmin} className="flex gap-4">
                        <input type="email" placeholder="Email..." className="flex-1 border p-3 rounded-lg" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} required />
                        <button type="submit" className="bg-[#667eea] text-white px-6 py-3 rounded-lg font-bold">Grant Access</button>
                    </form>
                 </div>

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
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit" : "Add New"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* --- PHONE FORM FIELDS --- */}
                {activeTab === "phones" && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Name" className="border p-2 rounded" value={phoneForm.name} onChange={e=>setPhoneForm({...phoneForm, name: e.target.value})} required/>
                            <input placeholder="Price" type="number" className="border p-2 rounded" value={phoneForm.price} onChange={e=>setPhoneForm({...phoneForm, price: e.target.value})} required/>
                        </div>
                        <select className="w-full border p-2 rounded" value={phoneForm.category} onChange={e => setPhoneForm({...phoneForm, category: e.target.value})}>
                            <option value="iphone">iPhone</option>
                            <option value="samsung">Samsung</option>
                            <option value="oneplus">OnePlus</option>
                        </select>
                        
                        <div className="border p-4 rounded bg-gray-50">
                            <h3 className="font-bold mb-2">Store Links</h3>
                            {phoneForm.stores.map((store, index) => (
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
                          {Object.keys(phoneForm.specs).map(key => (
                            <input key={key} placeholder={key} className="border p-2 rounded" value={phoneForm.specs[key]} onChange={handleSpecChange} name={key} />
                          ))}
                        </div>
                        <textarea placeholder="Description" className="w-full border p-2 rounded" rows="3" value={phoneForm.description} onChange={e=>setPhoneForm({...phoneForm, description: e.target.value})} />
                        <div className="border p-4 rounded border-dashed">
                            <p className="mb-2 font-bold">Cover Image</p>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'phone')} />
                            {phoneForm.coverImage && <img src={phoneForm.coverImage} className="h-20 mt-2 rounded" alt="preview" />}
                        </div>
                    </>
                )}

                {/* --- BLOG FORM FIELDS (NEW) --- */}
                {activeTab === "blogs" && (
                    <>
                        <input 
                            placeholder="Blog Title" 
                            className="border p-2 rounded w-full font-bold" 
                            value={blogForm.title} 
                            onChange={e=>setBlogForm({...blogForm, title: e.target.value})} 
                            required
                        />
                        <select 
                            className="border p-2 rounded w-full"
                            value={blogForm.category}
                            onChange={e=>setBlogForm({...blogForm, category: e.target.value})}
                        >
                            <option>Technology</option>
                            <option>Reviews</option>
                            <option>Guides</option>
                            <option>News</option>
                        </select>
                        <textarea 
                            placeholder="Short Excerpt (Summary)" 
                            className="border p-2 rounded w-full h-20" 
                            value={blogForm.excerpt} 
                            onChange={e=>setBlogForm({...blogForm, excerpt: e.target.value})} 
                            required
                        />
                        <textarea 
                            placeholder="Full Content (Standard Blog Text)" 
                            className="border p-2 rounded w-full h-64" 
                            value={blogForm.content} 
                            onChange={e=>setBlogForm({...blogForm, content: e.target.value})} 
                            required
                        />
                        <div className="border p-4 rounded border-dashed">
                             <p className="mb-2 font-bold">Blog Thumbnail Image</p>
                             <input type="file" onChange={(e) => handleImageUpload(e, 'blog')} />
                             {blogForm.image && <img src={blogForm.image} alt="preview" className="h-20 mt-2 rounded" />}
                        </div>
                    </>
                )}

                <button type="submit" className="w-full bg-[#667eea] text-white p-3 rounded font-bold">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;