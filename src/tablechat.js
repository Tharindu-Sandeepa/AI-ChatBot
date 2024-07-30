import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const Chat = () => {
  const [comparisons, setComparisons] = useState('');
  const [rows, setRows] = useState('');
  const [tableData, setTableData] = useState('');

  const API_KEY = 'AIzaSyD6O2MQ5yKAtAhRwMuxjE3-mR5BE2W-rkY'; // Replace with your actual API key

  const sendMessage = async (text) => {
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
      const tableMarkdown = match ? match[0] : '';

      setTableData(tableMarkdown);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comparisons.trim() && rows.trim()) {
      const text = `Compare ${comparisons} in a table. Rows = ${rows}`;
      sendMessage(text);
    }
  };

  const renderTable = (markdown) => {
    const rows = markdown
      .trim()
      .split('\n')
      .map(row => row.split('|').map(cell => cell.trim()).filter(cell => cell));

    if (rows.length < 2) return null; // Ensure there are enough rows to form a table

    return (
      <TableContainer component={Paper} sx={{ marginY: 2, boxShadow: 3, borderRadius: 2, backgroundColor: '#1d1d1d' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#333333' }}>
              {rows[0].map((header, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: 'bold', color: '#90caf9' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#1c1c1c' }, '&:nth-of-type(even)': { backgroundColor: '#2b2b2b' } }}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} align="center" sx={{ color: '#b0bec5' }}>
                    {cell}
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
      <Box sx={{ mb: 9, height: '100vh', overflowY: 'auto', padding: 2, backgroundColor: '#121212', color: '#ffffff' }}>
        {renderTable(tableData)}
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 2, borderTop: '1px solid #333', backgroundColor: '#1d1d1d' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              fullWidth
              value={comparisons}
              onChange={(e) => setComparisons(e.target.value)}
              placeholder="Enter items to compare (e.g., 'A and B and C')"
              sx={{ marginBottom: 1, backgroundColor: '#333333', borderRadius: 2, input: { color: '#ffffff' } }}
            />
            <TextField
              fullWidth
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              placeholder="Enter number of rows"
              type="number"
              sx={{ marginBottom: 1, backgroundColor: '#333333', borderRadius: 2, input: { color: '#ffffff' } }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 2 }}>
              Send
            </Button>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
