/* eslint-disable import/no-unresolved */
import axios from 'axios';
import {
    URL_BE
} from 'src/config/config';

export const sendResultApi = async (blob) => {
    const data = new FormData()
    const file = new File([blob], `file.wav`)
    data.append('file', file)
    const config = {
        method: 'post',
        url: `${URL_BE}result/test`,
        headers: {
            'Content-Type': `multipart/form-data`,
        },
        data
    };
    const response = await axios(config);
    return response;
}

export const sendSaveResultApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}result/saveResult`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
}