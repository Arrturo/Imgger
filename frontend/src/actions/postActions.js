import axios from "axios";
import {
  POST_LIST_FAIL,
  POST_LIST_REQUEST,
  POST_LIST_SUCCESS,
  POST_DETAILS_FAIL,
  POST_DETAILS_REQUEST,
  POST_DETAILS_SUCCESS,
  POST_CREATE_FAIL,
  POST_CREATE_REQUEST,
  POST_CREATE_SUCCESS,
  POST_LIKE_REQUEST,
  POST_LIKE_FAIL,
  POST_LIKE_SUCCESS,
  POST_COMMENTS_FAIL,
  POST_COMMENTS_REQUEST,
  POST_COMMENTS_RESET,
  POST_COMMENTS_SUCCESS,
  ADD_COMMENT_FAIL,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_RESET,
  ADD_COMMENT_SUCCESS,
  DELETE_COMMENT_FAIL,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  EDIT_COMMENT_FAIL,
  EDIT_COMMENT_REQUEST,
  EDIT_COMMENT_SUCCESS,
  MY_POST_LIST_FAIL,
  MY_POST_LIST_REQUEST,
  MY_POST_LIST_SUCCESS,
  LIKED_POST_LIST_FAIL, 
  LIKED_POST_LIST_REQUEST,
  LIKED_POST_LIST_SUCCESS,
  POST_DELETE_FAIL,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_UPDATE_FAIL,
  POST_UPDATE_REQUEST,
  POST_UPDATE_SUCCESS,
  SUBCOMMENT_FAIL,
  SUBCOMMENT_REQUEST,
  SUBCOMMENT_SUCCESS
} from "../constants/postConstants";


export const postsList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LIST_REQUEST });

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
                                id
                                url
                            }
                            user{
                                username
                            }
                          }
                          cursor
                        }
                      }
                }
                `,
      },
      config
    );

    dispatch({
      type: POST_LIST_SUCCESS,
      payload: data.data.posts.edges,
    });
  } catch (error) {
    dispatch({
      type: POST_LIST_FAIL,
      payload:
        error.respone && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

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
                            url
                        }
                        category{
                            id
                            name
                        }
                        user{
                            id
                            username
                        }
                }  
            }
            `,
      },
      config
    );

    dispatch({
      type: POST_DETAILS_SUCCESS,
      payload: data.data.postsById,
    });
  } catch (error) {
    dispatch({
      type: POST_DETAILS_FAIL,
      payload:
        error.respone && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createPost =
  (title, description, userId, imageId, categoryId) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: POST_CREATE_REQUEST,
      });


      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:8000/graphql`,
        {
          query: `
                mutation{
                   createPost(title: "${title}", description: "${description}", imageId: "${imageId}", 
                   categoryId: "${categoryId}"){
                        success
                        errors
                        post{
                            id
                            title
                        }
                   }
                }
            `,
        },
        config
      );

      dispatch({
        type: POST_CREATE_SUCCESS,
        payload: data.data.createPost,
      });
    } catch (error) {
      dispatch({
        type: POST_CREATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const likePost = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LIKE_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
                mutation{
                    like(postId: "${id}"){
                        success
                        errors
                    }
                }`,
      },
      config
    );

    dispatch({
      type: POST_LIKE_SUCCESS,
      payload: data.data.likePost,
    });
  } catch (error) {
    dispatch({
      type: POST_LIKE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const dislikePost = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LIKE_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://localhost:8000/graphql`,
      {
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


export const postComments = (postId) => async (dispatch, getState) => {
    try{
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };
        

        dispatch({type: POST_COMMENTS_REQUEST})
        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
                query{
                    commentsByPost(postId: "${postId}"){
                        edges{
                            node{
                                user {
                                    id
                                    username
                                }
                                id
                                comment
                                createTime
                                }
                            }
                        }
                    }
            `
        }, config)

        dispatch({
            type: POST_COMMENTS_SUCCESS,
            payload: data.data.commentsByPost.edges
        })

        // console.log(data.data.commentsByPost)


    }catch(error){
        dispatch({
            type: POST_COMMENTS_FAIL,
            payload: error.respone && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }

}


export const addComment = (postId, userId, comment) => async (dispatch, getState) => {
    
    try {
        dispatch({
            type: ADD_COMMENT_REQUEST,
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        }
        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
                mutation{
                   createComment(postId: "${postId}", userId: ${userId}, comment: "${comment}"){
                        success
                        errors
                   }
                }
            `
        }, config)
        

        dispatch({
            type: ADD_COMMENT_SUCCESS,
            payload: data.data.createComment,
        })

    }catch(error){
        dispatch({
            type: ADD_COMMENT_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}


export const deleteComment = (commentId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: DELETE_COMMENT_REQUEST,
        })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
            }}

        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
                mutation{
                    deleteComment(commentId: "${commentId}"){
                        success
                        errors
                    }
                }
            `
        }, config)
        
        dispatch({
            type: DELETE_COMMENT_SUCCESS,
        })

    }catch(error){
        dispatch({
            type: DELETE_COMMENT_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}


export const editComment = (comment) => async (dispatch, getState) => {
    
    try {
        dispatch({
            type: EDIT_COMMENT_REQUEST,
        })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
            }}

        const {data} = await axios.post(`http://localhost:8000/graphql`, {
            query: `
            mutation{
                updateComment(commentId: "${comment.id}", content: "${comment.content}") {
                  success
                  errors
                }
              }
            `
        }, config)


        dispatch({
            type: EDIT_COMMENT_SUCCESS,
            payload: data,
        })

    }catch(error){
        dispatch({
            type: EDIT_COMMENT_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}


export const myPostsList = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_POST_LIST_REQUEST });

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
                    postsByUser(userId: ${id}){
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
                                id
                                url
                            }
                            user{
                                username
                            }
                          }
                          cursor
                        }
                      }
                }
                `,
      },
      config
    );

    dispatch({
      type: MY_POST_LIST_SUCCESS,
      payload: data?.data?.postsByUser?.edges,
    });
  } catch (error) {
    dispatch({
      type: MY_POST_LIST_FAIL,
      payload:
        error.respone && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const likedPostsList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LIKED_POST_LIST_REQUEST });

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
                    me{
                      likes{
                        edges{
                          node{
                            id
                            title
                            description
                            likes
                            dislikes
                            image{
                              id
                              url
                            }
                            user{
                              id
                              username
                            }
                          }
                        }
                      }
                    }
                }
                `,
      },
      config
    );

    dispatch({
      type: LIKED_POST_LIST_SUCCESS,
      payload: data?.data?.me?.likes?.edges
    });
  } catch (error) {
    dispatch({
      type: LIKED_POST_LIST_FAIL,
      payload:
        error.respone && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const deletePost = (postId) => async (dispatch, getState) => {
  try {
      dispatch({
          type: POST_DELETE_REQUEST,
      })

      const {
          userLogin: {userInfo}
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
          }}

      const {data} = await axios.post(`http://localhost:8000/graphql`, {
          query: `
              mutation{
                  deletePost(postId: "${postId}"){
                      success
                      errors
                  }
              }
          `
      }, config)
      
      dispatch({
          type: POST_DELETE_SUCCESS,
      })

  }catch(error){
      dispatch({
          type: POST_DELETE_FAIL,
          payload: error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
      })
  }
}


export const editPost = (post) => async (dispatch, getState) => {
    
  try {
      dispatch({
          type: POST_UPDATE_REQUEST,
      })

      const {
          userLogin: {userInfo}
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
          }}

      const {data} = await axios.post(`http://localhost:8000/graphql`, {
          query: `
          mutation{
              updatePost(postId: "${post.postId}", title: "${post.title}", description: "${post.description}", categoryId: "${post.category}") {
                success
                errors
              }
            }
          `
      }, config)


      dispatch({
          type: POST_UPDATE_SUCCESS,
          payload: data,
      })

  }catch(error){
      dispatch({
          type: POST_UPDATE_FAIL,
          payload: error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
      })
  }
}


export const subcomments = (commentId) => async (dispatch, getState) => {
  try{
      const {
          userLogin: { userInfo },
      } = getState();

      const config = {
          headers: {
              'Content-type': 'application/json',
          },
      };
      

      dispatch({type: SUBCOMMENT_REQUEST})
      const {data} = await axios.post(`http://localhost:8000/graphql`, {
          query: `
              query{
                  subcommentsByComment(commentId: "${commentId}"){
                      edges{
                          node{
                              user {
                                  id
                                  username
                              }
                              id
                              content
                              createTime
                              }
                          }
                      }
                  }
          `
      }, config)

      dispatch({
          type: SUBCOMMENT_SUCCESS,
          payload: data.data.subcommentsByComment.edges
      })



  }catch(error){
      dispatch({
          type: SUBCOMMENT_FAIL,
          payload: error.respone && error.response.data.detail
          ? error.response.data.detail
          : error.message,
      })
  }

}
