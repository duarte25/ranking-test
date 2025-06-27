import ScoreController from '../controllers/scoreController';
import { wrapException } from '../utils/wrapException';
import express from 'express';

const router = express.Router();

router
  .get("/scores", wrapException(ScoreController.listScoresController))
  .get("/scores/:id", wrapException(ScoreController.findScore))
  .post("/scores", wrapException(ScoreController.createPontuacaoController))
  .patch("/scores/:id", wrapException(ScoreController.alterScore))
// .delete("/scores/:id", wrapException(UserController.deleteUser))

export default router;
