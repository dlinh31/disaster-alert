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
      height="calc(100vh - 20vh)"
      overflowY="auto"
      >
        {shelters.map((shelter) => (
          <Box
            key={shelter.id}
            bg="white"
            p={4}
            borderTop="0.25px groove grey"
            borderBottom="0.25px groove grey"
          >
            <Text fontWeight="bold">{shelter.title}</Text>
            <Text>{shelter.description}</Text>
            
            {/* Flex container for buttons */}
            <Flex mt={2} justifyContent="space-between">
              <Button size="sm" onClick={() => handleViewDetails(shelter)}>
                View Details
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => handleDeleteShelter(shelter.id)}
              >
                Delete
              </Button>
            </Flex>
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
