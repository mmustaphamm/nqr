import axios, { AxiosResponse } from 'axios';
import { paymentRail, baseUrls } from "../config/kredi"

export class ApiServices {

  static readonly paymentBaseUrl: string = paymentRail.accounts[paymentRail.account]
  static readonly walletBaseUrl: string = baseUrls.userService

  static async getPartner(token: string, key: string): Promise<any> {
    const http = axios.create({
        baseURL: ApiServices.walletBaseUrl,
        headers: {
            Authorization: `Bearer ${token}`,
            'x-api-key': key
        }
    })
    return await http.get("api/v2/partner/ids");
  }

  static async nqrGateway<T>(payload, url: string): Promise<any> {

    try {
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiI2Mjc3NDdhYy03YmI0LTQxZDctOGI5OC03NTZmMWQwMjVhMGQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMjc5YzdiMWItYmEwNi00MjdiLWE2ODEtYzhhNTQ5MmQyOTNkL3YyLjAiLCJpYXQiOjE2OTgyMzYwMzIsIm5iZiI6MTY5ODIzNjAzMiwiZXhwIjoxNjk4MjM5OTMyLCJhaW8iOiJFMkZnWUxqU203TTd2cTNNV09tbWMzaG9lZWd0NzVlY0QxMFYyM01EU2srSlBjbytVQW9BIiwiYXpwIjoiNjI3NzQ3YWMtN2JiNC00MWQ3LThiOTgtNzU2ZjFkMDI1YTBkIiwiYXpwYWNyIjoiMSIsInJoIjoiMC5BWUlBRzN1Y0p3YTZlMEttZ2NpbFNTMHBQYXhIZDJLMGU5ZEJpNWgxYngwQ1dnMkNBQUEuIiwidGlkIjoiMjc5YzdiMWItYmEwNi00MjdiLWE2ODEtYzhhNTQ5MmQyOTNkIiwidXRpIjoiRGdnZHVrRThaa3VnR2s0UWtXMHpBQSIsInZlciI6IjIuMCJ9.pdJNV8sxJWML4IVNv1iU7LtXpFg4rPbnUFUD8na_bPlrdgfKfd6SawQNHKquh1jaOI8sx1Gf5NGkaawSSoNKVUVeXkM4ok8JTExocT3ALjoC-xZE_KSWAFG7of7AKcyZWCHBW_KOVQEItYYCUv5o4-rXmxak25rW7i8oNlfJf8_p8hGpRW9qbuCDweZL2yDYQSK_peLBRb_LZ5Y8KOCy590sMCJXO2xOULKUNP2WT5VD6E_pIVwpC9zjoGD0e0Huzd_Hw4jZM6Z1dmcmNZRtPaswkjHPldQPI7MYjGKNTXe_wyuzPU4oD2zJgucOvk2XzBZiBy_NJiFosWgcuDZ_jQ"
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          };
         const response:  AxiosResponse< any> = await axios.post(url, payload, { headers })
         console.log(response.data)
         console.log(response.status)
            return response
     }   catch (error:any) {
           console.log('from catch', error?.response?.data)
           return error
   }
  }

  static async sendWebookNotification<T>(url: string, payload: object, signatureKey: string): Promise<AxiosResponse<T>> {
    const http = axios.create({
        headers: {
            'signature-key': signatureKey
        }
    })
    const response: AxiosResponse<T, any> = await http.post(url, payload);
    return response
  }

}