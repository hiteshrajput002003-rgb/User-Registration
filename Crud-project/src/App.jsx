import { useEffect, useState, useCallback } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import Toast from "./components/Toast";

function App() {
  // Lazy state initialization (reads localStorage only once on mount)
  const [userReport, setUserReport] = useState(() => {
    try {
      const saved = localStorage.getItem("userReport");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse userReport from localStorage:", error);
      return [];
    }
  });

  // Manage toast notification messages
  const [toast, setToast] = useState(null);

  // Sync userReport state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userReport", JSON.stringify(userReport));
  }, [userReport]);

  // Trigger a toast notification with a custom message and type
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // Add a new user with a unique ID
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: window.crypto?.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    setUserReport((prev) => [...prev, newUser]);
    showToast("Form submitted successfully!");
  };

  // Update existing user matching the provided ID
  const updateUser = (id, updatedUser) => {
    setUserReport((prev) =>
      prev.map((user) => (user.id === id ? { ...updatedUser, id } : user))
    );
    showToast("User updated successfully!");
  };

  // Delete user matching the provided ID
  const deleteUser = useCallback((id) => {
    setUserReport((prev) => prev.filter((user) => user.id !== id));
    showToast("User deleted successfully!", "info");
  }, [showToast]);

  return (
    <>
      <Routes>
        {/* Main dashboard route showing registered users */}
        <Route
          path="/"
          element={<Dashboard userReport={userReport} onDelete={deleteUser} />}
        />

        {/* Route to handle adding and updating users */}
        <Route
          path="/add-user"
          element={
            <AddUser
              userReport={userReport}
              onAdd={addUser}
              onUpdate={updateUser}
            />
          }
        />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global toast notification system */}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </>
  );
}

export default App;