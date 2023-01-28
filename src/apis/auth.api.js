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
        },
        data
    };
    const response = await axios(config);
    return response;
};

export const getInfoApi = async (token) => {
    const config = {
        method: 'get',
        url: `${URL_BE}users/info`,
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios(config);
    return response;
};

export const addLessonUserApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}users/addLesson`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
};

export const removeLessonUserApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}users/removeLesson`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
};

export const updateInFoUserApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}users/update`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
};

export const updatePasswordUserApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}users/updatePassword`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
};