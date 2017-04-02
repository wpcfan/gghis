import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdSidenav, MdSidenavContainer } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { authReducer } from '../reducers/auth.reducer';
import { loginTabReducer } from '../reducers/login-tab.reducer';
import { ageConvertReducer } from '../reducers/age-convert.reducer';
import { AuthGuardService } from './auth-guard.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    StoreModule.provideStore({
      auth: authReducer,
      loginTab: loginTabReducer,
      ageConvert: ageConvertReducer
    }),
    RouterStoreModule.connectRouter(),
    // Note that you must instrument after importing StoreModule
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    })
  ],
  exports:[
    FlexLayoutModule,
    HeaderComponent,
    FooterComponent,
    MdSidenav,
    MdSidenavContainer
  ],
  providers:[
    AuthGuardService,
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
