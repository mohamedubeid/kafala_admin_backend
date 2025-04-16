import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TweetSMSService {
  private apiUrl = 'https://tweetsms.ps/api.php';
  private apiKey = process.env.TWEETSMS_API_KEY;
  private sender = process.env.TWEETSMS_SENDER;

  async sendSMS(to: string, message: string) {
    const params = {
      comm: 'sendsms',
      api_key: this.apiKey,
      to,
      message,
      sender: this.sender,
    };

    try {
      const response = await axios.get(this.apiUrl, { params });
      return {
        success: true,
        response: response.data,
      };
    } catch (error) {
      console.error('SMS Error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
