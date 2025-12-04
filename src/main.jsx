import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";  // Fixed
import router from "./routers/router";

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<RouterProvider router={router} />);