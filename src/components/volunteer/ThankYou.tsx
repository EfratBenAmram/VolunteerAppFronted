import { Box, Typography, Paper } from '@mui/material';

const ThankYou = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #ffeb3d, #ffe082)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 6,
          textAlign: 'center',
          maxWidth: 400,
          width: '90%',
          backgroundColor: '#fff',
          borderRadius: 4,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#fbc02d' }}>
          THANK YOU!
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, color: '#555' }}>
        Your request has been successfully sent
                </Typography>
      </Paper>
    </Box>
  );
};

export default ThankYou;
