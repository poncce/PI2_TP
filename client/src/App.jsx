import Button from '@mui/material/Button'
import './App.css'
import Login from './components/login.jsx'
import Register from './components/register.jsx'
import UserList from './components/UserList.jsx'


function App() {
  const logout = async ()=>{
    localStorage.setItem('token', '')
    alert('Deslogeo exitoso')
  }
  return (
    <>
      <Login />
      <Register />
      <UserList />
      <Button variant='contained' color='error' onClick={logout}>Logout</Button>
      
    </>
  )
}

export default App
