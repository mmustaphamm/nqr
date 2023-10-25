export interface merchantData {
    id: number,
    uuid: string
    userId: number,
    nuban: string,
    glId: number,
    name: string
}

export interface IPartnerData {
    uuid: string
    webhook_url: string
    secret_key: string
}

export interface IPartnerDetails {
    [key: number]: IPartnerData
}