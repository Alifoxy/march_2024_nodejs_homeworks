import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";
import { ApiError } from "../errors/api-error";
import { ObjectSchema } from "joi";


class CommonMiddleware {

    public isIdValid(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!isObjectIdOrHexString(req.params[key])) {
                    throw new ApiError("Invalid ID", 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
    public isBodyValid(validator:ObjectSchema) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = await validator.validateAsync(req.body)
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();