import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environments'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string;
  private appUrl: string;
  private authUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.appUrl = 'api/usuarios';
    this.authUrl = 'api/auth';
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/obtener`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/obtener/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.appUrl}/crear`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.appUrl}/actualizar/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.appUrl}/eliminar/${id}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.authUrl}/login`, { username, password });
  }

}
