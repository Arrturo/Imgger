import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userLoginReducer, userRegisterReducer, userUpdateProfileRecuder, userListReducer, userDeleteReducer, userDetailsReducer} from './reducers/userReducers'
import { categoriesListReducers, categoryDeleteReducer, categoriesCreateReducers, categoriesEditeReducers } from './reducers/categoriesReducers'
import { postListReducers, myPostListReducers, potsDetailsReducers, postCreateReducers, postCommentsReducers, addCommentReducers, commentDeleteReducer, commentEditeReducers,
    likedPostListReducers, postDeleteReducer, postEditeReducers, subcommentsReducers } from './reducers/postReducers'



const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userUpdateProfile: userUpdateProfileRecuder,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userDetails: userDetailsReducer,
    categoriesList: categoriesListReducers,
    categoriesDelete: categoryDeleteReducer,
    categoriesCreate: categoriesCreateReducers,
    categoriesEdit: categoriesEditeReducers,
    postList: postListReducers,
    myPostList: myPostListReducers,
    deletePost: postDeleteReducer,
    updatePost: postEditeReducers,
    likedPostList: likedPostListReducers,
    postDetails: potsDetailsReducers,
    postComments: postCommentsReducers,
    addComment: addCommentReducers,
    deleteComment: commentDeleteReducer,
    editComment: commentEditeReducers,
    postCreate: postCreateReducers,
    subcomments: subcommentsReducers,

})



const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null


const initialState = {
    userLogin: {userInfo: userInfoFromStorage},
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
