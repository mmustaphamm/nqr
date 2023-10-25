import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'webhooks' })
export class Webhook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("bigint")
  user_id: string;

  @Column('bigint')
  partner_id: string;

  @Column()
  name: string;
  
  @Column()
  secret_key: string;

  @Column({type: 'text'})
  webhook_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}