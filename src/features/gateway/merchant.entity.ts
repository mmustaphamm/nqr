import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'merchants' })
export class Merchants {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: string;

  @Column({type:"varchar", default: "I0000000145"})
  Institution_number: string

  @Column({type:"varchar", nullable: false})
  Mch_no: string

  @Column({type:"varchar", nullable: false})
  MerchantName: string

  @Column({type:"varchar", nullable: false})
  MerchantTIN: string

  @Column({type:"varchar", nullable: false})
  MerchantContactName: string

  @Column({type:"varchar", nullable: false})
  MerchantPhoneNumber:string

  @Column({type: "varchar", nullable: false})
  MerchantEmail: string

  @Column({type:"varchar", nullable: false})
  MerchantAddress: string;

  @Column({type:"varchar", nullable: false})
  AccountName: string

  @Column({type:"varchar", nullable: true})
  AccountNumber: string

  @Column({type:"varchar", nullable: false})
  BankVerificationNumber: string

  @Column({type:"varchar", nullable: false})
  KYCLevel: string

  @Column({type:"varchar", nullable: false})
  m_fee_bearer: string

  @Column({type:"bigint"})
  partner_id: string
  
  @CreateDateColumn({type:"timestamp"})
  created_at: Date;

}