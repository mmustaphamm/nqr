export interface IPaymentTransaction {
    SessionID: string;
    NameEnquiryRef: string;
    DestinationInstitutionCode: string;
    ChannelCode: string;
    BeneficiaryAccountName: string;
    BeneficiaryAccountNumber: string;
    BeneficiaryKYCLevel: string;
    BeneficiaryBankVerificationNumber: string;
    OriginatorAccountName: string;
    OriginatorAccountNumber: string;
    OriginatorBankVerificationNumber: string;
    OriginatorKYCLevel: string;
    TransactionLocation: string;
    Narration: string;
    PaymentReference: string;
    Amount: string;
  }
  