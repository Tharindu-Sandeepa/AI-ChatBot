import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import TypingIndicator from './TypingIndicator';
import SendIcon from '@mui/icons-material/Send';

// Define dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#005046', // WhatsApp primary green
    },
    secondary: {
      main: '#005046', // WhatsApp secondary green
    },
    background: {
      default: '#161717', // WhatsApp background color
      paper: '#282829', // WhatsApp chat bubble background
    },
    text: {
      primary: '#D1D1D1',
      secondary: '#B3B3B3',
    },
    send:{
      main: '#24d366'
    }
  },
  typography: {
    fontFamily: 'Helvetica',
    fontSize:12
  },
});

// Styled <pre> tag
const StyledPre = styled('pre')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: '8px 12px',
  borderRadius: '10px',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  margin: 0, // Ensure no extra margin
}));

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const API_KEY = 'AIzaSyD6O2MQ5yKAtAhRwMuxjE3-mR5BE2W-rkY'; // Replace with your actual API key

  const sendMessage = async (text) => {
    setIsTyping(true);

    // Show the user's message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender: 'user' },
    ]);

    const requestBody = {
      contents: [{ parts: [{ text }] }],
    };

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        requestBody
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;

      // Extract table markdown
      const tableRegex = /(\|.*\|\r?\n)+/g;
      const match = tableRegex.exec(botResponse);
      const tableMarkdown = match ? match[0] : null;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: tableMarkdown || botResponse, sender: 'bot', tableMarkdown },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages state updates or typing status changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const renderContent = (content) => {
    // Check if content includes <pre> tags
    if (content.includes('<')) {
      return <StyledPre>{content.replace(/<\/?pre>/g, '')}</StyledPre>;
    }

    // Render text with possible markdown-like formatting
    const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/).filter(Boolean);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} style={{ backgroundColor: '#2c2c2c', padding: '2px 4px', borderRadius: '4px' }}>{part.slice(1, -1)}</code>;
      }
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#90caf9' }}>{linkMatch[1]}</a>;
      }
      return part;
    });
  };

  const renderTable = (markdown) => {
    const rows = markdown
      .trim()
      .split('\n')
      .map(row => row.split('|').map(cell => cell.trim()).filter(cell => cell));

    if (rows.length < 3) return null; // Ensure there are enough rows to form a table

    const headerRow = rows[0];
    const dataRows = rows.slice(2); // Skip the second row with dashes

    const renderCellContent = (content) => renderContent(content);

    return (
      <TableContainer component={Paper} sx={{ marginY: 2, boxShadow: 3, borderRadius: 2, backgroundColor: '#1E2428' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#128C7E' }}>
              {headerRow.map((header, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: 'bold', color: '#FFFFFF', padding: '10px' }}>
                  <Typography variant="body1">
                    {renderCellContent(header)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} sx={{ backgroundColor: '#2E3B3E' }}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} align="left" sx={{ color: '#D1D1D1', padding: '12px' }}>
                    <Typography variant="body2">
                      {renderCellContent(cell)}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ mb: 9, height: '150vh', overflowY: 'auto', padding: 2, backgroundColor: 'background.default', color: 'text.primary', mb: 8 }} ref={chatContainerRef}>
        <Grid container spacing={2}>
          {messages.map((msg, index) => (
            <Grid item key={index} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '75%',
                    padding: 1.2,
                    paddingLeft: 3,
                    paddingRight: 3,
                    borderRadius: '30px',
                    backgroundColor: msg.sender === 'user' ? '#128C7E' : '#1E2428',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#D1D1D1',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.tableMarkdown ? renderTable(msg.tableMarkdown) : (
                    <Typography variant="body1">
                      {renderContent(msg.text)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        {isTyping && (
          <Grid item xs={12}>
            <TypingIndicator />
          </Grid>
        )}
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 0, borderTop: '1px solid #333', backgroundColor: 'background.paper' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '30px' }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              variant="outlined"
              sx={{
                marginRight: 1,
                borderRadius: '30px',
                backgroundColor: '#3c3c3d',
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            
<Button 
  type="submit" 
  variant="contained" 
  color="send" 
  sx={{ 
    borderRadius: '50%', 
    width: 40, 
    height: 40, 
    minWidth: 0, 
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <SendIcon />
</Button>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
