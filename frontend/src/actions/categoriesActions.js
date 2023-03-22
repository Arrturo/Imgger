import {CATEGORIES_LIST_REQUEST, CATEGORIES_LIST_SUCCESS, CATEGORIES_LIST_FAIL, CATEGORIES_DELETE_FAIL, CATEGORIES_DELETE_REQUEST, CATEGORIES_DELETE_SUCCESS, CATEGORIES_ADD_FAIL, CATEGORIES_ADD_REQUEST, CATEGORIES_ADD_SUCCESS} from '../constants/catagoriesConstants'
import axios from 'axios'


export const categoriesList = () => async (dispatch) => {
    try{
        dispatch({
            type: CATEGORIES_LIST_REQUEST
        })

        const config = {
			headers: {
				'Content-type': 'application/json',
			},
		};

        const {data} = await axios.post('http://127.0.0.1:8000/graphql', {
            query: `
                query{
                    categories{
                        id
                        name
                    }
                }
            `
        }, config)

        dispatch({
            type: CATEGORIES_LIST_SUCCESS,
            payload: data.data
        })

        localStorage.setItem('categories', JSON.stringify(data)); 


    }catch (error){
        dispatch({
            type: CATEGORIES_LIST_FAIL,
            payload: error.respone && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }

}



export const deleteCategories = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CATEGORIES_DELETE_REQUEST,
        })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',

            }
        }

        const {data} = await axios.post('http://127.0.0.1:8000/graphql', {
            query: `
                mutation{
                    deleteCategory(categoryId: ${id}){
                        success
                        errors
                    }
                }
            `
        }, config)
        
        dispatch({
            type: CATEGORIES_DELETE_SUCCESS,
        })

    }catch(error){
        dispatch({
            type: CATEGORIES_DELETE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}


export const createCategory = (name) => async (dispatch, getState) => {
    
    try {
        dispatch({
            type: CATEGORIES_ADD_REQUEST,
        })

        const {
            userLogin: {userInfo}
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }
        const {data} = await axios.post(`http://127.0.0.1:8000/graphql`, {
            query: `
                mutation{
                    createCategory(name: "${name}"){
                        category{
                            id
                            name
                        }
                    }
                }
            `
        }, config)
        
        console.log(data)

        dispatch({
            type: CATEGORIES_ADD_SUCCESS,
            payload: data,
        })

    }catch(error){
        dispatch({
            type: CATEGORIES_ADD_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}