import { Request, Response } from 'express';
import { generateUpcomingNotifications } from '../service/notificationService';
import { NotificationLocal } from '../models/notificationModel';
import { sendPushNotification } from '../service/pushNotificationService';

export const createNotificationsForOneYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await generateUpcomingNotifications();
    res.json({ message: `Created ${count} notifications for upcoming festivals` });
  } catch (error) {
    console.error('Error generating notifications:', error);
    res.status(500).json({ error: 'Error generating notifications' });
  }
};

export const listNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await NotificationLocal.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error listing notifications:', error);
    res.status(500).json({ error: 'Error listing notifications' });
  }
};

export const sendPendingNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find pending notifications
    const pendingNotifications = await NotificationLocal.find({ status: 'pending' });
    
    console.log(`Found ${pendingNotifications.length} pending notifications`);
    
    if (pendingNotifications.length === 0) {
      res.json({ message: 'No pending notifications to send' });
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    // Process each notification
    for (const notification of pendingNotifications) {
      try {
        console.log(`Processing notification: ${notification._id} - ${notification.message}`);
        
        // Extract title and message
        const title = `FestivApp Event`;
        const body = notification.message;
        
        // Send push notification
        const pushResult = await sendPushNotification(title, body);
        console.log(`Push notification sent, result:`, pushResult);
        
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending notifications:', errorMessage);
    res.status(500).json({ error: 'Error sending notifications', details: errorMessage });
  }
};