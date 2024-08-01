import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import TypingIndicator from './TypingIndicator';
import SendIcon from '@mui/icons-material/Send';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddCircleOutlineIcon from '@mui/icons-material/OpenInNew';
import logo from './logocol.png';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#005046', 
    },
    secondary: {
      main: '#005046', 
    },
    background: {
      default: '#161717', 
      paper: '#282829', 
    },
    text: {
      primary: '#D1D1D1',
      secondary: '#B3B3B3',
    },
    send:{
      main: '#fff'
    }
  },
  typography: {
    fontFamily: 'Helvetica',
    fontSize:13
  },
});

// Styled <pre> tag for styling the code segment outpts . need to improve this more
const StyledPre = styled('pre')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: '8px 12px',
  borderRadius: '10px',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  margin: 0, 
}));



const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const API_KEY = 'AIzaSyD6O2MQ5yKAtAhRwMuxjE3-mR5BE2W-rkY'; 
  const sendMessage = async (text) => {
    setIsTyping(true);

    // Show the user's message 
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

      // identify the tables 
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
      setHasStartedTyping(true);
    }
  };

  useEffect(() => {
    // Scroll to the bottom while typing
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!hasStartedTyping) {
      setHasStartedTyping(true);
    }
  };

  const renderContent = (content) => {
    // Check if content includes code tags
    if (content.includes('<')) {
      return <StyledPre>{content.replace(/<\/?pre>/g, '')}</StyledPre>;
    }

    // fromatting the text outputs need to improve little bit
    const parts = content.split(/(##[^#]+##|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\n)/).filter(Boolean);

    return parts.map((part, index) => {
      if (part.startsWith('##')) {
        const isMainTopic = part.slice(2).includes(':'); // Check if it's a main topic
        return (
          <Typography
            variant="h5"
            key={index}
            style={{
              fontWeight: 'bold',
              fontSize: isMainTopic ? '1.5em' : '1.2em', // Increase font size for main topic
              marginTop: '1em',
              marginBottom: '0.5em',
            }}
          >
            {part.slice(2)}
          </Typography>
          
        );
      }
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
      if (part === '\n') {
        return <br key={index} />;
      }
      return part;
    });
  };

  const renderTable = (markdown) => {
    const rows = markdown
      .trim()
      .split('\n')
      .map(row => row.split('|').map(cell => cell.trim()).filter(cell => cell));

    if (rows.length < 3) return null; 

    const headerRow = rows[0];
    const dataRows = rows.slice(2); 

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

  const exampleQuestions = [
    "What is the weather like today?",
    "Tell me a joke.",
    "What's the latest news?",
    "Explain the theory of relativity.",
    "How do I cook a perfect steak?",
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ height: '88vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default', color: 'text.primary' ,mb:8,mt:7}}>
      <AppBar position="fixed" color="primary">
          <Toolbar>
         
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Logo" style={{ marginRight: 16, height: 56 , outline:'true', }} />
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="new chat"
              onClick={() => window.location.reload()} //  new chat button click
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }} ref={chatContainerRef}>


          
        {!hasStartedTyping && (
  <Box sx={{ ml:-2.5,mb: 2, mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center',position:'fixed',width:'100%' }}>
    <img src={logo} alt="Logo" style={{ marginRight: 16, height: 100 , outline:'true' }} />
    <Grid sx={{mt:7}}container spacing={2} justifyContent="center">
      {exampleQuestions.map((question, index) => {
        const googleColors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#fff'];
        const borderColor = googleColors[index % googleColors.length];
        return (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background
                color: '#fff',
                padding: 2,
                borderRadius: 2,
                border: `2px solid ${borderColor}`,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 5,
                },
                width: '100%', // Ensures card takes full width available in its Grid item
                maxWidth: 200, // Maximum width of each card
              }}
            >
              <Typography variant="body1" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
                {question}
              </Typography>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Box>
)}





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
</Box>
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 0, borderTop: '1px solid #333', backgroundColor: 'background.paper' }}>

          
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '30px' }}>

    <TextField
              fullWidth
              value={input}
              onChange={handleInputChange}
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
                justifyContent: 'center',
              }}
            >
  <SendIcon sx={{color:'#000'}}/>
</Button>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
