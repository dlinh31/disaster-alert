import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  HeatmapLayer,
} from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import mockdata from '../assets/mockdata.json';

// Adjust the center to Florida based on the mockdata coordinates
const center = { lat: 30.27, lng: -84.53 };

// Define the libraries array as a constant outside the component
const libraries = ['places', 'visualization'];

function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries, // Use the constant libraries array
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [heatmapData, setHeatmapData] = useState([]); // State for heatmap data

  const originRef = useRef();
  const destinationRef = useRef();

  useEffect(() => {
    if (isLoaded && window.google) {
      // Update the state with the coordinates from mockdata using LatLng when google is available
      const coordinates = mockdata.geometry.coordinates[0].map(point => ({
        location: new window.google.maps.LatLng(point[1], point[0]), // Ensure google is available
        weight: 1, // You can adjust the weight of each point
      }));
      setHeatmapData(coordinates); // Set the state with the coordinates
    }
  }, [isLoaded]); // Run only when map is loaded

  useEffect(() => {
    console.log('Heatmap Coordinates: ', heatmapData);
  }, [heatmapData]);

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="90vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center} // Set the map center to Florida
          zoom={8} // Adjust zoom level to ensure heatmap visibility
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          {/* Marker at center */}
          <Marker position={center} />

          {/* Render heatmap using the coordinates from the heatmapData state */}
          {heatmapData.length > 0 && (
            <HeatmapLayer
              dissipating={false}
              data={heatmapData}
              options={{
                radius: 50, // Fixed radius for each heatmap point
                opacity: 0.5, // Heatmap opacity
              }}
            />
          )}

          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(12);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
}

export default Map;
