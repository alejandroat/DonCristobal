import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../core/services/productos/productos.service';
import { CategoriasService } from '../../core/services/categorias/categorias.service';
import { UserService } from '../../core/services/user/user.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { NgIf, NgFor, isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID, inject } from '@angular/core';


@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  mostrar: 'productos' | 'categorias' = 'productos';
  productos: Array<{ id: number, nombre: string,estado: boolean, precio: number, categoriaId: string , descripcion: string }> = [];
  categorias: Array<{ id: number, nombre: string, estado: boolean, imagenUrl: string }> = [];
  usuario: Array<{ id: number, username: string, contrasena: string }> = [];
  loadingProductos: boolean = false;
  loadingCategorias: boolean = false;
  error: string | null = null;
  perfilid: number | null = null;

  modalCrudAbierto = false;
  modoEdicion = false;

  tipoFormulario: 'producto' | 'categoria' = 'producto';

  formProducto = {
    id: null as number | null,
    nombre: '',
    descripcion: '',
    precio: 0,
    estado: true,
    categoriaId: null as number | null,
    imagen: null as File | null
  };

  formCategoria = {
    id: null as number | null,
    nombre: '',
    estado: true,
    imagen: null as File | null
  };

  // Login
  modalLoginAbierto = false;
  loginData = { username: '', password: '' };
  loginError: string | null = null;
  isLogged = false;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    };
    if (!this.authService.isLogged()) {
      this.modalLoginAbierto = true;
      this.isLogged = false;
      return;
    }

    this.cargarCategorias();
    this.cargarProductos();
  }

  login() {
    this.loginError = null;
    this.userService.login(this.loginData.username, this.loginData.password).subscribe({
      next: (resp) => {
        this.perfilid = resp?.user.id || null;
        if (resp?.token) {
          this.authService.setToken(resp.token);
          this.isLogged = true;
          this.modalLoginAbierto = false;
          this.cargarProductos();
          this.cargarCategorias();
        } else {
          this.loginError = 'Respuesta inesperada del servidor';
        }
      },
      error: (err) => {
        this.loginError = err?.error?.message || 'Usuario o contraseña incorrectos';
      }
    });
  }

  cargarProductos() {
    this.loadingProductos = true;
    this.productosService.getProductos().subscribe({
      next: (rows) => {
        this.productos = (rows || []).map((r: any) => ({
          id: r.id,
          nombre: r.nombre,
          precio: r.precio,
          estado: r.estado,
          categoriaId: r.categoriaId,
          descripcion: r.descripcion || ''
        }));
        this.loadingProductos = false;
        console.log(this.productos);

      },

      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loadingProductos = false;
      }
    });
  }

  getNombreCategoria(id: string): string {
    const cat = this.categorias.find(c => c.id === Number(id));
    return cat ? cat.nombre : '';
  }

  cargarCategorias() {
    this.loadingCategorias = true;
    this.categoriasService.getCategorias().subscribe({
      next: (rows) => {
        this.categorias = (rows || []).map((r: any) => ({
          id: r.id,
          nombre: r.nombre,
          estado: r.estado,
          imagenUrl: r.imagenUrl
        }));
        this.loadingCategorias = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las categorías';
        this.loadingCategorias = false;
      }
    });
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.tipoFormulario = this.mostrar === 'productos' ? 'producto' : 'categoria';
    this.resetForm();
    this.modalCrudAbierto = true;
  }

  editarProducto(producto: any) {
    this.modoEdicion = true;
    this.tipoFormulario = 'producto';
    this.formProducto = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      estado: producto.estado,
      categoriaId: producto.categoriaId,
      imagen: null
    };
    this.modalCrudAbierto = true;
  }

  editarCategoria(categoria: any) {
    this.modoEdicion = true;
    this.tipoFormulario = 'categoria';
    this.formCategoria = {
      id: categoria.id,
      nombre: categoria.nombre,
      estado: categoria.estado,
      imagen: null
    };
    this.modalCrudAbierto = true;
  }

  resetForm() {
    this.formProducto = {
      id: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      estado: true,
      categoriaId: null,
      imagen: null
    };
    this.formCategoria = {
      id: null,
      nombre: '',
      estado: true,
      imagen: null
    };
  }

  onFileSelected(event: any, tipo: 'producto' | 'categoria') {
    const file = event.target.files[0];
    if (!file) return;

    if (tipo === 'producto') {
      this.formProducto.imagen = file;
    } else {
      this.formCategoria.imagen = file;
    }
  }

  guardar() {
    if (this.tipoFormulario === 'producto') {
      const formData = new FormData();
      formData.append('nombre', this.formProducto.nombre);
      formData.append('descripcion', this.formProducto.descripcion);
      formData.append('precio', this.formProducto.precio.toString());
      formData.append('estado', String(this.formProducto.estado));
      formData.append('categoriaId', String(this.formProducto.categoriaId));

      if (this.formProducto.imagen) {
        formData.append('imagen', this.formProducto.imagen);
      }

      if (this.modoEdicion && this.formProducto.id) {
        this.productosService.updateProducto(this.formProducto.id, formData).subscribe(() => {
          this.cargarProductos();
          this.modalCrudAbierto = false;
        });
      } else {
        this.productosService.createProducto(formData).subscribe(() => {
          this.cargarProductos();
          this.modalCrudAbierto = false;
        });
      }

    } else {

      const formData = new FormData();
      formData.append('nombre', this.formCategoria.nombre);
      formData.append('estado', String(this.formCategoria.estado));

      if (this.formCategoria.imagen) {
        formData.append('imagen', this.formCategoria.imagen);
      }

      if (this.modoEdicion && this.formCategoria.id) {
        this.categoriasService.updateCategoria(this.formCategoria.id, formData).subscribe(() => {
          this.cargarCategorias();
          this.modalCrudAbierto = false;
        });
      } else {
        this.categoriasService.createCategoria(formData).subscribe(() => {
          this.cargarCategorias();
          this.modalCrudAbierto = false;
        });
      }
    }
  }


  activarProducto(producto: any) {
    const nuevoEstado = !producto.estado;
    this.productosService.updateProducto(producto.id, { estado: nuevoEstado }).subscribe(() => {
      this.cargarProductos();
    });
  }

  activarCategoria(categoria: any) {
    const nuevoEstado = !categoria.estado;
    this.categoriasService.updateCategoria(categoria.id, { estado: nuevoEstado }).subscribe(() => {
      this.cargarCategorias();
    });
  }

  eliminarProducto(producto: any) { }
  eliminarCategoria(categoria: any) { }



}
