import { useEffect } from "react";

function Toast({ toast, onClose }) {
  // 1. The Timer Logic: Starts a 3-second countdown to close the popup
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  // If there is no message to show, render absolutely nothing
  if (!toast) return null;

  // 2. The Visual Logic: Figuring out classes and icons before the HTML
  const toastClass = "toast toast-" + toast.type;
  
  let icon = "i"; 
  if (toast.type === "success") {
    icon = "✓";
  }

  // 3. The Clean HTML Return
  return (
    <div className={toastClass}>
      
      <span className="toast-icon">{icon}</span>
      
      <span>{toast.message}</span>
      
      <button onClick={onClose}>
        ×
      </button>

    </div>
  );
}

export default Toast;