import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class PaymentTransaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  MerchantID: string;

  @Column()
  QrCodeID: string

  @Column({nullable: true })
  SessionID: string;

  @Column({ nullable: true })
  NameEnquiryRef: string;

  @Column({ nullable: true })
  DestinationInstitutionCode: string;

  @Column({ nullable: true })
  ChannelCode: string;

  @Column({ nullable: true })
  BeneficiaryAccountName: string;

  @Column({ nullable: true })
  BeneficiaryAccountNumber: string;

  @Column({ nullable: true })
  BeneficiaryKYCLevel: string;

  @Column({ nullable: true })
  BeneficiaryBankVerificationNumber: string;

  @Column({ nullable: true })
  OriginatorAccountName: string;

  @Column({ nullable: true })
  OriginatorAccountNumber: string;

  @Column({nullable: true})
  OriginatorBankVerificationNumber: string;

  @Column({ nullable: true })
  OriginatorKYCLevel: string;

  @Column({ nullable: true })
  TransactionLocation: string;

  @Column({ nullable: true })
  Narration: string;

  @Column({ nullable: true })
  PaymentReference: string;

  @Column({ nullable: true })
  Amount: string;

  @CreateDateColumn()
  created_at: Date;
}
