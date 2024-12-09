import { Button, Col, Row, Table,   } from "react-bootstrap"
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa"
import Message from "../Components/Message"
import Loader from "../Components/Loader"
import { useGetProductsQuery,useCreateProductMutation, useDeleteProductMutation } from "../slices/productApiSlice"
import { Link } from "react-router-dom"
import {toast} from 'react-toastify'


const ProductListScreen = () => {
    const {data:products, isLoading,error,refetch} = useGetProductsQuery();
    
    const[createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();
    
    const [deleteProduct, { isLoading: loadingDelete }]= useDeleteProductMutation();
    const deleteHandler =  async (id) => {
        if(window.confirm('Are you sure?')){
            try {
                await deleteProduct(id);
                toast.success('Product deleted')
                refetch();
            } catch (error) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    const createProductHandler = async() =>{
        if(window.confirm('Are yu sure want to create a new product?')){
            try {
                await createProduct();
                
                refetch();

            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }
  return (
    <div>
        <Row>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className="text-end">
                <Button className="btn-sm m-3" onClick={createProductHandler}>
                    <FaEdit /> Create Product
                </Button>
            </Col>
        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}

        {isLoading ? <Loader /> : error ? <Message variant='danger'></Message> : 
        (
            <>
                <Table striped hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td> 
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <Link to={`/admin/product/${product._id}/edit`} className='btn btn-primary mx-2'>
                                            <FaEdit />
                                        </Link>
                                        <Button variant='danger' className="btn" onClick={() => deleteHandler(product._id)}><FaTrash style={{color: 'white'}}/></Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>

                </Table>
            </>
        )}
    </div>
  )
}

export default ProductListScreen