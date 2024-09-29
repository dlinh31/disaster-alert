import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Box, Button, Flex, Heading, Text, Image } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { selectedShelterAtom } from '../state/atoms';
import pfp from '../assets/pfp.png';
function Contact() {
  const { shelterId } = useParams(); // Get shelterId from URL
  const [selectedShelter] = useAtom(selectedShelterAtom); // Get selected shelter data from global state
  const [providerInfo, setProviderInfo] = useState(null); // State to store fetched provider information

  useEffect(() => {
    const getProviderInfo = async () => {
      // Fetch provider information from the API
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/shelters/${shelterId}/provider`
        );
        const data = await response.json();
        setProviderInfo(data); // Store provider information in state
      } catch (error) {
        console.error('Error fetching provider info:', error);
      }
    };

    if (shelterId) {
      getProviderInfo(); // Fetch provider info when shelterId is available
    }
  }, [shelterId]);

  return (
    <Box minHeight="100vh" minWidth="100vw" position="relative">
      {/* Navbar with transparent background */}
      <Navbar />

      <Flex
        direction="column"
        alignItems="center"
        height="35vh"
        justifyContent="center"
        bg="lightblue"
      >
        <Heading as="h1" size="2xl" color="black" textAlign="center">
          Contact Provider
        </Heading>
        <Text color="black" textAlign="center" marginTop="2">
          Get in touch and them know we need help.
        </Text>
      </Flex>

      {/* Flex container for contact options */}
      <Flex
        direction={['column', 'column', 'row']} // Stack vertically on small screens and horizontally on larger screens
        justify="space-around"
        align="stretch" // Stretch cards to the same height
        wrap="wrap" // Allows wrapping if the screen is too small
        marginTop="8" // Add some margin at the top
      >
        {/* Provider Card */}
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          border="2px dashed black"
          padding="6"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around" // Ensure content is spaced evenly
          width={['80%', '80%', '35%']} // Full width on small screens, 45% on larger screens
        >
          <Image src={pfp} alt="Profile" boxSize="150px" borderRadius="full" />
          <Box display="flex" flexDirection="column" alignItems="center">
            <Heading marginTop="2" textAlign="center">
              {providerInfo ? providerInfo.name : 'Loading...'}
            </Heading>
            <Text marginTop="2" textAlign="center">
              Phone Number: {providerInfo ? providerInfo.phone : 'Loading...'}
            </Text>
            <Text marginTop="2" textAlign="center">
              Email: 
              <a href={`mailto:${providerInfo ? providerInfo.email : '#'}`}>
                {providerInfo ? providerInfo.email : 'Loading...'}
              </a>
            </Text>
            <Text marginTop="2" textAlign="center">
              Phone number:{' '}
              {providerInfo ? providerInfo.phone_number : 'Loading...'}
            </Text>
            <Button colorScheme="blue" variant="outline" marginTop="4">
              Contact
            </Button>
          </Box>
        </Box>

        {/* Shelter Information Card */}
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          border="2px dashed black"
          padding="6"
          textAlign="center"
          width={['80%', '80%', '35%']} // Full width on small screens, 45% on larger screens
        >
          <Heading as="h3" size="lg" marginTop="4">
            Shelter Information
          </Heading>
          <Text marginTop="2" textAlign="center">
            Address: {selectedShelter ? selectedShelter.address : 'Loading...'}
          </Text>
          <Text marginTop="2" textAlign="center">
            Occupancy:{' '}
            {selectedShelter ? selectedShelter.currentOccupancy : 'Loading...'}
          </Text>
          <Text marginTop="2" textAlign="center">
            Max Capacity:{' '}
            {selectedShelter ? selectedShelter.capacity : 'Loading...'}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default Contact;
