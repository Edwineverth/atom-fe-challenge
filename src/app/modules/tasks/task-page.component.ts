import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatLineModule } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { Router, RouterModule } from "@angular/router";

import { TaskService } from "../../core/services/task.service";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { DialogComponent } from "../../shared/components/dialog.component";
import { AutoFocusDirective } from "../../shared/directives/fucus/app-auto-fucus.directive";
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
        MatIconModule,
        MatDialogModule,
        AutoFocusDirective
    ],
    templateUrl: "./task-page.component.html",
    styleUrls: ["./task-page.component.scss"]
})
export class TaskPageComponent implements OnInit {
    private taskService = inject(TaskService);
    router = inject(Router);
    private fb = inject(FormBuilder);
    private dialog = inject(MatDialog);
    private cdr = inject(ChangeDetectorRef);

    tasks: Task[] = [];
    taskForm: FormGroup = this.fb.group({
        title: new FormControl<string>("", Validators.required),
        description: new FormControl<string>("", Validators.required)
    });

    isEditMode = false;
    taskToEditId: string | null = null;

    ngOnInit(): void {
        this.loadTasks();
        this.cdr.detectChanges();
    }

    openDialog(title: string, message: string): void {
        this.dialog.open(DialogComponent, {
            data: { title, message, isError: true },
            width: "400px"
        });
    }

    loadTasks(): void {
        this.taskService.getTasks().subscribe(
            (tasks) => {
                this.tasks = tasks.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
                this.cdr.detectChanges();
            },
            (error) => {
                console.log(error);
                this.openDialog(
                    "Error al cargar tareas",
                    "Hubo un problema al cargar las tareas. Por favor, inténtelo de nuevo."
                );
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
            this.taskService.createTask(newTask).subscribe(
                () => {
                    this.taskForm.reset();
                    this.loadTasks();
                },
                (error) => {
                    console.log(error);
                    this.openDialog(
                        "Error al agregar tarea",
                        "Hubo un problema al agregar la tarea. Por favor, inténtelo de nuevo."
                    );
                }
            );
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
            console.log("update");
            const updatedTask: Partial<Task> = {
                title: this.taskForm.value.title!,
                description: this.taskForm.value.description!
            };
            this.taskService.updateTask(this.taskToEditId, updatedTask).subscribe(
                () => {
                    this.taskForm.reset();
                    this.isEditMode = false;
                    this.taskToEditId = null;
                    this.loadTasks();
                },
                (error) => {
                    console.log(error);
                    this.openDialog(
                        "Error al actualizar tarea",
                        "Hubo un problema al actualizar la tarea. Por favor, inténtelo de nuevo."
                    );
                }
            );
        }
    }

    cancelEdit(): void {
        this.isEditMode = false;
        this.taskToEditId = null;
        this.taskForm.reset();
    }

    toggleTaskCompletion(task: Task): void {
        const updatedTask = { ...task, completed: !task.completed };
        this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe(
            () => {
                this.loadTasks();
            },
            (error) => {
                console.log(error);
                this.openDialog(
                    "Error al cambiar el estado de la tarea",
                    "Hubo un problema al cambiar el estado de la tarea. Por favor, inténtelo de nuevo."
                );
            }
        );
    }

    deleteTask(taskId: string | undefined): void {
        if (!taskId) {
            this.openDialog("Error al eliminar tarea", "El ID de la tarea es inválido.");
            return;
        }
        this.taskService.deleteTask(taskId).subscribe(
            () => {
                this.loadTasks();
            },
            (error) => {
                console.log(error);
                this.openDialog(
                    "Error al eliminar tarea",
                    "Hubo un problema al eliminar la tarea. Por favor, inténtelo de nuevo."
                );
            }
        );
    }

    logout(): void {
        localStorage.removeItem("token");
        this.router.navigate(["/auth"]);
    }
}
