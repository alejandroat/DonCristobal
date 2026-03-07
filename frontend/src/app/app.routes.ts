import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)},
    {path: 'nosotros', loadComponent: () => import('./features/nosotros/nosotros.component').then(m => m.NosotrosComponent)},
    {path: 'categoria', loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent)},
    {path: 'productos', loadComponent: () => import('./features/productos/productos.component').then(m => m.ProductosComponent)},
    {path: 'panel', loadComponent: () => import('./features/panel/panel.component').then(m => m.PanelComponent)},
];
