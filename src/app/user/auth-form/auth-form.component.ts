import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, LoginTab } from '../../domain/entities.interface';
import { Observable } from 'rxjs/Observable';

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

}
