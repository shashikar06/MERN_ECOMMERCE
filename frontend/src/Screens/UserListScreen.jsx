import React from 'react'

import { Button, Table } from 'react-bootstrap'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { FaTimes, FaTrash,FaEdit,FaCheck } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useDeleteUserMutation, useGetUsersQuery } from '../slices/usersApiSlice'
import { toast } from 'react-toastify'


const UserListScreen = () => {

    const {data:users, refetch,isLoading,error} = useGetUsersQuery();

    const [deleteUser, { isLoading: loadingDelete}] = useDeleteUserMutation();


    const deleteHandler = async (id) => {
       if(window.confirm('Are you sure>')){
        try {
            await deleteUser(id);
            toast.success('User Deleted');
            refetch();
        } catch (err) {
            toast.error(err?.data?.Message || err.error)
        }
       }
    }
  return (
    <div>
        <h1>USERS</h1>
        {loadingDelete && <Loader />}
        {
            isLoading ? <Loader /> :error ? <Message variant='danger'>{error}</Message> : (
                <Table striped  hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>DETAILS</th>
                        </tr>
                    </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.emil}`}>{user.email}</a></td>
                                    <td>{user.isAdmin ? (
                                        <FaCheck style={{color: 'green'}} />
                                    ) : (
                                        <FaTimes style={{color : 'red'}} />
                                    )}</td>
                                    
                                    
                                    <td>
                                        <Link to={`/admin/user/${user._id}/edit`} className='btn btn-sm'><FaEdit /></Link>
                                        <Button variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(user._id)}
                                            >
                                            <FaTrash style={{ color : 'white'}}/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    
                </Table>
            )
        }
    </div>
  )
}

export default UserListScreen