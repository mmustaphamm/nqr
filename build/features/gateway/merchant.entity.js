"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merchants = void 0;
const typeorm_1 = require("typeorm");
let Merchants = class Merchants {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint" }),
    __metadata("design:type", String)
], Merchants.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "I0000000145" }),
    __metadata("design:type", String)
], Merchants.prototype, "Institution_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "Mch_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "MerchantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "MerchantTIN", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "MerchantContactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "MerchantPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "MerchantEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "MerchantAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "AccountName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Merchants.prototype, "AccountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "BankVerificationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "KYCLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], Merchants.prototype, "m_fee_bearer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", String)
], Merchants.prototype, "partner_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Merchants.prototype, "created_at", void 0);
Merchants = __decorate([
    (0, typeorm_1.Entity)({ name: 'merchants' })
], Merchants);
exports.Merchants = Merchants;
