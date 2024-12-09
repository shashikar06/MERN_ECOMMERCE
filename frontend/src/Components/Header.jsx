import React from 'react'
import { Badge,Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/logo.png'
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice'
import { Link, useNavigate } from 'react-router-dom';




const Header = () => {
    const { cartItems} = useSelector((state) => state.cart);
    const {userInfo} = useSelector((state) => state.auth)
    console.log(userInfo)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApicall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApicall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }
    
    

  return (
    <header>
        
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
            <Container>
                <Navbar.Brand href='/'>
                <img src={logo} alt='ProShop ' />
                ProShop
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <Nav.Link href='/cart'>
                        <FaShoppingCart /> Cart
                        {
                            cartItems.length > 0 && (
                                <Badge pill bg='success' style={{marginLeft:'5px'}}>
                                    { cartItems.reduce((a,c) => a + c.qty,0)}
                                </Badge>
                            )
                        }
                        </Nav.Link>
                        
                        { userInfo ?  (
                              <>
                              <NavDropdown title={userInfo.name} id='username'>
                                <NavDropdown.Item as={Link} to='/profile'>
                                  Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={logoutHandler}>
                                  Logout
                                </NavDropdown.Item>
                              </NavDropdown>
                            </>
                        ) : (<Nav.Link href='/login'><FaUser /> Sign In</Nav.Link>)}
                        
                        { userInfo && userInfo.isAdmin && (
                              <>
                              <NavDropdown title='Admin' id='username'>
                              <NavDropdown.Item as={Link} to='/admin/productlist'>
                                  Products
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to='/admin/orderlist'>
                                  Orders
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to='/admin/userlist'>
                                  Users
                                </NavDropdown.Item>
                                
                              </NavDropdown>
                            </>
                        )  }
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header