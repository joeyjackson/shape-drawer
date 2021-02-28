import { Express } from "express";
import * as controllers from "./controllers/drawingControllers";

export const applyApiRoutes = (app: Express, baseApiPath: string = "/api") => {
  app.route(baseApiPath + "/drawings")
    .get(controllers.listDrawings)
    .put(controllers.editDrawingByName)
    .post(controllers.createDrawing)
  
  app.route(baseApiPath + "/drawings/:id")
    .get(controllers.getDrawing)
    .put(controllers.editDrawingById)
    .delete(controllers.deleteDrawing)
}