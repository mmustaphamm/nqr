import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'qrcode' })
export class GeneratedQRCode {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: string;

    @Column({type:"varchar", nullable: true})
    mch_ID: string

    @Column()
    mch_no: string

    @Column({type:"varchar", nullable: true})
    Order_sn: string;

    @Column({type:"varchar", nullable: true})
    order_no: string

    @Column({type:"varchar", })
    CodeUrl: string;

    @Column({type: "boolean", default: 0})
    isPaid: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
