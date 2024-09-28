import React from 'react';
import Map from '../components/Map';
const Home = () => {
  return (
    <div className="flex flex-col px-3 items-center w-full">
      <div className="w-full h-20vh">Navbar</div>
      <div className='p-5 h-80vh'>
        <Map />
      </div>
    </div>
  );
};

export default Home;
