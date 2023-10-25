import { cache } from "../../loader/database/redis";
import { IPartnerData, IPartnerDetails, merchantData } from "./interface/service.interface";

export class Auth {
    public partnerData
    public webhook
    private partnerDetails: IPartnerDetails = {}

    constructor() {

    }

    async getAuthData(partnerId: number) {
        let data = this.partnerDetails[partnerId]
        if(!data){
            let data: IPartnerData = await cache.get(`tsq_${partnerId}`)
            this.partnerDetails[partnerId] = data
        }
        return data
    }

    async setAuthDetails(partnerId: number, partnerDetails: IPartnerData) {
        this.partnerDetails[partnerId] = partnerDetails
        cache.set(`tsq_${partnerId}`, partnerDetails)
    }
}