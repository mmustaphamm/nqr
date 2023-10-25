"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const webhook_entity_1 = require("./webhook.entity");
const data_source_1 = require("../../data-source");
class WebhookService {
    static getWebhookByPartner(partnerId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookRepository = data_source_1.AppDataSource.getRepository(webhook_entity_1.Webhook);
            const webhook = yield webhookRepository.findOneBy({ partner_id: String(partnerId), name: type });
            return webhook;
        });
    }
    static findPartnerWebhook(partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT 
        IFNULL(p.uuid, '') AS uuid,
        IFNULL(w.webhook_url, '') AS webhook_url,
        IFNULL(w.secret_key, '') AS secret_key
        FROM partners AS p
        LEFT JOIN webhooks AS w ON p.id = w.partner_id AND w.name = 'outward'
        WHERE p.id = ${partnerId} LIMIT 1`;
            const transRepository = data_source_1.AppDataSource.getRepository(webhook_entity_1.Webhook);
            const webhook = yield transRepository.query(query);
            return webhook;
        });
    }
}
exports.WebhookService = WebhookService;
