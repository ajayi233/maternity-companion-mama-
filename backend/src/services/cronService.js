import cron from "node-cron";
import User from "../models/User.js";
import mnotifyService from "./mnotifyService.js";
import axios from "axios";

class CronService {
  start() {
    // Run every Sunday at 9:00 AM
    cron.schedule("0 9 * * 0", async () => {
      console.log("📅 Running weekly baby insights SMS job...");
      await this.sendWeeklyInsights();
    });

    console.log("⏰ Cron job scheduled: Weekly SMS every Sunday at 9:00 AM");
  }

  async sendWeeklyInsights() {
    try {
      const users = await User.find({
        "pregnancyData.isPregnant": true,
        "pregnancyData.dueDate": { $exists: true },
      });

      console.log(`📱 Found ${users.length} pregnant users`);

      for (const user of users) {
        try {
          const insights = await this.getInsightsForUser(
            user.pregnancyData.dueDate
          );
          const message = `MAMA Weekly Update: ${insights.baby_this_week.substring(
            0,
            140
          )}...`;

          await mnotifyService.sendSMS(user.phone, message);
          console.log(`✅ SMS sent to ${user.phone}`);

          // Small delay between SMS
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(
            `❌ Failed to send SMS to ${user.phone}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.error("❌ Weekly insights cron job failed:", error);
    }
  }

  async getInsightsForUser(dueDate) {
    const date = new Date(dueDate);
    const dueMonth = date.getMonth() + 1;
    const dueYear = date.getFullYear();

    const response = await axios.post(
      "https://is3v3ljqmbprnlleccmwgsgu7e0kkumt.lambda-url.eu-west-1.on.aws/",
      {
        due_month: dueMonth,
        due_year: dueYear,
      }
    );

    return response.data.insights;
  }
}

export default new CronService();
