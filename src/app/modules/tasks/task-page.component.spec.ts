import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";

import { TaskService } from "../../core/services/task.service";
import { Task } from "../../shared/models/task.model";
import { TaskPageComponent } from "./task-page.component";

describe("TaskPageComponent", () => {
    let component: TaskPageComponent;
    let fixture: ComponentFixture<TaskPageComponent>;
    let taskService: jasmine.SpyObj<TaskService>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        const taskServiceSpy = jasmine.createSpyObj("TaskService", [
            "getTasks",
            "createTask",
            "updateTask",
            "deleteTask"
        ]);
        taskServiceSpy.getTasks.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [TaskPageComponent, HttpClientTestingModule, RouterTestingModule, MatDialogModule],
            providers: [provideAnimations(), { provide: TaskService, useValue: taskServiceSpy }]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskPageComponent);
        component = fixture.componentInstance;
        taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    describe("loadTasks", () => {
        it("should load tasks on initialization", () => {
            const tasks: Task[] = [
                {
                    id: "1",
                    title: "Task 1",
                    description: "Description 1",
                    userId: "prueba",
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "2",
                    title: "Task 2",
                    description: "Description 2",
                    userId: "prueba",
                    completed: true,
                    createdAt: new Date().toISOString()
                }
            ];
            taskService.getTasks.and.returnValue(of(tasks));

            component.loadTasks();

            expect(taskService.getTasks).toHaveBeenCalled();
            expect(component.tasks).toEqual(tasks);
        });

        it("should open dialog on load tasks failure", () => {
            taskService.getTasks.and.returnValue(throwError(() => new Error("error")));

            const openDialogSpy = spyOn(component, "openDialog").and.callThrough();

            component.loadTasks();

            expect(openDialogSpy).toHaveBeenCalledWith(
                "Error al cargar tareas",
                "Hubo un problema al cargar las tareas. Por favor, inténtelo de nuevo."
            );
        });
    });

    describe("addTask", () => {
        it("should add a task successfully", () => {
            component.taskForm.controls["title"].setValue("New Task");
            component.taskForm.controls["description"].setValue("New Description");

            // Verificamos que el formulario es válido antes de llamar a addTask
            expect(component.taskForm.valid).toBeTrue();

            taskService.createTask.and.returnValue(of({} as Task));

            component.addTask();

            expect(taskService.createTask).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    title: "New Task",
                    description: "New Description",
                    completed: false
                })
            );
        });

        it("should open dialog on add task failure", () => {
            component.taskForm.controls["title"].setValue("New Task");
            component.taskForm.controls["description"].setValue("New Description");

            taskService.createTask.and.returnValue(throwError(() => new Error("error")));

            const openDialogSpy = spyOn(component, "openDialog").and.callThrough();

            component.addTask();

            expect(openDialogSpy).toHaveBeenCalledWith(
                "Error al agregar tarea",
                "Hubo un problema al agregar la tarea. Por favor, inténtelo de nuevo."
            );
        });
    });

    describe("editTask", () => {
        it("should set form values for editing a task", () => {
            const task: Task = {
                id: "1",
                title: "Task 1",
                userId: "test",
                description: "Description 1",
                completed: false
            };

            component.editTask(task);

            expect(component.isEditMode).toBeTrue();
            expect(component.taskToEditId).toBe(task.id ?? "");
            expect(component.taskForm.value).toEqual({
                title: "Task 1",
                description: "Description 1"
            });
        });
    });

    describe("updateTask", () => {
        it("should update a task successfully", () => {
            component.isEditMode = true;
            component.taskToEditId = "1";
            component.taskForm.controls["title"].setValue("Updated Task");
            component.taskForm.controls["description"].setValue("Updated Description");

            taskService.updateTask.and.returnValue(of({} as Task));

            component.updateTask();

            expect(taskService.updateTask).toHaveBeenCalledWith(
                "1",
                jasmine.objectContaining({
                    title: "Updated Task",
                    description: "Updated Description"
                })
            );
        });

        it("should open dialog on update task failure", () => {
            component.isEditMode = true;
            component.taskToEditId = "1";
            component.taskForm.controls["title"].setValue("Updated Task");
            component.taskForm.controls["description"].setValue("Updated Description");

            taskService.updateTask.and.returnValue(throwError(() => new Error("error")));

            const openDialogSpy = spyOn(component, "openDialog").and.callThrough();

            component.updateTask();

            expect(openDialogSpy).toHaveBeenCalledWith(
                "Error al actualizar tarea",
                "Hubo un problema al actualizar la tarea. Por favor, inténtelo de nuevo."
            );
        });
    });

    describe("deleteTask", () => {
        it("should delete a task successfully", () => {
            taskService.deleteTask.and.returnValue(of(undefined));

            component.deleteTask("1");

            expect(taskService.deleteTask).toHaveBeenCalledWith("1");
        });

        it("should open dialog on delete task failure", () => {
            taskService.deleteTask.and.returnValue(throwError(() => new Error("error")));

            const openDialogSpy = spyOn(component, "openDialog").and.callThrough();

            component.deleteTask("1");

            expect(openDialogSpy).toHaveBeenCalledWith(
                "Error al eliminar tarea",
                "Hubo un problema al eliminar la tarea. Por favor, inténtelo de nuevo."
            );
        });
    });

    describe("toggleTaskCompletion", () => {
        it("should toggle task completion status", () => {
            const task: Task = {
                id: "1",
                title: "Task 1",
                userId: "test",
                description: "Description 1",
                completed: false
            };
            taskService.updateTask.and.returnValue(of({ ...task, completed: true }));

            component.toggleTaskCompletion(task);

            expect(taskService.updateTask).toHaveBeenCalledWith(
                "1",
                jasmine.objectContaining({
                    completed: true
                })
            );
        });
    });

    describe("logout", () => {
        it("should clear token and navigate to auth", () => {
            spyOn(component.router, "navigate");

            component.logout();

            expect(localStorage.getItem("token")).toBeNull();
            expect(component.router.navigate).toHaveBeenCalledWith(["/auth"]);
        });
    });
});
