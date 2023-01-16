import { Container, Grid, Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { UserDisplay } from '../sections/learning';
import { PATH_PAGE } from '../routes/paths';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { TranslationSearch } from '../sections/translation';
import TranslationInfo from '../sections/translation/TranslationInfo';

export default function TranslationPage() {
  return (
    <>
      <Helmet>
        <title>Translation</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Translation"
          links={[{ name: 'Home', href: PATH_PAGE.home }, { name: 'Tranlsation' }]}
        />

        <Stack
          spacing={2}
          direction="column"
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <TranslationSearch />
          <Grid container spacing={3} marginBottom={3}>
            <Grid item xs={12} md={8}>
              <TranslationInfo />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <UserDisplay />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
