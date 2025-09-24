import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import{AuthProvider} from "./context/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/NavBar/Header";
import EntitiesPage from "./Pages/Entities/Entities";
import BookPage from "./Pages/Books/Books";

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
  { path: "/", element: <ProtectedRoute><BookPage/></ProtectedRoute> },
  { path: "/entities", element: <ProtectedRoute><EntitiesPage /></ProtectedRoute> }


]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ padding: "0px", margin: "0px", width: "100%", height: "100vh" }}>
      <AuthProvider>
        <Header />
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  </StrictMode>
);

