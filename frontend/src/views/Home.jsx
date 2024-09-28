import React from 'react';
import Map from '../components/Map';
import DisasterCard from '../components/DisasterCard';
import Navbar from '../components/Navbar'; // Ensure Navbar is imported
import { Grid, GridItem } from "@chakra-ui/react";

const Home = () => {
  return (
    <Grid
      templateAreas={`"header header"
                      "nav main"`}
      gridTemplateRows={'auto 1fr'} // 'auto' for header and '1fr' for main
      gridTemplateColumns={'25vw 1fr'} // Updated nav width (25%)
      height='100vh' // Occupies the full height of the viewport
      width='100vw' // Occupies the full width of the viewport
      gap='0' // No gaps between items
      overflow='hidden' // Prevent overflow causing scroll bars
    >
      <GridItem area={'header'}>
        <Navbar />
      </GridItem>
      <GridItem area={'nav'}>
        <DisasterCard />
      </GridItem>
      <GridItem area={'main'}>
        <Map />
      </GridItem>
    </Grid>
  );
};

export default Home;