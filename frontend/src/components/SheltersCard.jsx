import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '../state/atoms'; // Import the userAtom from your atom file

const SheltersCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [user] = useAtom(userAtom); // Get the user data from the atom

  useEffect(() => {
    // Fetch shelters from the API
    console.log('user.id: ', user);
    const fetchShelters = async () => {
      if (user.id === -1) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/shelters/${user.id}/get-shelter`
        );
        console.log(response.data);
        setShelters(response.data);
        setFilteredShelters(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching shelters:', err);
        setError('Failed to load shelters.');
        setIsLoading(false);
      }
    };

    fetchShelters();
  }, [user]);

  // Handle shelter selection
  const handleViewDetails = (shelter) => {
    setSelectedShelter(shelter);
    onOpen();
  };

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = shelters.filter((shelter) =>
      shelter.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredShelters(filtered);
  };

  return (
    <Box h="100%" paddingTop="5%">
      {/* Search Box */}
      <Box p="0 5%">
        <Input
          placeholder="Search for shelters..."
          mb={4}
          variant="filled"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      {/* Content */}
      {isLoading ? (
        // Loading State
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        // Error State
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Text color="red.500">{error}</Text>
        </Flex>
      ) : (
        // Shelters List
        <Flex
          flexDirection="column"
          h="90%" // Remaining height after search box
          overflowY="auto" // Allow scrolling for the card list
          justifyContent="flex-start" // Align cards at the start
        >
          {filteredShelters.length > 0 ? (
            filteredShelters.map((shelter) => (
              <Box
                key={shelter.id}
                bg="white"
                p={4}
                borderTop="0.25px groove grey"
                borderBottom="0.25px groove grey"
                position="relative"
              >
                <Text fontWeight="bold">{shelter.name}</Text>
                <Text>Address: {shelter.address}</Text>
                <Text>Capacity: {shelter.capacity}</Text>
                <Text>Current Occupancy: {shelter.current_occupancy}</Text>
                <Text>Coordinates: {shelter.latitude}, {shelter.longitude}</Text>
                <Button
                  mt={2}
                  size="sm"
                  onClick={() => handleViewDetails(shelter)}
                >
                  View Details
                </Button>
              </Box>
            ))
          ) : (
            <Flex justifyContent="center" alignItems="center" h="100%">
              <Text>No shelters found.</Text>
            </Flex>
          )}
        </Flex>
      )}

      {/* Modal to show shelter details */}
      {selectedShelter && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedShelter.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                <strong>Address:</strong> {selectedShelter.address}
              </Text>
              <Text>
                <strong>Capacity:</strong> {selectedShelter.capacity}
              </Text>
              <Text>
                <strong>Current Occupancy:</strong>{' '}
                {selectedShelter.current_occupancy}
              </Text>
              <Text>
                <strong>Coordinates:</strong> {selectedShelter.latitude}, {selectedShelter.longitude}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default SheltersCard;
