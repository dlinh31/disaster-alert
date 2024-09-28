import React from 'react';
import { Box, Input, Flex, Text } from '@chakra-ui/react';

const disasterData = [
  {
    title: 'Disaster Title 1',
    description: 'A brief description of the disaster.',
  },
  {
    title: 'Disaster Title 2',
    description: 'A brief description of the disaster.',
  },
  {
    title: 'Disaster Title 3',
    description: 'A brief description of the disaster.',
  },
  {
    title: 'Disaster Title 4',
    description: 'A brief description of the disaster.',
  },
  {
    title: 'Disaster Title 5',
    description: 'A brief description of the disaster.',
  },
  {
    title: 'Disaster Title 6',
    description: 'A brief description of the disaster.',
  },
  // Add more disasters as needed
];

const DisasterCard = () => {
  return (
    <Box h="100%" paddingTop="5%">
      {' '}
      {/* Parent box occupying full height and padding left-right */}
      {/* Search Box */}
      <Box p="0 5%">
        <Input placeholder="Search for disasters..." mb={4} variant="filled" />
      </Box>
      {/* Flex Container for Card List */}
      <Flex
        flexDirection="column"
        h="90%" // Remaining height after search box
        overflowY="auto" // Allow scrolling for the card list
        justifyContent="flex-start" // Align cards at the start
      >
        {disasterData.map((disaster, index) => (
          <Box
            key={index} // Use index as key (or use a unique identifier if available)
            bg="white"
            p={4}
            flex="0 0 20%" // Fixed height for cards
            borderTop="0.25px groove grey"
            borderBottom="0.25px groove grey"
          >
            <Text fontWeight="bold">{disaster.title}</Text>
            <Text>{disaster.description}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default DisasterCard;
