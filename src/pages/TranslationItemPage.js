import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Button,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import _ from "lodash"
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import { PATH_PAGE } from '../routes/paths';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import TranslationInfo from '../sections/translation/TranslationInfo';
import { searchWordApi, contributeWordApi } from "../apis/word.api";
import Iconium from '../components/iconify/Iconify';

export default function TranslationPage() {
  const [listWordSearch, setListWordSearch] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      setIsLogin(token)
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      word: '',
      meaning: '',
      ipa: '',
      link: ''
    },

    onSubmit: values => {
      handleContributeWord(values)
    }
  });

  const handleContributeWord = async (data) => {
    try {
      const res = await contributeWordApi(data, isLogin)

      if (res.status === 200) {
        enqueueSnackbar('Create Success', { variant: 'success' });
        closeContributePopup()
      } else if (res.status === 301) {
        enqueueSnackbar('Word already exist', { variant: 'error' });
      } else {
        enqueueSnackbar('Create failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  }

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

  const clickOpenContributePopup = () => {
    setOpen(true)
  }

  const closeContributePopup = () => {
    setOpen(false)
  }

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
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div> </div>
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
            {isLogin ? (
              <Button onClick={clickOpenContributePopup} variant="contained">Contribute</Button>
            ) : <div> </div>}
          </div>
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

      <Dialog open={open} onClose={closeContributePopup}>
        <DialogTitle>Contribute new word</DialogTitle>
        <DialogContent>
          <DialogContentText>
            contribute to our dictionary or you want to add new words to your practice
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="word"
            label="Word *"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.word}
            onChange={(event) => formik.setFieldValue('word', event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="meaning"
            label="Meaning *"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.meaning}
            onChange={(event) => formik.setFieldValue('meaning', event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="ipa"
            label="IPA *"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.ipa}
            onChange={(event) => formik.setFieldValue('ipa', event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="linkmp3"
            label="Link MP3"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.link}
            onChange={(event) => formik.setFieldValue('link', event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeContributePopup}>Cancel</Button>
          <Button onClick={formik.submitForm}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
