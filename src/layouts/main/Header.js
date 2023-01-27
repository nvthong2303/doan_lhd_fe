/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, MenuItem, Menu } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function handleClose() {
    setAnchorEl(null);
  }

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
    setUser({})
    navigate(PATH_PAGE.home)
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
            <Box
              onClick={(e) => handleClick(e)}
              onMouseOver={(e) => handleClick(e)}
            >
              <NavItem
                item={{
                  title: `Hi, ${_user.firstName} ${_user.lastName}`
                }} />
            </Box>
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

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
        <MenuItem onClick={() => {
          navigate(PATH_PAGE.account)
        }}>Setting profile</MenuItem>
        <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
      </Menu>
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
