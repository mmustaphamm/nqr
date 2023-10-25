import { AppDataSource } from "../../data-source";
import { IPaymentTransaction } from "./payment.interface";
import { PaymentTransaction } from "./paymentTransaction.entity";


export class PaymentService {

    static async createPayment(details: IPaymentTransaction): Promise<PaymentTransaction> {

        try {

          const paymentRepository = AppDataSource.getRepository(PaymentTransaction);
          const payment = paymentRepository.create(details);

          if (!payment) {
            throw new Error("Payment could not be created");
          }
      
          await paymentRepository.save(payment);
          return payment;
        } catch (error) {
          console.error('Error while creating payment:', error);
          throw new Error("Failed to create payment");
        }
      }

      static async getSinglePayment(order_no: string): Promise<PaymentTransaction> {

        try {
          const paymentRepository = AppDataSource.getRepository(PaymentTransaction);
          const qrCode = await paymentRepository.findOne({ where: { SessionID: order_no } });

          if (!qrCode) {
            throw new Error("The QR code does not exist");
          }
          return qrCode;
        } catch (error) {
          console.error('Error while fetching QR Code:', error);
          throw new Error("Failed to retrieve the QR code");
        }
      }

      
}