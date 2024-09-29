// src/components/Header.jsx
import React from 'react';
import { Box, Heading, Link, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Header = ({ plainLinks }) => {
  const navigate = useNavigate(); // Use the useNavigate hook

  return (
    <Box 
      bg={plainLinks ? 'transparent' : 'purple.900'} // Conditional background color
      p={4} 
      display="flex" 
      justifyContent={'space-between'} 
      alignItems="center" 
      maxWidth="100vw"
    >
      <Link onClick={() => navigate('/')} _hover={{ textDecoration: 'none' }}>
        <Heading color="white" size="lg" display="inline">
          Disaster Alert
        </Heading>
      </Link>

      {/* Login and Register Links */}
      <Box>
        {plainLinks ? (
          <>
            <Text 
              as="span" 
              color="white" 
              cursor="pointer" 
              onClick={() => navigate('/login')} 
              marginRight={2}
              _hover={{ textDecoration: 'underline' }} // Optional hover effect
            >
              Login
            </Text>
            <Text 
              as="span" 
              color="white" 
              cursor="pointer" 
              onClick={() => navigate('/register')} 
              marginLeft={2}
              _hover={{ textDecoration: 'underline' }} // Optional hover effect
            >
              Register
            </Text>
          </>
        ) : (
          <>
            <Button colorScheme="whiteAlpha" onClick={() => navigate('/login')} marginRight={2}>
              Login
            </Button>
            <Button colorScheme="whiteAlpha" onClick={() => navigate('/register')} marginLeft={2}>
              Register
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header; // Ensure this is a default export
