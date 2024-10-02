import { removeOldTokensCronJob } from "./remove-old-tokens.cron";
import { testCronJob } from "./test.cron";
import {removeOldUsersCronJob} from "./remove-old-users.cron";

export const cronRunner = () => {
    testCronJob.start();
    removeOldTokensCronJob.start();
    removeOldUsersCronJob.start();
};