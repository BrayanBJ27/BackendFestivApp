import dayjs from 'dayjs';
import { RowDataPacket } from 'mysql2';
import { localPool } from '../config/db';
import { NotificationAtlas, NotificationLocal } from '../models/notificationModel';

interface IFestival extends RowDataPacket {
  id_festival: number;
  name_Festival: string;
  start_date: string;
}

export async function generateUpcomingNotifications(): Promise<number> {
  try {
    // Calculate date one year from now
    const oneYearLater = dayjs().add(1, 'year').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    
    console.log(`🔍 Searching for festivals between ${today} and ${oneYearLater}`);

    // Query MySQL: festivals starting from today to one year later
    const [festivals] = await localPool.query<IFestival[]>(`
      SELECT id_festival, name_Festival, start_date
      FROM Festivals
      WHERE start_date <= ? AND start_date >= CURDATE()
    `, [oneYearLater]);

    console.log(`📅 Found ${festivals.length} upcoming festivals`);
    
    if (festivals.length === 0) {
      console.log('⚠️ No upcoming festivals found in the date range');
      return 0;
    }

    let count = 0;
    // For each festival found
    for (const fest of festivals) {
      console.log(`🎭 Processing festival: ${fest.name_Festival} (ID: ${fest.id_festival}) - Start date: ${fest.start_date}`);
      
      // Check for duplicates
      const existingQuery = { festivalId: fest.id_festival };
      const existingLocal = await NotificationLocal.findOne(existingQuery);
      
      console.log(`🔍 Checking for existing notification: ${existingLocal ? 'FOUND' : 'NOT FOUND'}`);

      if (!existingLocal) {
        const notifData = {
          festivalId: fest.id_festival,
          message: `🎭 The Festival "${fest.name_Festival}" start the ${fest.start_date}`,
          createdAt: new Date(),
          status: 'pending',
        };

        console.log(`📝 Creating notification: ${notifData.message}`);

        try {
          // Create notification in local MongoDB
          const localResult = await NotificationLocal.create(notifData);
          console.log(`✅ Local notification created with ID: ${localResult._id}`);
          
          // Try to create in Atlas if available
          try {
            const atlasResult = await NotificationAtlas.create(notifData);
            console.log(`✅ Atlas notification created with ID: ${atlasResult._id}`);
          } catch (atlasError) {
            console.error('❌ Error creating notification in Atlas:', atlasError);
          }
          
          count++;
        } catch (dbError) {
          console.error('❌ Database error creating notification:', dbError);
        }
      }
    }
    
    console.log(`✅ Created ${count} new notifications`);
    return count;
  } catch (error) {
    console.error('❌ Error in generateUpcomingNotifications:', error);
    throw error;
  }
}
