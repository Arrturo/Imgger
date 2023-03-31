import {USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_REGISTER_FAIL, USER_LOGOUT, USER_UPDATE_PROFILE_REQUEST,
	USER_UPDATE_PROFILE_SUCCESS,
	USER_UPDATE_PROFILE_FAIL,
	USER_UPDATE_PROFILE_RESET, USER_LIST_FAIL, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_DELETE_FAIL,
	USER_DELETE_REQUEST,
	USER_DELETE_SUCCESS, USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS} from '../constants/userConstants'
import axios from 'axios'

export const login = (username, password) => async (dispatch) =>{
    try{
        dispatch({
            type: USER_LOGIN_REQUEST
        })

		const config = {
			headers: {
				'Content-type': 'application/json',
				'Authorization': 'JWT ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjgwMjEwNTI2LCJvcmlnSWF0IjoxNjgwMjEwMjI2fQ.Cf-LRHnQAWjeAKXlkva81bqvP_TZ0qnP6CLjENf7vag",
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

      console.log(data)
      
      if (data.data.register.success) { 
        dispatch({
          type: USER_REGISTER_SUCCESS,
          payload: data,
        });
      }else{
        if (data?.data?.register?.errors?.username[0]?.message || data?.data?.register?.errors?.password2[0]?.message){
          const errorMessages = [
            data?.data?.register?.errors?.username[0]?.message,
            data?.data?.register?.errors?.password2[0]?.message,
            
          ];
          const filteredMessages = errorMessages.filter(message => message);
          const payload = filteredMessages.join(` \u2022 `);

          if (payload) {
            dispatch({
              type: USER_REGISTER_FAIL,
              payload: payload 
            });
          }
        }
      }


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



export const updateUserProfile = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post(`http://127.0.0.1:8000/graphql`,{
      query: `
        mutation{
          updateUser(userId: ${user.id}, username: "${user.username}", email: "${user.email}", password: "${user.password}"){
            user{
              id
              username
              email
              isStaff
              dateJoined
            }
          }
        }
      `
    },  config);

    
		dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		});
    
    const userData = JSON.parse(localStorage.getItem('userInfo')); 
    console.log(userData.user.username)
    console.log(data.data.updateUser.user.username)
    userData.user.username = data.data.updateUser.user.username;
    userData.user.email = data.data.updateUser.user.email 

    localStorage.setItem('userInfo', JSON.stringify(userData)); 
    window.location.reload()
    
    

	} catch (error) {
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};



export const listUsers = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_LIST_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-type': 'application/json',
				// Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post(`http://127.0.0.1:8000/graphql`,{
      query: `
        query{
          users{
              id
              username
              email
              isStaff
              dateJoined
          }
        }
      `
    }, config);


		dispatch({
			type: USER_LIST_SUCCESS,
			payload: data.data
		});



	} catch (error) {
		dispatch({
			type: USER_LIST_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};




export const deleteUser = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DELETE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-type': 'application/json',
				// Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post(`http://127.0.0.1:8000/graphql`, {
      query: `
        mutation{
          deleteUser(userId: ${id}){
              user{
                  username
                  email
              }
          }
        }
      `
    }, config);

		dispatch({
			type: USER_DELETE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: USER_DELETE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};


export const getUserDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-type': 'application/json',
				// Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post(`http://127.0.0.1:8000/graphql`, {
      query: `
        query{
          usersById(id: ${id}){
              id
              username
              email
              isStaff
          }
        }
      `
    }, config);


    // console.log(data.data.usersById)

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data.data.usersById,
		});



	} catch (error) {
		dispatch({
			type: USER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
}



export const updateUserProfileByAdmin = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post(`http://127.0.0.1:8000/graphql`,{
      query: `
        mutation{
          updateUser(userId: ${user.id}, username: "${user.username}", email: "${user.email}", password: "", isStaff: ${user.isStaff}){
            user{
              id
              username
              email
              isStaff
              dateJoined
            }
          }
        }
      `
    },  config);

    
		dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		});
    
    

	} catch (error) {
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload:
				error.response && error.response.data.detail
					? error.response.data.detail
					: error.message,
		});
	}
};
