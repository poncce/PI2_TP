// src/components/Toast.jsx
import React from "react";
import { Snackbar, Alert, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SlideRight = (props) => <Slide {...props} direction="left" />; 
// Entra desde la derecha, sale hacia la derecha

export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration, open: true }]);
  };

  const closeToast = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: false } : t))
    );
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, closeToast, removeToast };
};

export const ToastContainer = ({ toasts, closeToast, removeToast }) => {
  return (
    <>
      {toasts.map((t) => (
        <Snackbar
          key={t.id}
          open={t.open}
          autoHideDuration={t.duration ?? 3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={SlideRight}
          TransitionProps={{ appear: true }}
          // No cerrar por click afuera
          onClose={(_e, reason) => {
            if (reason === "clickaway") return;
            closeToast(t.id); // dispara animación de salida
          }}
          // Recién después de animar, lo removemos
          TransitionProps={{
            onExited: () => removeToast(t.id)
          }}
          sx={{ zIndex: 9999 }}
        >
          <Alert
            variant="filled"
            severity={t.type === "error" ? "error" : "success"}
            onClose={() => closeToast(t.id)}
            sx={{ width: "100%" }}
            action={
              <IconButton size="small" color="inherit" onClick={() => closeToast(t.id)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
