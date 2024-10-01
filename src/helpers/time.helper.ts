import {ManipulateType } from "dayjs";
import dayjs = require('dayjs')

class TimeHelper {
    public subtractByParams(value: number, unit: ManipulateType): Date {
        return dayjs().subtract(value, unit).toDate();
    }

    public parseConfigString(string: string): {
        value: number;
        unit: ManipulateType;
    } {
        const [value, unit] = string.split(" ");
        return { value: parseInt(value), unit: unit as ManipulateType };
    }
}

export const timeHelper = new TimeHelper();