import { Router } from "express";
import { PostController } from "../controllers";
import upload from "../middlewares/multer";

const router = Router();

router.post("/", upload.single("image"), PostController.create);
router.put("/:id", upload.single("image"), PostController.update);
router.get("/:id", PostController.findById);
router.delete("/:id", PostController.delete);

export default router;
