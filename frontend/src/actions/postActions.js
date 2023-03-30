import axios from "axios";

import { POST_LIST_FAIL, POST_LIST_REQUEST, POST_LIST_SUCCESS, POST_DETAILS_FAIL, POST_DETAILS_REQUEST, POST_DETAILS_SUCCESS } from "../constants/postConstants";




export const postsList = () => async (dispatch) => {
    try{
        dispatch({type: POST_LIST_REQUEST})


        const config = {
			headers: {
				'Content-type': 'application/json',
			},
		};


        const {data} = await axios.post(`http://127.0.0.1:8000/graphql`, {
            query:`
                query{
                    posts{
                        edges{
                          node{
                            id
                            title
                            description
                            likes
                            dislikes
                            createTime
                            image{
                              file
                              name
                            }
                            user{
                                username
                            }
                          }
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



export const postsDetails = (id) => async (dispatch) => {
    try{
        dispatch({type: POST_DETAILS_REQUEST})
        const {data} = await axios.post(`http://127.0.0.1:8000/graphql`, {
            query: `
                query{
                    postsById(id: "${id}"){
                    id
                    title
                    description
                    likes
                    dislikes
                    createTime
                    image{
                        id
                        file
                        name
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
        })

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