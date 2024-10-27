import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import {
    FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { lastValueFrom } from "rxjs";

import { AuthService } from "../../core/services/auth.service";
import { CustomButtonComponent } from "../../shared/components/custom-button/custom-button.component";
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";

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
        CustomButtonComponent
    ],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    loginForm: FormGroup = this.fb.group({
        email: new FormControl<string>("", [Validators.required, Validators.email]),
        password: new FormControl<string>("", [Validators.required])
    });

    getControl(controlName: string): FormControl {
        return this.loginForm.get(controlName) as FormControl;
    }

    async onSubmit(): Promise<void> {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            try {
                await lastValueFrom(this.authService.login(email as string, password as string));
                await this.router.navigate(["/tasks"]);
            } catch (error) {
                console.error("Error en el inicio de sesión:", error);
            }
        }
    }
}
