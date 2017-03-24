import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { HttpModule } from '@angular/http';
import { authReducer } from '../reducers/auth.reducer';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    StoreModule.provideStore({
      auth: authReducer
    }),
    RouterStoreModule.connectRouter()
  ],
  providers:[
    AuthGuardService,
    AuthService
  ],
  declarations: []
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
