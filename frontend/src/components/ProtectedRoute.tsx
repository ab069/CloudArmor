import { Navigate, Outlet } from "react-router-dom"; import { useAuthStore } from "../store/authStore";
export default function ProtectedRoute() { const t = useAuthStore((s) => s.token); return t ? <Outlet /> : <Navigate to="/login" replace />; }
