import { createBrowserRouter } from "react-router-dom";
import App from "../App"; 
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Compare from "../pages/compare/Compare";
import Login from "../pages/UI/Login";
import Signup from "../pages/UI/SignUp";
import PhoneDetail from "../pages/phones/PhoneDetail";
import AdminDashboard from "../pages/admin/AdminDashboard"; // Import Admin Page
import Search from "../pages/search/Search";
import AllPhones from "../pages/home/Allphones";
import UserDashboard from "../pages/user/UserDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About/> },
      { path: "/compare", element: <Compare/> },
      { path: "/login", element: <Login/> },
      { path: "/signup", element: <Signup/> },
      { path: "/phones/:id", element: <PhoneDetail/> },
      { path: "/search", element: <Search /> },
      { path: "/phones", element: <AllPhones /> },
      
      // Add the Admin Route here
      { 
        path: "/admin-dashboard", 
        element: <AdminDashboard/> 
      },

      {
        path: "/dashboard",
        element: <UserDashboard />
      }

    ],
  },
]);

export default router;