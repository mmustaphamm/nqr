import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SubMerchants {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: string;

    @Column({type:"varchar", nullable: false})
    institution_number: string;

    @Column({type:"varchar", nullable: false})
    mch_no: string;

    @Column({type:"varchar", nullable: false})
    bank_no: string;

    @Column({type:"varchar", nullable: false})
    account_name: string;

    @Column({type:"varchar", nullable: false})
    sub_mch_no: string;

    @Column({type:"varchar", nullable: false})
    emvco_code: string;

    @Column({type:"varchar", nullable: false})
    account_number: string;

    @Column({type:"varchar", nullable: false})
    timestamp: string;

    @Column({type:"varchar", nullable: false})
    sign: string;
}
