import axios from "axios";
import * as crypto from "crypto"

export class Utils {
    static async EncryptionService(payload): Promise<string> {

        try {

            const apiKey= process.env.SIGN_API_KEY as string

            // Convert payload to a sorted, URL-encoded string
            const sortedPayload = Object.entries(payload)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

            // Combine sortedPayload with the API Key
            const stringToSign = `${sortedPayload}${apiKey}`;
            const md5Hash = crypto.createHash('md5').update(stringToSign).digest('hex');
            const signature = md5Hash.toUpperCase();
            return signature; 
        } catch (error) {
            console.log("error creating sign", error)
            return "Error creating signature"
        }  
    }

    static async removePrefix(inputString: string, prefix: string) {
      if (inputString.startsWith(prefix)) {
        return inputString.slice(prefix.length);
      } else {
        return inputString;
      }
    }

      static async generateUniqueCode(length: number) {
        const characters = '0123456789';
        let code = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
        return code;
      }

      static async generateUniqueID() {
        // Get the current date (year and month)
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
        const uniqueCode = await Utils.generateUniqueCode(24); 
        const qrCodeID = `${year}${month}${uniqueCode}`;
      
        return qrCodeID;
      }

      static async generateRandomAlphaNumeric(length: number): Promise<string> {

        if (length < 1 || length > 99) {
          throw new Error('Invalid length. Length must be between 1 and 99.');
        }
      
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
      }

      static async FirstDigitInRange(amount: number): Promise<number> {
        const min = 1;
        const max = 99;
        return Math.min(max, Math.max(min, amount));
      }
      

       static async resetRoute(): Promise<any> {

        try {
          const data = {
            client_id: '627747ac-7bb4-41d7-8b98-756f1d025a0d',
            scope: '627747ac-7bb4-41d7-8b98-756f1d025a0d/.default',
            client_secret: 'uAs8Q~gk9Bgok_fXPeTqwqsJf93Dka7YRdNlFbbK',
            grant_type: 'client_credentials',
          };
          const apiUrl =  "https://apitest.nibss-plc.com.ng/v2/reset"
          const formData = new URLSearchParams();
          
          for (const key in data) {
            formData.append(key, data[key]);
          }
      
          const response = await axios.post(apiUrl, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'apiKey': 'LWZzkO2T4UbfRNT06BG0BqaQpdm1RwQs',
            },
          });
           console.log(response.data)
          return response.data;
        } catch (error:any) {
          throw new Error(`Failed to send POST request: ${error.message}`);
        }
      }
    
}