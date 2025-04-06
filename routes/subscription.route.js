import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post('/:id', authorize , createSubscription);

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: `This is the subscription ${req.params.id}` });
});

subscriptionRouter.put('/:id', (req, res) => {
    res.send({ title: `Update subscription ${req.params.id}` });
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({ title: `Delete subscription ${req.params.id}` });
});

subscriptionRouter.get('/', (req, res) => {
    res.send({ title: 'Get all subscriptions' });
});

subscriptionRouter.get('/user/:id', (req, res) => {
    res.send({ title: `Get all subscriptions for user ${req.params.id}` });
});

subscriptionRouter.put('/user/:id', (req, res) => {
    res.send({ title: `Update a subscription for user ${req.params.id}` });
});

subscriptionRouter.delete('/user/:id', (req, res) => {
    res.send({ title: `Delete a subscription for user ${req.params.id}` });
});

export default subscriptionRouter;
