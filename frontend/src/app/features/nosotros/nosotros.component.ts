import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  imports: [],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {

  constructor(private router: Router) {}

  iraInicio() {
    this.router.navigate(['/']);
  }

  iraMenu() {
    this.router.navigate(['/categoria']);
  }

}
