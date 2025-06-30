import React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const Hero: React.FC = () => {
  return (
    <Box sx={{ height: '100lvh', bgcolor: '#0085d2' }}>
      <Stack alignItems="center" justifyContent="center" direction="row" height="100%">
        <Typography>Hero section</Typography>
      </Stack>
    </Box>
  )
}

export default Hero
