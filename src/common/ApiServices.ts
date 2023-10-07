import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { QueryAcct } from '../features/merchant/interface/merchant.interface';
import {  CreateMerchantPayload, MerchantInfo, SubMerchantPayload } from "../features/merchant/interface/merchant.interface"
import { error } from 'console';
import { url } from 'inspector';



export class ApiServices {
  static async merchantQuery<T>({timestamp, account_number, sign}): Promise<T | any > {

    try {
      const url = process.env.QUERY_ACCT_URL as string;
      const channel = process.env.CHANNEL_NO as string
      const institution_number = process.env.INSTITUTION_NUMBER as string
      const bank_number = process.env.BANK_NUMBER as string

      const payload = {institution_number, channel, bank_number, account_number, timestamp, sign }

      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI2Mjc3NDdhYy03YmI0LTQxZDctOGI5OC03NTZmMWQwMjVhMGQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMjc5YzdiMWItYmEwNi00MjdiLWE2ODEtYzhhNTQ5MmQyOTNkL3YyLjAiLCJpYXQiOjE2OTY1MTMwMjAsIm5iZiI6MTY5NjUxMzAyMCwiZXhwIjoxNjk2NTE2OTIwLCJhaW8iOiJFMkZnWU1nb2NtaWFFSDU3aWtIampGMHRpeXhYV0dwRjdQTys5cmdwYUdiYi9weS92M1VCIiwiYXpwIjoiNjI3NzQ3YWMtN2JiNC00MWQ3LThiOTgtNzU2ZjFkMDI1YTBkIiwiYXpwYWNyIjoiMSIsInJoIjoiMC5BWUlBRzN1Y0p3YTZlMEttZ2NpbFNTMHBQYXhIZDJLMGU5ZEJpNWgxYngwQ1dnMkNBQUEuIiwidGlkIjoiMjc5YzdiMWItYmEwNi00MjdiLWE2ODEtYzhhNTQ5MmQyOTNkIiwidXRpIjoid0FxWUF0cXR4RUdqaERrMlpoeUpBQSIsInZlciI6IjIuMCJ9.QODK7Wmw_zHXINU9yssvmkBXXv8sPMK0b-1-gxhgD2SsWpfi9qmpl0C_iZWbbaRh0reO1w35mm3jR6bBYeaX68XwX6RVqMiRqapXjrUifqYUnvgkIQUJdexjEenSqK38xEzhCfmFJFm8_JowjqAuEhbMTVLR80thnX3cTCF1iVNizmaKmf3NGIZzE0Aadm55QcN4I_xRiSSZJcl1ZMpS_ablhFsGc7OB2HZ_OEheEG8pDc3kFcxU-SZ4FPhsH2JZL53xF3S-eXVPHaDXE2mzX9EDyAJYi50eSk6fZuyy4k5uqwdtrl8-iIDcUKhZjWeKDcsdu40-244E_maPcaE9hw"
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response: AxiosResponse<any> = await axios.post(url, payload, { headers });
      const data = response.data;
      console.log(data)
      if (data.ReturnCode == "Success") {
        return data
      } else {
        throw new Error(`Error querying account ${data.ReturnMsg}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(`Axios Error: ${error.message}`);
        throw error
      } else {
        throw error;
      }
    }
  }

    static async createMerchant<T>(payload:CreateMerchantPayload): Promise<any> {
        try {

   
          const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI2Mjc3NDdhYy03YmI0LTQxZDctOGI5OC03NTZmMWQwMjVhMGQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMjc5YzdiMWItYmEwNi00MjdiLWE2ODEtYzhhNTQ5MmQyOTNkL3YyLjAiLCJpYXQiOjE2OTY1MTMwMjAsIm5iZiI6MTY5NjUxMzAyMCwiZXhwIjoxNjk2NTE2OTIwLCJhaW8iOiJFMkZnWU1nb2NtaWFFSDU3aWtIampGMHRpeXhYV0dwRjdQTys5cmdwYUdiYi9weS92M1VCIiwiYXpwIjoiNjI3NzQ3YWMtN2JiNC00MWQ3LThiOTgtNzU2ZjFkMDI1YTBkIiwiYXpwYWNyIjoiMSIsInJoIjoiMC5BWUlBRzN1Y0p3YTZlMEttZ2NpbFNTMHBQYXhIZDJLMGU5ZEJpNWgxYngwQ1dnMkNBQUEuIiwidGlkIjoiMjc5YzdiMWItYmEwNi00MjdiLWE2ODEtYzhhNTQ5MmQyOTNkIiwidXRpIjoid0FxWUF0cXR4RUdqaERrMlpoeUpBQSIsInZlciI6IjIuMCJ9.QODK7Wmw_zHXINU9yssvmkBXXv8sPMK0b-1-gxhgD2SsWpfi9qmpl0C_iZWbbaRh0reO1w35mm3jR6bBYeaX68XwX6RVqMiRqapXjrUifqYUnvgkIQUJdexjEenSqK38xEzhCfmFJFm8_JowjqAuEhbMTVLR80thnX3cTCF1iVNizmaKmf3NGIZzE0Aadm55QcN4I_xRiSSZJcl1ZMpS_ablhFsGc7OB2HZ_OEheEG8pDc3kFcxU-SZ4FPhsH2JZL53xF3S-eXVPHaDXE2mzX9EDyAJYi50eSk6fZuyy4k5uqwdtrl8-iIDcUKhZjWeKDcsdu40-244E_maPcaE9hw"
          const channel = process.env.CHANNEL_NO as string
          const institution_number = process.env.INSTITUTION_NUMBER as string
          const bank_number = process.env.BANK_NUMBER as string

          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          };
            const response:  AxiosResponse<any> = await axios.post("https://apitest.nibss-plc.com.ng/nqr/v2/Gateway/create_merchant", payload, {headers})
            const data = response.data;
            console.log(data)
            if (data.ReturnCode == "Success") {
            return data
          } else {
            throw new Error(`Error querying account ${data.ReturnMsg}`)
          }
        } catch (error:any) {
            console.log('from catch', error?.response?.data)
            throw error
        }
    }

    static async bindAccount<T>(payload: MerchantInfo): Promise<any> {

        try {
            const baseUrl = process.env.BASE_URL as string
            const http = axios.create({ baseURL: baseUrl })
            console.log(baseUrl)
            const response:  AxiosResponse<T, any> = await axios.post(" https://apitest.nibss-plc.com.ng/nqr/v2/Gateway/binding_collection_account", payload)
            console.log('from try', response?.data)
            return response
          } catch (error: any) {
            console.log('from catch', error?.response?.data)
            throw error
        }  
    }

    static async createSubMerchAccount<T>(payload: SubMerchantPayload): Promise<any> {
        try {
            const baseUrl = process.env.BASE_URL as string
            const http = axios.create({ baseURL: baseUrl })
            console.log(baseUrl)
            const response:  AxiosResponse<T, any> = await axios.post("https://apitest.nibss-plc.com.ng/nqr/v2/Gateway/create_sub_merchant", payload)
            console.log('from try', response?.data)
            return response
          } catch (error: any) {
            console.log('from catch', error?.response?.data)
            throw error
        }  
    }

    static async getMerchTxnRecord<T>(payload): Promise<any> {
      try {
        const baseUrl = process.env.BASE_URL as string
        const http = axios.create({ baseURL: baseUrl })
            console.log(baseUrl)
            const response:  AxiosResponse<T, any> = await axios.post("https://apitest.nibss-plc.com.ng/nqr/v2/Gateway/query_mer_transaction", payload)
            console.log('from try', response?.data)
            return response
      } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`Axios Error: ${error.message}`)
            throw new Error(`Axios Error: ${error.message}`);
          } else {
            throw error;
      }
    }
  }

  static async createMerchantsInBatch<T>(payload): Promise<any> {
     try {
       const baseUrl = process.env.BASE_URL as string
       const http = axios.create({ baseURL: baseUrl })
          console.log(baseUrl)
          const response:  AxiosResponse<T, any> = await axios.post("https://apitest.nibss-plc.com.ng/nqr/v2/Gateway/batch_create_merchant", payload)
          console.log('from try', response?.data)
          return response
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(`Axios Error: ${error.message}`)
          throw new Error(`Axios Error: ${error.message}`);
          } else {
            throw error;
      }
    }
  }

  static async createSubMerchantsInBatch<T>(payload): Promise<any> {
    try {
      const baseUrl = process.env.BASE_URL as string
      const http = axios.create({ baseURL: baseUrl })
         console.log(baseUrl)
         const response:  AxiosResponse<T, any> = await axios.post("https://apitest.nibss-plc.com.ng/nqr/v2/Gateway/batch_create_sub_merchant", payload)
         console.log('from try', response?.data)
         return response
     } catch (error) {
       if (axios.isAxiosError(error)) {
         console.log(`Axios Error: ${error.message}`)
         throw new Error(`Axios Error: ${error.message}`);
         } else {
           throw error;
     }
   }
 }
}