import express from "express";

import { createChatResponse } from "../controllers/chat-controller.js";

const router = express.Router();

router.post("/", createChatResponse);

export { router as chatRouter };
