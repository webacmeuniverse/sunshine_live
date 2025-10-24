import { SERVER as backendURL } from '../constants/endpoints';
import { parse as parseTEX } from '../components/project/texParser';

export function getCalcMenuItems(data) {
 

    return (dispatch) => {
        dispatch({ type: 'GET_CALC_MENU' });

        return dispatch({
            type: 'GET_CALC_MENU#COMPLETE',
            payload: {
                data: data,
            },
        });
    };

}

export function setCalcMenuItems(data) {

    return dispatch({
        type: 'SET_CALC_MENU#COMPLETE',
        payload: data
    })
}

