import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoginMutation } from '../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      if (res?.token) navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    // <div className="form-container">
    //   <h2>Login</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       onChange={(e) => setForm({ ...form, password: e.target.value })}
    //     />
    //     <button type="submit" disabled={loading}>Login</button>
    //   </form>
    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    //   <p style={{ marginTop: '1rem' }}>
    //     New here? <Link to="/register">Create a new account</Link>
    //   </p>
    // </div>
         <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Grid item xs={11} sm={8} md={5} lg={4}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          {/* Form with submit handler */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >           
            <TextField
              label="Email"
              name="email"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
             onChange={(e) => setForm({ ...form, password: e.target.value })}
              variant="outlined"
              fullWidth
              required
            />           
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 1, py: 1.2, borderRadius: 2 }}
            >
              Login
            </Button>
            <p style={{ marginTop: '1rem' }}>
        New user? <Link to="/register">Create a new account</Link>
      </p>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
