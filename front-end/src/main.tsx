import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import{AuthProvider} from "./context/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  { path: "/", element: <ProtectedRoute><div>hello</div></ProtectedRoute> },

]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
 
  </StrictMode>
);
