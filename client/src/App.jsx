// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NewPost from "./components/NewPost.jsx";

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
        <Route path="/nueva-receta" element={<NewPost />} />
      </Routes>
    </BrowserRouter>
  );
}