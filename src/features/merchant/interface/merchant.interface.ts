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
  institution_number: string;
  mch_no: string;
  sub_mch_no:string
  emvco_code: string
  name: string;
  email: string;
  phone_number: string;
  sub_fixed: string;
  sub_amount: string;
  timestamp: string;
  sign: string;
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


export interface QueryAcct {
  institution_number: string,
  channel: string,
  bank_number: string,
  account_number: string,
  timestamp: string,
  sign: string
}