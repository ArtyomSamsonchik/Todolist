import {TaskDomain} from "../../features/Task/task-slice";
import {Task} from "../../features/Task/task-api";

export const createTaskDomainEntity = (
    task: Task, options?: Pick<TaskDomain, 'entityStatus'>
): TaskDomain => ({...task, entityStatus: 'idle', ...options})