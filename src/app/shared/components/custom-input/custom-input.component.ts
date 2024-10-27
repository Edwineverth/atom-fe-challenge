import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: "app-custom-input",
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf],
    template: `
        <mat-form-field appearance="outline" class="custom-input">
            <mat-label>{{ label }}</mat-label>
            <input matInput [formControl]="control" [type]="type" />
            <mat-error *ngIf="control.invalid && control.touched">
                {{ errorMessage }}
            </mat-error>
        </mat-form-field>
    `,
    styleUrls: ["./custom-input.component.scss"]
})
export class CustomInputComponent {
    @Input() label!: string;
    @Input() type: "text" | "password" | "email" = "text";
    @Input() control!: FormControl;
    @Input() errorMessage = "Campo requerido";
}
