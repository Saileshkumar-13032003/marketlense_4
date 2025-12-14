const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const ctrl = require("../controllers/adminController");
const logController = require('../controllers/logController');
const notificationController = require('../controllers/notificationController'); 
const adminProfileController = require('../controllers/adminProfileController');

router.get("/users", auth, admin, ctrl.getUsers);
router.put("/block/:id", auth, admin, ctrl.blockUser);
router.put("/unblock/:id", auth, admin, ctrl.unblockUser);
router.put("/verify/:id", auth, admin, ctrl.verifyUser);
router.put("/make-admin/:id", auth, admin, ctrl.makeAdmin);
router.delete("/delete/:id", auth, admin, ctrl.deleteUser);
router.get("/logs", auth, admin, logController.getLogs);
router.get('/notifications', auth, admin, notificationController.getNotifications); 
router.put('/notifications/mark-read/:id', auth, admin, notificationController.markAsRead);
router.get('/profile', auth, admin, adminProfileController.getAdminProfile);
router.put('/profile', auth, admin, adminProfileController.updateAdminProfile);

module.exports = router;
