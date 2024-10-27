import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: "", redirectTo: "auth", pathMatch: "full" },
    {
        path: "auth",
        loadComponent: () => import("./modules/auth/login.component").then((m) => m.LoginComponent)
    },
    {
        path: "tasks",
        loadComponent: () => import("./modules/tasks/task-page.component").then((m) => m.TaskPageComponent)
    }
];

@NgModule({
    imports: [HttpClientModule, RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
