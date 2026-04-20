import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import intervalsRouter from "./intervals";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/chat", chatRouter);
router.use("/intervals", intervalsRouter);

export default router;
