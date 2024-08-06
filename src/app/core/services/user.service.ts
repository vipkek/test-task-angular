import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray } from "@angular/forms";
import { Observable } from 'rxjs';
import { CheckUserResponseData, SubmitFormResponseData } from '../interface/responses';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  checkUser(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }

  createUser(formArray: FormArray): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', formArray);
  }
}
