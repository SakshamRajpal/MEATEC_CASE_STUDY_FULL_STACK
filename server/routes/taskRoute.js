import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateSubTaskStage,
  updateTask,
  updateTaskStage,
} from "../controllers/taskController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow all authenticated users to create their own tasks
router.post("/create", protectRoute, createTask);

// Only admins can duplicate or manage other users' tasks
router.post("/duplicate/:id", protectRoute, duplicateTask);

// Anyone logged in can post activity for their own task
router.post("/activity/:id", protectRoute, postTaskActivity);

// Dashboard stats can be admin-only if you want
router.get("/dashboard", protectRoute, dashboardStatistics);

// Regular users should see their own tasks
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

// Subtasks can be created by admins or possibly by users too
router.put("/create-subtask/:id", protectRoute, createSubTask);

// Allow user to update their own task
router.put("/update/:id", protectRoute, updateTask);

// Allow stage updates for both admins and users
router.put("/change-stage/:id", protectRoute, updateTaskStage);
router.put("/change-status/:taskId/:subTaskId", protectRoute, updateSubTaskStage);

// Trash and delete can be admin-only
router.put("/:id", protectRoute, trashTask);
router.delete("/delete-restore/:id?", protectRoute, deleteRestoreTask);

export default router;
