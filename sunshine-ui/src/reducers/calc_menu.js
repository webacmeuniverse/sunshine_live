const initialState = {
    menu: [],
    loading: false,
    error: null,
};

export default function calcmenuReducer(state = initialState, action) {
   
    switch (action.type) {
        case 'GET_CALC_MENU':
            return { ...state, loading: true };
        case 'GET_CALC_MENU#COMPLETE':
            const { menuname, submenu, submenudata } = action.payload;

            return {
                ...state,
                loading: false,
                error: null,
                menu: {
                    ...state.data,
                    [calcmenu]: {
                        ...state.data[menuname],
                        [submenu]: submenudata,
                    },
                },
            };
        case 'GET_CALC_MENU#ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'SET_CALC_MENU':
            return { ...state, loading: true };
        case 'SET_CALC_MENU#COMPLETE':
          
            return {
                ...state,
                loading: false,
                error: null,
                menu: action.payload.data
            }
        default:
            return state;
    }
}

