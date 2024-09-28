import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../components/Map';
import DisasterCard from '../components/DisasterCard';
import Navbar from '../components/Navbar';
import { Grid, GridItem } from '@chakra-ui/react';

// Helper function to convert the coordinates string into an array of LatLng objects
function convertCoordinates(coordString) {
  try {
    const parsedCoords = JSON.parse(coordString); // Parse the string into an array
    return parsedCoords[0].map(point => ({
      lat: point[1], // Convert [lng, lat] to {lat, lng}
      lng: point[0],
    }));
  } catch (error) {
    console.error('Error parsing coordinates:', error);
    return [];
  }
}

// Fetch disaster data and store dates as Date objects
const Home = () => {
  const [disasterData, setDisasterData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/alerts/fetch-flood-alerts-from-db`
        );

        // Map the data to the structure needed, storing dates as Date objects
        const formattedData = response.data.map((event, index) => ({
          id: event.id,
          title: event.headline || `Disaster Title ${index + 1}`, // Use headline if available, otherwise default title
          description: event.description || 'No description available', // Use description if available
          area: event.areaDesc || 'No area specified', // Include area description
          eventType: event.event || 'Unknown event', // Include the type of event
          severity: event.severity || 'Unknown severity', // Include severity
          urgency: event.urgency || 'Unknown urgency', // Include urgency
          certainty: event.certainty || 'Unknown certainty', // Include certainty
          effective: event.effective ? new Date(event.effective) : null, // Store effective date as Date object
          expires: event.expires ? new Date(event.expires) : null, // Store expiration date as Date object
          coordinates: convertCoordinates(event.coordinates), // Convert and include coordinates
        }));
        console.log('Formatted data:', formattedData)

        setDisasterData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Grid
      templateAreas={`"header header"
                      "nav main"`}
      gridTemplateRows={'auto 1fr'} // 'auto' for header and '1fr' for main
      gridTemplateColumns={'25vw 1fr'} // Updated nav width (25%)
      height="100vh" // Occupies the full height of the viewport
      width="100vw" // Occupies the full width of the viewport
      gap="0" // No gaps between items
      overflow="hidden" // Prevent overflow causing scroll bars
    >
      <GridItem area={'header'}>
        <Navbar />
      </GridItem>
      <GridItem area={'nav'}>
        <DisasterCard disasterData={disasterData} />
      </GridItem>
      <GridItem area={'main'}>
        <Map disasterData={disasterData} /> {/* Pass disasterData to Map */}
      </GridItem>
    </Grid>
  );
};

export default Home;
