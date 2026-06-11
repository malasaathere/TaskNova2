const router = require('express').Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { authenticate, checkPasswordReset } = require('../middleware/auth');

router.use(authenticate, checkPasswordReset);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
