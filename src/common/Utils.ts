import * as crypto from "crypto"

export class Utils {
    static async EncryptionService(payload): Promise<string>{
        try {

            const apiKey= process.env.SIGN_API_KEY as string
            console.log(apiKey)

            // Convert payload to a sorted, URL-encoded string
            const sortedPayload = Object.entries(payload)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

            // Combine sortedPayload with the API Key
            const stringToSign = `${sortedPayload}${apiKey}`;
            console.log(stringToSign)
            const md5Hash = crypto.createHash('md5').update(stringToSign).digest('hex');
            const signature = md5Hash.toUpperCase();
            return signature; 
        } catch (error) {
            console.log("error creating sign", error)
            return "Error creating signature"
        }  
    }
}