import { Component } from '@angular/core';
import { LayoutComponent } from '../../layouts/layout/layout.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../core/services/products.service';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Product } from '../../core/models/product-interface';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [LayoutComponent, MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'description', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  userRole: string | null = null;

  constructor(
    private productService: ProductsService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.productService.findAll().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data;
      },
      error: (err) => {
        this.snackbarService.showSnackBar(
          'Error find all. Please try again',
          'error'
        );
      },
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  updateProduct(element: any) {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '400px',
      data: element,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.snackbarService.showSnackBar(
          'Produto deletado com sucesso!',
          'success'
        );
        this.findAll();
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Erro ao deletar produto. Por favor, tente novamente!';
        this.snackbarService.showSnackBar(errorMessage, 'error');
      },
    });
  }
}
