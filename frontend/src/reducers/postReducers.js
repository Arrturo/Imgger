import { POST_LIST_FAIL, POST_LIST_REQUEST, POST_LIST_SUCCESS, POST_DETAILS_FAIL, POST_DETAILS_REQUEST, POST_DETAILS_SUCCESS, POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_CREATE_RESET, 
POST_COMMENTS_FAIL, POST_COMMENTS_REQUEST, POST_COMMENTS_RESET, POST_COMMENTS_SUCCESS, ADD_COMMENT_FAIL, ADD_COMMENT_REQUEST, ADD_COMMENT_RESET, ADD_COMMENT_SUCCESS,
DELETE_COMMENT_FAIL, DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS, EDIT_COMMENT_FAIL, EDIT_COMMENT_REQUEST, EDIT_COMMENT_SUCCESS,
MY_POST_LIST_FAIL, MY_POST_LIST_REQUEST, MY_POST_LIST_SUCCESS, LIKED_POST_LIST_FAIL, LIKED_POST_LIST_REQUEST, LIKED_POST_LIST_SUCCESS } from "../constants/postConstants";




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


export const postCommentsReducers = (state = {comments: []}, action) => {
    switch(action.type){
        case POST_COMMENTS_REQUEST:
            return {loading: true, comments: []}
        
        case POST_COMMENTS_SUCCESS:
            return {loading: false, comments: action.payload}

        case POST_COMMENTS_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 

    }
}


export const addCommentReducers = (state = {}, action) => {
    switch(action.type){
        case ADD_COMMENT_REQUEST:
            return {loading: true}
        
        case ADD_COMMENT_SUCCESS:
            return {loading: false, success: true, product:action.payload}

        case ADD_COMMENT_FAIL:
            return {loading: false, error: action.payload}

        case ADD_COMMENT_RESET:
            return {product: {}}
        
        default:
            return state 

    }
}


export const commentDeleteReducer = (state = {}, action) => {
    switch(action.type){
        case DELETE_COMMENT_REQUEST:
            return {loading: true}
        
        case DELETE_COMMENT_SUCCESS:
            return {loading: false, success: true}
        
        case DELETE_COMMENT_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 
    }
}



export const commentEditeReducers = (state = {}, action) => {
    switch(action.type){
        case EDIT_COMMENT_REQUEST:
            return {loading: true}
        
        case EDIT_COMMENT_SUCCESS:
            return {loading: false, success: true, comment:action.payload}

        case EDIT_COMMENT_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 

    }
}


export const myPostListReducers = (state = {myPosts:[]}, action) => {
    switch(action.type){
        case MY_POST_LIST_REQUEST:
            return {loadingPosts: true, posts:[]}
        
        case MY_POST_LIST_SUCCESS:
            return {loadingPosts: false, posts: action.payload}

        case MY_POST_LIST_FAIL:
            return {loadingPosts: false, error: action.payload}
        
        default:
            return state 

    }
}

export const likedPostListReducers = (state = {liked:[]}, action) => {
    switch(action.type){
        case LIKED_POST_LIST_REQUEST:
            return {loadingLikedPosts: true, liked:[]}
        
        case LIKED_POST_LIST_SUCCESS:
            return {loadingLikedPosts: false, liked: action.payload}

        case LIKED_POST_LIST_FAIL:
            return {loadingLikedPosts: false, error: action.payload}
        
        default:
            return state 

    }
}