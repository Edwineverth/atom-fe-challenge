import { Location } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { routes } from "./app-routing.module"; // Importar las rutas para poder hacer el test de navegación

describe("AppComponent", () => {
    let router: Router;
    let location: Location;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)], // Cargar las rutas de la app
            declarations: [AppComponent]
        }).compileComponents();

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        router.initialNavigation(); // Hacer la navegación inicial
    });

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it("should have as title 'atom-challenge-fe-template-v15'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual("atom-challenge-fe-template-v15");
    });
});
