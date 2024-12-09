import { useState,useEffect } from "react"
import { Button, Col, Form, Row, Toast } from "react-bootstrap"
import { Link,useLocation,useNavigate } from "react-router-dom"
import FormContainer from "../Components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../Components/Loader"

import { setCredentials } from "../slices/authSlice"
import {toast} from 'react-toastify'
import { useRegisterMutation } from "../slices/usersApiSlice"

const RegisterScreen = () => {
    const [name,setName]= useState('')
    const [email,setEmail]= useState('')
    const [password,setPassword] = useState('')
   // const [confirmPassword,setConfirmPassword] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();
    
    const {userInfo} = useSelector((state) => state.auth)

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/'

   
    
    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const res = await register({name,email,password}).unwrap();
            dispatch(setCredentials({...res,}));
            navigate(redirect);

        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
        
    }

  return (
   <FormContainer>
    <h1>Sign Up</h1>

        <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}>

                </Form.Control>
            </Form.Group>
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
                Already Customer? <Link to='/login'>Login</Link>
            </Col>
        </Row>
   </FormContainer>
  )
}

export default RegisterScreen;