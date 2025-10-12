import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios'
function Login() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const fetchLogin = async () => {
        const response = await axios.post('http://localhost:3000/login', {
            password,
            email
        })
        
        alert('login exitoso')
        localStorage.setItem('token', response.data.token)
    }

    return (
        <>
            <h2>Login</h2>
            <input type="text" placeholder="email" onChange={(event) => setEmail(event.target.value)} />
            <input type="text" placeholder="contraseña" onChange={(event) => setPassword(event.target.value)} />
            <Button variant='contained' onClick={fetchLogin}>Login</Button>
        </>
    )
}

export default Login