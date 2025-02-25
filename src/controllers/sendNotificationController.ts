import { Request, Response } from 'express';
import { NotificationLocal } from '../models/notificationModel';
import { sendPushNotification } from '../service/pushNotificationService';

export const sendPendingNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find pending notifications
    const pendingNotifications = await NotificationLocal.find({ status: 'pending' });
    
    if (pendingNotifications.length === 0) {
      res.json({ message: 'No pending notifications to send' });
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    // Process each notification
    for (const notification of pendingNotifications) {
      try {
        // Extract title and message (assuming the message contains both)
        const title = `FestivApp Event`;
        const body = notification.message;
        
        // Send push notification
        await sendPushNotification(title, body);
        
        // Update notification status
        notification.status = 'sent';
        await notification.save();
        
        successCount++;
      } catch (error) {
        console.error(`Error sending notification ${notification._id}:`, error);
        failCount++;
      }
    }
    
    res.json({
      message: `Processed ${pendingNotifications.length} notifications`,
      success: successCount,
      failed: failCount
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Error sending notifications' });
  }
};

// For sending a specific notification (useful for testing)
export const sendSpecificNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body } = req.body;
    
    if (!title || !body) {
      res.status(400).json({ error: 'Title and body are required' });
      return;
    }
    
    const result = await sendPushNotification(title, body);
    res.json({ 
      message: 'Notification sent', 
      successCount: result?.successCount || 0,
      failureCount: result?.failureCount || 0
    });
  } catch (error) {
    console.error('Error sending specific notification:', error);
    res.status(500).json({ error: 'Error sending notification' });
  }
};