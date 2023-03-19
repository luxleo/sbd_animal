import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.withCredentials = true;

const myAxios = axios.create({
	baseURL: process.env.NEXT_PUBLIC_HOST,
});

export default myAxios;
