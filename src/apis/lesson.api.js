/* eslint-disable import/no-unresolved */
import axios from 'axios';
import {
    URL_BE
} from 'src/config/config';

export const getListLessonApi = async () => {
    const config = {
        method: 'get',
        url: `${URL_BE}lesson/list`,
        headers: {
        },
    };
    const response = await axios(config);
    return response;
};

export const getListLessonAuthApi = async (token) => {
    const config = {
        method: 'get',
        url: `${URL_BE}lesson/listAuth`,
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios(config);
    return response;
};

export const getListLessonUnAuthApi = async (token) => {
    const config = {
        method: 'get',
        url: `${URL_BE}lesson/listUnAuth`,
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios(config);
    return response;
};

export const searchLessonApi = async (keyword) => {
    const data = {
        "keyword": keyword,
        "skip": 0,
        "limit": 20
    };
    const config = {
        method: 'post',
        url: `${URL_BE}lesson/search`,
        headers: {
        },
        data
    };
    const response = await axios(config);
    return response;
}

export const createLessonApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}lesson/create`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
}

export const getDetailLessonApi = async (id) => {
    const config = {
        method: 'get',
        url: `${URL_BE}lesson/detail/${id}`,
        headers: {
        }
    };
    const response = await axios(config);
    return response;
}

export const addExerciseLessonApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}lesson/exercise`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
}

