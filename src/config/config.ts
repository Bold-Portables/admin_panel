import axios from "axios";
import store from '../Redux/store';


export const withoutAuthAxios = () => {
  return axios.create({
    baseURL: process.env.REACT_APP_BASEURL
  });
};


export const authAxios = () => {
  let token = store.getState().auth.accessToken;
  return axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
    headers: {
      'Authorization': `${token ? `${token}` : null}`,
    },
  });
};