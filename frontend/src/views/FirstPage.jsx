import React from 'react';
import stormImage from '../assets/Tropical-Storm-vs-Hurricane-What_s-the-Difference.jpeg'; // Adjust the path based on your directory structure
import Header from '../components/Navbar'; // Ensure correct import
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function FirstPage() {
    const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'fixed', // Ensure the child elements position correctly
        height: '100vh', // Full height of the viewport
        width: '100vw',  // Full width of the viewport
      }}
    >
      {/* Background Image */}
      <div
        style={{
          backgroundImage: `url(${stormImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%', // Cover the full height of the parent
          width: '100%',  // Cover the full width of the parent
          filter: 'brightness(0.5)', // Darken the image slightly
          position: 'absolute', // Position the background
          top: 0,
          left: 0,
          zIndex: -1, // Send the background behind other content
        }}
      ></div>


      {/* Content on top of the darkened background */}
      <div
        style={{
            position: 'absolute', // Position it absolutely within the parent
            top: '50%', // Move it down by 50% of the parent's height
            left: '50%', // Move it right by 50% of the parent's width
            transform: 'translate(-50%, -50%)', // Center the element
            color: 'white',
            fontSize: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap:'5px',
          }}
      >
        <h1 style={{fontWeight: '500'}}>Hurricanify</h1>
        <h2 style={{fontSize: '1.5rem', fontWeight: '300'}}>We are Hurricanify, your Eye on the Hurricane!</h2>
        <Button 
          colorScheme="whiteAlpha" 
          onClick={() => navigate('/home')} // Add navigation logic as needed
        >
          Discover
        </Button>
      </div>
    </div>
  );
}

export default FirstPage;