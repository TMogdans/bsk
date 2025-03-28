import { AwardController } from "../controllers/awardController";
import { Router } from "express";

const awardRoutes = Router();
const awardController = new AwardController();

awardRoutes.get("/awards", awardController.getAwards.bind(awardController));
awardRoutes.get("/awards/:id", awardController.getAwardById.bind(awardController));
awardRoutes.post("/awards", awardController.createAward.bind(awardController));
awardRoutes.put("/awards/:id", awardController.updateAward.bind(awardController));
awardRoutes.delete("/awards/:id", awardController.deleteAward.bind(awardController));

export default awardRoutes;