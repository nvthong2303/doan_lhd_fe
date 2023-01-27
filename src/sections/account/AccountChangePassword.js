/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// form
import { useFormik } from 'formik';
// @mui
import { Stack, Card, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/snackbar';
import { PATH_PAGE } from '../../routes/paths';
import { updatePasswordUserApi } from '../../apis/auth.api';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setLogin(token)
    } else {
      navigate(PATH_PAGE.home)
    }
  }, [])

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };


  const formik = useFormik({
    initialValues,
    validationSchema: ChangePassWordSchema,
    onSubmit: events => {
      const data = {
        oldPassword: events.oldPassword,
        newPassword: events.newPassword
      }
      handleUpdatePassword(data)
    }
  });

  const handleUpdatePassword = async (data) => {
    try {
      const res = await updatePasswordUserApi(data, login)

      if (res.status === 200) {
        setLoading(false)
        enqueueSnackbar(res.data.message, { variant: 'success' });
      } else if (res.status === 202) {
        setLoading(false)
        enqueueSnackbar(res.data.message, { variant: 'error' });
      } else {
        setLoading(false)
        enqueueSnackbar('Update info password failed', { variant: 'error' });
      }
    } catch (error) {
      console.log('error update password', error)
      enqueueSnackbar('Update info password failed', { variant: 'error' });
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <TextField
            fullWidth
            type='password'
            placeholder='Old Password'
            name="oldPassword"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
            }
            helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          />
          <TextField
            fullWidth
            type='password'
            placeholder='New Password'
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <TextField
            fullWidth
            type='password'
            placeholder='Confirm New Password'
            name="confirmNewPassword"
            value={formik.values.confirmNewPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmNewPassword && Boolean(formik.errors.confirmNewPassword)
            }
            helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
          />

          <LoadingButton type="submit" variant="contained" loading={loading}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </form>
  );
}
