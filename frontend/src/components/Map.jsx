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
import { useAtom } from 'jotai'; // Import Jotai's hook
import PropTypes from 'prop-types';
import { userLocationAtom, selectedMarkerAtom } from '../state/atoms';

const center = { lat: 30.27, lng: -84.53 };

const libraries = ['places', 'visualization'];

function Map({ disasterData }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Ensure API key is correct
    libraries, // Use the constant libraries array
  });

  // Jotai atoms for user location and selected marker
  const [userLocation, setUserLocation] = useAtom(userLocationAtom);
  const [selectedMarker, setSelectedMarker] = useAtom(selectedMarkerAtom);

  const [map, setMap] = useState(null);
  const [markersData, setMarkersData] = useState([]); // State for markers data
  const [heatmapData, setHeatmapData] = useState([]); // State for heatmap data
  const [polygonData, setPolygonData] = useState([]); // State for polygon data

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude }); // Update atom
        },
        error => console.error('Error getting location', error)
      );
    }
  }, [setUserLocation]);

  // Convert event data and extract the first coordinate from each event
  useEffect(() => {
    if (isLoaded && window.google) {
      const markerLocations = disasterData.map((event, index) => {
        const coordinates = event.coordinates;
        return {
          id: index,
          position: coordinates[0], // Use the first coordinate for marker
          eventDetails: event.eventType,
          headline: event.title, // Use title for headline
          coordinates: event.coordinates,
        };
      });
      setMarkersData(markerLocations); // Set the state with the markers data
    }
  }, [isLoaded, disasterData]); // Run only when map is loaded or disasterData changes

  const handleMarkerClick = marker => {
    // Clear heatmapData and polygonData before updating
    setHeatmapData([]); // Clear previous heatmap
    setPolygonData([]); // Clear previous polygon
    setSelectedMarker(null); // Clear previous marker

    // Now update the state with the new marker and its data
    setSelectedMarker(marker); // Update atom

    // Generate heatmap for this specific event's coordinates
    const heatmapPoints = marker.coordinates.map(coord => ({
      location: new window.google.maps.LatLng(coord.lat, coord.lng),
      weight: 1, // You can adjust the weight of each point
    }));
    setHeatmapData(heatmapPoints); // Update heatmap data
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
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/512/2272/2272231.png', // Your custom icon URL
                scaledSize: new window.google.maps.Size(30, 30), // Scaled size of the icon
              }}
              position={marker.position}
              onClick={() => handleMarkerClick(marker)} // Click event for marker
            />
          ))}

          {/* Render heatmap when a marker is selected */}
          {selectedMarker && heatmapData.length > 0 && (
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
                <h3>{selectedMarker.headline}</h3> {/* Display the headline */}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </Box>
    </Flex>
  );
}

Map.propTypes = {
  disasterData: PropTypes.arrayOf(
    PropTypes.shape({
      coordinates: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
        .isRequired, // Handle both string or array types for coordinates
      eventType: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Map;
