import React from 'react';
import Map from '../components/Map';
import DisasterCard from '../components/DisasterCard';
import Navbar from '../components/Navbar'; // Ensure Navbar is imported
import { Grid, GridItem } from '@chakra-ui/react';
import mockdata from '../assets/mockdata.json';
const Home = () => {
  const disasterData = mockdata.map((event, index) => ({
    title: event.headline || `Disaster Title ${index + 1}`, // Use headline if available, otherwise default title
    description: event.description || 'No description available', // Use description if available
    area: event.areaDesc || 'No area specified', // Include area description
    eventType: event.event || 'Unknown event', // Include the type of event
    severity: event.severity || 'Unknown severity', // Include severity
    urgency: event.urgency || 'Unknown urgency', // Include urgency
    certainty: event.certainty || 'Unknown certainty', // Include certainty
    effective: event.effective || 'No effective date', // Include effective date
    expires: event.expires || 'No expiration date', // Include expiration date
  }));
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
        <Map />
      </GridItem>
    </Grid>
  );
};

export default Home;
