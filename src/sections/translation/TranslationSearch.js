import { useState } from 'react';
import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Typography, Autocomplete, InputAdornment } from '@mui/material';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_PAGE } from '../../routes/paths';
// components
import Image from '../../components/image';
import Iconify from '../../components/iconify';
import { CustomTextField } from '../../components/custom-input';
import SearchNotFound from '../../components/search-not-found';

// ----------------------------------------------------------------------

export default function ShopTranslationSearch() {
  const navigate = useNavigate();

  const [searchTranslations, setSearchTranslations] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const handleChangeSearch = async (value) => {
    try {
      setSearchTranslations(value);
      if (value) {
        const response = await axios.get('/api/translations/search', {
          params: { query: value },
        });

        setSearchResults(response.data.results);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGotoTranslation = (name) => {
    navigate(PATH_PAGE.translationSearch(paramCase(name)));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleGotoTranslation(searchTranslations);
    }
  };

  return (
    <Autocomplete
      size="small"
      autoHighlight
      popupIcon={null}
      options={searchResults}
      onInputChange={(event, value) => handleChangeSearch(value)}
      getOptionLabel={(translation) => translation.name}
      noOptionsText={<SearchNotFound query={searchTranslations} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      componentsProps={{
        popper: {
          sx: {
            width: `280px !important`,
          },
        },
        paper: {
          sx: {
            '& .MuiAutocomplete-option': {
              px: `8px !important`,
            },
          },
        },
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          width={220}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, translation, { inputValue }) => {
        const { name, cover } = translation;
        const matches = match(name, inputValue);
        const parts = parse(name, matches);

        return (
          <li {...props}>
            <Image
              alt={cover}
              src={cover}
              sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }}
            />

            <Link underline="none" onClick={() => handleGotoTranslation(name)}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  variant="subtitle2"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}
