// src/components/Header.jsx
import React from 'react';
import { Box, Heading, Link } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="purple.900" p={4}>
        <Link 
                onClick={() => history.push('/')} 
                _hover={{ textDecoration: 'none' }} // Removes the blue underline
            >
      <Heading color="white" size="lg" display="inline">Disaster Alert</Heading>
      </Link>
    </Box>
  );
};

export default Header; // Ensure this is a default export