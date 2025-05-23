import { Router } from "express";
import { registerStudent,loginStudent,logoutStudent,refreshAccessToken } from "../controllers/student.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.route("/register").post(registerStudent);
router.route("/login").post(loginStudent);
router.route("/logout").post(verifyJWT,logoutStudent)
router.route("./refresh-access").post(refreshAccessToken)

export default router;
