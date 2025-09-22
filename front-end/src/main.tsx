import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import{AuthProvider} from "./context/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/NavBar/Header";
import App from "./App";

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  { path: "/", element: <ProtectedRoute><App/></ProtectedRoute> },


]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AuthProvider>
      <Header />
      <RouterProvider router={router} />
    </AuthProvider>
 
  </StrictMode>
);
