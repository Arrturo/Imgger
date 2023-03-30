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

function App() {
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
