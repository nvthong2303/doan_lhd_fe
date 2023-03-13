/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Link,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  IconButton,
  Tooltip,
  CardHeader
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import { getListWordsApi, searchWordApi } from '../../apis/word.api';
import {
  createLessonApi,
  getListLessonApi,
  getListLessonAuthApi,
  searchLessonApi,
  getListLessonUnAuthApi,
  getDetailLessonApi,
  updateLessonApi,
  deleteLessonApi
} from '../../apis/lesson.api';
import Iconium from '../../components/iconify/Iconify';
import { addLessonUserApi, removeLessonUserApi } from '../../apis/auth.api';

const SectionList = () => {
  const [listLesson, setListLesson] = useState([]);
  const [listUserLesson, setListUserLesson] = useState([]);
  const [isLogin, setIsLogin] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [listWordSearch, setListWordSearch] = useState([]);
  const [currentEmailUser, setCurrentEmailUser] = useState('');
  const [detailLesson, setDetailLesson] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const _email = localStorage.getItem('datn_email')
    setCurrentEmailUser(_email)

    if (token) {
      setIsLogin(token)
      fetchListLessonAuth(token)
      fetchListLessonUnAuth(token)
    } else {
      fetchListLesson()
    }
  }, []);

  useEffect(() => {
    if (listLesson.length > 0 && listUserLesson.length > 0) {
      const listUserLessonId = listUserLesson.map(el => el._id)
      setListLesson(listLesson.filter(el => !listUserLessonId.includes(el._id)))
    }
  }, [JSON.stringify(listLesson), JSON.stringify(listUserLesson)])

  const fetchListLessonAuth = async (token) => {
    const res = await getListLessonAuthApi(token)

    if (res.status === 200) {
      console.log('list auth lesson', res.data.data)
      setListUserLesson(res.data.data)
    }
  }

  const fetchListLesson = async () => {
    const res = await getListLessonApi()

    if (res.status === 200) {
      console.log('list lesson', res.data.data)
      setListLesson(res.data.data)
    }
  }

  const fetchListLessonUnAuth = async (token) => {
    const res = await getListLessonUnAuthApi(token)

    if (res.status === 200) {
      console.log('list lesson', res.data.data)
      setListLesson(res.data.data)
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.setValues({
      title: '',
      description: '',
      exercises: []
    })
    setDetailLesson({})
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDetailLesson({})
  };

  const handleSearchLesson = (value) => {
    searchLesson(value);
  };

  const handleSearchWord = (value) => {
    if (value.length > 0) {
      searchWord(value);
    }
  };

  const onSelectWord = (words) => {
    formik.setFieldValue('exercises', words)
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      exercises: []
    },

    onSubmit: values => {
      if (Object.keys(detailLesson).length === 0) {
        handleCreateLesson(values)
      } else {
        const data = {
          lessonId: detailLesson._id,
          title: values.title,
          description: values.description,
          exercise: values.exercises.map(el => el.word)
        }
        handleUpdateLesson(data)
      }
    }
  });

  const handleCreateLesson = async (values) => {
    try {
      const data = {
        title: values.title,
        description: values.description,
        exercise: values.exercises.map(el => el.word)
      }
      const res = await createLessonApi(data, isLogin)

      if (res.status === 200) {
        enqueueSnackbar('Create Success', { variant: 'success' });
        handleClose()
        fetchListLessonAuth(isLogin)
      } else {
        enqueueSnackbar('Create failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  }

  const searchWord = _.debounce(async (value) => {
    try {
      const res = await searchWordApi(value, true)

      if (res.status === 200) {
        console.log(res.data)
        setListWordSearch(res.data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }, 1000);

  const searchLesson = _.debounce(async (value) => {
    try {
      const res = await searchLessonApi(value)

      if (res.status === 200) {
        console.log(res.data)
        setListLesson(res.data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }, 1000);

  const handleAddLesson = async (section) => {
    try {
      const data = {
        lessonId: section._id
      }
      const token = isLogin
      const res = await addLessonUserApi(data, token)

      if (res.status === 200) {
        enqueueSnackbar('Add Success', { variant: 'success' });
        fetchListLessonAuth(token)
        fetchListLessonUnAuth(token)
      } else {
        enqueueSnackbar('Add failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  }

  const handleRemoveLesson = async (section) => {
    try {
      const data = {
        lessonId: section._id
      }
      const token = isLogin
      const res = await removeLessonUserApi(data, token)

      if (res.status === 200) {
        enqueueSnackbar('Add Success', { variant: 'success' });
        fetchListLessonAuth(token)
        fetchListLessonUnAuth(token)
      } else {
        enqueueSnackbar('Add failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  }

  const handleClickUpdateLesson = async (section) => {
    try {
      setOpen(true);
      fetchDetailLesson(section._id)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  }

  const fetchDetailLesson = async (id) => {
    const res = await getDetailLessonApi(id)

    if (res.status === 200) {
      fetListInitialWords(res.data.data.exercise)
      setDetailLesson(res.data.data)
      formik.setFieldValue('title', res.data.data.title)
      formik.setFieldValue('description', res.data.data.description)
    } else {
      console.log('err get detail lesson', res)
    }
  }

  const fetListInitialWords = async (words) => {
    try {
      const data = {
        list: words
      }
      const res = await getListWordsApi(data);

      if (res.status === 200) {
        setListWordSearch(res.data.data)
        formik.setFieldValue('exercises', res.data.data)
      } else {
        console.log('err get list word', res.data)
      }
    } catch (error) {
      console.log('error get list word', error)
    }
  }

  const handleUpdateLesson = async (data) => {
    try {
      const res = await updateLessonApi(data, isLogin)

      if (res.status === 200) {
        enqueueSnackbar('Update Success', { variant: 'success' });
        handleClose()
        fetchListLessonAuth(isLogin)
      } else {
        enqueueSnackbar('Update failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  }

  const handleClickDelete = (section) => {
    setDetailLesson(section)
    setOpenDelete(true)
  }

  const handleDeleteLesson = async () => {
    try {
      const data = {
        lessonId: detailLesson._id
      }
      const res = await deleteLessonApi(data, isLogin)

      if (res.status === 200) {
        enqueueSnackbar('Delete Success', { variant: 'success' });
        handleCloseDelete()
        fetchListLessonAuth(isLogin)
        fetchListLessonUnAuth(isLogin)
      } else {
        enqueueSnackbar(res.data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  }

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box>
          {isLogin ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5">
                  My Lesson
                </Typography>
                <Button variant="contained" onClick={handleClickOpen}>Create</Button>
              </Box>
              <hr />
              <Box
                gap={3}
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                }}
                sx={{
                  paddingTop: '20px',
                  display: 'flex',
                  flexFlow: 'row wrap'
                }}
              >
                {listUserLesson?.map((section, index) => (
                  <Card
                    key={index}
                    sx={(theme) => ({
                      '&:hover': {
                        boxShadow: theme.shadows[5],
                      },
                    })}
                    style={{
                      width: '240px'
                    }}
                  >
                    {section.author !== currentEmailUser ? (
                      <CardHeader
                        action={
                          <Tooltip title="Remove lesson from my list lesson">
                            <IconButton
                              aria-label="settings"
                              sx={{ width: '30x', height: 'auto' }}
                              onClick={() => handleRemoveLesson(section)}>
                              <Iconium icon="material-symbols:remove" width={20} />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    ) : (
                      <CardHeader
                        action={
                          <>
                            <Tooltip title="Update this lesson">
                              <IconButton
                                aria-label="settings"
                                sx={{ width: '30x', height: 'auto' }}
                                onClick={() => handleClickUpdateLesson(section)}>
                                <Iconium icon="ph:pen-fill" width={20} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete this lesson">
                              <IconButton
                                aria-label="settings"
                                sx={{ width: '30x', height: 'auto' }}
                                onClick={() => handleClickDelete(section)}>
                                <Iconium icon="ph:trash" width={20} />
                              </IconButton>
                            </Tooltip>
                          </>
                        }
                      />
                    )}
                    <Box
                      padding={3}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height={200}>
                      {section.author === currentEmailUser
                        ? <Iconium icon="mdi:user-edit" width={48} />
                        : <Iconium icon="mdi:user" width={48} />
                      }
                    </Box>
                    <Stack spacing={1.5} sx={{ p: 3 }}>
                      <Link
                        component={RouterLink}
                        to={`/learn/${section._id}`}
                        color="inherit"
                        variant="subtitle2"
                        noWrap
                      >
                        Section: {section.title}
                      </Link>
                      <Typography
                        sx={{ marginTop: '8px !important' }}
                        fontSize={12}
                      >Description: {section.description}</Typography>
                      <Typography
                        sx={{ marginTop: '0px !important' }}
                        fontSize={12}
                      >Done: {section.done} / {section.exercise?.length}</Typography>
                    </Stack>
                  </Card>
                ))}
              </Box>
            </>
          ) : null}
        </Box>
        <Box sx={{ marginTop: '30px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">
              {isLogin ? 'Other Lesson' : 'List Lesson'}
            </Typography>
            <TextField
              label="Lesson"
              id="filled-size-small"
              size="small"
              sx={{ width: '500px' }}
              onChange={(e) => {
                handleSearchLesson(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconium icon="ic:baseline-search" width={24} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <hr />
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            sx={{
              paddingTop: '20px',
              display: 'flex',
              flexFlow: 'row wrap',
            }}
          >

            {listLesson?.map((section, index) => (
              <Card
                key={index}
                sx={(theme) => ({
                  '&:hover': {
                    boxShadow: theme.shadows[5],
                  },
                })}
                style={{
                  width: '240px'
                }}
              >
                {isLogin ? (
                  <CardHeader
                    action={
                      <Tooltip title="Add lesson to my list lesson">
                        <IconButton aria-label="settings" sx={{ width: '30x', height: 'auto' }} onClick={() => handleAddLesson(section)}>
                          <Iconium icon="material-symbols:add" width={20} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                ) : null}
                <Box padding={3} display="flex" justifyContent="center" alignItems="center" height={200}>
                  <Iconium icon="mdi:user" width={48} />
                </Box>
                <Stack spacing={1.5} sx={{ p: 3 }}>
                  <Link
                    component={RouterLink}
                    to={`/learn/${section._id}`}
                    color="inherit"
                    variant="subtitle2"
                    noWrap
                  >
                    Section: {section.title}
                  </Link>
                  <Typography sx={{ marginTop: '8px !important' }} fontSize={12}>Description: {section.description}</Typography>
                  <Typography sx={{ marginTop: '0px !important' }} fontSize={12}>Total exercise: {section.exercise.length}</Typography>
                </Stack>

              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{Object.keys(detailLesson).length === 0 ? 'Create new lesson' : 'Update lesson'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {Object.keys(detailLesson).length === 0
              ? 'Create a new lesson, you can create your own English pronunciation learning route.'
              : 'Update your lesson, you can update title, description, list exercise of your lesson.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title lesson"
            type="email"
            fullWidth
            variant="standard"
            value={formik.values.title}
            onChange={(event) => formik.setFieldValue('title', event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description lesson"
            type="email"
            fullWidth
            variant="standard"
            value={formik.values.description}
            onChange={(event) => formik.setFieldValue('description', event.target.value)}
          />
          <Autocomplete
            multiple
            style={{
              marginTop: '20px'
            }}
            id="size-small-standard-multi"
            size="small"
            options={listWordSearch}
            value={formik.values.exercises}
            getOptionLabel={(option) => option.word}
            onChange={(event, value) => {
              onSelectWord(value);
            }}
            onInputChange={(event, newValue) => {
              handleSearchWord(newValue);
            }}
            noOptionsText="Input to search word"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Word"
                placeholder="Add word to your lesson"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={formik.submitForm}>{Object.keys(detailLesson).length === 0 ? 'Create' : 'Update'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>{Object.keys(detailLesson).length === 0 ? 'Create new lesson' : 'Update lesson'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure delete lesson ${detailLesson.title} ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDeleteLesson}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SectionList;
