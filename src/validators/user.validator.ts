import joi = require('joi');

import { regexConstant } from "../constants/regex.constant";

export class UserValidator{
    // @ts-ignore
    private static name  = joi.string().min(3).max(20).trim();
    private static email =  joi.string().lowercase().trim().regex(regexConstant.EMAIL);
    private static password=  joi.string().trim().regex(regexConstant.PASSWORD);
    private static age =  joi.number().min(18).max(100).required();
    private static phone =  joi.string().trim().regex(regexConstant.PHONE);

    public static create = joi.object({
        name: this.name.required(),
        email:  this.email.required(),
        password: this.password.required(),
        age:this.age.required(),
        phone: this.phone,
    })

    public static update = joi.object({
        name: this.name,
        age:this.age,
        phone: this.phone,
    })
}