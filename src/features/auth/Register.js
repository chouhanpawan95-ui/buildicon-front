import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSignupMutation } from '../api/authApi';
import { useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { token } = useSelector((state) => state.auth);
  const [signup, { isLoading, error }] = useSignupMutation();

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Register payload:', formData);
      const res = await signup(formData).unwrap();
      console.log('Signup success', res);
    } catch (err) {
      console.error('Signup error', err);
    }
  };

  return (
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
            Register
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
              label="Full Name"
              name="name"
              variant="outlined"
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
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
              Sign Up
            </Button>
            <p style={{ marginTop: '1rem' }}>
               Already have an Account <Link to="/">Login</Link>
           </p>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Register;
