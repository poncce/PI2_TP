import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios'
function Register() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const registerUser = async () => {
        const response = await axios.post('http://localhost:3000/users', {
            password,
            email,
            firstName,
            lastName
        })
        // localStorage.setItem('token', response.data.token)
        console.log(response.data);
        alert('registradovich')
        
    }

    return (
        <>
            <h2>Register</h2>
            <input type="text" placeholder="email" onChange={(event) => setEmail(event.target.value)} />
            <input type="text" placeholder="contraseña" onChange={(event) => setPassword(event.target.value)} />
            <input type="text" placeholder="nombre" onChange={(event) => setFirstName(event.target.value)} />
            <input type="text" placeholder="apellido" onChange={(event) => setLastName(event.target.value)} />
            <Button variant='contained' onClick={registerUser}>Register</Button>
        </>
    )
}

export default Register