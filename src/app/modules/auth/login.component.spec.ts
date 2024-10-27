import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";

import { AuthService } from "../../core/services/auth.service";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { User } from "../../shared/models/user.model";
import { LoginComponent } from "./login.component";

// Clase mock para MatDialogRef
class MockMatDialogRef {
    close(value = "") {}
    afterClosed() {
        return of(true);
    }
}

const mockDialogData = {
    title: "Error",
    message: "Ha ocurrido un error",
    isError: true
};

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj("AuthService", ["login", "register"]);

        await TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                MatDialogModule,
                NoopAnimationsModule,
                RouterTestingModule.withRoutes([{ path: "auth", redirectTo: "" }])
            ],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: MatDialogRef, useClass: MockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("Login Form", () => {
        it("should disable the submit button if the login form is invalid", () => {
            component.isRegisterMode = false;
            fixture.detectChanges();

            component.loginForm.controls["email"].setValue("");
            component.loginForm.controls["password"].setValue("");
            fixture.detectChanges();

            const submitButton = fixture.debugElement.nativeElement.querySelector("app-custom-button button");
            expect(submitButton.disabled).toBeTruthy();
        });

        it("should call authService.login and navigate to tasks on successful login", fakeAsync(() => {
            component.isRegisterMode = false;
            component.loginForm.controls["email"].setValue("test@example.com");
            component.loginForm.controls["password"].setValue("password");

            authService.login.and.returnValue(
                of({ token: "dummy-token", user: { id: "123", email: "test@example.com" } as User })
            );

            component.onSubmit();
            tick();

            expect(authService.login).toHaveBeenCalledOnceWith("test@example.com", "password");
        }));
    });

    describe("Register Form", () => {
        beforeEach(() => {
            component.isRegisterMode = true;
            fixture.detectChanges();
        });

        it("should disable the submit button if the register form is invalid", () => {
            component.isRegisterMode = true;
            component.registerForm.controls["email"].setValue("");
            component.registerForm.controls["password"].setValue("");
            component.registerForm.controls["confirmPassword"].setValue("");
            fixture.detectChanges();

            // Obtener el componente app-custom-button
            const customButtonComponent = fixture.debugElement.query(By.directive(CustomButtonComponent))
                .componentInstance as CustomButtonComponent;

            expect(component.registerForm.invalid).toBeTrue();
            expect(customButtonComponent.disabled).toBeTrue();
        });

        it("should call authService.register and navigate to tasks on successful registration", fakeAsync(() => {
            component.registerForm.controls["email"].setValue("test@example.com");
            component.registerForm.controls["password"].setValue("password");
            component.registerForm.controls["confirmPassword"].setValue("password");
            authService.register.and.returnValue(of({} as User));
            authService.login.and.returnValue(
                of({ token: "dummy-token", user: { id: "123", email: "test@example.com" } as User })
            );

            component.onSubmit();
            tick();

            expect(authService.register).toHaveBeenCalledOnceWith("test@example.com", "password");
            expect(authService.login).toHaveBeenCalledOnceWith("test@example.com", "password");
        }));

        it("should open a dialog on registration failure", fakeAsync(() => {
            component.isRegisterMode = true;
            component.registerForm.controls["email"].setValue("test@example.com");
            component.registerForm.controls["password"].setValue("password");
            component.registerForm.controls["confirmPassword"].setValue("password");

            authService.register.and.returnValue(throwError(() => new Error("error")));

            spyOn(component, "openDialog").and.callThrough();

            component.onSubmit();
            tick();

            expect(component.openDialog).toHaveBeenCalledWith(
                "Error en el registro",
                "Hubo un problema al registrar su cuenta. Por favor, inténtelo de nuevo más tarde."
            );
        }));

        it("should show password mismatch error if passwords do not match", () => {
            component.isRegisterMode = true; // Cambia a modo registro
            component.registerForm.controls["password"].setValue("password1");
            component.registerForm.controls["confirmPassword"].setValue("password2");
            fixture.detectChanges();

            const formErrors = component.registerForm.errors;
            expect(formErrors?.["passwordMismatch"]).toBeTruthy();
        });
    });

    describe("Mode Toggle", () => {
        it("should toggle between login and register modes", () => {
            component.isRegisterMode = false;
            component.toggleRegisterMode();
            expect(component.isRegisterMode).toBeTrue();

            component.toggleRegisterMode();
            expect(component.isRegisterMode).toBeFalse();
        });
    });
});
