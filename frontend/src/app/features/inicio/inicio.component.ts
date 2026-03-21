import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  constructor(private router: Router) {}

  iraMenu() {
    this.router.navigate(['/categoria']);
  }

  iraNosotros() {
    this.router.navigate(['/nosotros']);
  }

  domicilios() {
    window.open('https://wa.me/573225628345?text=Hola%20quiero%20hacer%20un%20pedido', '_blank');
  }

}
