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
exports.SubMerchants = void 0;
const typeorm_1 = require("typeorm");
let SubMerchants = class SubMerchants {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint" }),
    __metadata("design:type", String)
], SubMerchants.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "I0000000145" }),
    __metadata("design:type", String)
], SubMerchants.prototype, "Institution_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], SubMerchants.prototype, "Mch_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], SubMerchants.prototype, "Sub_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], SubMerchants.prototype, "Sub_mch_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], SubMerchants.prototype, "Emvco_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], SubMerchants.prototype, "email", void 0);
SubMerchants = __decorate([
    (0, typeorm_1.Entity)()
], SubMerchants);
exports.SubMerchants = SubMerchants;
