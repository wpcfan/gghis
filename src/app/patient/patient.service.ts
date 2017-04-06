import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Patient } from '../domain/entities.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PatientService {
  private domain: string = 'patients';
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http, @Inject('API_BASE_URL') private baseUri) { }

  addPatient(patient: Patient): Observable<Patient>{
    const uri = `${this.baseUri}/${this.domain}`;
    return this.http.post(uri, JSON.stringify(patient), {headers: this.headers})
      .map(res => res.json() as Patient)
  }
}
