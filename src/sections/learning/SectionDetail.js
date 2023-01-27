/* eslint-disable arrow-body-style */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lonely-if */
/* eslint-disable no-empty */
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Autocomplete
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Recorder from 'recorder-js';
import WaveStream from 'react-wave-stream';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import configSectionList from './constant/config-section-list';
import Iconify from '../../components/iconify';
import { getDetailWordApi, searchWordApi } from '../../apis/word.api';
import { addExerciseLessonApi, getDetailLessonApi } from '../../apis/lesson.api';
import { sendResultApi, sendSaveResultApi, getResultApi } from '../../apis/result.api';

const SectionDetail = () => {
  const theme = useTheme();
  // TODO: Get example audio file.
  const params = useParams();
  const navigate = useNavigate();
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState({ data: [], lineTo: 0 });
  const [isLogin, setIsLogin] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [blob, setBlob] = useState(null);
  const [detailLesson, setDetailLesson] = useState({})
  const [emptyExercises, setEmptyExercises] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState('');
  const [currentIpa, setCurrentIpa] = useState('');
  const [listWordSearch, setListWordSearch] = useState([]);
  const [listWordSelected, setListWordSelected] = useState([]);
  const [currentEmailUser, setCurrentEmailUser] = useState('');
  const [currentDetailExercise, setCurrentDetailExercise] = useState({});
  const [listResultExercise, setListResultExercise] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const _email = localStorage.getItem('datn_email')
    setCurrentEmailUser(_email)

    if (token) {
      setIsLogin(token)
      if (params.id) {
        fetchDetailLesson(params.id)
      } else {
        navigate('/404');
      }
    } else {
      if (params.id) {
        fetchDetailLesson(params.id)
      } else {
        navigate('/404');
      }
    }
  }, [params, navigate]);

  useEffect(() => {
    if (currentExercise && currentExercise.length > 0) {
      handleGetDetailWord(currentExercise)
    }

    if (isLogin) {
      handleGetDetailResultExercise(detailLesson._id, currentExercise, isLogin)
    }
  }, [currentExercise]);

  useEffect(() => {
    if (detailLesson.exercise && detailLesson.exercise.length > 0) {
      setCurrentExercise(detailLesson.exercise[currentExerciseIndex])
    }
  }, [currentExerciseIndex])

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorderSetup = new Recorder(audioContext, {
      onAnalysed: (soundData) => setData(soundData),
    });

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => recorderSetup.init(stream))
      .then(() => setRecorder(recorderSetup))
      .catch((err) => console.log('Uh oh... unable to get stream...', err));
  }, []);

  useEffect(() => {
    if (blob) {
      handleSendRecording()
    }
  }, [blob])

  const fetchDetailLesson = async (id) => {
    const res = await getDetailLessonApi(id)

    if (res.status === 200) {
      console.log('detail lesson', res.data.data)
      setDetailLesson(res.data.data)
      if (res.data.data.exercise.length === 0) {
        setEmptyExercises(true)
      } else {
        setEmptyExercises(false)
        setCurrentExerciseIndex(0)
        setCurrentExercise(res.data.data.exercise[0])
      }
    } else {
      console.log('err get detail lesson', res)
    }
  }

  const handleGetDetailWord = async (word) => {
    try {
      const res = await getDetailWordApi(word)

      if (res.status === 200) {
        setCurrentDetailExercise(res.data.data)
      } else {
        console.log('err get detail word', res.data)
      }
    } catch (error) {
      console.log('err get detail word', error)
    }
  }

  const handleGetDetailResultExercise = async (lessonId, word, token) => {
    const _data = {
      lessonId,
      word
    }
    console.log(_data)
    const res = await getResultApi(_data, token)

    if (res.status === 200) {
      console.log('detail result : ', res.data)
      setListResultExercise(res.data.data?.result ?? [])
    }
  }

  // handle add exercise
  const handleClickAddWord = () => {
    setOpenAdd(true)
  }

  const handleClose = () => {
    setOpenAdd(false)
  }

  const handleAddNewWord = async () => {
    const _data = {
      lessonId: detailLesson._id,
      words: listWordSelected.map(el => el.word)
    }

    const res = await addExerciseLessonApi(_data, isLogin)

    if (res.status === 200) {
      enqueueSnackbar('Add Success', { variant: 'success' });
      handleClose();
      fetchDetailLesson(detailLesson._id);
    } else {
      enqueueSnackbar('Create failed', { variant: 'error' });
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
        const list = res.data.data.filter(el => !detailLesson.exercise.includes(el.word))
        setListWordSearch(list)
      }
    } catch (err) {
      console.log(err)
    }
  }, 1000);

  const onSelectWord = (words) => {
    setListWordSelected(words)
  }
  // --------------------------------------------------------------------

  // handle learning
  const listenExercise = () => {
    const url = currentDetailExercise.us_audio_url
      ? currentDetailExercise.us_audio_url
      : currentDetailExercise.gp_audio_url
        ? currentDetailExercise.gp_audio_url
        : null
    new Audio(url).play()
  }

  const onRecord = () => {
    recorder.start().then(() => setIsRecording(true));
  };

  const onStop = () => {
    recorder.stop().then(({ blob: newBlob }) => {
      setIsRecording(false);
      setBlob(newBlob);
      // console.log(newBlob)
      // const blobUrl = window.URL.createObjectURL(newBlob);

      // console.log(blobUrl)
    });

    // Recorder.download(blob)
  };

  const handleClickNextExercise = () => {
    setCurrentExerciseIndex(currentExerciseIndex + 1)
  }

  const handleClickPrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const handleSendRecording = async () => {
    try {
      const lessonId = detailLesson._id;
      const word = currentExercise;
      const res = await sendResultApi(blob, word)

      if (res.status === 200) {
        console.log('res service', res.data)
        const point = compare2Ipa(currentDetailExercise.ipa, res.data.ipa[0] ?? '')
        const _data = {
          lessonId, word, result: point
        }
        if (isLogin) {
          const token = isLogin

          const _res = await sendSaveResultApi(_data, token)

          if (_res.status === 200) {
            console.log(_res.data)
            handleGetDetailResultExercise(lessonId, word, token)
          }
        }

      }
    } catch (error) {
      console.log('err res service', error)
    }
  }
  // --------------------------------------------------------------------


  const compare2Ipa = (ipaRoot, ipa) => {
    let res = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < ipaRoot.length; i++) {
      if (ipaRoot[i] === ipa[i]) {
        res += 1;
      }
    }
    return Math.trunc((res / ipaRoot.length) * 100)
  }

  const sort = (a, b) => {
    if (a.createAt < b.createAt) {
      return -1;
    }
    if (a.createAt > b.createAt) {
      return 1;
    }
    return 0;
  }


  const progressBar = (point, index) => {
    const containerStyles = {
      height: '20px',
      width: 'auto',
      backgroundColor: "#212b36",
      borderRadius: 50,
    }

    const fillerStyles = {
      height: '100%',
      width: `${point}%`,
      backgroundColor: '#00ab55',
      borderRadius: 'inherit',
      textAlign: 'right'
    }

    const labelStyles = {
      padding: 5,
      color: 'white',
    }

    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${point}%`}</span>
        </div>
      </div>
    )
  }


  // TODO: GET exercise from API.

  return (
    <>
      <Typography variant='h6'>Lesson: {detailLesson.title}</Typography>
      <Typography variant='body2'>{detailLesson.description}</Typography>
      <Card sx={{ padding: 1, marginTop: '20px' }}>
        {emptyExercises ? (
          <Box sx={{ padding: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle1'>Empty lesson</Typography>
              {(isLogin && detailLesson.author === currentEmailUser) ? (
                <Typography variant='caption'>Add new exercise to start learn</Typography>
              ) : (!isLogin || detailLesson.author !== currentEmailUser)
                ? <Typography variant='caption'>Login or contact author to add exercise</Typography>
                : null}
            </Box>
            {isLogin && detailLesson.author === currentEmailUser
              ? <Button variant="contained" onClick={handleClickAddWord}>Add exercise</Button>
              : null}
          </Box>
        ) : Object.keys(currentDetailExercise).length > 0 ? (
          <>
            <CardHeader
              title={`Exercise ${currentExerciseIndex + 1}: ${currentDetailExercise.word}`}
              subheader={currentDetailExercise.ipa}
            />
            <CardContent>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                  startIcon={<Iconify icon="material-symbols:headset-mic" />}
                  size="large"
                  variant="contained"
                  color="warning"
                  onClick={listenExercise}
                >
                  Listen
                </Button>
                <Button
                  startIcon={<Iconify icon="ic:outline-mic" />}
                  size="large"
                  variant="contained"
                  color="error"
                  onClick={isRecording ? onStop : onRecord}
                >
                  {isRecording ? 'Stop' : 'Record'}
                </Button>
              </Stack>
              <Box position="relative" height={80} marginTop={2}>
                <WaveStream
                  lineTo={data.lineTo}
                  data={data.data}
                  backgroundColor="transparent"
                  stroke={isRecording ? theme.palette.primary.main : theme.palette.grey[400]}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                disabled={currentExerciseIndex === 0}
                sx={{ marginRight: 'auto' }}
                variant="outlined"
                size="large"
                onClick={handleClickPrevExercise}
              >
                Prev
              </Button>
              <Button
                disabled={currentExerciseIndex === detailLesson.exercise.length - 1}
                sx={{ marginLeft: 'auto' }}
                size="large"
                variant="contained"
                onClick={handleClickNextExercise}
              >
                Next
              </Button>
            </CardActions>
          </>
        ) : null}
      </Card>

      {listResultExercise.length > 0 && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant='h6'>Prev Result : </Typography>
          {listResultExercise.sort(sort).map((el, index) => {
            return (
              <Card sx={{ marginTop: '10px', padding: '10px 20px' }}>
                {progressBar(el.point, index)}
              </Card>
            )
          })}
        </Box>
      )}

      <Dialog open={openAdd} onClose={handleClose} fullWidth >
        <DialogTitle>Add new word to this lesson</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add new exercise to lesson
          </DialogContentText>
          <Autocomplete
            multiple
            style={{
              marginTop: '20px'
            }}
            id="size-small-standard-multi"
            size="small"
            options={listWordSearch}
            getOptionLabel={(option) => option.word}
            onChange={(event, value) => {
              onSelectWord(value);
            }}
            onInputChange={(event, newValue) => {
              handleSearchWord(newValue);
            }}
            noOptionsText="Input to search word"
            renderInput={(_params) => (
              <TextField
                {..._params}
                variant="standard"
                label="Word"
                placeholder="Add word to your lesson"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddNewWord}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SectionDetail;
