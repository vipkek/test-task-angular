import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckUserResponseData } from '../interface/responses';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  checkUser(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }

  createUser(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/submitForm', { username });
  }
}
