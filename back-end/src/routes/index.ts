import logRoutes from "../middlewares/logRoutesMiddleware";
import { Application, Request, Response } from "express";
import photos from "./photoRouter";
import score from "./scoreRouter";
import users from "./userRouter";

const routes = (app: Application): void => {

  app.use(logRoutes);

  app.route("/").get((req: Request, res: Response): void => {
    res.status(200).redirect("/docs");
  });

  app.use(
    users,
    photos,
    score
  );
};

export default routes;