import React from 'react';
import Navbar from '../components/Navbar';
import { Box, Button, Flex, Heading, Text, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Contact() {
    const navigate = useNavigate();

    return (
        <Box
            minHeight="100vh"
            minWidth="100vw"
            position="relative"
        >
            {/* Navbar with transparent background */}
            <Navbar />

            <Flex direction="column" alignItems="center" height="35vh" justifyContent="center" bg="lightblue">
                <Heading as="h1" size="2xl" color="black" textAlign="center">
                    Contact Us
                </Heading>
                <Text color="black" textAlign="center" marginTop="2">
                    Get in touch and let us know how we can help.
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
                   
                    <Image
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        boxSize="150px"
                        borderRadius="full"
                    />
                     <Box
                     display="flex"
                     flexDirection="column"
                     alignItems="center">
                    <Heading marginTop="2" textAlign="center">
                      John Doe
                    </Heading>
                    <Text marginTop="2" textAlign="center">
                        Phone Number:
                    </Text>
                    <Text marginTop="2" textAlign="center">
                        Email:
                    </Text>
                    <Text marginTop="2" textAlign="center">
                        Language:
                    </Text>
                    <Button
                        colorScheme="blue"
                        variant="outline"
                        marginTop="4"
                    >
                        Contact
                    </Button>
                    </Box>
                </Box>

                {/* Help & Support Card */}
                <Box
                    bg="white"
                    borderRadius="lg"
                    boxShadow="md"
                    border="2px dashed black"
                    padding="6"
                    textAlign="center"
                    width={['80%', '80%', '35%']} // Full width on small screens, 45% on larger screens
                >
                    <Heading as="h3" size="lg" marginTop="4">Shelter Information</Heading>
                    <Text marginTop="2" textAlign="center">
                        Address:
                    </Text>
                    <Text marginTop="2" textAlign="center">
                        Occupancy:
                    </Text>
                    <Text marginTop="2" textAlign="center">
                        Max Capacity:
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
}

export default Contact;
