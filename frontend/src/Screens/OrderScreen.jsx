import { Button, Card, Col,  Image, ListGroup, ListGroupItem, Row } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { useGetOrderDetailsQuery,usePayOrderMutation,useGetPayPalClientIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice";
import { PayPalButtons,usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";



const OrderScreen = () => {
  const {id: orderId} = useParams();

  const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
  const[deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
  const {
    data:paypal,
    isLoading:loadingPayPal,
    error:errorPayPal
  } = useGetPayPalClientIdQuery();

  const {userInfo} = useSelector((state) => state.auth)

  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type:'resetOptions',
          value: {
            'clientId' : paypal.clientId,
            currency:'USD',
          }
        });
        paypalDispatch({type:'setLoadingStatus',value:'pending'})
      }
      if(order && !order.isPaid){
        if(!window.paypal){
          loadPayPalScript();
        }
      }
    }
  },[order,paypal,paypalDispatch,loadingPayPal,errorPayPal])
  
  function onApprove(data,actions){
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({orderId, details});
        refetch();
        toast.success('Payment successful')
      } catch (err) {
        toast.error(err?.data?.message || err.message)
      }
    })
  }
  async function onApproveTest(){
    await payOrder({ orderId,details:{ payer: {}}});
    refetch();
    toast.success('Payment successful')
  }
  function onError(){
    toast.error(err.message);
  }
  function createOrder(data,actions){
    return actions.order.create({
      purchase_units:[
        {
          amount:{
            value:order.totalPrice
          }
        }
      ]
    })
      .then((orderId) => {
        return orderId;
      })
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order Delivered')
    } catch (error) {
      toast.error(err?.data?.message || err.message)
    }
  }
  
  
  return isLoading ? <Loader /> : error ? <Message variant='danger' />
  :(
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Name :</strong> {order.user.name}
              </p>
              <p>
                <strong>Email :</strong> {order.user.email}
              </p>
              <p>
                <strong>Address :</strong> 
                {order.shippingAddress.address}, {order.shippingAddress.city} {' '}
                {order.shippingAddress.postalCode}, {' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on { order.deliveredAt }
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Payment Method</h2>
              <p>
                <strong>
                  method
                  {order.paymentMethod}
                </strong>
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  paid on {order.paidAt}
                </Message>
              ) : (
                <Message variant='danger'>Not paid</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Order Items</h2>
              {order.orderItems.map ((item,index) => (
                <ListGroupItem key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroupItem>
            
          </ListGroup>
        </Col>
        <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <h2>Order Summary</h2>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>
                    <Row>
                      <Col>ShippingPrice</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                    <Row>
                      <Col>TaxPrice</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Total Price</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroupItem>
                  {
                    !order.isPaid && (
                      <ListGroupItem>
                        {loadingPay && <Loader />}

                        {isPending ? <Loader /> : (
                          <div>
                            <Button onClick={onApproveTest} style={{marginBottom:'10px'}}>Test pay Order</Button>
                            <div>
                              <PayPalButtons 
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                              >

                              </PayPalButtons>
                            </div>
                          </div>
                        )}
                      </ListGroupItem>
                    )
                  }
                  
                  {loadingDeliver && <Loader />}

                  {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroupItem>
                      <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>Mark As Delivered</Button>
                    </ListGroupItem>
                  )}

                </ListGroup>
              </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen