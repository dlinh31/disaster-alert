import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../components/Map';
import DisasterCard from '../components/DisasterCard';
import Navbar from '../components/Navbar';
import Chatbot from '../components/ChatBot';
import { Grid, GridItem } from '@chakra-ui/react';

// Helper function to convert the coordinates string into an array of LatLng objects
function convertCoordinates(coordString) {
  try {
    const parsedCoords = JSON.parse(coordString);
    return parsedCoords[0].map(point => ({
      lat: point[1],
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
  const [shelters, setShelters] = useState([]);
  const [isEnlarged, setIsEnlarged] = useState(false);

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/alerts/fetch-flood-alerts-from-db`
        );

        const formattedData = response.data.map((event, index) => ({
          id: event.id,
          title: event.headline || `Disaster Title ${index + 1}`,
          description: event.description || 'No description available',
          area: event.areaDesc || 'No area specified',
          eventType: event.event || 'Unknown event',
          severity: event.severity || 'Unknown severity',
          urgency: event.urgency || 'Unknown urgency',
          certainty: event.certainty || 'Unknown certainty',
          effective: event.effective ? new Date(event.effective) : null,
          expires: event.expires ? new Date(event.expires) : null,
          coordinates: convertCoordinates(event.coordinates),
        }));

        setDisasterData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/shelters/`
        );

        setShelters(response.data);
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

  const toggleEnlarge = () => {
    setIsEnlarged(!isEnlarged);
  };

  return (
    <Grid
      templateAreas={`"header header"
                      "nav main"`}
      gridTemplateRows={'auto 1fr'}
      gridTemplateColumns={'25vw 1fr'}
      height="100vh"
      width="100vw"
      gap="0"
      overflow="hidden"
    >
      <GridItem area={'header'}>
        <Navbar />
      </GridItem>
      <GridItem area={'nav'}>
        <DisasterCard disasterData={disasterData} />
      </GridItem>
      <GridItem area={'main'}  mt={16} position="relative">
        <Map disasterData={disasterData} shelters={shelters} />

        {/* Chatbot floating on top of the map */}
        <Chatbot isEnlarged={isEnlarged} toggleEnlarge={toggleEnlarge} />
      </GridItem>
    </Grid>
  );
};

export default Home;
