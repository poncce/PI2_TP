import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useToast, ToastContainer } from './Toast';

export default function AdvancedRecipeForm() {
  const navigate = useNavigate();
  const { toasts, showToast, closeToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    contenido: ''
  });

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!form.titulo.trim() || !form.contenido.trim()) {
      showToast('Por favor completá el título y el contenido', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:3000/recipes',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showToast('¡Receta publicada exitosamente! 🎉', 'success', 2500);

      setTimeout(() => {
        navigate(`/recipes/${data.post.id}`);
      }, 2000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al publicar la receta';
      showToast(errorMsg, 'error', 4000);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} closeToast={closeToast} removeToast={removeToast} />

      <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf9' }}>
        {/* Header */}
        <AppBar
          position="static"
          sx={{
            bgcolor: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => navigate('/inicio')}
              sx={{ mr: 2, color: '#64748b' }}
            >
              <ArrowLeft className="w-6 h-6" />
            </IconButton>
            <Typography variant="h6">
              Nueva Receta
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Formulario */}
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, pb: 8 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              Nueva Receta
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Contenido"
                value={form.contenido}
                onChange={(e) => handleChange('contenido', e.target.value)}
                multiline
                rows={6}
                fullWidth
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={() => navigate('/inicio')}
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1665c0' }
                }}
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}