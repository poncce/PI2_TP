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
      const { data } = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
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
        background: "linear-gradient(135deg, #ffffff 40%, #ffedd5 100%)", // blanco a naranja suave
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
          bgcolor: "#fff7ed", // naranja muy claro
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
            input: { color: "#1e1e1e" },
            label: { color: "#9ca3af" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e5e7eb" },
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
            input: { color: "#1e1e1e" },
            label: { color: "#9ca3af" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e5e7eb" },
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

        <Typography variant="body2" sx={{ mt: 2, color: "#6b7280" }}>
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
  );
}
