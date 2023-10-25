"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OTP {
    constructor() {
        this.numbers = "0123456789";
        this.chars = "abcdefghijklmnopqrstuvxyz";
        this.specialChars = "!£%^&*#";
    }
    generate(length) {
        try {
            if (Object.is("number", typeof length)) {
                let OTP = "";
                for (let i = 0; i < length; i++) {
                    OTP += this.numbers[Math.floor(Math.random() * 10)];
                }
                let date = new Date();
                let time = date.getTime();
                //Get the last five digit
                let digit = String(time)
                    .split("")
                    .reverse()
                    .join("")
                    .substring(0, 5);
                OTP += digit;
                return OTP;
            }
            throw {
                name: "ArgumentError : The argument provided for the length of the OTP is not a number",
                message: "Kindly specify the length of the OTP using Number",
            };
        }
        catch (error) {
            let message = error.message;
            return message;
        }
    }
}
exports.default = new OTP();
