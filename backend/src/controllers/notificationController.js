const { Notification, Task } = require('../models');

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      include: [{ model: Task, attributes: ['id', 'title'] }],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!notif) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Notification not found' });

    notif.isRead = true;
    await notif.save();
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
