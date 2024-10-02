import { CronJob } from "cron";

import { configs } from "../config/configs";
import { timeHelper } from "../helpers/time.helper";
import {oldPasswordRepository} from "../repositories/old-password.repository";

const handler = async () => {
    try {
        const { value, unit } = timeHelper.parseConfigString(
            configs.OLD_PASSWORDS_EXPIRATION,
        );

        const date = timeHelper.subtractByParams(value, unit);
        const deletedPasswordsCount = await oldPasswordRepository.deleteManyByParams({createdAt: { $lt: date },});
        console.log(`Deleted ${deletedPasswordsCount} old passwords`);
    } catch (error) {
        console.error(error);
    }
};

export const removeOldPasswordsCronJob = new CronJob("0,20,40 * * * * *", handler);