import {USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_REGISTER_FAIL, USER_LOGOUT} from '../constants/userConstants'
import axios from 'axios'

export const login = (username, password) => async (dispatch) =>{
    try{
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        const config = {
			    headers: {
				    'Content-type': 'application/json',
			  },
		  };

        const { data } = await axios.post('http://127.0.0.1:8000/graphql', {
            query: `
              mutation {
                tokenAuth(username: "${username}", password: "${password}") {
                  success
                  errors
                  token
                  user {
                    pk
                    username
                    email
                    isStaff
                    dateJoined
                  }
                }
              }
            `,
          }, config)

          console.log(data.data.tokenAuth.success)

          if(data.data.tokenAuth.success === true){
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: data.data.tokenAuth,
            });
        
            localStorage.setItem('userInfo', JSON.stringify(data.data.tokenAuth));

          } else {
            dispatch({
                type: USER_LOGIN_FAIL,
                payload: "Invalid username or password",
            })
          }



    } catch (error){
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}


export const logout = () => (dispatch) => {
	localStorage.removeItem('userInfo');
	dispatch({
		type: USER_LOGOUT,
	});
};






export const register = (username, email, password, confirmPassword) => async (dispatch) => {
	try {
		dispatch({
			type: USER_REGISTER_REQUEST,
		});

		const config = {
			headers: {
				'Content-type': 'application/json',
			},
		};

		const { data } = await axios.post('http://127.0.0.1:8000/graphql', {
      query: `
       mutation {
        register(
          email: "${email}",
          username: "${username}",
          password1: "${password}",
          password2: "${confirmPassword}"
        ) {
          success,
          errors,
          token,
          refreshToken
        }
      }
      
       `}
		);

		dispatch({
			type: USER_REGISTER_SUCCESS,
			payload: data,
		});


	} catch (error) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};