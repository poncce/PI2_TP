// src/components/RecipeExplorer.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Pagination
} from '@mui/material';
import {
  ArrowLeft,
  Plus,
  ChefHat,
  TrendingUp
} from 'lucide-react';
import RecipeSearch from './RecipeSearch';
import RecipeCard from './RecipeCard';
import { useToast, ToastContainer } from './Toast';
import axios from 'axios';

export default function RecipeExplorer() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page: filters.page || pagination.page,
        limit: filters.limit || pagination.limit,
        ...filters
      };

      // Remover campos vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get('http://localhost:3000/recipes', { params });

      setRecipes(response.data.recipes);
      setPagination({
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Error al cargar recetas:', error);
      showToast('Error al cargar las recetas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    loadRecipes({ ...filters, page: 1 });
  };

  const handlePageChange = (event, value) => {
    loadRecipes({ page: value });
  };

  const handleCreateRecipe = () => {
    navigate('/nueva-receta-avanzada');
  };

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
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
              <Button
                onClick={() => navigate('/inicio')}
                sx={{ mr: 2, color: '#64748b' }}
                startIcon={<ArrowLeft className="w-5 h-5" />}
              >
                Volver
              </Button>

              <ChefHat className="w-8 h-8 mr-2" style={{ color: '#f97316' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f97316', flexGrow: 1 }}>
                Explorar Recetas
              </Typography>

              <Button
                variant="contained"
                onClick={handleCreateRecipe}
                startIcon={<Plus className="w-4 h-4" />}
                sx={{
                  bgcolor: '#f97316',
                  '&:hover': { bgcolor: '#ea580c' },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Nueva Receta
              </Button>
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="lg" sx={{ mt: 3, pb: 4 }}>
          {/* Búsqueda y filtros */}
          <RecipeSearch onSearch={handleSearch} loading={loading} />

          {/* Resultados */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {pagination.total > 0 ? (
                <>
                  {pagination.total} receta{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
                </>
              ) : (
                'No se encontraron recetas'
              )}
            </Typography>

            {pagination.total > 0 && (
              <Typography variant="body2" color="#64748b">
                Página {pagination.page} de {pagination.totalPages}
              </Typography>
            )}
          </Box>

          {/* Grid de recetas */}
          {loading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <RecipeCard loading />
                </Grid>
              ))}
            </Grid>
          ) : recipes.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {recipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                  </Grid>
                ))}
              </Grid>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        '&.Mui-selected': {
                          bgcolor: '#f97316',
                          color: 'white',
                          '&:hover': { bgcolor: '#ea580c' }
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            // Estado vacío
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: '#f9fafb',
                borderRadius: 2
              }}
            >
              <ChefHat className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                ¿No encuentras lo que buscas?
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ mb: 4 }}>
                Intenta con otros términos de búsqueda o ajusta los filtros.
              </Typography>
              <Button
                variant="contained"
                onClick={handleCreateRecipe}
                startIcon={<Plus className="w-4 h-4" />}
                sx={{
                  bgcolor: '#f97316',
                  '&:hover': { bgcolor: '#ea580c' },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Crear nueva receta
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
}