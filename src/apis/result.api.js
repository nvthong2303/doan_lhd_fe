/* eslint-disable import/no-unresolved */
import axios from 'axios';
import {
    URL_BE, URL_SERVICE
} from 'src/config/config';

// export const sendResultApi = async (blob, word) => {
//     const data = new FormData()
//     const file = new File([blob], `file.wav`)
//     data.append('file', file)
//     data.append('word', word)
//     const config = {
//         method: 'post',
//         url: `${URL_BE}result/test`,
//         headers: {
//             'Content-Type': `multipart/form-data`,
//         },
//         data
//     };
//     const response = await axios(config);
//     return response;
// }


export const sendResultApi = async (blob, word) => {
    // const data = new FormData()
    // const file = new File([blob], `file.wav`)
    // data.append('file', file)

    const audiofile = new File([blob], "audiofile.wav", {
        type: "audio/wav",
    });
    const formData = new FormData();
    formData.append("file", audiofile, 'test.wav');
    const config = {
        method: 'post',
        url: `${URL_SERVICE}`,
        headers: {
            'Content-Type': `multipart/form-data`,
        },
        formData
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

export const getResultApi = async (data, token) => {
    const config = {
        method: 'post',
        url: `${URL_BE}result/getResult`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data
    };
    const response = await axios(config);
    return response;
}

// const record = async () => {
//     this.setState({ isLoading: true })

//     if (this.state.isRecording) {
//         const endPoint = 'https://fc91-104-196-189-249.ngrok.io/predict'
//         const blob = await recorder.stopRecording()
//         this.setState({
//             isLoading: false,
//             isRecording: false,
//             recordings: this.state.recordings.concat(URL.createObjectURL(blob))
//         })
//         console.log(URL.createObjectURL(blob))
//         // const audioBlob = await fetch('https://unpkg.com/vmsg@0.3.0/vmsg.wasm').then((r) => r.blob());
//         const audiofile = new File([blob], "audiofile.wav", {
//             type: "audio/wav",
//         });
//         console.log(audiofile)
//         const formData = new FormData();
//         formData.append("file", audiofile, 'test.wav');
//         console.log(formData)
//         const response = await axios.post(
//             endPoint,
//             formData,
//             {
//                 'Accept': 'application/json',
//                 "content-type": "multipart/form-data",
//             }
//         );
//     }
// }