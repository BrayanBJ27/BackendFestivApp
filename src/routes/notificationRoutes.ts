import { Router } from 'express';
import { createNotificationsForOneYear, listNotifications } from '../controllers/notificationController';
import { sendPendingNotifications, sendSpecificNotification } from '../controllers/sendNotificationController';

const router = Router();

// Generate notifications
router.post('/generate', createNotificationsForOneYear);

// List notifications
router.get('/list', listNotifications);

// Send pending notifications
router.post('/send-pending', sendPendingNotifications);

// Send a specific test notification
router.post('/send-test', sendSpecificNotification);

export default router;