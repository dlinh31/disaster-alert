import {
  Box,
  Flex,
  SkeletonText,
  Text,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  Select,
} from '@chakra-ui/react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  HeatmapLayer,
  InfoWindow,
  Polygon,
  Circle,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';

import { findNearestShelter } from '../utils/utils';
import { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import {
  userLocationAtom,
  selectedMarkerAtom,
  selectedShelterAtom,
  radiusAtom,
  isFindRouteAtom,
} from '../state/atoms';
import { formatDate } from '../utils/utils'; // Assuming you have a formatDate helper

const libraries = ['places', 'visualization'];

function Map({ disasterData, shelters }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  // Set a mock userLocation
  const [userLocation, setUserLocation] = useAtom(userLocationAtom); // Use the mock location
  const [selectedMarker, setSelectedMarker] = useAtom(selectedMarkerAtom);
  const [selectedShelter, setSelectedShelter] = useAtom(selectedShelterAtom);
  const [isFindRoute, setIsFindRoute] = useAtom(isFindRouteAtom);

  const [map, setMap] = useState(null);
  const [markersData, setMarkersData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [polygonData, setPolygonData] = useState([]);
  const [mapCenter, setMapCenter] = useState(userLocation); // Set initial map center to the mock location
  const [shelterMarkers, setShelterMarkers] = useState([]); // State for shelter markers

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [selectedDestinationShelterId, setSelectedDestinationShelterId] =
    useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  useEffect(() => {
    console.log('userLocation:', userLocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentLocation);
          setMapCenter(currentLocation);
        },
        error => {
          console.error('Error getting user location:', error);
          // Handle error or set a default location
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
          setUserLocation(defaultLocation);
          setMapCenter(defaultLocation);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Convert event data and extract the first coordinate from each event
  useEffect(() => {
    if (isLoaded && window.google) {
      const markerLocations = disasterData
        .filter(event => event.coordinates && event.coordinates[0]) // Ensure we have valid coordinates
        .map(event => {
          const coordinates = event.coordinates[0]; // Assume the first coordinate is valid
          if (
            coordinates &&
            typeof coordinates.lat === 'number' &&
            typeof coordinates.lng === 'number'
          ) {
            return {
              id: event.id,
              position: coordinates,
              eventDetails: event.eventType,
              headline: event.title,
              coordinates: event.coordinates,
              severity: event.severity || 'Unknown severity',
              urgency: event.urgency || 'Unknown urgency',
              certainty: event.certainty || 'Unknown certainty',
              effective: event.effective
                ? new Date(event.effective)
                : 'Unknown effective date',
              expires: event.expires
                ? new Date(event.expires)
                : 'Unknown expiration date',
            };
          }
          return null; // Skip this marker if coordinates are invalid
        })
        .filter(marker => marker !== null); // Filter out invalid markers
      setMarkersData(markerLocations);
    }
  }, [isLoaded, disasterData]);

  useEffect(() => {
    if (isLoaded && window.google) {
      const formattedShelters = shelters
        .filter(shelter => shelter.latitude && shelter.longitude) // Ensure valid coordinates
        .map(shelter => ({
          id: shelter.id,
          position: { lat: shelter.latitude, lng: shelter.longitude },
          name: shelter.name,
          capacity: shelter.capacity,
          currentOccupancy: shelter.current_occupancy,
          address: shelter.address,
        }));

      setShelterMarkers(formattedShelters);
    }
  }, [isLoaded, shelters]);

  // Handle when a marker is selected
  useEffect(() => {
    if (!map) return;

    if (!selectedMarker) {
      // Clear heatmapData and polygonData when selectedMarker is null
      setHeatmapData([]);
      setPolygonData([]);
      return;
    }

    // Pan to the selected marker's position
    if (selectedMarker.position) {
      map.panTo(selectedMarker.position);
    }

    // Set the heatmap data and polygon data
    const heatmapPoints = selectedMarker.coordinates.map(coord => ({
      location: new window.google.maps.LatLng(coord.lat, coord.lng),
      weight: 1,
    }));
    setHeatmapData(heatmapPoints);
    setPolygonData(selectedMarker.coordinates);
  }, [selectedMarker, map]);

  // Function to handle marker clicks
  const handleMarkerClick = marker => {
    setHeatmapData([]);
    setPolygonData([]);
    setSelectedMarker(marker);
  };
  const handleShelterMarkerClick = shelter => {
    setHeatmapData([]);
    setPolygonData([]);
    setSelectedShelter(shelter);
  };

  async function calculateRoute() {
    if (!userLocation) {
      return;
    }
    let destinationShelter;
    if (selectedDestinationShelterId) {
      // Remove 'const' to assign to the outer 'destinationShelter' variable
      destinationShelter = shelterMarkers.find(
        shelter => shelter.id === parseInt(selectedDestinationShelterId, 10)
      );
    } else if (selectedShelter) {
      destinationShelter = selectedShelter;
    }

    if (!destinationShelter) {
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: userLocation,
      destination: destinationShelter.position,
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
    setSelectedDestinationShelterId('');
  }

  const findNearestShelterAndCalculateRoute = () => {
    if (!userLocation || shelterMarkers.length === 0) {
      return;
    }
    const nearestShelter = findNearestShelter(userLocation, shelterMarkers);
    if (!nearestShelter) {
      return;
    }
    // Set the selected shelter ID and selected shelter
    setSelectedDestinationShelterId(nearestShelter.id.toString());
    setSelectedShelter(nearestShelter);
    // Calculate the route to the nearest shelter
    calculateRoute();
  };

  if (!isLoaded) {
    return <SkeletonText />;
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="90vh"
      w="80vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        <GoogleMap
          center={mapCenter}
          zoom={8}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={userLocation} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {markersData.map((marker, index) => (
            <Marker
              key={index}
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/512/2272/2272231.png',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              position={marker.position} // Ensure valid position
              onClick={() => handleMarkerClick(marker)}
            />
          ))}

          {selectedMarker && heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData}
              options={{
                radius: 50,
                opacity: 0.5,
              }}
            />
          )}

          {polygonData.length > 0 && (
            <Polygon
              paths={polygonData}
              options={{
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}

          {shelterMarkers.map(shelter => (
            <Marker
              key={shelter.id}
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/512/195/195492.png', // Shelter icon
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              position={shelter.position}
              onClick={() => handleShelterMarkerClick(shelter)} // Handle shelter marker clicks
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <Text fontWeight="bold" fontSize="md" mb={2}>
                  {selectedMarker.headline}
                </Text>
                <Text>
                  <strong>Event Type:</strong> {selectedMarker.eventDetails}
                </Text>
                <Text>
                  <strong>Area:</strong> {selectedMarker.area || 'Unknown area'}
                </Text>
                <Text>
                  <strong>Severity:</strong> {selectedMarker.severity}
                </Text>
                <Text>
                  <strong>Urgency:</strong> {selectedMarker.urgency}
                </Text>
                <Text>
                  <strong>Certainty:</strong> {selectedMarker.certainty}
                </Text>
                <Text>
                  <strong>Effective:</strong>{' '}
                  {selectedMarker.effective !== 'Unknown effective date'
                    ? formatDate(selectedMarker.effective)
                    : 'Unknown'}
                </Text>
                <Text>
                  <strong>Expires:</strong>{' '}
                  {selectedMarker.expires !== 'Unknown expiration date'
                    ? formatDate(selectedMarker.expires)
                    : 'Unknown'}
                </Text>
              </div>
            </InfoWindow>
          )}

          {/* Shelter InfoWindow */}
          {selectedShelter && selectedShelter.id && (
            <InfoWindow
              position={{
                lat: selectedShelter.position.lat,
                lng: selectedShelter.position.lng,
              }}
              onCloseClick={() => setSelectedShelter(null)} // Close the shelter info window
            >
              <div>
                <Text fontWeight="bold" fontSize="md" mb={2}>
                  {selectedShelter.name}
                </Text>
                <Text>
                  <strong>Address:</strong> {selectedShelter.address}
                </Text>
                <Text>
                  <strong>Capacity:</strong> {selectedShelter.capacity}
                </Text>
                <Text>
                  <strong>Current Occupancy:</strong>{' '}
                  {selectedShelter.currentOccupancy}
                </Text>
              </div>
            </InfoWindow>
          )}

          {/* {userLocation && (
            <>
              <Marker
                position={userLocation}
                label="You"
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
              />
              <Circle
                center={userLocation}
                radius={5} // Use the radius stored in Jotai
                options={{
                  fillColor: 'rgba(100, 150, 255, 0.3)',
                  strokeColor: 'rgba(100, 150, 255, 1)',
                  strokeWeight: 1,
                }}
              />
            </>
          )} */}
        </GoogleMap>
      </Box>

      {isFindRoute && (
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
            {/* <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box> */}
            <Box flexGrow={1}>
              <Select
                placeholder="Select a shelter"
                onChange={e => setSelectedDestinationShelterId(e.target.value)}
                value={selectedDestinationShelterId}
              >
                {shelterMarkers.map(shelter => (
                  <option key={shelter.id} value={shelter.id}>
                    {shelter.name}
                  </option>
                ))}
              </Select>
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
            <Text>Duration: {duration} </Text>+{' '}
            <Button onClick={findNearestShelterAndCalculateRoute}>
              Find Nearest Shelter
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(userLocation);
                map.setZoom(15);
              }}
            />
          </HStack>
        </Box>
      )}
    </Flex>
  );
}

Map.propTypes = {
  disasterData: PropTypes.arrayOf(
    PropTypes.shape({
      coordinates: PropTypes.arrayOf(
        PropTypes.shape({
          lat: PropTypes.number.isRequired,
          lng: PropTypes.number.isRequired,
        })
      ).isRequired,
      eventType: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  shelters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      address: PropTypes.string.isRequired,
      capacity: PropTypes.number.isRequired,
      current_occupancy: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Map;
