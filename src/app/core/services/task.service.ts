import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { TaskServiceInterface } from "../../shared/interface/task.interface";
import { Task } from "../../shared/models/task.model";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: "root"
})
export class TaskService implements TaskServiceInterface {
    constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {}

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    public getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.configService.apiUrl}/api/tasks`, { headers: this.getAuthHeaders() });
    }

    public createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(`${this.configService.apiUrl}/api/tasks`, task, { headers: this.getAuthHeaders() });
    }

    public updateTask(taskId: string, task: Partial<Task>): Observable<Task> {
        return this.http.put<Task>(`${this.configService.apiUrl}/api/tasks/${taskId}`, task, { headers: this.getAuthHeaders() });
    }

    public deleteTask(taskId: string): Observable<void> {
        return this.http.delete<void>(`${this.configService.apiUrl}/api/tasks/${taskId}`, { headers: this.getAuthHeaders() });
    }
}
