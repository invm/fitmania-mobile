import axios from 'axios';
import { API_URL } from '../../env';
import i18n from '../i18n';

export interface RequestWrapperProps {
  headers?: object;
  method: string;
  endpoint: string;
  body?: object;
}

export interface Res {
  [key: string]: any;
}

let instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: '*/*',
  },
});

/**
 * A wrapper function for all requests
 *
 * @param headers - custom headers if required.
 * @param method - The http method that will be used for the request
 * @param endpoint - The endpoint that the request is aimed at
 * @param body - The request body
 * @param withCredentials - Specifies if the request request credentials. Required for the cookies to be passed!
 * @returns A response object that always contains an indication if the request was successful, a single message and potentially full request data for the caller to play around with if needed.
 */
export default async function requestWrapper({
  // headers,
  method,
  endpoint,
  body,
}: RequestWrapperProps) {
  let res: Res;

  try {
    // @ts-ignore
    let response = await instance?.[method](
      API_URL + endpoint,
      method === 'DELETE' ? { data: body } : body,
    );

    res = response;
    res.success = true; // Indicator for the caller to know that the request was processed successfully.
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      return {
        success: false,
        status: 999,
      };
    }

    res = err?.response ? err.response : {}; // pulls the res from the error
    res.success = false; // Indicator for the caller to know that the request wasn't processed successfully.
  }

  if (res) res.message = res?.data?.message; // Pull the error message out of the res in order to make the life of the caller easier

  return res;
}
