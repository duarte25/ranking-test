import UserController from '../controllers/userController';
import { wrapException } from '../utils/wrapException';
import express from 'express';

const router = express.Router();

router
.get("/users", wrapException(UserController.listUserController))
.get("/users/first_rank", wrapException(UserController.findFirstRankUser))
.get("/users/:id", wrapException(UserController.findUser))
  .post("/users", wrapException(UserController.createUserController))
  .patch("/users/:id", wrapException(UserController.alterUser))
// .delete("/users/:id", wrapException(UserController.deleteUser))

export default router;
