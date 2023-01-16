/* eslint-disable import/no-unresolved */
import axios, { AxiosRequestConfig } from 'axios';
import {
    URL_BE
} from 'src/config/config';

export const registerApi = async (data) => {
    const config = {
        method: 'post',
        url: `${URL_BE}users/register`,
        headers: {
            // Authorization: `Bearer ${TOKEN_EMSO}`
        },
        data
    };
    const response = await axios(config);
    return response;
};

export const loginApi = async (data) => {
    const config = {
        method: 'post',
        url: `${URL_BE}users/login`,
        headers: {
            // Authorization: `Bearer ${TOKEN_EMSO}`
        },
        data
    };
    const response = await axios(config);
    return response;
};