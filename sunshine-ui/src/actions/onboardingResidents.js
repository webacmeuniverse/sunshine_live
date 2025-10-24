import i18n from 'i18next';
import { addAlert } from './alerts';
import {
    SELECT_RESIDENTS_REQUEST,
    SELECT_RESIDENTS_SUCCESS,
    SELECT_RESIDENTS_FAILURE,
 
} from '../constants/actionTypes';
import ENDPOINTS from '../constants/endpoints';
import { query } from '../utils/url';

export function getAllUsers(offset = 0, limit = 10) {
  const config = {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };

  return (dispatch) => {
    dispatch({ type: SELECT_RESIDENTS_REQUEST, isUsersFetching: true })
    return fetch(ENDPOINTS.SERVER + `/user?limit=${limit}&offset=${offset}`, config)
      .then(response => {
        if (!response.ok) {
          dispatch({ type: SELECT_RESIDENTS_FAILURE, isUsersFetching: false });
          return Promise.reject(response);
        }
        const allUsers = response.headers.get('X-Documents-Count');
        dispatch({ type: SELECT_RESIDENTS_SUCCESS, payload: allUsers });
        return response.json();
      })
      .then(res => {
        dispatch({ type: SELECT_RESIDENTS_SUCCESS, isUsersFetching: false, users: res });
      })
      .catch(err => {
        dispatch({ type: SELECT_RESIDENTS_FAILURE, isUsersFetching: false });
        if (err && err.message === 'Failed to fetch') {
          dispatch(addAlert({ text: i18n.t('translations:adminActions.failedToFetch'), level: 'error' }));
        } else {
          dispatch(addAlert({ text: i18n.t('translations:errors.internal'), level: 'error' }));
        }
      });
  }
}

