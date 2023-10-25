import { Webhook } from "./webhook.entity";
import { AppDataSource } from "../../data-source";
import { IWebhook } from "./interface/service.interface";


export class WebhookService {

  static async getWebhookByPartner(partnerId: number, type: string): Promise<IWebhook | null> {
    const webhookRepository = AppDataSource.getRepository(Webhook);
    const webhook = await webhookRepository.findOneBy({partner_id: String(partnerId), name: type});
    return webhook;
  }

  static async findPartnerWebhook(partnerId: number): Promise<any> {
    const query = `SELECT 
        IFNULL(p.uuid, '') AS uuid,
        IFNULL(w.webhook_url, '') AS webhook_url,
        IFNULL(w.secret_key, '') AS secret_key
        FROM partners AS p
        LEFT JOIN webhooks AS w ON p.id = w.partner_id AND w.name = 'outward'
        WHERE p.id = ${partnerId} LIMIT 1`
        const transRepository = AppDataSource.getRepository(Webhook)
        const webhook = await transRepository.query(query)
        return webhook
  }

}
