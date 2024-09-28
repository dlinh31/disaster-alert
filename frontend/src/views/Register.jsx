import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, Flex } from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      className="flex justify-center items-center bg-gray-800"
      width="100vw"
      height="100vh"
    >
      <Box className="bg-white p-6 rounded-lg w-80">
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Register
        </Heading>
        <form>
        <FormControl mb={4}>
            <FormLabel htmlFor="name">
              <strong>Full Name</strong>
            </FormLabel>
            <Input
              type="name"
              placeholder="Enter Full Name"
              autoComplete="off"
              name="name"
              variant="outline"
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
                flex="1"
                mr={2}
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
        
        {/* Buttons in a Flex container */}
        <Flex justifyContent="space-between">
          <Link to="/login" style={{ width: "48%" }}>
            <Button colorScheme="blue" className="w-full">
              Login
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

export default Register;
