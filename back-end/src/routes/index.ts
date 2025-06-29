import { DeleteOrphanImages } from "../repositories/photoRepository";
import logRoutes from "../middlewares/logRoutesMiddleware";
import { Application, Request, Response } from "express";
import photos from "./photoRouter";
import score from "./scoreRouter";
import users from "./userRouter";
import cron from "node-cron";

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

  const scheduleOptions = { scheduled: true, timezone: "America/Porto_Velho" };
  cron.schedule("0 * * * *", async () => {
    await DeleteOrphanImages();
  }, scheduleOptions);

};

export default routes;