import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { lastValueFrom } from "rxjs";

import { AuthService } from "../../core/services/auth.service";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { DialogComponent } from "../../shared/components/dialog.component";
import { PasswordMatchDirective } from "../../shared/directives/password/app-password-match.directive";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        HttpClientModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CustomInputComponent,
        CustomButtonComponent,
        MatDialogModule,
        PasswordMatchDirective
    ],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private dialog = inject(MatDialog);

    loginForm: FormGroup = this.fb.group({
        email: new FormControl<string>("", [Validators.required, Validators.email]),
        password: new FormControl<string>("", [Validators.required])
    });

    registerForm: FormGroup = this.fb.group({
        email: new FormControl<string>("", [Validators.required, Validators.email]),
        password: new FormControl<string>("", [Validators.required]),
        confirmPassword: new FormControl<string>("", [Validators.required])
    });

    isRegisterMode = false;

    getControl(controlName: string): FormControl {
        return (this.isRegisterMode ? this.registerForm : this.loginForm).get(controlName) as FormControl;
    }

    toggleRegisterMode(): void {
        this.isRegisterMode = !this.isRegisterMode;
    }

    openDialog(title: string, message: string): void {
        this.dialog.open(DialogComponent, {
            data: { title, message, isError: true },
            width: "400px"
        });
    }

    async onSubmit(): Promise<void> {
        if (this.isRegisterMode && this.registerForm.valid) {
            const { email, password } = this.registerForm.value;
            try {
                await lastValueFrom(this.authService.register(email, password));
                await lastValueFrom(this.authService.login(email as string, password as string));
                await this.router.navigate(["/tasks"]);
            } catch (error) {
                this.openDialog(
                    "Error en el registro",
                    "Hubo un problema al registrar su cuenta. Por favor, inténtelo de nuevo más tarde."
                );
            }
        } else if (!this.isRegisterMode && this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            try {
                await lastValueFrom(this.authService.login(email as string, password as string));
                await this.router.navigate(["/tasks"]);
            } catch (error) {
                this.openDialog(
                    "Error en el inicio de sesión",
                    "Las credenciales ingresadas son incorrectas o hubo un problema. Por favor, inténtelo de nuevo."
                );
                await this.router.navigate(["/auth"]);
            }
        }
    }
}
