import { useState,useEffect } from "react"
import { Button, Col, Form } from "react-bootstrap"
import FormContainer from "../Components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { savePaymentmethod } from "../slices/cartSlice"



const PaymentScreen = () => {
    const [paymentMethod,setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress} = cart;


    useEffect(() => {
        if(!shippingAddress){
            navigate('/shipping');
        }
    },[shippingAddress,navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentmethod(paymentMethod));
        navigate('/placeorder')
    }
  return (
    <FormContainer>
        <h1>Payment Methods</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                    <Form.Check
                        type="radio"
                        className="my-2"
                        label='PayPal or Credit Card'
                        id="Paypal"
                        name='paymentmethod'
                        value='Paypal'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </Col>
            </Form.Group>
            <Button type="submit" variant="primary">
                Continue
            </Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen