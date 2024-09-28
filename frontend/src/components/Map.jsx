import { Box, Flex, SkeletonText } from '@chakra-ui/react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  HeatmapLayer,
  InfoWindow,
  Polygon,
} from '@react-google-maps/api';

import { useEffect, useState } from 'react';
import eventsData from '../assets/mockdata.json'; // Assuming this is the JSON array

// Adjust the center to Florida based on the mockdata coordinates
const center = { lat: 30.27, lng: -84.53 };

// Define the libraries array as a constant outside the component
const libraries = ['places', 'visualization'];

// Function to convert coordinates string into a usable array of LatLng objects
function convertCoordinates(coordString) {
  const parsedCoords = JSON.parse(coordString); // Parse the string into an array
  return parsedCoords[0].map(point => ({
    lat: point[1],
    lng: point[0],
  }));
}

function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Ensure API key is correct
    libraries, // Use the constant libraries array
  });

  const [map, setMap] = useState(null);
  const [markersData, setMarkersData] = useState([]); // State for markers data
  const [heatmapData, setHeatmapData] = useState([]); // State for heatmap data
  const [polygonData, setPolygonData] = useState([]); // State for polygon data
  const [userLocation, setUserLocation] = useState(null); // State for user's current location
  const [selectedMarker, setSelectedMarker] = useState(null); // State for the selected marker

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        error => console.error('Error getting location', error)
      );
    }
  }, []);

  // Convert event data and extract the first coordinate from each event
  useEffect(() => {
    if (isLoaded && window.google) {
      const markerLocations = eventsData.map((event, index) => {
        const coordinates = convertCoordinates(event.coordinates);
        return {
          id: index,
          position: coordinates[0], // Use the first coordinate for marker
          eventDetails: event.event,
          headline: event.headline, // Add headline to marker data
          coordinates, // All coordinates for heatmap and polygon
        };
      });
      setMarkersData(markerLocations); // Set the state with the markers data
    }
  }, [isLoaded]); // Run only when map is loaded

  const handleMarkerClick = marker => {
    setSelectedMarker(marker); // Set the selected marker

    // Generate heatmap for this specific event's coordinates
    const heatmapPoints = marker.coordinates.map(coord => ({
      location: new window.google.maps.LatLng(coord.lat, coord.lng),
      weight: 1, // You can adjust the weight of each point
    }));
    setHeatmapData(heatmapPoints); // Update heatmap data

    // Update polygon data
    setPolygonData(marker.coordinates); // Update polygon coordinates for this event
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
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={userLocation ? userLocation : center}
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
          {/* Marker for user's location */}
          {userLocation && <Marker position={userLocation} label="You" />}

          {/* Render a marker for each event's first coordinate */}
          {markersData.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              label={marker.eventDetails} // Optional: Label the marker with event details
              onClick={() => handleMarkerClick(marker)} // Click event for marker
            />
          ))}

          {/* Render heatmap when heatmapData is available */}
          {heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData}
              options={{
                radius: 50, // Fixed radius for each heatmap point
                opacity: 0.5, // Heatmap opacity
              }}
            />
          )}

          {/* Render Polygon for the selected event */}
          {polygonData.length > 0 && (
            <Polygon
              paths={polygonData} // Polygon path
              options={{
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}

          {/* InfoWindow to display details of the selected marker */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)} // Close the InfoWindow
            >
              <div>
                <h4>{selectedMarker.headline}</h4> {/* Display the headline */}
                <p>
                  Click on the marker to show heatmap and polygon of this area
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </Box>
    </Flex>
  );
}

export default Map;
