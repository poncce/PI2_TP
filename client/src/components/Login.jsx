// src/components/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { ToastContainer, useToast } from "../components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // toasts con animación (ya configurados en Toast.jsx)
  const { toasts, showToast, removeToast, closeToast } = useToast();

  const fetchLogin = async () => {
    // validación simple en cliente
    if (!email || !password) {
      showToast("Completá email y contraseña", "error", 3000);
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      // éxito con animación
      showToast("¡Inicio de sesión exitoso!", "success", 2000);

      // pequeño delay para que el usuario vea el toast
      setTimeout(() => {
        navigate("/inicio");
      }, 1200);
    } catch (e) {
      // mensajes típicos: 401 credenciales inválidas / message del backend
      const status = e.response?.status;
      const backendMsg =
        e.response?.data?.message || e.response?.data?.errors?.[0];

      const msg =
        status === 401
          ? "Email o contraseña incorrectos"
          : backendMsg || "Error al iniciar sesión. Intenta nuevamente";

      // error con animación; limpiamos el password para reintentar
      setPassword("");
      showToast(msg, "error", 3000);
      console.error(e);
    }
  };

  return (
    <>
      {/* contenedor de toasts (arriba-derecha, animado) */}
      <ToastContainer toasts={toasts} removeToast={removeToast} closeToast={closeToast} />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fafaf9",
          color: "#1e293b"
        }}
      >

        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            bgcolor: "#ffffff",
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#f97316" }}>
            Iniciar sesión
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "#f97316" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "#f97316" },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={fetchLogin}
            sx={{
              py: 1.2,
              fontWeight: 600,
              bgcolor: "#f97316",
              "&:hover": { bgcolor: "#ea580c" },
              borderRadius: 2,
            }}
          >
            Entrar
          </Button>

          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            ¿No tenés cuenta?{" "}
            <Link
              to="/register"
              style={{
                color: "#f97316",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Registrate acá
            </Link>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}