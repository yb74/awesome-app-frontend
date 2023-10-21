import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/register/register.component';
import { ToastComponent } from './shared/UI/toast/toast.component';
import { AuthGuard } from './services/guards/AuthGuard';
import { LoginGuard } from './services/guards/LoginGuard';
import { TokenTimerComponent } from './shared/UI/token-timer/token-timer/token-timer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    RegisterComponent,
    ToastComponent,
    TokenTimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthGuard, LoginGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
