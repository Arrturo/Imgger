import {CATEGORIES_LIST_REQUEST, CATEGORIES_LIST_SUCCESS, CATEGORIES_LIST_FAIL, CATEGORIES_DELETE_FAIL, CATEGORIES_DELETE_REQUEST, CATEGORIES_DELETE_SUCCESS, CATEGORIES_ADD_FAIL, CATEGORIES_ADD_REQUEST, CATEGORIES_ADD_SUCCESS, CATEGORIES_EDIT_FAIL, CATEGORIES_EDIT_REQUEST, CATEGORIES_EDIT_SUCCESS} from '../constants/catagoriesConstants'


export const categoriesListReducers = (state = {categories: []}, action) => {
    switch(action.type){
        case CATEGORIES_LIST_REQUEST:
            return{
                loading: true,
                categories: []
            }
        case CATEGORIES_LIST_SUCCESS:
            return{
                loading: false,
                categories: action.payload
            }
        case CATEGORIES_LIST_FAIL:
            return{
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
}

export const categoryDeleteReducer = (state = {}, action) => {
    switch(action.type){
        case CATEGORIES_DELETE_REQUEST:
            return {loading: true}
        
        case CATEGORIES_DELETE_SUCCESS:
            return {loading: false, success: true}
        
        case CATEGORIES_DELETE_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 
    }
}


export const categoriesCreateReducers = (state = {}, action) => {
    switch(action.type){
        case CATEGORIES_ADD_REQUEST:
            return {loading: true}
        
        case CATEGORIES_ADD_SUCCESS:
            return {loading: false, success: true, product:action.payload}

        case CATEGORIES_ADD_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 

    }
}


export const categoriesEditeReducers = (state = {}, action) => {
    switch(action.type){
        case CATEGORIES_ADD_REQUEST:
            return {loading: true}
        
        case CATEGORIES_ADD_SUCCESS:
            return {loading: false, success: true, product:action.payload}

        case CATEGORIES_ADD_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state 

    }
}