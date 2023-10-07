import * as fs from 'fs';

export class BankService {

    static readonly allBanks: string = "./src/constant/banks/all-banks.json";

    static readBankFile(): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(BankService.allBanks, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }
}
