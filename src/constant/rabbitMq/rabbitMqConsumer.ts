import { PayoutMQController } from "../../feature/payout/payoutMQ.controller";
import {ApiServices} from "../../common/ApiServices"
import amqp from "amqplib"
import { AxiosResponse } from "axios";

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';
const queueName = process.env.RABBITMQ_QUEUE_NAME || "payoutTests"


async function consumePayoutQueue(payout:any) {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: false});
    channel.consume(queueName, (message:any) => {
        if (message !== null) {
            console.log({ message: message.content.toString() });
            //  Perform your desired operation with the message content here
            
            channel.ack(message);
        } else {
            console.log('Consumer cancelled by server')
        }
    });
  } catch (error) {
    console.log('error consuming the queues', error);
  }
}

export default consumePayoutQueue

