// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NewPost from "./components/NewPost.jsx";

// Componentos básicos
import SimpleRecipeExplorer from "./components/SimpleRecipeExplorer.jsx";
import RecipeView from "./components/RecipeView.jsx";
import EditRecipeForm from "./components/EditRecipeForm.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/inicio"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/nueva-receta"
          element={
            <PrivateRoute>
              <NewPost />
            </PrivateRoute>
          }
        />

        <Route
          path="/explorar"
          element={
            <PrivateRoute>
              <SimpleRecipeExplorer />
            </PrivateRoute>
          }
        />

        <Route
          path="/recipes/:id"
          element={
            <PrivateRoute>
              <RecipeView />
            </PrivateRoute>
          }
        />

        <Route
          path="/recipes/:id/edit"
          element={
            <PrivateRoute>
              <EditRecipeForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}