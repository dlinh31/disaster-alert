import React, { useState } from 'react';
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
} from '@chakra-ui/react';

const initialShelterData = [
  { id: 1, title: 'Shelter Title 1', description: 'A brief description of the shelter.', address: '123 Main St', capacity: 100, occupancy: 50 },
  { id: 2, title: 'Shelter Title 2', description: 'A brief description of the shelter.', address: '456 Elm St', capacity: 150, occupancy: 80 },
  { id: 3, title: 'Shelter Title 3', description: 'A brief description of the shelter.', address: '789 Oak St', capacity: 200, occupancy: 120 },
  { id: 4, title: 'Shelter Title 4', description: 'A brief description of the shelter.', address: '101 Pine St', capacity: 250, occupancy: 180 },
  { id: 1, title: 'Shelter Title 1', description: 'A brief description of the shelter.', address: '123 Main St', capacity: 100, occupancy: 50 },
  { id: 2, title: 'Shelter Title 2', description: 'A brief description of the shelter.', address: '456 Elm St', capacity: 150, occupancy: 80 },
  { id: 3, title: 'Shelter Title 3', description: 'A brief description of the shelter.', address: '789 Oak St', capacity: 200, occupancy: 120 },
  { id: 4, title: 'Shelter Title 4', description: 'A brief description of the shelter.', address: '101 Pine St', capacity: 250, occupancy: 180 },
];

const SheltersCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shelters, setShelters] = useState(initialShelterData);
  const [selectedShelter, setSelectedShelter] = useState(null);

  const handleViewDetails = (shelter) => {
    setSelectedShelter(shelter);
    onOpen();
  };

  const handleDeleteShelter = (shelterId) => {
    // Filter out the deleted shelter from the state
    setShelters((prevShelters) => prevShelters.filter(shelter => shelter.id !== shelterId));
  };

  return (
    <Box h="100%" paddingTop="5%">
      {/* Search Box */}
      <Box p="0 5%">
        <Input placeholder="Search for shelters..." mb={4} variant="filled" />
      </Box>

      {/* Flex Container for Card List */}
      <Flex
        flexDirection="column"
        h="90%" // Remaining height after search box
        overflowY="auto" // Allow scrolling for the card list
        justifyContent="flex-start" // Align cards at the start
      >
        {shelters.map((shelter) => (
          <Box
            key={shelter.id}
            bg="white"
            p={4}
            borderTop="0.25px groove grey"
            borderBottom="0.25px groove grey"
            position="relative" // To position the delete button in the bottom-right
          >
            <Text fontWeight="bold">{shelter.title}</Text>
            <Text>{shelter.description}</Text>
            <Button mt={2} size="sm" onClick={() => handleViewDetails(shelter)}>
              View Details
            </Button>

            {/* Delete Button in the bottom-right corner */}
            <Button
              size="sm"
              colorScheme="red"
              position="absolute"
              bottom="10px"
              right="10px"
              onClick={() => handleDeleteShelter(shelter.id)}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Flex>

      {/* Modal to show shelter details */}
      {selectedShelter && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedShelter.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                <strong>Address:</strong> {selectedShelter.address}
              </Text>
              <Text>
                <strong>Capacity:</strong> {selectedShelter.capacity}
              </Text>
              <Text>
                <strong>Current Occupancy:</strong> {selectedShelter.occupancy}
              </Text>
              <Text>
                <strong>Description:</strong> {selectedShelter.description}
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
