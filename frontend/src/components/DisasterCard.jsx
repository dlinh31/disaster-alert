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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button, // Import Button component
} from '@chakra-ui/react'; // Import Chakra components
import { useAtom } from 'jotai';
import {
  selectedMarkerAtom,
  radiusAtom,
  isFindRouteAtom, // Import isFindRouteAtom
} from '../state/atoms';

const DisasterCard = ({ disasterData }) => {
  const [selectedMarker, setSelectedMarker] = useAtom(selectedMarkerAtom); // Get selectedMarker from Jotai
  const [radius, setRadius] = useAtom(radiusAtom); // Get and set radius from Jotai
  const [isFindRoute, setIsFindRoute] = useAtom(isFindRouteAtom); // Get and set isFindRoute from Jotai
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [filterToday, setFilterToday] = useState(false);

  const handleCardClick = disaster => {
    const selectedMarker = {
      id: disaster.id,
      position: disaster.coordinates[0], // Assume first coordinate represents the marker position
      headline: disaster.title,
      coordinates: disaster.coordinates,
      area: disaster.area,
      description: disaster.description,
      certainty: disaster.certainty,
      severity: disaster.severity,
      urgency: disaster.urgency,
      effective: disaster.effective,
      expires: disaster.expires,
    };
    setSelectedMarker(selectedMarker); // Update the selected marker
  };

  const formatDate = date => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

  const today = new Date().toISOString().split('T')[0];

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
      !filterToday ||
      (new Date(disaster.effective).toISOString().split('T')[0] <= today &&
        new Date(disaster.expires).toISOString().split('T')[0] >= today);

    return matchesSearch && matchesUrgency && matchesToday;
  });

  return (
    <Box h="90vh" overflowY="hidden">
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
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          width="100%"
          maxWidth="400px"
        />
        <Select
          placeholder="Filter by urgency"
          value={urgencyFilter}
          onChange={e => setUrgencyFilter(e.target.value)}
          mb={4}
          width="100%"
          maxWidth="400px"
        >
          <option value="Immediate">Immediate</option>
          <option value="Expected">Expected</option>
        </Select>
        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="today-switch" mb="0">
            Show events for today
          </FormLabel>
          <Switch
            id="today-switch"
            isChecked={filterToday}
            onChange={() => setFilterToday(!filterToday)}
          />
        </FormControl>

        {/* Radius slider */}
        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="radius-slider" mb="0">
            Radius (in km)
          </FormLabel>
          <Slider
            id="radius-slider"
            value={radius / 1000} // Convert meters to km
            min={1}
            max={50}
            step={1}
            onChange={value => setRadius(value * 1000)} // Convert km back to meters
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text ml={4}>{radius / 1000} km</Text>{' '}
          {/* Display the radius in km */}
        </FormControl>

        {/* Add the button to toggle finding route */}
        <Button
          colorScheme={isFindRoute ? 'teal' : 'gray'}
          onClick={() => setIsFindRoute(!isFindRoute)}
          mb={4}
        >
          {isFindRoute ? 'Disable Route Finding' : 'Enable Route Finding'}
        </Button>
      </Flex>

      <Flex
        flexDirection="column"
        height="50vh"
        overflowY="auto"
        p="4"
      >
        {filteredDisasters.map((disaster, index) => {
          const isSelected = selectedMarker?.id === disaster.id;
          return (
            <Box
              key={index}
              bg={isSelected ? 'teal.100' : 'white'}
              p={4}
              borderRadius="md"
              shadow="md"
              mb={4}
              border="1px solid #ccc"
              onClick={() => handleCardClick(disaster)}
              cursor="pointer"
              _hover={{
                bg: 'teal.50',
                border: '1px solid teal',
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
      effective: PropTypes.instanceOf(Date).isRequired,
      expires: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
};

export default DisasterCard;
