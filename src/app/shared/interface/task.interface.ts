import { Observable } from "rxjs";

import { Task } from "../models/task.model";

export interface TaskServiceInterface {
    getTasks(): Observable<Task[]>;
    createTask(task: Task): Observable<Task>;
    updateTask(taskId: string, task: Partial<Task>): Observable<Task>;
    deleteTask(taskId: string): Observable<void>;
}
