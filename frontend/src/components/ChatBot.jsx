import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import axios from 'axios';

const Chatbot = ({ isEnlarged, toggleEnlarge }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm here to assist you with disaster and catastrophic event information.",
      sender: 'bot',
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      const newMessage = { text: userMessage, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setUserMessage('');

      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/chatbot/query`,
          {
            prompt: userMessage,
            returnSources: true, // Ensure sources are returned
          }
        );

        const botResponse = {
          text: response.data.answer || 'Sorry, I couldn’t fetch a response.',
          sender: 'bot',
        };

        // Add the bot response and sources to the state
        setMessages(prevMessages => [...prevMessages, botResponse]);
        setSources(response.data.sources || []); // Correctly set the sources
      } catch (error) {
        console.error('Error fetching response from backend:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            text: 'Error fetching response. Please try again later.',
            sender: 'bot',
          },
        ]);
      } finally {
        setLoading(false); // End loading state
      }
    }
  };

  const formatText = text => {
    if (typeof text !== 'string') {
      return '';
    }
    // Optionally add more text formatting logic
    return text.replace(/\*\*/g, ''); // Remove bold markers, for example
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="fixed"
      bottom={isEnlarged ? 'auto' : '20px'}
      right="20px"
      top={isEnlarged ? '50%' : 'auto'}
      left={isEnlarged ? '50%' : 'auto'}
      transform={isEnlarged ? 'translate(-50%, -50%)' : 'none'}
      zIndex={1000}
      width={isEnlarged ? { base: '90vw', md: '500px' } : '250px'}
      height={isEnlarged ? { base: '80vh', md: '600px' } : '300px'}
      backgroundColor="white"
      borderRadius="8px"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      transition="all 0.3s ease"
    >
      {/* Header with Enlarge/Minimize Button */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        borderBottom="1px solid #E2E8F0"
      >
        <Text fontWeight="bold">AI Weatherman</Text>
        <IconButton
          aria-label={isEnlarged ? 'Minimize Chatbot' : 'Enlarge Chatbot'}
          icon={isEnlarged ? <ArrowDownIcon /> : <ArrowUpIcon />}
          size="sm"
          onClick={toggleEnlarge}
        />
      </Box>

      {/* Messages */}
      <VStack
        align="start"
        spacing={2}
        flex="1"
        overflowY="auto"
        p={2}
        width="100%"
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            bg={msg.sender === 'user' ? 'blue.200' : 'green.200'}
            p={1}
            borderRadius="md"
            maxWidth="80%"
          >
            <Text fontSize="sm">{formatText(msg.text)}</Text>
          </Box>
        ))}

        {/* Display Sources if available */}
        {sources.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="bold">Sources:</Text>
            <VStack align="start" spacing={1}>
              {sources.map((source, index) => (
                <Link
                  key={index}
                  href={source}
                  isExternal
                  color="blue.500"
                  fontSize="sm"
                  _hover={{ textDecoration: 'underline' }}
                >
                  {source}
                </Link>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>

      {/* Input and Send Button */}
      <Box p={2} width="100%">
        <Input
          placeholder="Type your message..."
          value={userMessage}
          onChange={e => setUserMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          mb={2}
          size="sm"
          isDisabled={loading} // Disable input while loading
        />
        <Button
          onClick={handleSendMessage}
          colorScheme="blue"
          width="100%"
          size="sm"
          isLoading={loading} // Show loading spinner on button
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;
