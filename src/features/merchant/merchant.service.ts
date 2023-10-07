import { AppDataSource } from "../../data-source";
import { CreateMerchant, SubMerchantInfo } from "./interface/merchant.interface";
import { Merchants } from "./merchant.entity";
import { SubMerchants } from "./submerchant.entity";

export class MerchantService {
    static async createMerchant(merchantDetails:CreateMerchant):Promise<Merchants> {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = userRepository.create(merchantDetails)
        if (!merchant) throw new Error("merchant could not be created");
        await userRepository.save(merchant);
        return merchant;
       
    }

    static async createSubMerchant(submerchantDetails:SubMerchantInfo):Promise<SubMerchants> {
        const userRepository = AppDataSource.getRepository(SubMerchants);
        const submerchant = userRepository.create(submerchantDetails)
        if (!submerchant) throw new Error("submerchant could not be created");
        await userRepository.save(submerchant);
        return submerchant;  
    }

    static async getMerchants():Promise<Merchants[]> {
        const merchantRepo = AppDataSource.getRepository(Merchants);
        const merchant = await merchantRepo.find({ });
        return merchant;
    }

    static async getMerchantbyAcctNo(account_number: string) {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { account_number }});
        return merchant;
    }

    static async getMerchantByEmail(email: string):Promise<Merchants | null> {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { email }});
        return merchant
    }

    static async getMerchantById(id: string):Promise<Merchants> {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { id}});
        if (!merchant || merchant == null) throw new Error("There is no merchant with that id")
        return merchant
    }

    static async getMerchantByTin(tin: string):Promise<Merchants | null> {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { tin }});
        return merchant
    }

    static async getSubMerchantbyMchNo(mch_no: string) {
        const userRepository = AppDataSource.getRepository(SubMerchants);
        const merchant = await userRepository.findOne({ where: { mch_no }});
        return merchant;
    }
}