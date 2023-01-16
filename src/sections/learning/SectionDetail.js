import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Recorder from 'recorder-js';
import WaveStream from 'react-wave-stream';
import configSectionList from './constant/config-section-list';
import Iconify from '../../components/iconify';

const SectionDetail = () => {
  const theme = useTheme();
  // TODO: Get example audio file.
  const params = useParams();
  const navigate = useNavigate();
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState({ data: [], lineTo: 0 });

  const [blob, setBlob] = useState(null);

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

  const [searchParams, setSearchParams] = useSearchParams();
  const [maxSectionExercises, setMaxSectionExercises] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);

  useEffect(() => {
    if (params.id) {
      const currentSection = configSectionList.find((section) => section.id === params.id);
      if (!currentSection) {
        navigate('/404');
      } else {
        setMaxSectionExercises(currentSection.count);
      }
    }
  }, [params, navigate]);

  useEffect(() => {
    if (maxSectionExercises > 0) {
      if (!searchParams.get('number')) {
        setSearchParams((prev) => prev.append('number', '1'));
        setCurrentExercise(1);
      } else {
        setCurrentExercise(parseInt(searchParams.get('number'), 10));
      }
    }
  }, [searchParams, maxSectionExercises, setSearchParams]);

  // useEffect(() => {
  //   if (blob) {
  //     Recorder.download(blob, 'audio');
  //   }
  // }, [blob]);

  const onRecord = () => {
    recorder.start().then(() => setIsRecording(true));
  };

  const onStop = () => {
    // blob is wav file data.
    recorder.stop().then(({ blob: newBlob }) => {
      setIsRecording(false);
      setBlob(newBlob);
    });
  };

  // TODO: GET exercise from API.

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader title={`Exercise ${currentExercise}`} subheader="Some description" />
      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button
            startIcon={<Iconify icon="material-symbols:headset-mic" />}
            size="large"
            variant="contained"
            color="warning"
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
        <Button sx={{ marginRight: 'auto' }} variant="outlined" size="large">
          Prev
        </Button>
        <Button disabled sx={{ marginLeft: 'auto' }} size="large" variant="contained">
          Next
        </Button>
      </CardActions>
    </Card>
  );
};

export default SectionDetail;
