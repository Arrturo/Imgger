import axios from "axios";

import { POST_LIST_FAIL, POST_LIST_REQUEST, POST_LIST_SUCCESS, POST_DETAILS_FAIL, POST_DETAILS_REQUEST, POST_DETAILS_SUCCESS, POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_LIKE_REQUEST, POST_LIKE_FAIL, POST_LIKE_SUCCESS} from "../constants/postConstants";




export const postsList = () => async (dispatch, getState) => {
    try{
        dispatch({type: POST_LIST_REQUEST})

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };

        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query:`
                query{
                    posts(first: 10, offset: 0){
                        edges{
                          node{
                            id
                            title
                            description
                            likes
                            dislikes
                            createTime
                            isLiked
                            isDisliked
                            image{
                              file
                            }
                            user{
                                username
                            }
                          }
                          cursor
                        }
                      }
                }
                `
        }, config)


        dispatch({
            type: POST_LIST_SUCCESS,
            payload: data.data.posts.edges
        })


    }catch(error){
        dispatch({
            type: POST_LIST_FAIL,
            payload: error.respone && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }

}



export const postsDetails = (id) => async (dispatch, getState) => {
    try{
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };

        dispatch({type: POST_DETAILS_REQUEST})
        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
                query{
                    postsById(id: "${id}"){
                        id
                        title
                        description
                        likes
                        dislikes
                        isLiked
                        isDisliked
                        createTime
                        nextPost{
                            id
                        }
                        previousPost{
                            id
                        }
                        image{
                            id
                            file
                        }
                        category{
                            id
                            name
                        }
                        user{
                            username
                        }
                }  
            }
            `
        }, config)

        dispatch({
            type: POST_DETAILS_SUCCESS,
            payload: data.data.postsById
        })


    }catch(error){
        dispatch({
            type: POST_DETAILS_FAIL,
            payload: error.respone && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }

}



export const createPost = (title, description,  userId, imageId,  categoryId,) => async (dispatch, getState) => {
    
    try {
        dispatch({
            type: POST_CREATE_REQUEST,
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        }
        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
                mutation{
                   createPost(title: "${title}", description: "${description}", userId: ${userId}, imageId: "${imageId}", 
                   categoryId: "${categoryId}"){
                        success
                        errors
                        post{
                            id
                            title
                        }
                   }
                }
            `
        }, config)
        

        dispatch({
            type: POST_CREATE_SUCCESS,
            payload: data.data.createPost,
        })

    }catch(error){
        dispatch({
            type: POST_CREATE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}

export const likePost = (id) => async (dispatch, getState) => {

    try{
        dispatch({type: POST_LIKE_REQUEST})

        const config = {
            headers: {
                'Content-type': 'application/json',
            }}

        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
                mutation{
                    like(postId: "${id}"){
                        success
                        errors
                    }
                }`
        }, config)

        dispatch({
            type: POST_LIKE_SUCCESS,
            payload: data.data.likePost
        })

    }catch(error){
        dispatch({
            type: POST_LIKE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
        
    }
}


export const dislikePost = (id) => async (dispatch, getState) => {

    try{
        dispatch({type: POST_LIKE_REQUEST})

        const config = {
            headers: {
                'Content-type': 'application/json',
            }}

        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
                mutation{
                    dislike(postId: "${id}"){
                        success
                        errors
                    }
                }`
        }, config)

        dispatch({
            type: POST_LIKE_SUCCESS,
            payload: data.data.dislikePost
        })

    }catch(error){
        dispatch({
            type: POST_LIKE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
        
    }
}
