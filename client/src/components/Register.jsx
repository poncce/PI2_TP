import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Stack } from "@mui/material";
import { useToast, ToastContainer } from "../components/Toast";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toasts, showToast, removeToast, closeToast } = useToast();

  const onChange = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setError("");
  };

  const registerUser = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("Completá todos los campos");
      showToast("Por favor, completá todos los campos", "error", 3000);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      showToast("Las contraseñas no coinciden", "error", 3000);
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/users", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      console.log(data);

      showToast("¡Registro exitoso! 🎉 Bienvenido a Paulina Cultiva", "success", 2500);

      // Navegar después de 2 segundos para que vea el mensaje
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (e) {
      const errorMessage = e.response?.data?.message || e.response?.data?.errors?.[0] || "Error al registrarse. Intenta nuevamente";
      setError(errorMessage);
      showToast(errorMessage, "error", 4000);
      console.error(e);
    }
  };

  return (
    <>
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
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 700, color: "#f97316" }}
          >
            Crear cuenta
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nombre de usuario"
              type="text"
              value={form.username}
              onChange={(e) => onChange("username", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "#f97316" },
                },
              }}
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "#f97316" },
                },
              }}
            />

            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "#f97316" },
                },
              }}
            />

            <TextField
              label="Confirmar contraseña"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "#f97316" },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={registerUser}
              sx={{
                py: 1.2,
                fontWeight: 600,
                bgcolor: "#f97316",
                "&:hover": { bgcolor: "#ea580c" },
                borderRadius: 2,
              }}
            >
              Registrarme
            </Button>

            <Typography variant="body2" sx={{ color: "#64748b" }}>
              ¿Ya tenés cuenta?{" "}
              <Link
                to="/"
                style={{
                  color: "#f97316",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Iniciá sesión
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}