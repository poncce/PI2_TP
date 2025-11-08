// src/components/ReviewSystem.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Card,
  CardMedia,
  CardContent,
  Stack
} from '@mui/material';
import {
  Star,
  MessageCircle,
  Camera,
  ThumbsUp,
  Clock,
  Users,
  ChefHat,
  Plus,
  X,
  Edit,
  Delete,
  Send
} from 'lucide-react';
import { useToast, ToastContainer } from './Toast';
import axios from 'axios';

export default function ReviewSystem({ recipeId, user }) {
  const { toasts, showToast, removeToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    madeItCount: 0,
    wouldMakeAgainCount: 0,
    ratingDistribution: []
  });
  const [loading, setLoading] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Estado del formulario de reseña
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: '',
    photos: [],
    madeIt: false,
    wouldMakeAgain: null,
    difficulty: '',
    timeToMake: 30,
    modifications: ''
  });

  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [recipeId]);

  const loadReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/recipes/${recipeId}/reviews`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/recipes/${recipeId}/reviews/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para dejar una reseña', 'error');
      return;
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      showToast('La calificación debe estar entre 1 y 5 estrellas', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const reviewData = {
        ...reviewForm,
        photos: reviewForm.photos.filter(url => url.trim())
      };

      let response;
      if (editingReview) {
        response = await axios.put(
          `http://localhost:3000/recipes/${recipeId}/reviews/${editingReview.id}`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        response = await axios.post(
          `http://localhost:3000/recipes/${recipeId}/reviews`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      showToast(editingReview ? 'Reseña actualizada exitosamente' : 'Reseña publicada exitosamente', 'success');
      setShowReviewDialog(false);
      resetForm();
      loadReviews();
      loadStats();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al guardar la reseña';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      title: review.title || '',
      content: review.content || '',
      photos: review.photos || [],
      madeIt: review.madeIt || false,
      wouldMakeAgain: review.wouldMakeAgain,
      difficulty: review.difficulty || '',
      timeToMake: review.timeToMake || 30,
      modifications: review.modifications || ''
    });
    setShowReviewDialog(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/recipes/${recipeId}/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showToast('Reseña eliminada exitosamente', 'success');
      loadReviews();
      loadStats();
    } catch (error) {
      showToast('Error al eliminar la reseña', 'error');
    }
  };

  const resetForm = () => {
    setReviewForm({
      rating: 5,
      title: '',
      content: '',
      photos: [],
      madeIt: false,
      wouldMakeAgain: null,
      difficulty: '',
      timeToMake: 30,
      modifications: ''
    });
    setPhotoUrl('');
    setEditingReview(null);
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim() && !reviewForm.photos.includes(photoUrl.trim())) {
      setReviewForm(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl.trim()]
      }));
      setPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index) => {
    setReviewForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const difficulties = [
    { value: 'muy_facil', label: 'Muy fácil' },
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Medio' },
    { value: 'dificil', label: 'Difícil' },
    { value: 'muy_dificil', label: 'Muy difícil' }
  ];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <Box sx={{ mt: 4 }}>
        {/* Estadísticas de reseñas */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            <Star className="w-6 h-6 inline mr-2" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            Valoraciones y Reseñas
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {parseFloat(stats.averageRating).toFixed(1)}
                </Typography>
                <Rating value={parseFloat(stats.averageRating)} precision={0.1} readOnly />
                <Typography variant="body2" color="#64748b">
                  {stats.totalReviews} valoración{stats.totalReviews !== 1 ? 'es' : ''}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#10b981' }}>
                  {stats.madeItCount}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  <ChefHat className="w-4 h-4 inline mr-1" />
                  La cocinaron
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#10b981' }}>
                  {stats.wouldMakeAgainCount}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  <ThumbsUp className="w-4 h-4 inline mr-1" />
                  La volverían a hacer
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Botón para agregar reseña */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                if (!user) {
                  showToast('Debes iniciar sesión para dejar una reseña', 'error');
                  return;
                }
                setShowReviewDialog(true);
              }}
              startIcon={<MessageCircle className="w-4 h-4" />}
              sx={{
                bgcolor: '#f97316',
                '&:hover': { bgcolor: '#ea580c' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {user ? 'Escribir una reseña' : 'Inicia sesión para reseñar'}
            </Button>
          </Box>
        </Paper>

        {/* Lista de reseñas */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Reseñas ({reviews.length})
          </Typography>

          {reviews.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb', borderRadius: 2 }}>
              <MessageCircle className="w-12 h-12 mx-auto mb-2" style={{ color: '#d1d5db' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
                Sé el primero en reseñar esta receta
              </Typography>
              <Typography variant="body2" color="#64748b">
                Comparte tu experiencia y ayuda a otros cocineros
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {reviews.map((review) => (
                <Card key={review.id} elevation={1}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={review.user?.avatar}>
                            {review.user?.username?.[0]?.toUpperCase() || 'A'}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {review.user?.username || 'Anónimo'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Rating value={review.rating} precision={1} readOnly size="small" />
                              <Typography variant="caption" color="#64748b">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Botones de editar/eliminar si es el dueño */}
                          {user && user.id === review.userId && (
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleEditReview(review)}
                              >
                                <Edit className="w-4 h-4" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                <Delete className="w-4 h-4" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      {review.title && (
                        <Grid item xs={12}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {review.title}
                          </Typography>
                        </Grid>
                      )}

                      {review.content && (
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {review.content}
                          </Typography>
                        </Grid>
                      )}

                      {/* Fotos de la reseña */}
                      {review.photos && review.photos.length > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {review.photos.map((photo, index) => (
                              <Box
                                key={index}
                                component="img"
                                src={photo}
                                alt={`Foto ${index + 1}`}
                                sx={{
                                  width: 120,
                                  height: 120,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  cursor: 'pointer'
                                }}
                                onClick={() => window.open(photo, '_blank')}
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}

                      {/* Información adicional */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {review.madeIt && (
                            <Chip
                              icon={<ChefHat className="w-3 h-3" />}
                              label="La cocinó"
                              size="small"
                              color="success"
                            />
                          )}
                          {review.wouldMakeAgain !== null && (
                            <Chip
                              icon={review.wouldMakeAgain ? <ThumbsUp className="w-3 h-3" /> : <ThumbsUp className="w-3 h-3" />}
                              label={review.wouldMakeAgain ? 'Volvería a hacerla' : 'No la volvería a hacer'}
                              size="small"
                              color={review.wouldMakeAgain ? 'success' : 'default'}
                            />
                          )}
                          {review.difficulty && (
                            <Chip
                              label={`Dificultad: ${review.difficulty.replace('_', ' ')}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {review.timeToMake && (
                            <Chip
                              icon={<Clock className="w-3 h-3" />}
                              label={`${review.timeToMake} min`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Grid>

                      {review.modifications && (
                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9fafb' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Modificaciones que hizo:
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                              {review.modifications}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Diálogo para agregar/editar reseña */}
      <Dialog
        open={showReviewDialog}
        onClose={() => {
          setShowReviewDialog(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingReview ? 'Editar Reseña' : 'Escribir una Reseña'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Calificación */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ¿Qué calificación le das a esta receta?
              </Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(e, value) => setReviewForm(prev => ({ ...prev, rating: value }))}
                size="large"
              />
            </Box>

            {/* Título */}
            <TextField
              label="Título de la reseña (opcional)"
              value={reviewForm.title}
              onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />

            {/* Contenido */}
            <TextField
              label="Tu experiencia con esta receta"
              multiline
              rows={4}
              value={reviewForm.content}
              onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
              fullWidth
            />

            {/* Fotos */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                <Camera className="w-4 h-4 inline mr-1" />
                Fotos de tu resultado (URLs)
              </Typography>

              {/* Fotos agregadas */}
              {reviewForm.photos.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {reviewForm.photos.map((photo, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <Box
                        component="img"
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePhoto(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'white',
                          boxShadow: 1
                        }}
                      >
                        <X className="w-3 h-3" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Agregar foto */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="URL de la foto"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  onClick={handleAddPhoto}
                  variant="outlined"
                  size="small"
                  disabled={!photoUrl.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </Box>
            </Box>

            {/* Información adicional */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Dificultad real</InputLabel>
                  <Select
                    value={reviewForm.difficulty}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    label="Dificultad real"
                  >
                    <MenuItem value="">No especificar</MenuItem>
                    {difficulties.map(diff => (
                      <MenuItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Tiempo real (minutos)"
                  type="number"
                  value={reviewForm.timeToMake}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, timeToMake: parseInt(e.target.value) || 0 }))}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>¿La volverías a hacer?</InputLabel>
                  <Select
                    value={reviewForm.wouldMakeAgain === null ? '' : reviewForm.wouldMakeAgain}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, wouldMakeAgain: e.target.value === '' ? null : e.target.value === 'true' }))}
                    label="¿La volverías a hacer?"
                  >
                    <MenuItem value="">No especificar</MenuItem>
                    <MenuItem value="true">Sí, definitivamente</MenuItem>
                    <MenuItem value="false">No, no la volvería a hacer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Modificaciones que hiciste"
                  multiline
                  rows={2}
                  value={reviewForm.modifications}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, modifications: e.target.value }))}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReviewDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#f97316',
              '&:hover': { bgcolor: '#ea580c' }
            }}
          >
            {loading ? 'Guardando...' : 'Publicar Reseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}