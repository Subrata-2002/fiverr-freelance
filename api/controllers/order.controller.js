import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {

    const stripe = new Stripe(process.env.STRIPE);

    const gig = await Gig.findById(req.params.id);

    const customer = await stripe.customers.create({
        name: 'Jenny Rosen',
        address: {
            line1: 'Old Egara',
            postal_code: '713347',
            city: 'Raniganj',
            state: 'WB',
            country: 'US',
        },
    });
    // console.log("The customer id is " + customer.id);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: gig.price * 100,
        currency: "usd",
        description: gig.desc,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
        customer: customer.id,
    },

    );

    const newOrder = new Order({
        gigId: gig._id,
        img: gig.cover,
        title: gig.title,
        buyerId: req.userId,
        sellerId: gig.userId,
        price: gig.price,
        payment_intent: paymentIntent.id,

    });

    await newOrder.save();
    // console.log("IN order controller the order details are " + newOrder);

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    })
}
// export const createOrder = async (req, res, next) => {

//     try {

//         const gig =await Gig.findById(req.params.gigId);
//         const newOrder = new Order({
//             gigId: gig._id,
//             img: gig.cover,
//             title: gig.title,
//             buyerId: req.userId,
//             sellerId: gig.userId,
//             price: gig.price,
//             payment_intent: "temporary"

//         })

//         await newOrder.save();
//         res.status(200).send("Successful...");

//     } catch (error) {
//         next(error)
//     }
// }

export const getOrders = async (req, res, next) => {

    try {
        const orders = await Order.find({
            ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
            isCompleted: true
        })

        res.status(200).send(orders);
    } catch (error) {
        next(error)
    }
};

export const confirm = async (req, res, next) => {

    try {
        const orders = await Order.findOneAndUpdate({
            payment_intent: req.body.payment_intent,
        }, {
            $set: {
                isCompleted: true,
            }
        });
        // console.log(req.body.payment_intent);
        // console.log("you are in order controller and your updated order is \n " + orders);

        res.status(200).send("Order has been confirmed!");
    } catch (error) {
        next(error)
    }
}