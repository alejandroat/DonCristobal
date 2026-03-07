import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environments'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl: string;
  private appUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.appUrl = 'api/productos';
  }

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/obtener`);
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/obtener/${id}`);
  }

  getProductoImagen(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.appUrl}/imagen/${id}`, { responseType: 'blob' });
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.appUrl}/crear`, producto);
  }

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.appUrl}/actualizar/${id}`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.appUrl}/eliminar/${id}`);
  }

}
