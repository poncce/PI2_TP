// src/components/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Paper, Grid, Card, CardContent, CardActions, Avatar, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import { LogOut, User, ChefHat, BookOpen, Star, Clock, Users, Settings, Bell, Plus, TrendingUp, Heart } from 'lucide-react';
import logo from '../assets/logo.png';
import { useToast, ToastContainer } from './Toast';

function Home() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [userName, setUserName] = useState('Usuario');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setUserName('Chef');
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [openNewPost, setOpenNewPost] = useState(false);


  const logout = () => {
    localStorage.removeItem('token');
    showToast('Sesión cerrada correctamente', 'success');
    navigate('/');
  };

  const categories = [
    {
      title: 'Mis Recetas',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Tus creaciones culinarias',
      color: '#f97316',
      action: () => navigate('/mis-recetas')
    },
    {
      title: 'Explorar',
      icon: <ChefHat className="w-8 h-8" />,
      description: 'Descubre nuevas recetas',
      color: '#10b981',
      action: () => navigate('/explorar')
    },
    {
      title: 'Favoritos',
      icon: <Heart className="w-8 h-8" />,
      description: 'Recetas que te encantan',
      color: '#ef4444',
      action: () => navigate('/favoritos')
    },
    {
      title: 'Comunidad',
      icon: <Users className="w-8 h-8" />,
      description: 'Conecta con otros chefs',
      color: '#8b5cf6',
      action: () => navigate('/comunidad')
    }
  ];

  const popularRecipes = [
    {
      title: 'Pasta Carbonara Clásica',
      author: 'María González',
      rating: 4.8,
      time: '30 min',
      difficulty: 'Media',
      image: '🍝'
    },
    {
      title: 'Empanadas Criollas',
      author: 'Juan Pérez',
      rating: 4.9,
      time: '45 min',
      difficulty: 'Media',
      image: '🥟'
    },
    {
      title: 'Brownie de Chocolate',
      author: 'Ana Rodríguez',
      rating: 5.0,
      time: '40 min',
      difficulty: 'Fácil',
      image: '🍫'
    }
  ];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf9' }}>
        {/* Header/AppBar */}
        <AppBar
          position="static"
          sx={{
            bgcolor: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}
        >
          <Toolbar>
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

            <Button
              variant="contained"
              startIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/nueva-receta')}
              sx={{
                mr: 2,
                bgcolor: '#f97316',
                '&:hover': { bgcolor: '#ea580c' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Nueva Receta
            </Button>

  
            <IconButton sx={{ mr: 1, ml: 1, color: '#64748b' }}>
              <Bell className="w-5 h-5" />
            </IconButton>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                bgcolor: '#fff7ed',
                '&:hover': { bgcolor: '#ffedd5' }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#f97316',
                  fontSize: '0.875rem'
                }}
              >
                {userName[0].toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate('/perfil'); }}>
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/configuracion'); }}>
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </MenuItem>
              <MenuItem onClick={logout} sx={{ color: '#ef4444' }}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
          {/* Welcome Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                ¡Hola, {userName}! 👨‍🍳
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                ¿Qué vas a cocinar hoy?
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: '#f97316',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#fff7ed' }
                }}
                onClick={() => navigate('/explorar')}
              >
                Explorar Recetas
              </Button>
            </Box>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <BookOpen className="w-6 h-6 mx-auto mb-1" style={{ color: '#f97316' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f97316' }}>
                  24
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Mis Recetas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Heart className="w-6 h-6 mx-auto mb-1" style={{ color: '#ef4444' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  87
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Me Gusta
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Users className="w-6 h-6 mx-auto mb-1" style={{ color: '#8b5cf6' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                  156
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Seguidores
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Star className="w-6 h-6 mx-auto mb-1" style={{ color: '#f59e0b' }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  4.7
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Calificación
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Categories Grid */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
            ¿Qué te gustaría hacer?
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    },
                    borderRadius: 2
                  }}
                  onClick={category.action}
                >
                  <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: `${category.color}15`,
                        color: category.color,
                        mb: 2
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      size="small"
                      sx={{
                        color: category.color,
                        '&:hover': { bgcolor: `${category.color}10` }
                      }}
                    >
                      Ver más →
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Popular Recipes Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
              🔥 Recetas Populares
            </Typography>
            <Button
              endIcon={<TrendingUp className="w-4 h-4" />}
              sx={{ color: '#f97316', textTransform: 'none' }}
              onClick={() => navigate('/populares')}
            >
              Ver todas
            </Button>
          </Box>

          <Grid container spacing={3}>
            {popularRecipes.map((recipe, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    },
                    borderRadius: 2
                  }}
                >
                  <Box
                    sx={{
                      height: 180,
                      bgcolor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {recipe.image}
                  </Box>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                      Por {recipe.author}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        icon={<Star className="w-3 h-3" />}
                        label={recipe.rating}
                        size="small"
                        sx={{ 
                          bgcolor: '#f97316',
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                      <Chip
                        icon={<Clock className="w-3 h-3" />}
                        label={recipe.time}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={recipe.difficulty}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: '#f97316',
                        color: '#f97316',
                        '&:hover': {
                          borderColor: '#ea580c',
                          bgcolor: '#fff7ed'
                        }
                      }}
                    >
                      Ver Receta
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Home;