import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Avatar } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import { bgBlur } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// routes
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/logo';
import { NavItem } from './nav/desktop/NavItem';
//
import navConfig from './nav/config-navigation';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { useAuthContext } from '../../auth/useAuthContext';
import { getInfoApi } from '../../apis/auth.api';

// ----------------------------------------------------------------------

export default function Header() {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  const [isLoggin, setIsLoggin] = useState(false);
  const [_user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      getInfo(token);
      setIsLoggin(true)
    }
  }, [])

  const getInfo = async (token) => {
    const res = await getInfoApi(token);

    if (res.status === 200) {
      setUser(res.data.user)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('datn_email')
    window.location.reload(false);
    setUser({})
  }

  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <AppBar ref={carouselRef} color="transparent" sx={{ boxShadow: 0 }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(isOffset && {
            ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Logo />

          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && <NavDesktop isOffset={isOffset} data={navConfig} />}

          {_user.firstName ? (
            // <Link to={PATH_PAGE.account}>
            //   <Avatar
            //     alt={user.displayName}
            //     src={user.photoURL}
            //     sx={{
            //       '&:hover': {
            //         cursor: 'pointer',
            //       },
            //     }}
            //   />
            // </Link>
            // <p style={{
            //   lineHeight: '1.5',
            //   fontSize: '1rem',
            //   fontFamily: 'Public Sans,sans-serif',
            //   fontWeight: '400'
            // }}>{_user.firstName ? `Hi, ${_user.firstName} ${_user.lastName}` : 'Hi!'}</p>
            <>
              <NavItem item={{
                title: `Hi, ${_user.firstName} ${_user.lastName}`
              }} />
              <NavItem
                onClick={handleLogout}
                sx={{ marginLeft: '20px' }}
                item={{
                  title: 'Logout'
                }}
              />
            </>
          ) : (
            <>
              <Link to={PATH_AUTH.register}>
                <Button variant="contained">Sign up</Button>
              </Link>

              <Link to={PATH_AUTH.login}>
                <Button variant="outlined" sx={{ marginLeft: 2 }}>
                  Log in
                </Button>
              </Link>
            </>
          )}

          {!isDesktop && <NavMobile isOffset={isOffset} data={navConfig} />}
        </Container>
      </Toolbar>


      {isOffset && <Shadow />}
    </AppBar>
  );
}

// ----------------------------------------------------------------------

Shadow.propTypes = {
  sx: PropTypes.object,
};

function Shadow({ sx, ...other }) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
