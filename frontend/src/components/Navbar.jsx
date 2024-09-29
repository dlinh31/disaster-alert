// src/components/Header.jsx
import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const Links = ['Home', 'Alerts', 'Shelters', 'Contact'];

const NavLink = ({ children, to }) => {
  const navigate = useNavigate();
  return (
    <Button
      as="a"
      variant="ghost"
      color="gray.600"
      _hover={{ color: 'blue.500' }}
      onClick={() => navigate(to)}
    >
      {children}
    </Button>
  );
};

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const isAuthenticated = false; // Replace with your auth logic

  return (
    <>
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        px={4}
        boxShadow="md"
        position="fixed"
        width="100%"
        zIndex="1000"
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box
              onClick={() => navigate('/')}
              cursor="pointer"
              display="flex"
              alignItems="center"
            >
              <Image
                src={logo} // Replace with your logo path
                alt="Logo"
                boxSize="40px"
                mr={2}
              />
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                Disaster Alert
              </Text>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map(link => (
                <NavLink key={link} to={`/${link.toLowerCase()}`}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant={'ghost'}
                  color="gray.600"
                  onClick={() => navigate('/login')}
                  mr={2}
                  _hover={{ color: 'blue.500' }}
                >
                  Login
                </Button>
                <Button
                  variant={'solid'}
                  colorScheme={'blue'}
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={'https://bit.ly/sage-adebayo'} // Replace with user's avatar
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => navigate('/logout')}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {/* Mobile Menu */}
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(link => (
                <NavLink key={link} to={`/${link.toLowerCase()}`}>
                  {link}
                </NavLink>
              ))}
              {!isAuthenticated ? (
                <>
                  <Button
                    variant={'ghost'}
                    color="gray.600"
                    onClick={() => navigate('/login')}
                    _hover={{ color: 'blue.500' }}
                  >
                    Login
                  </Button>
                  <Button
                    variant={'solid'}
                    colorScheme={'blue'}
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/logout')}>
                    Logout
                  </MenuItem>
                </>
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
