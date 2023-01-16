import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Typography } from '@mui/material';
// components
import Image from '../../components/image';
import SvgColor from '../../components/svg-color';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

export default function UserCard() {
  const { isInitialized, isAuthenticated, user } = useAuthContext();
  const { displayName: name, cover, photoURL: avatarUrl, email } = user || {};
  if (!isInitialized || !isAuthenticated) {
    return (
      <Card sx={{ textAlign: 'center' }}>
        <Box variant="body2" sx={{ color: 'text.secondary', m: 3 }}>
          Login or register to track your progress
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgColor
          src="/assets/shape_avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />

        <StyledOverlay />

        <Image src={cover} alt={cover} ratio="16/9" />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {email}
      </Typography>
    </Card>
  );
}
