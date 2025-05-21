import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <Typography variant="h1" color="error" sx={{ fontSize: '6rem' }}>
          403
        </Typography>
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page. Please contact your administrator
          if you believe this is a mistake.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/attendant/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized; 