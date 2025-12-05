import { createBrowserRouter } from "react-router-dom";
import App from "../App"; 
import Home from "../pages/home/Home";
import About from "../pages/about/About"
import Compare from "../pages/compare/Compare";
import Login from "../pages/UI/Login";
import PhoneDetail from "../pages/phones/PhoneDetail"; // Import the new component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",        // Home page
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
        path: "/phones/:id",  // Dynamic Route for Phone Details
        element: <PhoneDetail />
      }
    ],
  },
]);

export default router;