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
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { Router, RouterModule } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";
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
        FormsModule
    ],
    templateUrl: "./task-page.component.html",
    styleUrls: ["./task-page.component.scss"]
})
export class TaskPageComponent implements OnInit {
    private taskService = inject(TaskService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    tasks: Task[] = [];
    taskForm: FormGroup = this.fb.group({
        title: new FormControl<string>("", Validators.required),
        description: new FormControl<string>("", Validators.required),
    });

    getControl(controlName: string): FormControl {
        return this.taskForm.get(controlName) as FormControl;
    }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.taskService.getTasks().subscribe(
            (tasks) => {
                // Ordenar las tareas por fecha de creación en orden descendente
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
                userId: "userId_placeholder", // Reemplaza este valor con el ID real del usuario
                completed: false
            };
            this.taskService.createTask(newTask).subscribe(() => {
                this.taskForm.reset();
                this.loadTasks(); // Recargar las tareas después de añadir una nueva
            });
        }
    }

    toggleTaskCompletion(task: Task): void {
        const updatedTask = { ...task, completed: !task.completed };
        this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe(() => {
            this.loadTasks(); // Recargar las tareas después de actualizar el estado de completado
        });
    }

    deleteTask(taskId: string | undefined): void {
        if (!taskId) {
            throw new Error("codigo malo");
        }
        this.taskService.deleteTask(taskId).subscribe(() => {
            this.loadTasks(); // Recargar las tareas después de eliminar
        });
    }

    logout(): void {
        localStorage.removeItem("token"); // Eliminar el token de autenticación
        this.router.navigate(["/auth"]); // Redirigir a la página de inicio de sesión
    }
}
