import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
//
import Footer from './Footer';
import Header from './Header';
import { getInfoApi } from "../../apis/auth.api";

// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation();
  const [infoUser, setInfoUser] = useState({});
  const [count, setCount] = useState(0);

  const isHome = pathname === '/';

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      getInfo(token);
    }
  }, [])

  useEffect(() => {
    if (count > 0) {
      console.log(count)
      const token = localStorage.getItem('accessToken')
      if (token) {
        getInfo(token);
      }
    }
  }, [count])

  const getInfo = async (token) => {
    const res = await getInfoApi(token);

    if (res.status === 200) {
      setInfoUser(res.data.user)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header infoUser={infoUser} setInfoUser={setInfoUser} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 11 },
          }),
        }}
      >
        <Outlet context={[count, setCount]} />
      </Box>
    </Box>
  );
}
