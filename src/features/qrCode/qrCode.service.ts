import { AppDataSource } from "../../data-source";
import { GeneratedQRCode } from "./qrCode.entity";
import { IqrCode } from "./qrcode.interface";

export class QRCodeService {

    static async getQrcode(): Promise<GeneratedQRCode[]> {

        try {
          const qRRepository = AppDataSource.getRepository(GeneratedQRCode);
          const qrcode = await qRRepository.find({});
          return qrcode;
        } catch (error) {
          console.error('Error while fetching QR codes:', error);
          throw new Error("Failed to retrieve QR codes");
        }
      }
      

    static async getSingleQRCode(Order_sn: string): Promise<GeneratedQRCode> {

        try {
          const qrRepository = AppDataSource.getRepository(GeneratedQRCode);
          const qrCode = await qrRepository.findOne({ where: { Order_sn } });
          if (!qrCode) {
            throw new Error("The QR code does not exist");
          }
          return qrCode;
        } catch (error) {
          console.error('Error while fetching QR Code:', error);
          throw new Error("Failed to retrieve the QR code");
        }
      }

      static async getQRCodeByOrderNo(order_no: string): Promise<GeneratedQRCode> {

        try {
          const qrRepository = AppDataSource.getRepository(GeneratedQRCode);
          const qrCode = await qrRepository.findOne({ where: { order_no} });
          if (!qrCode) {
            throw new Error("The QR code does not exist");
          }
          return qrCode;
        } catch (error) {
          console.error('Error while fetching QR Code:', error);
          throw new Error("Failed to retrieve the QR code");
        }
      }


    static async updateQrCode(order_no: string) {
        try {
          const qrRepository = AppDataSource.getRepository(GeneratedQRCode);
          const qrCode = await qrRepository.find({ where: { order_no } });
          if (!qrCode) {
            return null;
          }
          await qrRepository.update({ order_no }, { isPaid: true });
          return 'QR Code updated successfully';
        } catch (error) {
          console.error('Error updating QR Code:', error);
          return 'Error updating QR Code'; 
        }
      }

      static async createQrCode(qrCodeDetails: IqrCode): Promise<GeneratedQRCode> {
        try {
           const qrRepository = AppDataSource.getRepository(GeneratedQRCode);
           const qrCode = qrRepository.create(qrCodeDetails);
          //  const g = new GeneratedQRCode()
          //  g.CodeUrl = qrCodeDetails.CodeUrl
          if (!qrCode) {
            throw new Error("Qr could not be created");
          }
      
          await qrRepository.save(qrCode);
          return qrCode;
        } catch (error) {
          console.error('Error while creating QR Code:', error);
          throw new Error("Failed to create QR Code:");
        }
      }

      static async getPaymentOrderStatus(): Promise<GeneratedQRCode[]> {

        try {

          const qrRepository = AppDataSource.getRepository(GeneratedQRCode);
          const qrRecords = qrRepository
            .createQueryBuilder('qrcode')
            .where('qrcode.isPaid = :isPaid', { isPaid: false })
            .orderBy('qrcode.id', 'ASC')
            .take(20)
            .getMany();
      
          return qrRecords;
        } catch (error) {
          console.error('An error occurred:', error);
          throw error;
        }
      }
      
}