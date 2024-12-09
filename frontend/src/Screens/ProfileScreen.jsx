import React, { useEffect, useState } from 'react'
import { useProfileMutation } from '../slices/usersApiSlice'
import { Button, Col, Form, FormControl, Row, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { setCredentials } from '../slices/authSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'



const ProfileScreen = () => {
    const[name,setName] = useState('');
    const[email,setEmail] = useState('');
    const[password,setPassword]  = useState('');

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);

    const [updateProfile, {isLoading:loadingUpdateprofile}] = useProfileMutation();
    const {data: orders, isLoading, error} = useGetMyOrdersQuery();


    useEffect(() => {
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    },[userInfo,userInfo.name,userInfo.email])

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
           const res = await updateProfile({
            _id:userInfo._id,
            name,
            email,
            password
           }).unwrap();
           dispatch(setCredentials(res));
           toast.success('Profile updated successfully')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
    
  return (
    <Row>
        <Col md={3}>
            <h2>User Profiles</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <FormControl
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}>

                    </FormControl>
                </Form.Group>
                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email</Form.Label>
                    <FormControl
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}>

                    </FormControl>
                </Form.Group>
                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <FormControl
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>

                    </FormControl>
                </Form.Group>
                <Button type='sumbit' variant='success' className='my-2'>Update</Button>
            </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
            {isLoading ? <Loader /> : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>)
            : (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVARY</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>
                                        {
                                            order.isPaid ? (order.paidAt.substring(0,10)) : (<FaTimes style={{color : 'red'}}/>)
                                        }
                                    </td>
                                    <td>
                                        {
                                            order.isDelivered ? (order.deliveredAt.substring(0,10)) : (<FaTimes style={{color : 'red'}}/>)
                                        }
                                    </td>
                                    <td>
                                         
                                            <Link className='btn-sm' variant='light' to={`/order/${order._id}`}>Details</Link>
                                        
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            )
        }
        </Col>
    </Row>
  )
}

export default ProfileScreen