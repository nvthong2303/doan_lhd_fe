/* eslint-disable import/no-unresolved */
import axios from 'axios';
import {
    URL_BE
} from 'src/config/config';

export const searchWordApi = async (keyword) => {
    const data = {
        "keyword": keyword,
        "skip": 0,
        "limit": 20
    };
    const config = {
        method: 'post',
        url: `${URL_BE}word/search`,
        headers: {
            'Content-Type': 'application/json'
        },
        data
    };
    const response = await axios(config);
    return response;
};

export const getDetailWordApi = async (word) => {
    const config = {
        method: 'get',
        url: `${URL_BE}word/detail/${word}`,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await axios(config);
    return response;
}

export const getListWordsApi = async (data) => {
    const config = {
        method: 'post',
        url: `${URL_BE}word/list`,
        headers: {
            'Content-Type': 'application/json'
        },
        data
    };
    const response = await axios(config);
    return response;
}
