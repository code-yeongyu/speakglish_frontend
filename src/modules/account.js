import update from 'react-addons-update';
import {URL} from '../config/Api';
//Actions
export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_LOGOUT = "AUTH_LOGOUT";
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";
export const PROFILE_SET = "PROFILE_SET";

//Action Creators
export function loginRequest(email, password) {
    return (dispatch) => {
        dispatch(login());
        return fetch(URL+"/auth/login/",{
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'username='+email+"&password="+password
        })
        .then(response => response.json())
        .then(json => {
            if(json.token !== undefined){
                dispatch(loginSuccess(json));
            }else{
                dispatch(loginFailure(json));
            }
        })
    }
}
export function login() {
    return {
        type: AUTH_LOGIN
    };
}
export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
export function loginSuccess(data) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        data
    };
}
export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}
export function profileRequest(token) {
    return (dispatch) => {
        return fetch(URL+"/api/profile/",{
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Token "+token
            }
        })
        .then(response => response.json())
        .then(json => {
            dispatch(profileSet(json));
        })
    }
}
export function profileSet(data) {
    return {
        type: PROFILE_SET,
        data
    };
}

//Reducer
const initialState = {
    login:{
        status: 'INIT'
    },
    status:{
        isLoggedIn: false,
        token: "",
    },
    profile:{
        name: "",
        email: ""
    }
}

function reducer(state = initialState, action){
    switch(action.type) {
        case AUTH_LOGIN :
            return update(state, {
                login:{
                    status: {$set:'WAITING'}
                }
            });
        case AUTH_LOGOUT :
            return update(state, {
                login:{
                    status: {$set:'INIT'}
                },
                status:{
                    isLoggedIn: {$set:false},
                    token: {$set:""}
                }
            });
        case AUTH_LOGIN_SUCCESS :
            return update(state, {
                login:{
                    status: {$set:'SUCCESS'}
                },
                status:{
                    isLoggedIn: {$set:true},
                    token: {$set:action.data.token}
                }
            });
        case AUTH_LOGIN_FAILURE :
            return update(state, {
                login:{
                    status: {$set:'FAILURE'}
                }
            });
        case PROFILE_SET :
            return update(state, {
                profile:{
                    name: {$set:action.data.username},
                    email: {$set:action.data.email}
                }
            })
        default :
            return state
    }
}

//Export Reducer
export default reducer;