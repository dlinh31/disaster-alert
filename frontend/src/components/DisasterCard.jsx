import React from 'react';
import { Box, Input, Flex, Text } from '@chakra-ui/react';

const DisasterCard = ({ disasterData }) => {
  return (
    <Box h="100vh" overflowY="hidden">
      {/* Search Box */}
      <Box p="4" bg="white">
        <Input placeholder="Search for disasters..." mb={4} variant="filled" />
      </Box>

      {/* Flex Container for Card List */}
      <Flex
        flexDirection="column"
        height="calc(100vh - 64px)" // Adjust height based on the search box height
        overflowY="auto" // Allow scrolling for the entire Flex container
        p="4"
      >
        {disasterData.map((disaster, index) => (
          <Box
            key={index}
            bg="white"
            p={4}
            borderRadius="md"
            shadow="md"
            mb={4} // Margin between cards
            border="1px solid #ccc"
          >
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              {disaster.title}
            </Text>
            <Text>
              <strong>Event Type:</strong> {disaster.eventType}
            </Text>
            <Text>
              <strong>Area:</strong> {disaster.area}
            </Text>
            <Text>
              <strong>Severity:</strong> {disaster.severity}
            </Text>
            <Text>
              <strong>Urgency:</strong> {disaster.urgency}
            </Text>
            <Text>
              <strong>Certainty:</strong> {disaster.certainty}
            </Text>
            <Text>
              <strong>Effective:</strong> {disaster.effective}
            </Text>
            <Text>
              <strong>Expires:</strong> {disaster.expires}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default DisasterCard;
