import * as fs from 'fs';

export class DummyDataService {

    static readonly data: object = {
        'enquiry': './src/constant/dummy-data/enquiry.sql'
    }

    static async read($filename: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(DummyDataService.data[$filename], 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve({data: jsonData});
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }

}
