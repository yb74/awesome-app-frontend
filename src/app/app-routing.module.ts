import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './services/guards/AuthGuard';
import { LoginGuard } from './services/guards/LoginGuard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomepageComponent, canActivate: [AuthGuard]},
  // {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  // {path: 'register', component: RegisterComponent, canActivate: [LoginGuard]},
  // {path: 'home', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
