import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';

const UserDash = ({ name, email, phone_number, role }) => {
  const [timezone, setTimezone] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controls the modal

  // Handle timezone detection
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);
  }, []);

  // Form state for the shelter inputs
  const [shelterName, setShelterName] = useState('');
  const [shelterAddress, setShelterAddress] = useState('');
  const [shelterCapacity, setShelterCapacity] = useState('');
  const [shelterOccupancy, setShelterOccupancy] = useState('');

  // Handle form submission
  const handleAddShelter = () => {
    const newShelter = {
      name: shelterName,
      address: shelterAddress,
      capacity: shelterCapacity,
      occupancy: shelterOccupancy,
    };
    console.log('Shelter Added:', newShelter);
    // You can now send this data to an API or update the state
    onClose(); // Close the modal after submission
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
          <Heading size="lg">Welcome, {name}</Heading> {/* Render the name */}
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
              <Link color="blue.500">{name}</Link>
            </Text>
            <Text>
              <strong>Email Address: </strong>
              <Link color="blue.500">{email}</Link>
            </Text>
            <Text>
              <strong>Password: </strong>
              <Button size="sm">Change</Button>
            </Text>
          </Box>

          {/* Account Section */}
          <Box>
            <Heading size="md" mb={4}>
              Account
            </Heading>
            <Text>
              <strong>Phone Number:</strong>{phone_number}
            </Text>
            <Text>
              <strong>Timezone: </strong>
              <Link color="blue.500">{timezone}</Link>
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
      <Modal isOpen={isOpen} onClose={onClose}>
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
                onChange={(e) => setShelterName(e.target.value)}
              />
            </FormControl>
            <FormControl id="shelterAddress" mb={4}>
              <FormLabel>Shelter Address</FormLabel>
              <Input
                placeholder="Enter shelter address"
                value={shelterAddress}
                onChange={(e) => setShelterAddress(e.target.value)}
              />
            </FormControl>
            <FormControl id="shelterCapacity" mb={4}>
              <FormLabel>Shelter Capacity</FormLabel>
              <Input
                type="number"
                placeholder="Enter shelter capacity"
                value={shelterCapacity}
                onChange={(e) => setShelterCapacity(e.target.value)}
              />
            </FormControl>
            <FormControl id="shelterOccupancy" mb={4}>
              <FormLabel>Current Occupancy</FormLabel>
              <Input
                type="number"
                placeholder="Enter current occupancy"
                value={shelterOccupancy}
                onChange={(e) => setShelterOccupancy(e.target.value)}
              />
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
