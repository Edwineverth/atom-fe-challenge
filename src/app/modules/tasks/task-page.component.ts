import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
    FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatLineModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { Router, RouterModule } from "@angular/router";

import { TaskService } from "../../core/services/task.service";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { Task } from "../../shared/models/task.model";

@Component({
    selector: "app-task-page",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        CustomButtonComponent,
        CustomInputComponent,
        MatListModule,
        MatLineModule,
        FormsModule,
        MatIconModule
    ],
    templateUrl: "./task-page.component.html",
    styleUrls: ["./task-page.component.scss"]
})
export class TaskPageComponent implements OnInit {
    private taskService = inject(TaskService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    tasks: Task[] = [];
    taskForm: FormGroup = this.fb.group({
        title: new FormControl<string>("", Validators.required),
        description: new FormControl<string>("", Validators.required),
    });

    isEditMode = false;
    taskToEditId: string | null = null; // Guarda el ID de la tarea que se está editando

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.taskService.getTasks().subscribe(
            (tasks) => {
                this.tasks = tasks.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
            },
            (error) => {
                console.error("Error al cargar tareas:", error);
            }
        );
    }

    addTask(): void {
        if (this.taskForm.valid) {
            const newTask: Task = {
                title: this.taskForm.value.title!,
                description: this.taskForm.value.description!,
                userId: "userId_placeholder",
                completed: false
            };
            this.taskService.createTask(newTask).subscribe(() => {
                this.taskForm.reset();
                this.loadTasks();
            });
        }
    }

    editTask(task: Task): void {
        this.isEditMode = true;
        this.taskToEditId = task.id!;
        this.taskForm.patchValue({
            title: task.title,
            description: task.description
        });
    }

    updateTask(): void {
        if (this.taskForm.valid && this.taskToEditId) {
            const updatedTask: Partial<Task> = {
                id: this.taskToEditId,
                title: this.taskForm.value.title!,
                description: this.taskForm.value.description!,
                completed: false
            };
            this.taskService.updateTask(this.taskToEditId, updatedTask).subscribe(() => {
                this.taskForm.reset();
                this.isEditMode = false;
                this.taskToEditId = null;
                this.loadTasks();
            });
        }
    }

    cancelEdit(): void {
        this.isEditMode = false;
        this.taskToEditId = null;
        this.taskForm.reset();
    }

    toggleTaskCompletion(task: Task): void {
        const updatedTask = { ...task, completed: !task.completed };
        this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe(() => {
            this.loadTasks();
        });
    }

    deleteTask(taskId: string | undefined): void {
        if (!taskId) {
            throw new Error("codigo malo");
        }
        this.taskService.deleteTask(taskId).subscribe(() => {
            this.loadTasks();
        });
    }

    logout(): void {
        localStorage.removeItem("token");
        this.router.navigate(["/auth"]);
    }
}
