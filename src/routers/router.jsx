import { createBrowserRouter } from "react-router-dom";
import App from "../App"; 
import Home from "../pages/home/Home";
import About from "../pages/About"
import Compare from "../pages/compare/Compare";

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
      }
    ],
  },
]);

export default router;