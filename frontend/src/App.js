import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen'
import CategoriesAdminScreen from './screens/CategoriesAdminScreen'; 
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen'
import CreatingPost from './screens/CreatingPost';
import PostScreen from './screens/PostScreen';
import PostsAdminScreen from './screens/PostsAdminScreen';
import { useEffect } from 'react';
import axios from 'axios';



function App() {
	useEffect(() => {
		const fetchData = async () => {
		  if ((localStorage.getItem('userInfo')) && (localStorage.getItem('exp')) && (localStorage.getItem('refreshToken'))) {
			const exp = localStorage.getItem('exp');
			const refreshToken = localStorage.getItem('refreshToken');
			const now = new Date().getTime() / 1000;
			if (exp < now) {
			  const config = {
				headers: {
				  'Content-type': 'application/json',
				}
			  }
			  try {
				const { data }  = await axios.post('http://127.0.0.1:8000/graphql', {
				  query: `
					mutation {
					  refreshToken(refreshToken: ${refreshToken}) {
						success,
						errors,
						token,
						refreshToken
						payload
					  }
					}
				  `
				}, config)
	  
				if (data.data.refreshToken.success) {
				  const userData = JSON.parse(localStorage.getItem('userInfo'));
				  userData.token = data.data.refreshToken.token;
				  userData.refreshToken = data.data.refreshToken.refreshToken;
				  localStorage.setItem('userInfo', JSON.stringify(userData));
				  localStorage.setItem('exp', JSON.stringify(data.data.refreshToken.payload.exp));
				  localStorage.setItem('refreshToken', JSON.stringify(data.data.refreshToken.refreshToken));
				}
			  } catch (error) {
				console.log(error);
			  }
			} else {
				console.log("Token is still valid");
			}
		  }
		}
		fetchData();
	  }, []);
	

	return (
		<Router>
			<main className="min-h-screen">
				<Header />
					<Container className="mt-5">
						<Routes>
							<Route path='/' element={<HomeScreen />}/>
							<Route path='/login' element={<LoginScreen />}/>
							<Route path='/register' element={<RegisterScreen />}/>
							<Route path='/profile' element={<ProfileScreen />}/>
							<Route path='/newpost' element={<CreatingPost />} />
							<Route path='/post/:id' element={<PostScreen />} />
							<Route path='/admin/categoriesList' element={<CategoriesAdminScreen />} />
							<Route path='admin/userlist' element={<UserListScreen />} />
							<Route path='admin/userlist/:id/edit' element={<UserEditScreen />} />
							<Route path='admin/postlist' element={<PostsAdminScreen />} />
						</Routes>
					</Container>
				<Footer />
			</main>
		</Router>
	);
}

export default App;
