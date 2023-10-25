export interface CreateMerchantPayload {
  institution_number: string,
  name: string
  tin: string
  contact: string
  phone: string
  email: string
  address: string
  bank_no: string
  account_name: string
  account_number: string
  m_fee_bearer: string
  timestamp: string
  sign: string
}

export interface CreateMerchant {
  institution_number: string,
  name: string
  tin: string
  merchant_number: string
  contact: string
  phone: string
  email: string
  address: string
  bank_no: string
  account_name: string
  account_number: string
  m_fee_bearer: string
  timestamp: string
  sign: string
}

export interface MerchantInfo {
  institution_number: string;
  mch_no: string;
  bank_no: string;
  account_name: string;
  account_number: string;
  timestamp: string;
  sign: string;
}

export interface SubMerchantInfo {
  Institution_number: string;
  Mch_no: string;
  Sub_mch_no:string;
  Emvco_code: string;
  Sub_name: string;
  email?: string
}

export interface SubMerchantPayload {
  institution_number: string;
  mch_no: string;
  name: string;
  email: string;
  phone_number: string;
  sub_fixed: string;
  sub_amount: string;
  timestamp: string;
  sign: string;
}

export interface BatchMerchantData {
  institution_number: string;
  timestamp: string;
  sign: string;
  list: BatchMerchant[];
}

export interface SubBatchMerchantData {
  institution_number: string;
  mch_no: string;
  timestamp: string;
  sign: string;
  list: SubBatchMerchant[];
}

export interface BatchMerchant {
  name: string;
  tin: string;
  contact: string;
  phone: string;
  email: string;
  bank_no: string;
  account_name: string;
  account_number: string;
  m_fee_bearer: string;
}

export interface SubBatchMerchant {
  sub_name: string;
  sub_email: string;
  sub_phone_number: string;
  sub_fixed: string;
  sub_amount: string;
}


export interface QueryAcct {
  institution_number: string,
  channel: string,
  bank_number: string,
  account_number: string,
  timestamp: string,
  sign: string
}

export interface bindAcct {
  mch_no: string,
  account_name: string,
  account_number: string,
}