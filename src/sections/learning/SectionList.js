import { useEffect } from 'react';
import { Box, Card, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import configSectionList from './constant/config-section-list';
import { useAuthContext } from '../../auth/useAuthContext';

const SectionList = () => {
  const { isInitialized, isAuthenticated } = useAuthContext();

  // useEffect(() => {
  //   if (!isInitialized || !isAuthenticated) {
  //   }
  //   // TODO: Call api to get progress (if needed)
  //   // eslint-disable-next-line consistent-return
  // }, [isInitialized, isAuthenticated]);

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
    >
      {configSectionList.map((section) => (
        <Card
          key={section.id}
          sx={(theme) => ({
            '&:hover': {
              boxShadow: theme.shadows[5],
            },
          })}
        >
          <Box padding={3} display="flex" justifyContent="center" alignItems="center" height={200}>
            {section.icon}
          </Box>
          <Stack spacing={1.5} sx={{ p: 3 }}>
            <Link
              component={RouterLink}
              to={`/learn/${section.id}`}
              color="inherit"
              variant="subtitle2"
              noWrap
            >
              Section: {section.title}
            </Link>
            <Typography fontSize={12}> Progress: 0/{section.count}</Typography>
          </Stack>
        </Card>
      ))}
    </Box>
  );
};

export default SectionList;
