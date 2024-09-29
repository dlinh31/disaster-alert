import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import Home from './views/Home';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './views/Login';
import Register from './views/Register';
import UserProfile from './views/UserProfile';

// Correct the route structure
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<UserProfile />} />
    </>
  )
);

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
