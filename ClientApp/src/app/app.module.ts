import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScratchpadComponent } from './components/scratchpad/scratchpad.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProgressInterceptorProvider } from './interceptors/ProgressInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ScratchpadComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'scratchpad', component: ScratchpadComponent, pathMatch: 'full' },
      { path: '', component: HomeComponent, pathMatch: 'full' },
    ]),
  ],
  providers: [ProgressInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
