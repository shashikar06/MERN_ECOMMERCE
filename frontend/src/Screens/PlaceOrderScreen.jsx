import { useEffect } from "react"
import { Button, Card, Col, ListGroup, Row, Image, ListGroupItem} from "react-bootstrap"
import {  useSelector, useDispatch } from "react-redux"
import { Link,useNavigate} from "react-router-dom"
import { toast } from "react-toastify"
import Message from "../Components/Message"
import Loader from "../Components/Loader"
import { useCreateOrderMutation } from "../slices/ordersApiSlice"
import { clearCartItems } from "../slices/cartSlice"

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    console.log(cart);

    const [createOrder, {isLoading, error}] = useCreateOrderMutation();

    useEffect(() => {
        if(!cart.shippingAddress.address){
            navigate('/shipping')
        }else if(!cart.paymentMethod){
            navigate('/payment')
        }
    },[cart.paymentMethod,cart.shippingAddress.address,navigate])

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod:cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice:cart.shippingPrice,
                taxPrice:cart.taxPrice,
                totalPrice:cart.totalPrice
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            toast.error(error);
        }
    }
  return (
    <Row>
        <Col md={8}>
            <ListGroup variant="flush">
                <h2>Shipping</h2>
                <p>
                    <strong>Address</strong> :
                   {cart.shippingAddress.address},{cart.shippingAddress.city} { ''} 
                   {cart.shippingAddress.postalCode}, {' '}
                   {cart.shippingAddress.country}
                </p>
            </ListGroup>
            <ListGroup.Item>
                <h2>Payment Method</h2>
                <strong>Method :</strong> 
                {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
                <h2>Order Items</h2>
                {cart.cartItems.length === 0 ? (
                    <Message>Your Cart is empty</Message>
                ) : (
                    <ListGroup variant="flush">
                        {cart.cartItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col>
                                        <Link to={`products/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </ListGroup.Item>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
                <ListGroupItem>
                    <h2>Order Summary</h2>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col>Items:</Col>
                        <Col>${cart.itemsPrice}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col>Shipping:</Col>
                        <Col>${cart.shippingPrice}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col>Tax:</Col>
                        <Col>${cart.taxPrice}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col>Total:</Col>
                        <Col>${cart.totalPrice}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    { error && <Message variant='danger'>{error}</Message>}
                </ListGroupItem>

                <ListGroupItem>
                    <Button
                        type="button"
                        className="btn-block"
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}>Place Order
                        {isLoading && <Loader />}
                        </Button>
                </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
    </Row>
  )
}

export default PlaceOrderScreen