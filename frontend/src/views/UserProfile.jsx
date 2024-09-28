import React from 'react';
import Navbar from '../components/Navbar';
import { Grid, GridItem } from '@chakra-ui/react';
import SheltersCard from '../components/SheltersCard';
import UserDash from '../components/UserDash';


// Fetch disaster data and store dates as Date objects
const UserProfile = () => {

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
        <SheltersCard />
      </GridItem>
      <GridItem area={'main'}>
        <UserDash />
      </GridItem>
    </Grid>
  );
};

export default UserProfile;
