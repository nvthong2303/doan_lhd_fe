import { Card, CardContent, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Iconify from '../../components/iconify';

const TranslationInfo = () => {
  const { word } = useParams();

  return (
    <Card>
      <CardContent>
        <Stack direction="column" spacing={0.5}>
          <Typography variant="h2">{word}</Typography>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
          >
            <Typography variant="body1">[pronunciation]</Typography>
            <IconButton sx={{ fontSize: 12 }}>
              <Iconify icon="fluent:megaphone-loud-16-regular" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TranslationInfo;
