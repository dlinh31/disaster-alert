import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Input,
  Flex,
  Text,
  Select,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'; // Import Chakra components
import { useAtom } from 'jotai';
import { selectedMarkerAtom } from '../state/atoms';

const DisasterCard = ({ disasterData }) => {
  const [selectedMarker, setSelectedMarker] = useAtom(selectedMarkerAtom); // Get selectedMarker from Jotai

  // State for search term, urgency filter, and today filter
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [filterToday, setFilterToday] = useState(false); // State for the "Today" filter

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

  const formatDate = date => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter the disaster data based on search term, urgency filter, and "Today" filter
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

    const matchesToday =
      !filterToday || // If "Today" filter is off, all disasters match
      (new Date(disaster.effective).toISOString().split('T')[0] <= today &&
        new Date(disaster.expires).toISOString().split('T')[0] >= today);

    return matchesSearch && matchesUrgency && matchesToday;
  });

  return (
    <Box h="100vh" overflowY="hidden">
      {/* Search, Urgency, and Today Filter Box */}
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        p="4"
        bg="white"
      >
        <Input
          placeholder="Search for disasters..."
          mb={4}
          variant="filled"
          value={searchTerm} // Controlled input for search
          onChange={e => setSearchTerm(e.target.value)}
          width="100%" // Make input take full width
          maxWidth="400px" // Set max width for larger screens
        />
        {/* Urgency Filter Dropdown */}
        <Select
          placeholder="Filter by urgency" // Default placeholder
          value={urgencyFilter} // Controlled value for urgency filter
          onChange={e => setUrgencyFilter(e.target.value)} // Update urgency filter on selection
          mb={4}
          width="100%" // Make select take full width
          maxWidth="400px" // Set max width for larger screens
        >
          <option value="Immediate">Immediate</option>
          <option value="Expected">Expected</option>
        </Select>
        {/* Toggle switch for filtering disasters by today's date */}
        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="today-switch" mb="0">
            Show events for today
          </FormLabel>
          <Switch
            id="today-switch"
            isChecked={filterToday}
            onChange={() => setFilterToday(!filterToday)} // Toggle today filter
          />
        </FormControl>
      </Flex>

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
      expires: PropTypes.instanceOf(Date).isRequired, // Expect Date instance
    })
  ).isRequired,
};

export default DisasterCard;
