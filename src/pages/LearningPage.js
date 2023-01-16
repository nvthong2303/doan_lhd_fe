import { useTheme } from '@emotion/react';
import { Container, Grid } from '@mui/material';
import { m, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { SectionList, UserDisplay } from '../sections/learning';
import { PATH_PAGE } from '../routes/paths';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';

const mockUser = {
  name: 'Test User',
  cover: 'https://picsum.photos/1600',
  avatarUrl: 'https://picsum.photos/1600',
  email: 'test@test.test',
};

export default function LearningPage() {
  return (
    <>
      <Helmet>
        <title>Learn</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Learn"
          links={[{ name: 'Home', href: PATH_PAGE.home }, { name: 'Learn' }]}
        />

        <Grid container spacing={3} marginBottom={3}>
          <Grid item xs={12} md={8}>
            <SectionList />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <UserDisplay user={mockUser} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
