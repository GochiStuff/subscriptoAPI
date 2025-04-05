import { Router } from "express";

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.send({ title: 'Get all users' });
});

userRouter.get('/:id', (req, res) => {
    res.send({ title: `This is the user ${req.params.id}` });
});

userRouter.post('/', (req, res) => {
    res.send({ title: 'Create a user' });
});

userRouter.put('/:id', (req, res) => {
    res.send({ title: `Update user ${req.params.id}` });
});

userRouter.delete('/:id', (req, res) => {
    res.send({ title: `Delete user ${req.params.id}` });
});

export default userRouter;
