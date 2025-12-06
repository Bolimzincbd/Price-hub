import { createBrowserRouter } from "react-router-dom";
import App from "../App"; 
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Compare from "../pages/compare/Compare";
import Login from "../pages/UI/Login";
import Signup from "../pages/UI/SignUp";
import PhoneDetail from "../pages/phones/PhoneDetail";
import AdminDashboard from "../pages/admin/AdminDashboard"; // Import Admin Page

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
      
      // Add the Admin Route here
      { 
        path: "/admin-dashboard", 
        element: <AdminDashboard/> 
      }
    ],
  },
]);

export default router;