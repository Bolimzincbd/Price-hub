import { createBrowserRouter } from "react-router-dom";
import App from "../App"; 
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Compare from "../pages/compare/Compare";
import Login from "../pages/UI/Login";
import Signup from "../pages/UI/SignUp"; // Import the new page
import PhoneDetail from "../pages/phones/PhoneDetail";

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
      {
        path: "/signup", // Add this new path
        element: <Signup/>
      },
      {
        path: "/phones/:id", 
        element: <PhoneDetail/>
      }
    ],
  },
]);

export default router;