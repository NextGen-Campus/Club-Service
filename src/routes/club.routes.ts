import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { registerClub, deleteClub } from "../controllers/club.controller";

const router = Router();

router
  .route("/register-club")
  .post(upload.fields([{ name: "logo", maxCount: 1 }]), registerClub);

router.route("/delete-club").delete(deleteClub);

export default router;
