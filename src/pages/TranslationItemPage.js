import { useEffect, useState } from 'react';
import { Container, Grid, Stack, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import _ from "lodash"
import { PATH_PAGE } from '../routes/paths';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import TranslationInfo from '../sections/translation/TranslationInfo';
import { searchWordApi } from "../apis/word.api";
import Iconium from '../components/iconify/Iconify';

export default function TranslationPage() {
  const [listWordSearch, setListWordSearch] = useState([]);

  const handleSearchWord = (value) => {
    if (value.length > 0) {
      searchWord(value);
    }
  };

  const searchWord = _.debounce(async (value) => {
    try {
      const res = await searchWordApi(value)

      if (res.status === 200) {
        console.log(res.data)
        setListWordSearch(res.data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }, 1000);

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
          {/* <TranslationSearch /> */}
          <TextField
            variant="standard"
            label="Translation"
            placeholder="Input to search"
            onChange={(e) => {
              handleSearchWord(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconium icon="ic:baseline-search" width={24} />
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={3} marginBottom={3}>
            <Grid item xs={12} md={12}>
              <TranslationInfo listWordSearch={listWordSearch} />
            </Grid>
            {/* <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <UserDisplay />
            </Grid> */}
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
