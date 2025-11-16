import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clickSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch ('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      })

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to sign up');
      }

      // The signup endpoint currently returns only a success message.
      // If the API later returns token/user, we will set them here.
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        if (setUser) setUser({ username: data.user.username, token: data.token });
        navigate('/');
        return;
      }

      // No token/user returned: show success message and redirect to login.
      setSuccess(data.message || 'Account created successfully. Please log in.');
      setTimeout(() => navigate('/login'), 1000);

    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className = "signUpForm">
      <fieldset >
        <legend>Sign Up</legend>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={clickSubmit}>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} required />

          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="password">Password:</label>
          <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          
          <button type="submit" style={{ marginTop: '20px' }}>Sign Up</button>
          </form>
          </fieldset>
          </div>
  );
};

export default SignUp;