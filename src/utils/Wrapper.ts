import api, { Res, RequestWrapperProps } from './Api';
import i18n from '../i18n';
import AppError from './AppError';
import { AUTHENTICATE } from '../redux/types/user';

// All supported http methods of the system
export const Methods = {
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  GET: 'get',
  DELETE: 'delete',
};

/**
 * Centralizes the request sending and handles responses that are global.
 *
 * @param dispatch
 * @param requestParams
 */

export const Request = async (
  dispatch: Function,
  requestParams: RequestWrapperProps,
) => {
  let response: Res = await api(requestParams);

  console.log('response', response);

  console.log(
    `Server request wrapper, ${requestParams.method} '${requestParams.endpoint}' result:`,
  );
  if (response?.data) {
    console.log(response.data);
  } else if (response) {
    console.log(`No data, showing status code instead: ${response.status}`);
  }

  if (response.success) {
    return {
      error: false,
      data: response.data,
      response,
    };
  } else {
    switch (response.status) {
      case 401:
        dispatch({ type: AUTHENTICATE, payload: false });
        throw new AppError({ message: `No session`, display: false });
      case 400:
      case 422:
        throw new AppError({
          message: i18n.t(
            `errors.server_errors.${response.data.errors[0].errorCode}`,
            { defaultValue: i18n.t(`errors.server_errors.A0`) },
          ),
          display: true,
          code: response.data.errors[0].errorCode,
        });
      case 413:
        throw new AppError({
          message: i18n.t(`errors.server_errors.file_too_large`),
          display: true,
          code: response.data.errors[0].errorCode,
        });
      case 999:
        throw new AppError({
          message: 'Connection to server failed',
          data: { connectionAborted: true },
        });
      default:
        throw new AppError({
          message: i18n.t(`errors.server_errors.A0`),
          data: {
            endpoint: response?.request?.responseURL,
            data: response.data,
            status: response.status,
          },
          display: true,
        });
    }
  }
};
