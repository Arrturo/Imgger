import { POST_LIST_FAIL, POST_LIST_REQUEST, POST_LIST_SUCCESS, POST_DETAILS_FAIL, POST_DETAILS_REQUEST, POST_DETAILS_SUCCESS, POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_CREATE_RESET } from "../constants/postConstants";




export const postListReducers = (state = {posts:[]}, action) => {
    switch(action.type){
        case POST_LIST_REQUEST:
            return {loading: true, posts:[]}
        
        case POST_LIST_SUCCESS:
            return {loading: false, posts: action.payload}

        case POST_LIST_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 

    }
}


export const potsDetailsReducers = (state = {post: {}}, action) => {
    switch(action.type){
        case POST_DETAILS_REQUEST:
            return {loading: true, ...state}
        
        case POST_DETAILS_SUCCESS:
            return {loading: false, post: action.payload}

        case POST_DETAILS_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 

    }
}


export const postCreateReducers = (state = {}, action) => {
    switch(action.type){
        case POST_CREATE_REQUEST:
            return {loading: true}
        
        case POST_CREATE_SUCCESS:
            return {loading: false, success: true, post:action.payload}

        case POST_CREATE_FAIL:
            return {loading: false, error: action.payload}
        
        case POST_CREATE_RESET:
            return {}
        
        default:
            return state 

    }
}
