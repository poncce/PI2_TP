// src/components/register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Stack } from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const onChange = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const registerUser = async () => {
    // validación simple
    if (!form.username || !form.email || !form.password) {
      alert("Completá todos los campos");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/users", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      console.log(data);
      alert("Registro exitoso 🎉");
      navigate("/"); // volver al login
    } catch (e) {
      alert("Error al registrarse");
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0f172a",
        color: "white",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          bgcolor: "#1e293b",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#fff" }}>
          Crear cuenta
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nombre de usuario"
            type="text"
            value={form.username}
            onChange={(e) => onChange("username", e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#94a3b8" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#38bdf8" },
              },
            }}
          />

          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#94a3b8" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#38bdf8" },
              },
            }}
          />

          <TextField
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => onChange("password", e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#94a3b8" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#38bdf8" },
              },
            }}
          />

          <TextField
            label="Confirmar contraseña"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            sx={{
              input: { color: "#fff" },
              label: { color: "#94a3b8" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#38bdf8" },
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
              bgcolor: "#38bdf8",
              "&:hover": { bgcolor: "#0ea5e9" },
            }}
          >
            Registrarme
          </Button>

          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/"
              style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600 }}
            >
              Iniciá sesión
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
