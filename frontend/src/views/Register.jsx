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
  InputGroup,
  useToast, // Import useToast from Chakra UI
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '../state/atoms'; // Import userAtom from your atoms file

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(''); // State to store the selected role
  const [countryCode, setCountryCode] = useState('+1'); // State to store the country code

  // States for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  // State and function to update userAtom
  const [, setUser] = useAtom(userAtom); // Use setUser to update the userAtom

  // Create a toast instance
  const toast = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle role selection
  const handleRoleSelection = role => {
    setSelectedRole(role.toLowerCase());
  };

  const handleSubmit = async e => {
    e.preventDefault(); // Prevent the default form submission

    if (!name || !email || !phone || !password || !selectedRole) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/users/register',
        {
          name,
          email,
          password,
          phone_number: phone,
          role: selectedRole,
        }
      );


      // Show success toast
      toast({
        title: 'Registration Successful',
        description: 'You have registered successfully!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });

      // Set the user data to userAtom after successful registration
      setUser(response.data.user);

      // Navigate to login or another page after setting the user data
      navigate('/');
    } catch (error) {
      console.error('Error:', error);

      // Show error toast in case of failure
      toast({
        title: 'Error',
        description: 'Failed to register. Please try again later.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box
      className="flex justify-center items-center bg-gray-800"
      width="100vw"
      height="100vh"
    >
      <Box className="bg-white p-6 rounded-lg w-80">
        {/* If the role is not selected, show role selection */}
        {!selectedRole ? (
          <>
            <Heading as="h2" size="lg" mb={4} textAlign="center">
              Choose Your Role
            </Heading>
            <Flex justifyContent="space-between">
              <Button
                colorScheme="teal"
                width="48%"
                onClick={() => handleRoleSelection('Seeker')}
              >
                Seeker
              </Button>
              <Button
                colorScheme="orange"
                width="48%"
                onClick={() => handleRoleSelection('Provider')}
              >
                Provider
              </Button>
            </Flex>
          </>
        ) : (
          // Show registration form after the role is selected
          <>
            <Heading as="h2" size="lg" mb={4} textAlign="center">
              Register
            </Heading>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel htmlFor="name">
                  <strong>Full Name</strong>
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Full Name"
                  autoComplete="off"
                  name="name"
                  variant="outline"
                  value={name}
                  onChange={e => setName(e.target.value)} // Capture name input
                />
              </FormControl>

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
                <FormLabel htmlFor="phone">
                  <strong>Phone Number</strong>
                </FormLabel>
                <InputGroup>
                  <Input
                    placeholder="+1"
                    width="4rem"
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)} // Allow typing of country code
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    name="phone"
                    variant="outline"
                    flex="1"
                    value={phone}
                    onChange={e => setPhone(e.target.value)} // Capture phone input
                  />
                </InputGroup>
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

              <Button type="submit" colorScheme="green" className="w-full mb-4">
                Register as {selectedRole}
              </Button>
            </form>

            <Text textAlign="center" mb={2}>
              Already Have an Account?
            </Text>

            <Flex justifyContent="space-between">
              <Link to="/login" style={{ width: '48%' }}>
                <Button colorScheme="blue" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/" style={{ width: '48%' }}>
                <Button colorScheme="blue" className="w-full">
                  Back
                </Button>
              </Link>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Register;
