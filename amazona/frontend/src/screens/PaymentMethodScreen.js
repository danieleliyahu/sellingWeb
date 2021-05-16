import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheackoutSteps from '../components/CheackoutSteps'

const PaymentMethodScreen = (props) => {
    const cart = useSelector((state)=>state.cart);
    const {shippingAddress} = cart;
    if(!shippingAddress.address){
        props.history.push('/shipping')
    }
    const [paymentMethod, setPaymentMethod] = useState("Paypal");
    const dispatch = useDispatch();
    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        props.history.push('/placeorder')
    }
    return (
        <div>
            <CheackoutSteps step1 step2 step3></CheackoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Payment Method</h1>
                </div>
                <div>
                    <div>
                        <input type="radio" id="paypal" value="paypal" name="paymentMethod" required checked 
                        onChange={(e)=>setPaymentMethod(e.target.value)}></input>
                        <label htmlFor="paypal">Paypal</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input type="radio" id="stripe" value="stripe" name="paymentMethod" required  
                        onChange={(e)=>setPaymentMethod(e.target.value)}></input>
                        <label htmlFor="stripe">Stripe</label>
                    </div>
                </div>
                <div>
                    <button className="primary" type="submit">Continue</button>
                </div>
            </form>
        </div>
    )
}

export default PaymentMethodScreen
