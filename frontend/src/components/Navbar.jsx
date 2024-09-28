// src/components/Header.jsx
import React from 'react';
import { Box, Heading, Link, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // Use the useNavigate hook

  return (
    <Box bg="purple.900" p={4} display="flex" justifyContent={'space-between'} alignItems="center" maxWidth="100vw">
      <Link onClick={() => navigate('/')} _hover={{ textDecoration: 'none' }}>
        <Heading color="white" size="lg" display="inline">
          Disaster Alert
        </Heading>
      </Link>

      {/* Login and Register Buttons */}
      <Box>
        <Button colorScheme="whiteAlpha" onClick={() => navigate('/login')} marginRight={2}>
          Login
        </Button>
        <Button colorScheme="whiteAlpha" onClick={() => navigate('/register')} marginLeft={2}>
          Register
        </Button>
        </Box>
    </Box>
  );
};

export default Header; // Ensure this is a default export
