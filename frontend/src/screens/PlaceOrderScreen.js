import {useEffect} from "react";
import {Button, Row, Col, ListGroup, Image, Card} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import {Link} from "react-router-dom"
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state=>state.cart);

    const {cartItems, shippingAddress, paymentMethod } = cart;

    cart.itemsPrice = cartItems.reduce((acc,item)=> acc + item.price*item.qty, 0 ).toFixed(2)
    cart.shippingPrice = cart.itemsPrice > 100 ? "0.00" : 100 ; 
    cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2))
    cart.totalPrice = Number(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);

    const orderCreate = useSelector(state=> state.orderCreate);

    const {order, success, error} = orderCreate;

    console.log("order = ");
    console.log(order);

    console.log("success= ");
    console.log(success);

    console.log("error= ");
    console.log(error);


    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems : cartItems, 
            shippingAddress, 
            paymentMethod, 
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice, 
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    }

    useEffect(()=>{
        if (success) navigate(`/order/${order._id}`);
    }, [navigate, success])

    return ( 
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address:</strong>
                                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </ListGroup.Item>


                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <strong>Items: </strong>
                            {cartItems.length ===0 ? <Message>Your cart is empty</Message>
                            :
                                <ListGroup variant="flush">
                                    {cartItems.map((item,index)=>(
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} x {item.price}(???) = {item.qty * item.price}(???)
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                        }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary:</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>{cart.itemsPrice}(???)</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>{cart.shippingPrice}(???)</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>{cart.taxPrice}(???)</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>{cart.totalPrice}(???)</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant="danger">{error}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button onClick={placeOrderHandler} type="button" className="btn-block" disabled={cartItems.length===0}>
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        
        </>
     );
}
 
export default PlaceOrderScreen;