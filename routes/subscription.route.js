import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post('/', (req, res) => {
    res.send({ title: 'Create a subscription' });
});

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
