import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { registerClub, deleteClub, searchClub, updateClub } from "../controllers/club.controller";

const router = Router();

router
  .route("/register-club")
  .post(upload.fields([{ name: "logo", maxCount: 1 }]), registerClub);

router.route("/delete-club").delete(deleteClub);

router.route("/find-clubs").get(searchClub)

router.route("/update-club/:id").post(upload.fields([{name: "logo", maxCount: 1}]) ,updateClub)


export default router;
