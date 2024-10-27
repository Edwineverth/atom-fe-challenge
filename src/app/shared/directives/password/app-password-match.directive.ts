import { Directive, Input } from "@angular/core";
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
    selector: "[appPasswordMatch]",
    standalone: true,
    providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }]
})
export class PasswordMatchDirective implements Validator {
    @Input("appPasswordMatch") matchTo: string = "";

    validate(formGroup: FormGroup): ValidationErrors | null {
        const control = formGroup.controls[this.matchTo];
        const matchingControl = formGroup.controls["confirmPassword"];

        if (control && matchingControl && control.value !== matchingControl.value) {
            return { passwordMismatch: true };
        }
        return null;
    }
}
