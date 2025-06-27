import { Application, Request, Response } from "express";
import photos from "./photoRouter";
import users from "./userRouter";

const routes = (app: Application): void => {
  
  app.route("/").get((req: Request, res: Response): void => {
    res.status(200).redirect("/docs");
  });

  app.use(
    users,
    photos
  );
};

export default routes;