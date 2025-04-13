import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';

const LazyImage = ({ 
  src, 
  alt, 
  style = {}, 
  className = '',
  width = '100%',
  height = '100%',
  objectFit = 'contain'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        backgroundColor: 'grey.100',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      <img
        src={error ? '/placeholder.png' : src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...style,
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
        className={className}
      />
    </Box>
  );
};

export default LazyImage; 