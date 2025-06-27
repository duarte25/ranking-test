import ScoreController from '../controllers/scoreController';
import { wrapException } from '../utils/wrapException';
import express from 'express';

const router = express.Router();

router
  .get("/scores", wrapException(ScoreController.listScoresController))
// .get("/scores/:id", wrapException(UserController.findUser))
// .post("/scores", wrapException(UserController.createUserController))
// .patch("/scores/:id", wrapException(UserController.alterUser))
// .delete("/scores/:id", wrapException(UserController.deleteUser))

export default router;
