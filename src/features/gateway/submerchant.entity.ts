import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SubMerchants {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: string;

    @Column({type:"varchar", default: "I0000000145"})
    Institution_number: string;

    @Column({type:"varchar", nullable: true})
    Mch_no: string;

    @Column({type:"varchar",  nullable: true})
    Sub_name: string;

    @Column({type:"varchar",  nullable: true})
    Sub_mch_no: string;

    @Column({type:"varchar",  nullable: true})
    Emvco_code: string;

    @Column({type:"varchar",  nullable: true})
    email: string;

}
