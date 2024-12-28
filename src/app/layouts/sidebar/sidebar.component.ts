import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isSidebarCollapsed = false;
  userRole: string | null = null;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userRole = this.autenticacaoService.getRole();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.snackbarService.showSnackBar('Logout successfully!', 'success');
    this.autenticacaoService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }
}
