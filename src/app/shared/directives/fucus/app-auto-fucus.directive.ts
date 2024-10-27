import { AfterViewInit, Directive, ElementRef } from "@angular/core";

@Directive({
    standalone: true,
    selector: "[appAutoFocus]"
})
export class AutoFocusDirective implements AfterViewInit {
    constructor(private el: ElementRef) {}

    ngAfterViewInit(): void {
        this.el.nativeElement.focus();
    }
}
