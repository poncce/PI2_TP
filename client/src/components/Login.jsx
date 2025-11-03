// src/components/login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const fetchLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:3000/login", { email, password });
      localStorage.setItem("token", data.token);
      alert("Login exitoso");
      navigate("/inicio");
    } catch (e) {
      alert("Error al iniciar sesión");
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
        bgcolor: "#0f172a", // azul oscuro
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
          bgcolor: "#1e293b", // tarjeta gris oscura
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#fff" }}>
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
            input: { color: "#fff" },
            label: { color: "#94a3b8" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#38bdf8" },
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
          onClick={fetchLogin}
          sx={{
            py: 1.2,
            fontWeight: 600,
            bgcolor: "#38bdf8",
            "&:hover": { bgcolor: "#0ea5e9" },
          }}
        >
          Entrar
        </Button>

        <Typography variant="body2" sx={{ mt: 2, color: "#94a3b8" }}>
          ¿No tenés cuenta?{" "}
          <Link
            to="/register"
            style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600 }}
          >
            Registrate acá
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
    