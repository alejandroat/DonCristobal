import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environments'
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiUrl :string;
  private appUrl :string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.appUrl = 'api/categorias';
  }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/obtener`);
  }

  getCategoriaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/obtener/${id}`);
  }

  getCategoriaImagen(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/imagen/${id}`, { responseType: 'blob' });
  }

  createCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.appUrl}/crear`, categoria);
  }

  updateCategoria(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.appUrl}/actualizar/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.appUrl}/eliminar/${id}`);
  }
  
}

