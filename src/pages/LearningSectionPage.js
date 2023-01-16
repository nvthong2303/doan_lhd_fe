import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { UserDisplay, SectionDetail } from '../sections/learning';
import { PATH_PAGE } from '../routes/paths';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';

export default function LearningSectionPage() {
  return (
    <>
      <Helmet>
        <title>Learn</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Exercises"
          links={[
            { name: 'Home', href: PATH_PAGE.home },
            { name: 'Learn', href: PATH_PAGE.learn },
            { name: 'Exercise' },
          ]}
        />
        <Grid container spacing={3} marginBottom={3}>
          <Grid item xs={12} md={9}>
            <SectionDetail />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <UserDisplay />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
