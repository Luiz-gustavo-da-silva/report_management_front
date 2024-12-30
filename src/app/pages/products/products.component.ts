import { Component, ViewChild } from '@angular/core';
import { LayoutComponent } from '../../layouts/layout/layout.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../core/services/products.service';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Product } from '../../core/models/product-interface';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterProduct } from '../../core/models/filter-product-interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [LayoutComponent, MatTableModule, MatPaginatorModule, CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  form!: FormGroup;

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'price',
    'description',
    'createdAt',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  userRole: string | null = null;

  constructor(
    private productService: ProductsService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group(
      {
        name: '',
        category: '',
        minPrice: [null, [Validators.min(0)]],
        maxPrice: [null, [Validators.min(0)]],
        offset: 0,
      },
      { updateOn: 'submit' }
    );
    this.findAll();
  }

  findAll() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();

    const form: FilterProduct = {
      name: formValues.name,
      category: formValues.category,
      minPrice: formValues.minPrice,
      maxPrice: formValues.maxPrice
    };

    this.productService.findAll(form).subscribe({
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
        const errorMessage =
          err.error?.message ||
          'Erro ao deletar produto. Por favor, tente novamente!';
        this.snackbarService.showSnackBar(errorMessage, 'error');
      },
    });
  }

  onSubmit(){
    this.findAll();
  }

  clearFilters() {
    this.form.reset({
      name: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      offset: 0,
    });
  
    this.findAll();
  }
  
}
