export interface IWebhook {
    id: number
    partner_id: string
    user_id: string
    name: string
    secret_key: string,
    webhook_url: string,
    created_at?: Date | null,
    updated_at?: Date | null
  };