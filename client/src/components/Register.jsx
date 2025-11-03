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
  const [error, setError] = useState(""); // nuevo estado para errores
  const navigate = useNavigate();

  const onChange = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setError(""); // limpia error cuando el usuario escribe
  };

  const registerUser = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("Completá todos los campos");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
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
      setError("Error al registrarse");
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
        background: "linear-gradient(135deg, #ffffff 40%, #ffedd5 100%)",
        color: "#1e1e1e",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          bgcolor: "#fff7ed",
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
              input: { color: "#1e1e1e" },
              label: { color: "#9ca3af" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
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
              input: { color: "#1e1e1e" },
              label: { color: "#9ca3af" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
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
              input: { color: "#1e1e1e" },
              label: { color: "#9ca3af" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
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
              input: { color: "#1e1e1e" },
              label: { color: "#9ca3af" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#f97316" },
              },
            }}
          />

          {/* Mensaje de error (solo aparece si hay error) */}
          {error && (
            <Typography
              variant="body2"
              sx={{
                color: "red",
                fontWeight: 600,
                textAlign: "center",
                mt: -1,
              }}
            >
              {error}
            </Typography>
          )}

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

          <Typography variant="body2" sx={{ color: "#6b7280" }}>
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
  );
}
