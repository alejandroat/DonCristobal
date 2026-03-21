import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductosService } from '../../core/services/productos/productos.service';
import { CategoriasService } from '../../core/services/categorias/categorias.service';

type ProductoVM = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  estado: boolean;
  imagenUrl?: string;
  categoriaId?: number;
  imagenSrc?: string;
};

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit, OnDestroy {

  categoriaId: number | null = null;
  categoriaNombre: string | null = null;

  productos: ProductoVM[] = [];
  productosFiltrados: ProductoVM[] = [];
  loading: boolean = false;
  error: string | null = null;

  private objectUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const raw = pm.get('categoriaId');
      const id = raw ? Number(raw) : NaN;
      this.categoriaId = Number.isFinite(id) ? id : null;
      this.cargarCategoriaNombre();
      this.cargarProductos();
    });
  }

  ngOnDestroy(): void {
    for (const url of this.objectUrls) {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
    }
    this.objectUrls = [];
  }

  volverCategorias() {
    this.router.navigate(['/categoria']);
  }

  private cargarCategoriaNombre() {
    this.categoriaNombre = null;
    if (this.categoriaId === null) return;

    this.categoriasService.getCategoriaById(this.categoriaId).subscribe({
      next: (cat) => {
        this.categoriaNombre = cat?.nombre ?? null;
      },
      error: () => {
        this.categoriaNombre = null;
      }
    });
  }

  cargarProductos() {
    this.loading = true;
    this.error = null;

    const req$ = this.categoriaId
      ? this.productosService.getProductosPorCategoria(this.categoriaId)
      : this.productosService.getProductos();

    req$.subscribe({
      next: (rows) => {
        this.productos = (rows || []).map((r: any) => ({
          id: r.id,
          nombre: r.nombre,
          descripcion: r.descripcion,
          precio: Number(r.precio),
          estado: r.estado,
          imagenUrl: r.imagenUrl,
          categoriaId: r.categoriaId ?? r.categoria_id
        }));

        this.productosFiltrados = this.productos.filter(p => p.estado === true);

        for (const p of this.productosFiltrados) {
          this.cargarImagenProducto(p);
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  private cargarImagenProducto(prod: ProductoVM) {
    this.productosService.getProductoImagen(prod.id).subscribe({
      next: (blob) => {
        if (blob.type === 'image/svg+xml') {
          prod.imagenSrc = undefined;
          return;
        }

        const url = URL.createObjectURL(blob);
        this.objectUrls.push(url);
        prod.imagenSrc = url;
      },
      error: () => {
        prod.imagenSrc = undefined;
      }
    });
  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}


