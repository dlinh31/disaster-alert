import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, Flex, Text, Select } from '@chakra-ui/react'; // Import Select from Chakra UI
import { useAtom } from 'jotai';
import { selectedMarkerAtom } from '../state/atoms';

const DisasterCard = ({ disasterData }) => {
  const [selectedMarker, setSelectedMarker] = useAtom(selectedMarkerAtom); // Get selectedMarker from Jotai

  // State for search term and urgency filter
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');

  // Handle card click and set the selected marker
  const handleCardClick = disaster => {
    const selectedMarker = {
      id: disaster.id,
      position: disaster.coordinates[0], // Assume first coordinate represents the marker position
      headline: disaster.title,
      coordinates: disaster.coordinates,
    };

    setSelectedMarker(selectedMarker); // Update the selected marker
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Filter the disaster data based on search term and urgency filter
  const filteredDisasters = disasterData.filter(disaster => {
    const matchesSearch =
      disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.urgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.certainty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUrgency =
      urgencyFilter === '' || disaster.urgency === urgencyFilter;

    return matchesSearch && matchesUrgency;
  });

  return (
    <Box h="100vh" overflowY="hidden">
      {/* Search Box */}
      <Box p="4" bg="white">
        <Input
          placeholder="Search for disasters..."
          mb={4}
          variant="filled"
          value={searchTerm} // Controlled input for search
          onChange={e => setSearchTerm(e.target.value)}
        />
        {/* Urgency Filter Dropdown */}
        <Select
          placeholder="Filter by urgency" // Default placeholder
          value={urgencyFilter} // Controlled value for urgency filter
          onChange={e => setUrgencyFilter(e.target.value)} // Update urgency filter on selection
          mb={4}
        >
          <option value="Immediate">Immediate</option>
          <option value="Expected">Expected</option>
        </Select>
      </Box>

      {/* Flex Container for Card List */}
      <Flex
        flexDirection="column"
        height="calc(100vh - 64px)" // Adjust height based on the search box height
        overflowY="auto" // Allow scrolling for the entire Flex container
        p="4"
      >
        {filteredDisasters.map((disaster, index) => {
          const isSelected = selectedMarker?.id === disaster.id; // Check if this card is selected
          return (
            <Box
              key={index}
              bg={isSelected ? 'teal.100' : 'white'} // Change background if selected
              p={4}
              borderRadius="md"
              shadow="md"
              mb={4}
              border="1px solid #ccc"
              onClick={() => handleCardClick(disaster)} // Add onClick to handle marker selection
              cursor="pointer" // Change the cursor to indicate clickability
              _hover={{
                bg: 'teal.50', // Hover effect to change background
                border: '1px solid teal', // Change border color on hover
              }}
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
          );
        })}
      </Flex>
    </Box>
  );
};

DisasterCard.propTypes = {
  disasterData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      eventType: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      severity: PropTypes.string.isRequired,
      urgency: PropTypes.string.isRequired,
      certainty: PropTypes.string.isRequired,
      effective: PropTypes.instanceOf(Date).isRequired, // Expect Date instance
      expires: PropTypes.instanceOf(Date).isRequired,   // Expect Date instance
    })
  ).isRequired,
};
export default DisasterCard;
