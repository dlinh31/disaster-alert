import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
  Image,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { userAtom } from '../state/atoms'; // Import the userAtom from your atom file
import axios from 'axios';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places']; // Specify the libraries for Google Maps API

const UserDash = () => {
  const [timezone, setTimezone] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controls the modal

  // Fetch user data from atomWithStorage (localStorage)
  const [user] = useAtom(userAtom); // Get the user data from the atom

  // Form state for the shelter inputs
  const [shelterName, setShelterName] = useState('');
  const [shelterAddress, setShelterAddress] = useState('');
  const [shelterCapacity, setShelterCapacity] = useState('');
  const [shelterOccupancy, setShelterOccupancy] = useState('');
  const [shelterCoordinates, setShelterCoordinates] = useState(null); // State to store coordinates

  const toast = useToast(); // For toast notifications

  /** @type React.MutableRefObject<HTMLInputElement> */
  const autocompleteRef = useRef(null); // Ref for Autocomplete instance

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  // Load Google Maps API with the 'places' library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Your Google Maps API Key
    libraries,
  });

  // Handle timezone detection
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);
  }, []);

  // Function to handle place selection
  const handlePlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const address = place.formatted_address;
        const coordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setShelterAddress(address);
        setShelterCoordinates(coordinates); // Update coordinates
      } else {
        console.error('No place details available');
      }
    }
  };

  // Handle form submission to add shelter
  const handleAddShelter = async () => {
    try {
      // Use Geocoding API to get coordinates from the address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: shelterAddress }, async (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const coordinates = {
            lat: location.lat(),
            lng: location.lng(),
          };
          const newShelter = {
            name: shelterName,
            address: shelterAddress,
            capacity: shelterCapacity,
            occupancy: shelterOccupancy,
            latitude: shelterCoordinates ? shelterCoordinates.lat : null, // Send latitude
            longitude: shelterCoordinates ? shelterCoordinates.lng : null, // Send longitude
          };
          // Make POST request to add the shelter using the user’s ID
          console.log('Adding shelter:', newShelter);
          const response = await axios.post(
            // `${import.meta.env.VITE_BASE_URL}/api/shelters/${user.id}/add-shelter`,
            `${import.meta.env.VITE_BASE_URL}/api/shelters/1/add-shelter`,
            newShelter
          );

          // Show success toast
          toast({
            title: 'Shelter added.',
            description: `Shelter "${shelterName}" has been added successfully.`,
            status: 'success',
            duration: 4000,
            isClosable: true,
          });

          // Close modal and reset form
          setShelterName('');
          setShelterAddress('');
          setShelterCapacity('');
          setShelterOccupancy('');
          onClose(); // Close the modal after submission
        } else {
          console.error(
            'Geocode was not successful for the following reason:',
            status
          );
          toast({
            title: 'Error obtaining location.',
            description: 'Could not determine the coordinates of the address.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
      });
    } catch (error) {
      console.error('Error adding shelter:', error);

      // Show error toast
      toast({
        title: 'Error adding shelter.',
        description: 'There was an issue adding the shelter. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Box mt={4} marginBottom="5vh">
        <Image
          src="https://via.placeholder.com/150"
          alt="Profile"
          boxSize="200px"
          borderRadius="full"
        />
      </Box>

      {/* Top bar for View/Edit Admin */}
      <Box p={6} borderRadius="5px" border="3px black solid">
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Welcome, {user.name}</Heading>{' '}
          {/* Render the user name */}
          <Box>
            <Button colorScheme="red">Delete Profile</Button>
          </Box>
        </Flex>

        {/* Main content section with details */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {/* Basic Details Section */}
          <Box>
            <Heading size="md" mb={4}>
              Basic Details
            </Heading>
            <Text>
              <strong>Full Name: </strong>
              <Link color="blue.500">{user.name}</Link>{' '}
              {/* Display name from userAtom */}
            </Text>
            <Text>
              <strong>Email Address: </strong>
              <Link color="blue.500">{user.email}</Link>{' '}
              {/* Display email from userAtom */}
            </Text>
          </Box>

          {/* Account Section */}
          <Box>
            <Heading size="md" mb={4}>
              Account
            </Heading>
            <Text>
              <strong>Phone Number:</strong>
              {user.phone} {/* Display phone from userAtom */}
            </Text>
            <Text>
              <strong>Timezone: </strong>
              <Link color="blue.500">{timezone}</Link> {/* Display timezone */}
            </Text>
            <Text>
              <strong>Language: </strong>None
            </Text>
            <Box mt={4}>
              <Button size="sm" mt={2} onClick={onOpen}>
                Add Shelter
              </Button>
            </Box>
          </Box>
        </Grid>
      </Box>

      {/* Modal for adding a shelter */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        trapFocus={false}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Shelter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="shelterName" mb={4}>
              <FormLabel>Shelter Name</FormLabel>
              <Input
                placeholder="Enter shelter name"
                value={shelterName}
                onChange={e => setShelterName(e.target.value)}
              />
            </FormControl>

            <FormControl id="shelterCapacity" mb={4}>
              <FormLabel>Shelter Capacity</FormLabel>
              <Input
                type="number"
                placeholder="Enter shelter capacity"
                value={shelterCapacity}
                onChange={e => setShelterCapacity(e.target.value)}
              />
            </FormControl>
            <FormControl id="shelterOccupancy" mb={4}>
              <FormLabel>Current Occupancy</FormLabel>
              <Input
                type="number"
                placeholder="Enter current occupancy"
                value={shelterOccupancy}
                onChange={e => setShelterOccupancy(e.target.value)}
              />
            </FormControl>

            <FormControl id="shelterAddress" mb={4}>
              <FormLabel>Shelter Address</FormLabel>
              {isLoaded && (
                <Autocomplete
                  onLoad={autocomplete => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceSelected}
                >
                  <Input
                    type="text"
                    placeholder="Enter shelter address"
                    value={shelterAddress}
                    onChange={e => setShelterAddress(e.target.value)}
                  />
                </Autocomplete>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddShelter}>
              Add Shelter
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserDash;
