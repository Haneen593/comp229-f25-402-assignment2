import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const clickSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            // Try to parse JSON safely (server may return empty body)
            const text = await response.text();
            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch (err) {
                // invalid JSON
                data = {};
            }

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to login');
            }

            // If API returns token and user, persist and update parent state
            if (data.token && data.user) {
                const username = data.user.username || data.user.name || data.user.email;
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                if (setUser) {
                    setUser({ username, token: data.token });
                }
                navigate('/');
                return;
            }

            // No token/user returned: show server message as error
            setError(data.error || data.message || 'Login failed');

        } catch (error) {
            setError(error.message);
        }
    }
    
    return (
        <div className='loginForm'>
            <fieldset >
                <legend>Login</legend>
                {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={clickSubmit}>
                <label htmlFor='email'>Email</label>
                <input type='text' id='email' name='email' value={formData.email} onChange={handleChange} required />
                
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
                
                <button type="submit" style={{ marginTop: '20px' }}>Login</button>
                </form>
                </fieldset>
                </div>
    )
}

export default Login;