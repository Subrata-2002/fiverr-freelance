import React, { useEffect, useState } from 'react';
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from '../../utils/newRequest';
import { useParams } from 'react-router-dom';
import CheckoutForm from '../../components/checkoutForm/CheckoutForm';

const stripePromise = loadStripe("pk_test_51OTj8bSAIyfzUeCiXDbSmEkHME3KOaHHgTWyZ3G0kY1tdy8T0ktuw3u3QiAQZ2j1UMXcpVMP1tneqAUw5p715UbR00U1JPmYs5");

const Pay = () => {
    console.log('Pay component is rendering...');
    const [clientSecret, setClientSecret] = useState("");

    const { id } = useParams()

    // useEffect(() => {

    //     const makeRequest = async () => {
    //         console.log('Making request...\n');
    //         try {
    //             const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
    //             console.log("It is in Pay.jsx page and res.data.clientSecrect is "+ res.data.clientSecret);
    //             setClientSecret(res.data.clientSecret);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     makeRequest();
    // }, []);
    useEffect(() => {
        // console.log('Pay component is mounting...');

        const makeRequest = async () => {
            // console.log('Making request...\n');
            try {
                const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
                // console.log("It is in Pay.jsx page and res.data.clientSecrect is " + res.data.clientSecret);
                setClientSecret(res.data.clientSecret);
            } catch (error) {
                console.log(error);
            }
        };

        makeRequest();

        // Cleanup function (will log when the component is unmounted)
        return () => {
            console.log('Pay component is unmounting...');
        };
    }, []);  // Dependency array is intentionally left empty


    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };


    return (
        <div className='pay'>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    )
}

export default Pay
