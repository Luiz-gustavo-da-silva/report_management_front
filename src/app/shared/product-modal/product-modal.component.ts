import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../core/models/product-interface';
import { ProductsService } from '../../core/services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent {
  product: Product = {
    name: '',
    price: 0,
    category: '',
    description: ''
  };

  action: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productsService: ProductsService,
    private snackbarService: SnackbarService
  ) {
    if (data) {
      this.action = true;
      this.product ={...data}
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.action ? this.updateProduct() : this.addProduct();
    this.dialogRef.close(this.product);
  }

  updateProduct() {
    this.productsService.updateProduct(this.product).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar('Produto atualizado com sucesso!', 'success');
        this.onClose();
      },
      error: (err) => {
        this.snackbarService.showSnackBar('Erro ao atualizar o produto.', 'error');
      },
    });
  }

  addProduct() {
    this.productsService.addProduct(this.product).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar('Produto adicionado com sucesso!', 'success');
        this.onClose();
      },
      error: (err) => {
        this.snackbarService.showSnackBar('Erro ao produto a categoria.', 'error');
      },
    });
  } 
}
