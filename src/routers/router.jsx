import { createBrowserRouter } from "react-router-dom";
import App from "../App"; 
import Home from "../pages/home/Home";
import About from "../pages/about/About";  // Fixed path based on your folders
import Compare from "../pages/compare/Compare";
import Login from "../pages/UI/Login";
import PhoneDetail from "../pages/phones/PhoneDetail"; // Import your new page

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About/>
      },
      {
        path: "/compare",
        element: <Compare/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      // Add this dynamic route
      {
        path: "/phones/:id", 
        element: <PhoneDetail/>
      }
    ],
  },
]);

export default router;