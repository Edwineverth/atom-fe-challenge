import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-custom-button",
    standalone: true,
    imports: [MatButtonModule, NgClass],
    template: `
    <button mat-raised-button
            [color]="color"
            [disabled]="disabled"
            [ngClass]="buttonSize">
      <ng-content></ng-content>
    </button>
  `,
    styleUrls: ["./custom-button.component.scss"]
})
export class CustomButtonComponent {
    @Input() color: "primary" | "accent" | "warn" = "primary";
    @Input() disabled = false;
    @Input() size: "small" | "medium" | "large" = "medium";

    get buttonSize(): string {
        return `btn-${this.size}`;
    }
}
