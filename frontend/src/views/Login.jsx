import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '../state/atoms'; // Import the userAtom from your atom file

function Login() {
  const [user, setUser] = useAtom(userAtom); // Get the user data from the atom

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // State to store email input
  const [password, setPassword] = useState(''); // State to store password input
  const [isLoading, setIsLoading] = useState(false); // State to handle loading

  const toast = useToast(); // For displaying toast notifications
  const navigate = useNavigate(); // Hook for navigation after login

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleLogin = async e => {
    e.preventDefault(); // Prevent default form submission

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in both fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true); // Show loading spinner

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/users/login',
        {
          email,
          password,
        }
      );
      setUser(response.data.user);

      // Show success notification
      toast({
        title: 'Login Successful',
        description: 'You are now logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate to another page after successful login (e.g., dashboard)
      navigate('/home'); // Replace with your route
    } catch (error) {
      console.error('Error logging in:', error);

      // Show error notification
      toast({
        title: 'Login Failed',
        description:
          error.response?.data?.message ||
          'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <Box
      className="flex justify-center items-center bg-gray-800"
      width="100vw"
      height="100vh"
    >
      <Box className="bg-white p-6 rounded-lg w-80">
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <FormControl mb={4}>
            <FormLabel htmlFor="email">
              <strong>Email</strong>
            </FormLabel>
            <Input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              variant="outline"
              value={email}
              onChange={e => setEmail(e.target.value)} // Capture email input
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="password">
              <strong>Password</strong>
            </FormLabel>
            <Box display="flex" alignItems="center">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                name="password"
                variant="outline"
                flex="1"
                mr={2}
                value={password}
                onChange={e => setPassword(e.target.value)} // Capture password input
              />
              <Button onClick={togglePasswordVisibility} variant="outline">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </Box>
          </FormControl>
          <Button
            type="submit"
            colorScheme="green"
            className="w-full mb-4"
            isLoading={isLoading} // Show loading spinner
            loadingText="Logging in..."
          >
            Login
          </Button>
        </form>
        <Text textAlign="center" mb={2}>
          Do not Have an Account?
        </Text>
        <Flex justifyContent="space-between">
          <Link to="/register" style={{ width: '48%' }}>
            <Button colorScheme="blue" className="w-full">
              Register
            </Button>
          </Link>
          <Link to="/" style={{ width: '48%' }}>
            <Button colorScheme="blue" className="w-full">
              Back
            </Button>
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}

export default Login;
