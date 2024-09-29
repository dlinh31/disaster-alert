import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, Flex } from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/users/login', {
        email,
        password,
      });

      console.log(response.data);
      alert('Login successfully!\nClick OK to dismiss this alert.');
      navigate('/user'); // Redirect to your desired route after login
    } catch (error) {
      console.log('Error:', error);
      alert('Login failed. Please check your email and password.');
    }
  };
      
  return (
    <Box
      className="flex justify-center items-center bg-gray-800"
      width="100vw"  // Set width to 100vw
      height="100vh" // Set height to 100vh
    >
      <Box className="bg-white p-6 rounded-lg w-80">
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit}> {/* Added onSubmit handler */}
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
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)} // Update state on change
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="password">
              <strong>Password</strong>
            </FormLabel>
            <Box display="flex" alignItems="center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                variant="outline"
                flex="1" // Allow the input to take available space
                mr={2} // Add margin to the right
                value={password} // Controlled input
                onChange={(e) => setPassword(e.target.value)} // Update state on change
              />
              <Button onClick={togglePasswordVisibility} variant="outline">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </Box>
          </FormControl>
          <Button type="submit" colorScheme="green" className="w-full mb-4">
            Login
          </Button>
        </form>
        <Text textAlign="center" mb={2}>
          Don't Have an Account?
        </Text>
        <Flex justifyContent="space-between">
          <Link to="/register" style={{ width: "48%" }}>
            <Button colorScheme="blue" className="w-full">
              Register
            </Button>
          </Link>
          <Link to="/" style={{ width: "48%" }}>
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
