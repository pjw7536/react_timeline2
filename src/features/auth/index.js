// src/features/auth/index.js
export { default as AutoLoginGate } from "./components/AutoLoginGate";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { AuthProvider, useAuth } from "./contexts/AuthContext";
export { authService } from "./services/authService";
