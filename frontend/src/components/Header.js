import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {logout} from '../actions/userActions'
import '../index.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useNavigate} from 'react-router-dom'
import SearchBox from './SearchBox';


function Header() {

	const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

	const navigate = useNavigate()

	const dispatch = useDispatch()


	const logoutHandler = () =>{
		dispatch(logout())
		localStorage.clear()
		navigate('/')
		window.location.reload()
	}

	return (
        <header className="text-2xl">
			<Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
				<Container fluid >
                    <LinkContainer to='/'>
					    <Navbar.Brand className="hover:text-amber-400 hover:font-bold text-2xl text-amber-200" href='/'>PySquad</Navbar.Brand>
                    </LinkContainer>
					<Navbar.Toggle aria-controls='navbarScroll' />
					<Navbar.Collapse id='navbarScroll'>
					<SearchBox />
						<Nav className='my-2 my-lg-0 ms-auto p-1 gap-5 ' navbarScroll>
                            <LinkContainer to='/newpost'>
                                <Nav.Link className="hover:text-amber-500 text-amber-200"> <i class="fa-solid fa-plus"></i> New post </Nav.Link>
                            </LinkContainer>
							{userInfo?.user?.isStaff && (
								<NavDropdown title={`Admin panel`} id='adminmenu' className="admin-nav">
									<LinkContainer to= '/admin/categoriesList'>
										<NavDropdown.Item className="hover:text-amber-400"><i class="fa-solid fa-list"></i> Categories</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/userlist'>
										<NavDropdown.Item className="hover:text-amber-400"><i class="fa-solid fa-user-group"></i> Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/postlist'>
										<NavDropdown.Item className="hover:text-amber-400"><i class="fa-solid fa-images"></i> Posts</NavDropdown.Item>
									</LinkContainer>
								
							</NavDropdown>
							)}

							{userInfo ? (
								<NavDropdown title={`Hello ${userInfo?.user?.username} !`} id='username' className="pr-5">
									<LinkContainer to='/profile'>
									<NavDropdown.Item className="hover:text-amber-400"><i class="fa-solid fa-address-card"></i> Account</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/myposts'>
									<NavDropdown.Item className="hover:text-amber-400"><i class="fa-solid fa-images"></i> My posts</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler} className="hover:text-amber-400"><i class="fa-solid fa-right-from-bracket"></i> Logout</NavDropdown.Item>
								</NavDropdown>
								) : (
								<>
									<LinkContainer to='/login' >
									<Nav.Link className="hover:text-amber-500 text-amber-200"><i class="fa-solid fa-right-to-bracket"></i> Sign in</Nav.Link>
									</LinkContainer>

									<LinkContainer to='/register' >
									<Nav.Link className="hover:text-amber-500 text-amber-200"><i class="fa-solid fa-right-to-bracket"></i> Sign up</Nav.Link>
									</LinkContainer>
								</>
								)}


						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
      );
}

export default Header;
