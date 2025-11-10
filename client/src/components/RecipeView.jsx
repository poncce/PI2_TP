// src/components/RecipeView.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton
} from '@mui/material';
import {
  ArrowLeft,
  ChefHat,
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast, ToastContainer } from './Toast';
import axios from 'axios';
import logo from '../assets/logo.png';

export default function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadRecipe();
    loadUser();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error al cargar receta:', error);
      showToast('Error al cargar la receta', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:3000/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDelete = async () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteDialogOpen(false);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('Receta eliminada exitosamente', 'success');
      setTimeout(() => {
        navigate('/explorar');
      }, 1500);
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      const errorMsg = error.response?.data?.message || 'Error al eliminar la receta';
      showToast(errorMsg, 'error');
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  // Verificar si el usuario puede editar/borrar
  const canEdit = user && recipe && (user.id === recipe.autorId || user.isAdmin);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Receta no encontrada</Typography>
            <Button variant="contained" onClick={() => navigate('/explorar')}>
              Volver a explorar
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf9' }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#fff',
            color: '#1e293b',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1100
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
              <IconButton
                onClick={() => navigate('/explorar')}
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
                  variant="h5"
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
                {recipe.titulo}
              </Typography>

              {canEdit && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleEdit}
                    startIcon={<Edit className="w-4 h-4" />}
                    sx={{
                      borderColor: '#f97316',
                      color: '#f97316',
                      '&:hover': {
                        borderColor: '#ea580c',
                        bgcolor: '#f9731608'
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleDelete}
                    startIcon={<Trash2 className="w-4 h-4" />}
                    sx={{
                      borderColor: '#ef4444',
                      color: '#ef4444',
                      '&:hover': {
                        borderColor: '#dc2626',
                        bgcolor: '#ef444408'
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </Box>
              )}
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="md" sx={{ mt: 3, pb: 4 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            {/* Información básica */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                {recipe.titulo}
              </Typography>

              {/* Autor y fecha */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#f97316' }}>
                    {recipe.autor?.username?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                  </Avatar>
                  <Typography variant="body2" color="#64748b">
                    {recipe.autor?.username || `Autor #${recipe.autorId}`}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calendar className="w-4 h-4" style={{ color: '#64748b' }} />
                  <Typography variant="body2" color="#64748b">
                    {recipe.fechaPublicacion ?
                      new Date(recipe.fechaPublicacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : 'Fecha desconocida'
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Contenido de la receta */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                Descripción
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: '#374151',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {recipe.contenido}
              </Typography>
            </Box>

            {/* Información adicional */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<ChefHat className="w-4 h-4" />}
                label="Receta Simple"
                size="small"
                sx={{
                  bgcolor: '#f97316',
                  color: 'white'
                }}
              />
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1e293b',
            pb: 1
          }}
        >
          ¿Eliminar Receta?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: '#64748b',
              lineHeight: 1.6
            }}
          >
            ¿Estás seguro de que quieres eliminar la receta <strong>"{recipe?.titulo}"</strong>?
            <br /><br />
            Esta acción no se puede deshacer y se perderá permanentemente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            autoFocus
            startIcon={<Trash2 className="w-4 h-4" />}
            sx={{
              bgcolor: '#ef4444',
              '&:hover': {
                bgcolor: '#dc2626'
              }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}