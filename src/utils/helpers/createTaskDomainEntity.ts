import {Task} from "../../app/api";
import {TaskDomain} from "../../features/Task/task-slice";

export const createTaskDomainEntity = (
    task: Task, options?: Pick<TaskDomain, 'entityStatus'>
): TaskDomain => ({...task, entityStatus: 'idle', ...options})