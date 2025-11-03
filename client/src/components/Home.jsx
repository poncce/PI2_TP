// src/components/Home.jsx
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    alert('Sesión cerrada');
    navigate('/'); // vuelve al login
  };

  return (
    <>
      <h1>Bienvenido al inicio 🎉</h1>
      <Button variant="contained" color="error" onClick={logout}>
        Logout
      </Button>
    </>
  );
}

export default Home;
