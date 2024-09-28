import { Box, Flex, SkeletonText, Text } from '@chakra-ui/react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  HeatmapLayer,
  InfoWindow,
  Polygon,
} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai'; 
import PropTypes from 'prop-types';
import { userLocationAtom, selectedMarkerAtom } from '../state/atoms';
import { formatDate } from '../utils/utils'; // Assuming you have a formatDate helper

const libraries = ['places', 'visualization'];

function Map({ disasterData }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, 
    libraries, 
  });

  // Jotai atoms for user location and selected marker
  const [userLocation, setUserLocation] = useAtom(userLocationAtom);
  const [selectedMarker, setSelectedMarker] = useAtom(selectedMarkerAtom);

  const [map, setMap] = useState(null);
  const [markersData, setMarkersData] = useState([]); 
  const [heatmapData, setHeatmapData] = useState([]); 
  const [polygonData, setPolygonData] = useState([]); 
  const [mapCenter, setMapCenter] = useState({ lat: 30.27, lng: -84.53 }); 

  // Debugging the selected marker
  useEffect(() => {
    if (selectedMarker) {
      console.log('Selected Marker:', selectedMarker);
    }
  }, [selectedMarker]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude }); 
          setMapCenter({ lat: latitude, lng: longitude }); 
        },
        (error) => console.error('Error getting location', error)
      );
    }
  }, [setUserLocation]);

  // Convert event data and extract the first coordinate from each event
  useEffect(() => {
    if (isLoaded && window.google) {
      const markerLocations = disasterData.map((event, index) => {
        const coordinates = event.coordinates;
        return {
          id: event.id, 
          position: coordinates[0], 
          eventDetails: event.eventType,
          headline: event.title, 
          coordinates: event.coordinates,
          severity: event.severity || 'Unknown severity', 
          urgency: event.urgency || 'Unknown urgency',
          certainty: event.certainty || 'Unknown certainty',
          effective: event.effective ? new Date(event.effective) : 'Unknown effective date', 
          expires: event.expires ? new Date(event.expires) : 'Unknown expiration date', 
        };
      });
      setMarkersData(markerLocations); 
    }
  }, [isLoaded, disasterData]); 

  // Handle when a marker is selected
  useEffect(() => {
    if (!selectedMarker || !map) return;

    // Center the map on the selected marker
    map.panTo(selectedMarker.position);

    // Set the heatmap data and polygon data
    setHeatmapData([]); 
    setPolygonData([]); 
    const heatmapPoints = selectedMarker.coordinates.map((coord) => ({
      location: new window.google.maps.LatLng(coord.lat, coord.lng),
      weight: 1, 
    }));
    setHeatmapData(heatmapPoints); 
    setPolygonData(selectedMarker.coordinates); 
  }, [selectedMarker, map]);

  // Function to handle marker clicks
  const handleMarkerClick = (marker) => {
    setSelectedMarker({
      ...marker, 
      title: marker.headline, 
    });
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
          onLoad={(map) => setMap(map)}
        >
          {userLocation && <Marker position={userLocation} label="You" />}

          {markersData.map((marker, index) => (
            <Marker
              key={index}
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/512/2272/2272231.png', 
                scaledSize: new window.google.maps.Size(30, 30), 
              }}
              position={marker.position}
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

          {selectedMarker && selectedMarker.id && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <Text fontWeight="bold" fontSize="md" mb={2}>
                  {selectedMarker.title}
                </Text>
                <Text>
                  <strong>Event Type:</strong> {selectedMarker.eventType}
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
        </GoogleMap>
      </Box>
    </Flex>
  );
}

Map.propTypes = {
  disasterData: PropTypes.arrayOf(
    PropTypes.shape({
      coordinates: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
        .isRequired, 
      eventType: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Map;
