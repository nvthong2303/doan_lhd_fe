/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prop-types */
import { Card, CardContent, Divider, IconButton, Stack, Typography, Box, Link } from '@mui/material';
import { useParams } from 'react-router-dom';
import Iconify from '../../components/iconify';
import IconCambridge from '../../assets/icons/Cambridge.png'

export default function TranslationInfo({ listWordSearch }) {

  const handleListen = (section) => {
    const url = section.gp_audio_url ?? section.us_audio_url
      ? section.us_audio_url
      : null
    new Audio(url).play()
  }

  return (
    <Box>
      {listWordSearch.map(item => (
        <Card sx={{ marginTop: '5px' }}>
          <CardContent key={item._id}>
            <Stack
              direction="column"
              spacing={0.5}
              alignItems="flex-start"
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center ' }}>
                  <Typography variant="body1">{item.word}</Typography>
                  <IconButton sx={{ marginLeft: '12px', fontSize: 12 }} onClick={() => handleListen(item)}>
                    <Iconify icon="fluent:megaphone-loud-16-regular" />
                  </IconButton>
                </Box>
                <Link target="_blank" sx={{ marginLeft: '12px', fontSize: 12 }} href={`https://dictionary.cambridge.org/dictionary/learner-english/${item.word}`}>
                  <img src={IconCambridge} style={{ width: '20px', height: 'auto' }} />
                </Link>
              </Box>
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">{`[${item.ipa}]`}</Typography>
                <IconButton sx={{ marginLeft: '12px', fontSize: 12 }} onClick={() => handleListen(item)}>
                  <Iconify icon="fluent:megaphone-loud-16-regular" />
                </IconButton>
              </Box> */}
              <Divider />
              <Typography variant="caption">{`Meaning: ${item.meaning.split('-')[1]}`}</Typography>
              {item.meaning.split('-')[2].length > 0 && (
                <Typography variant="caption">{`Example: ${item.meaning.split('-')[2]}`}</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
};
