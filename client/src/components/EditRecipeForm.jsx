// src/components/EditRecipeForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useToast, ToastContainer } from './Toast';

export default function EditRecipeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toasts, showToast, closeToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [form, setForm] = useState({
    titulo: '',
    contenido: ''
  });

  const [originalForm, setOriginalForm] = useState({
    titulo: '',
    contenido: ''
  });

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/recipes/${id}`);
      const recipe = response.data;

      setForm({
        titulo: recipe.titulo || '',
        contenido: recipe.contenido || ''
      });

      setOriginalForm({
        titulo: recipe.titulo || '',
        contenido: recipe.contenido || ''
      });
    } catch (error) {
      console.error('Error al cargar receta:', error);
      showToast('Error al cargar la receta', 'error');
      navigate('/explorar');
    } finally {
      setInitialLoading(false);
    }
  };

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

    // Verificar si hubo cambios
    const hasChanges = form.titulo !== originalForm.titulo || form.contenido !== originalForm.contenido;

    if (!hasChanges) {
      showToast('No hay cambios para guardar', 'info');
      navigate(`/recipes/${id}`);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `http://localhost:3000/recipes/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showToast('¡Receta actualizada exitosamente! 🎉', 'success', 2500);

      setTimeout(() => {
        navigate(`/recipes/${id}`);
      }, 2000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al actualizar la receta';
      showToast(errorMsg, 'error', 4000);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Verificar si hay cambios sin guardar
    const hasChanges = form.titulo !== originalForm.titulo || form.contenido !== originalForm.contenido;

    if (hasChanges) {
      if (window.confirm('¿Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')) {
        navigate(`/recipes/${id}`);
      }
    } else {
      navigate(`/recipes/${id}`);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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
              onClick={handleCancel}
              sx={{ mr: 2, color: '#64748b' }}
            >
              <ArrowLeft className="w-6 h-6" />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: '40px',
                  width: 'auto',
                  marginRight: '12px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#f97316',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5px'
                }}
              >
                Paulina Cultiva
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b', mr: 2 }}>
              Editar Receta
            </Typography>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Save className="w-4 h-4" />}
              sx={{
                bgcolor: '#f97316',
                '&:hover': { bgcolor: '#ea580c' }
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Toolbar>
        </AppBar>

        {/* Formulario */}
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, pb: 8 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              Editar Receta
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                fullWidth
                required
                multiline
                maxRows={3}
              />

              <TextField
                label="Contenido"
                value={form.contenido}
                onChange={(e) => handleChange('contenido', e.target.value)}
                multiline
                rows={8}
                fullWidth
                required
                placeholder="Describe los ingredientes y pasos para preparar tu receta..."
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                onClick={handleCancel}
                variant="outlined"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Save className="w-4 h-4" />}
                sx={{
                  bgcolor: '#f97316',
                  '&:hover': { bgcolor: '#ea580c' }
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}