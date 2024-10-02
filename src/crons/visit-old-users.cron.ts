import { CronJob } from "cron";

import { EmailTypeEnum } from "../enums/email-type.enum";
import { timeHelper } from "../helpers/time.helper";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.service";
import {configs} from "../config/configs";

const handler = async () => {
    try {
        const { value, unit } = timeHelper.parseConfigString(
            configs.NO_ACTIVITY_EXPIRATION,
        );

        const date = timeHelper.subtractByParams(value,unit);

        const users = await userRepository.findWithOutActivity(date);
        await Promise.all(
            users.map(async (user) => {
                await emailService.sendMail(EmailTypeEnum.OLD_VISIT, user.email, {
                    name: user.name,
                });
            }),
        );
        console.log(`Sent ${users.length} old visit emails`);
    } catch (error) {
        console.error(error);
    }
};

export const oldVisitorCronJob = new CronJob("*/5 * * * 8 *", handler);