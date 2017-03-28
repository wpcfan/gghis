import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, LoginTab } from '../../domain/entities.interface';
import { Observable } from 'rxjs/Observable';
import { TAB_LOGIN, TAB_FORGOT, TAB_REGISTER } from '../../actions/login-tab.action'

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  tab$: Observable<LoginTab>;
  constructor(private store$: Store<AppState>) { 
    this.tab$ = this.store$.select(appState => appState.loginTab);
  }

  ngOnInit() {
  }
  onSelectedChange(selectedIndex){
    switch(selectedIndex){
      case 0:
        this.store$.dispatch({type: TAB_LOGIN});
        break;
      case 1:
        this.store$.dispatch({type: TAB_REGISTER});
        break;
      case 2:
        this.store$.dispatch({type: TAB_FORGOT});
        break;
      default:
        this.store$.dispatch({type: TAB_LOGIN});
    }
    
  }
}
