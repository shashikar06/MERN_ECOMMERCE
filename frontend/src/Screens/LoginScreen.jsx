import { useState,useEffect } from "react"
import { Button, Col, Form, Row, Toast } from "react-bootstrap"
import { Link,useLocation,useNavigate } from "react-router-dom"
import FormContainer from "../Components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../Components/Loader"
import { useLoginMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import {toast} from 'react-toastify'


const LoginScreen = () => {
    const [email,setEmail]= useState('')
    const [password,setPassword] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, {isLoading}] = useLoginMutation();
    const {userInfo} = useSelector((state) => state.auth)

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
          navigate(redirect);
        }
      }, [navigate, redirect, userInfo]);
    
    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const res = await login({email,password}).unwrap();
            
            dispatch(setCredentials({...res }));
            navigate(redirect);

        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
        
    }

  return (
   <FormContainer>
    <h1>Sign In</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>

                </Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">Sign In</Button>
        </Form>
        <Row className="py-3">
            <Col>
                New Customer? <Link to='/register'>Register</Link>
            </Col>
        </Row>
   </FormContainer>
  )
}

export default LoginScreen