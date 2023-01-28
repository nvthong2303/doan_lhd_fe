/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// form
import { useFormik } from 'formik';
// @mui
import { Box, Grid, Card, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useNavigate } from 'react-router-dom';
import { PATH_PAGE } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
import { getInfoApi, updateInFoUserApi } from "../../apis/auth.api";

// ----------------------------------------------------------------------

export default function AccountGeneral(props) {
  const { setCount } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [login, setLogin] = useState('')

  const initialValues = {
    firstName: '',
    lastName: '',
    email: ''
  }

  const navigate = useNavigate();

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: UpdateUserSchema,
    onSubmit: events => {
      // handleSubmitForm(events);
      if (JSON.stringify(user) !== JSON.stringify(events)) {
        console.log(events)
        handleUpdateInfo(events)
      }
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setLogin(token)
      getInfo(token)
    } else {
      navigate(PATH_PAGE.home)
    }
  }, [])

  const getInfo = async (token) => {
    try {
      const res = await getInfoApi(token);

      if (res.status === 200) {
        setUser({
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
        })
        formik.setValues({
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
        })
      }
    } catch (error) {
      console.log('err get info account page', error)
      enqueueSnackbar('Get info failed', { variant: 'error' });
    }
  }

  const handleUpdateInfo = async (data) => {
    try {
      setLoading(true)
      const res = await updateInFoUserApi(data, login)

      if (res.status === 200) {
        // reload header
        setCount((c) => c + 1)
        setLoading(false)
        localStorage.setItem('accessToken', res.data.token)
        getInfo(res.data.token)
        enqueueSnackbar(res.data.message, { variant: 'success' });
      } else if (res.status === 201) {
        setLoading(false)
        enqueueSnackbar(res.data.message, { variant: 'error' });
      } else {
        setLoading(false)
        console.log('error update password', res.data)
      }
    } catch (error) {
      console.log('error update info', error)
      enqueueSnackbar('Update info failed', { variant: 'error' });
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={1}
              display="grid"
            >
              <TextField
                fullWidth
                placeholder='First name'
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />

              <TextField
                fullWidth
                placeholder='Last name'
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />

              <TextField
                fullWidth
                placeholder='Email'
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={
                  formik.touched.email && Boolean(formik.errors.email)
                }
                helperText={formik.touched.email && formik.errors.email}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}
