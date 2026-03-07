import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-categorias',
  imports: [CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  constructor(private router: Router) {}

  categorias = [
    { nombre: 'Entrantes', imagen: 'assets/entrantes.jpg' },
    { nombre: 'Platos Principales', imagen: 'assets/platos_principales.jpg' },
    { nombre: 'Postres', imagen: 'assets/postres.jpg' },
    { nombre: 'Bebidas', imagen: 'assets/bebidas.jpg' }
  ];

}
