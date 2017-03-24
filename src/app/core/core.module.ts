import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdSidenav, MdSidenavContainer } from '@angular/material';
import { authReducer } from '../reducers/auth.reducer';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import 'hammerjs';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.provideStore({
      auth: authReducer
    }),
    RouterStoreModule.connectRouter()
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    MdSidenav,
    MdSidenavContainer
  ],
  providers:[
    AuthGuardService,
    AuthService,
    {
      provide: 'API_BASE_URL',
      useValue: 'http://localhost:8090'
    }
  ],
  declarations: [HeaderComponent, FooterComponent]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
