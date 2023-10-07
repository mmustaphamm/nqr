import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'merchants' })
export class Merchants {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: string;

  @Column({type:"varchar", nullable: false})
  institution_number: string

  @Column({type:"varchar", nullable: false})
  name: string

  @Column({type:"varchar", nullable: false})
  tin: string

  @Column({type:"varchar", nullable: false})
  merchant_number: string

  @Column({type:"varchar", nullable: false})
  contact: string

  @Column({type:"varchar", nullable: false})
  phone:string

  @Column({type: "varchar", nullable: false})
  email: string

  @Column({type:"varchar", nullable: false})
  address: string;

  @Column({type:"varchar", nullable: false})
  bank_no: string

  @Column({type:"varchar", nullable: false})
  account_name: string

  @Column({type:"varchar", nullable: false})
  account_number: string

  @Column({type:"varchar", nullable: false})
  m_fee_bearer: string

  @Column({type:"varchar", nullable: false})
  timestamp: string

  @Column({type:"varchar", nullable: false})
  sign: string

  @CreateDateColumn({type:"timestamp"})
  created_at: Date;

}