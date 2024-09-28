import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, Flex, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai'; // Import useAtom from Jotai

import { selectedMarkerAtom } from '../state/atoms'; // Import the selectedMarker atom

const DisasterCard = ({ disasterData }) => {
  const [, setSelectedMarker] = useAtom(selectedMarkerAtom); // Use setSelectedMarker from Jotai

  // Function to handle card click and set the selected marker
  const handleCardClick = disaster => {
    const selectedMarker = {
      position: disaster.coordinates[0], // Assume first coordinate represents the marker position
      headline: disaster.title,
      coordinates: disaster.coordinates, // Coordinates for heatmap or polygon if necessary
    };

    setSelectedMarker(selectedMarker); // Update the selected marker
  };

  const [searchTerm, setSearchTerm] = useState('');
  const filteredDisasters = disasterData.filter(
    disaster =>
      disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.urgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.certainty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = dateString => {
    const date = new Date(dateString); // Convert string to Date object
    return date.toLocaleDateString(); // Format date as a locale string
  };

  return (
    <Box h="100vh" overflowY="hidden">
      {/* Search Box */}
      <Box p="4" bg="white" border="1px solid black">
        <Input
          placeholder="Search for disasters..."
          mb={4}
          variant="filled"
          value={searchTerm} // Controlled input
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Flex Container for Card List */}
      <Flex
        flexDirection="column"
        height="calc(100vh - 64px)" // Adjust height based on the search box height
        overflowY="auto" // Allow scrolling for the entire Flex container
        p="4"
      >
        {filteredDisasters.map((disaster, index) => (
          <Box
            key={index}
            bg="white"
            p={4}
            borderRadius="md"
            shadow="md"
            mb={4}
            border="1px solid #ccc"
            onClick={() => handleCardClick(disaster)} // Add onClick to handle marker selection
            cursor="pointer" // Change the cursor to indicate clickability
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
              <strong>Effective:</strong> {formatDate(disaster.effective)}
            </Text>
            <Text>
              <strong>Expires:</strong> {formatDate(disaster.expires)}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

DisasterCard.propTypes = {
  disasterData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      eventType: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      severity: PropTypes.string.isRequired,
      urgency: PropTypes.string.isRequired,
      certainty: PropTypes.string.isRequired,
      effective: PropTypes.string.isRequired,
      expires: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DisasterCard;
