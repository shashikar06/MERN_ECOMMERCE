
import { useParams,useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem,Form } from 'react-bootstrap'
import Loader from '../Components/Loader'
import Rating from '../Components/Rating'
import Message from '../Components/Message'
import { useGetProductDetailsQuery } from '../slices/productApiSlice'
import { useState } from 'react'
import { addToCart } from '../slices/cartSlice'
import { useDispatch } from 'react-redux'

const ProductScreen = () => {

    
const { id: productId} = useParams();
const dispatch = useDispatch();
const navigate = useNavigate();

const [qty,setQty] = useState(1);



const { data: product, isLoading,error} = useGetProductDetailsQuery(productId)

const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}));
    navigate('/cart');
}
    
  return (
    <div>
        <Link className='btn btn-light my-3' to='/'>Go Back</Link>
        {isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error?.data?.message}</Message>) : (
            <div>

            <Row>
            <Col md={5}>
                <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <p>Description: ${product.description}</p>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3}>
             <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <Row>
                            <Col>price</Col>
                            <Col>
                                <strong>${product.price}</strong>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Status</Col>
                            <Col>
                                <strong>{product.countInStock > 0 ? 'In Stock' : 'out of stock'}</strong>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                        <ListGroupItem>
                            <Row>
                                <Col>Qty</Col>
                                <Col>
                                    <Form.Control as='select'
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}>
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                               {x + 1}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    )}
                    <ListGroupItem>
                        <Button className='btn-block' type='button' disabled={product.countInStock === 0}
                        onClick={addToCartHandler}>
                            Add To Cart
                        </Button>
                    </ListGroupItem>
                </ListGroup>
             </Card>
            </Col>
        </Row>
            </div>
        )}
    </div>
  )
}

export default ProductScreen