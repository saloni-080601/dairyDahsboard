import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Avatar, 
  Snackbar, 
  Alert, 
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login({ onLogin }) {
  const navigate = useNavigate();
  
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Check if already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with your actual deployed Google Apps Script web app URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbz4EU0pjZRfMQnpctF2_TKWEhATAUNDvz09In2nMPhoz0o3DFXXI8rjTNbApbIko3Q/exec?type=login';
      
      // Fetch all users from your current API
      const response = await fetch(scriptUrl);
      const allUsers = await response.json();
      
      // Find the matching user by checking contact and password
      const user = allUsers.find(user => 
        user.contact == email && user.Password === password
      );
      
      if (user) {
        // Create success result with matching user data
        const result = {
          success: true,
          message: "Login successful",
          token: Date.now().toString(), // Simple token generation
          user: {
            name: user.Name,
            email: user.contact,
            role: user.Role // This should be the array of roles
          }
        };
        
        // Successful login
        setShowAlert(true);
        
        // Store user info in localStorage
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', user.Name);
        localStorage.setItem('userRole', JSON.stringify(user.Role));
        
        // Call the onLogin function from props with the role
        onLogin(user.Role);
        
        // Redirect after successful login
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Failed login
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ margin: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Mobile number or username"
            name="contact"
            autoComplete="contact"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
          />
          
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar open={showAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;