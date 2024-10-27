import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

interface DialogData {
    title: string;
    message: string;
    isError?: boolean; // Para estilos específicos en caso de error
}

@Component({
    selector: "app-dialog",
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    closeDialog(): void {
        this.dialogRef.close();
    }
}
