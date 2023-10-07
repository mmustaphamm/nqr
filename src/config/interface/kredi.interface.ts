export interface IPaymentRail {
    account: string,
    accounts: {
        nip: string,
        stanbic: string
    },
    secretKey: string,
    generalLedgerId: number,
    tsqUrl: string
}

export interface ISettlementAccount {
    typeorm: {
        type: string,
        host: string,
        port: number,
        username: string,
        password: string,
        database: string,
        synchronize: boolean,
        logging: boolean,
        entities: object,
        migrations: object,
        migrationsTableName: string
        subscribers: object,
    }
}

export interface baseUrl {
    userService: string
}