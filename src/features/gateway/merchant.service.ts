import BadRequestError from "../../loader/error-handler/BadRequestError";
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

    static async createSubMerchant(submerchantDetails: SubMerchantInfo): Promise<SubMerchants> {
        
        try {
          const userRepository = AppDataSource.getRepository(SubMerchants);
          const submerchant = userRepository.create(submerchantDetails);
      
          if (!submerchant) {
            throw new BadRequestError("Submerchant could not be created");
          }
      
          await userRepository.save(submerchant);
          return submerchant;
        } catch (error) {
          console.error('Error while creating submerchant:', error);
          throw new BadRequestError("Failed to create submerchant");
        }
      }      

      
    static async getMerchants():Promise<Merchants[]> {
        const merchantRepo = AppDataSource.getRepository(Merchants);
        const merchant = await merchantRepo.find({ });
        return merchant;
    }

    static async getMerchantbyAcctNo(account_number: string) {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { AccountNumber: account_number }});
        return merchant;
    }

    static async getMerchantByMchNo(mch: string):Promise<Merchants> {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { Mch_no: mch }});
        if (!merchant || merchant == null) throw new BadRequestError("There is no merchant with that mch_no")
        return merchant
    }

    static async getMerchantById(id: string):Promise<Merchants> {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { id}});
        if (!merchant || merchant == null) throw new BadRequestError("There is no merchant with that id")
        return merchant
    }

    static async getMerchantByTin(tin: string):Promise<Merchants | null> {
        const userRepository = AppDataSource.getRepository(Merchants);
        const merchant = await userRepository.findOne({ where: { MerchantTIN: tin }});
        return merchant
    }

    static async getSubMerchantbyMchNo(mch_no: string) {
        const userRepository = AppDataSource.getRepository(SubMerchants);
        const merchant = await userRepository.findOne({ where: { Mch_no: mch_no }});
        return merchant;
    }
}