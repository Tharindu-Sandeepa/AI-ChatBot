import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/system';

// Keyframes for dot jumping animation
const dotJump = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
`;


const Dot = styled('div')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#4CAF50',
  margin: '0 2px',
  animation: `${dotJump} 1.4s infinite`,
}));


const DotWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  '& > div:nth-of-type(1)': {
    animationDelay: '0s',
  },
  '& > div:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '& > div:nth-of-type(3)': {
    animationDelay: '0.4s',
  },
  '& > div:nth-of-type(4)': {
    animationDelay: '0.6s',
  },
}));

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width:120,        padding: 1.2,
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: '30px',
        backgroundColor: '#1E2428',
        color: '#D1D1D1',
        wordBreak: 'break-word',
        marginBottom: 2,
      }}
    >
      <DotWrapper>
        <Dot />
        <Dot />
        <Dot />
        <Dot />
      </DotWrapper>
      <Typography variant="body1" sx={{ marginLeft: 1 }}>Typing...</Typography>
    </Box>
  );
};

export default TypingIndicator;
