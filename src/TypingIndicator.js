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

// Styled component for dot
const Dot = styled('div')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#4CAF50',
  margin: '0 2px',
  animation: `${dotJump} 1.4s infinite`,
}));

// Wrapper to animate each dot with a delay
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
        padding: 2,
        mt:10,
        borderRadius: 7,
        backgroundColor: '#2c2c2c',
        marginBottom: 2,
        color: '#ffffff',
        width:110
      }}
    >
      <DotWrapper>
        <Dot />
        <Dot />
        <Dot />
        <Dot />
      </DotWrapper>
      <Typography variant="body1" sx={{ marginLeft: 0 }}>Typing...</Typography>
    </Box>
  );
};

export default TypingIndicator;
