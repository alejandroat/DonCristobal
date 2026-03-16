import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CategoriasService } from '../../core/services/categorias/categorias.service';

type CategoriaVM = {
  id: number;
  nombre: string;
  estado: boolean;
  imagenUrl: string;
  imagenSrc?: string;
};

@Component({
  selector: 'app-categorias',
  imports: [CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit, OnDestroy {

  categorias: CategoriaVM[] = [];
  categoriasfiltradas: CategoriaVM[] = [];
  loadingCategorias: boolean = false;
  error: string | null = null;

  private objectUrls: string[] = [];

  constructor(
    private router: Router,
    private categoriasService: CategoriasService
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngOnDestroy(): void {
    // Prevent memory leaks from blob URLs.
    for (const url of this.objectUrls) {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
    }
    this.objectUrls = [];
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
        this.categoriasfiltradas = this.categorias.filter(c => c.estado === true);

        // Load images via backend endpoint (blob -> object URL)
        for (const c of this.categoriasfiltradas) {
          this.cargarImagenCategoria(c);
        }

        this.loadingCategorias = false;
      },
      error: () => {
        this.error = 'Error al cargar las categorías';
        this.loadingCategorias = false;
      }
    });
  }

  private cargarImagenCategoria(cat: CategoriaVM) {
    this.categoriasService.getCategoriaImagen(cat.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.objectUrls.push(url);
        cat.imagenSrc = url;
      },
      error: () => {
        cat.imagenSrc = '/assets/logo.png';
      }
    });
  }

  verProductos(categoriaId: number) {
    this.router.navigate(['/productos', categoriaId]);
  }
}



