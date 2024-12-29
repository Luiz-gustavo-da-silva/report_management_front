import { Component, Inject, OnInit } from '@angular/core';
import { StockService } from '../../core/services/stock.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Stock, StockData } from '../../core/models/stock-interface';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductRedu } from '../../core/models/product-interface';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-stock-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './stock-modal.component.html',
  styleUrl: './stock-modal.component.scss',
})
export class StockModalComponent implements OnInit {
  stock: StockData = {
    id: 0,
    productId: -1,
    quantity: 0,
    createdAt: '',
    updatedAt: '',
    product: {
      id: 0,
      name: '',
      price: 0,
      category: '',
      description: ''
    }
  };

  getlistProductId!: ProductRedu[];

  action: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<StockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService,
    private productService: ProductsService,
    private snackbarService: SnackbarService
  ) {
    if (data) {
      this.action = true;
      this.stock = { ...data };
    } else {
      this.action = false;
    }
  }

  ngOnInit(): void {
    this.findAllProductRedu();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.action ? this.updateStock() : this.addStock();
    this.dialogRef.close(this.stock);
  }

  findAllProductRedu() {
    this.productService.getlistProductId().subscribe({
      next: (response) => {
        this.getlistProductId = response;
      },
      error: (err) => {
        this.snackbarService.showSnackBar(
          'Erro ao buscar produtos.',
          'error'
        );
      },
    });
  }

  updateStock() {
    const stock: Stock = {
      productId: Number(this.stock.productId),
      quantity: this.stock.quantity,
    }

    this.stockService.updateStock(stock).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar(
          'Produto atualizado com sucesso!',
          'success'
        );
        this.onClose();
      },
      error: (err) => {
        this.snackbarService.showSnackBar(
          'Erro ao atualizar o produto.',
          'error'
        );
      },
    });
  }

  addStock() {
    const stock: Stock = {
      productId: Number(this.stock.productId),
      quantity: this.stock.quantity
    }

    this.stockService.addStock(stock).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar(
          'Stock do produto adicionado com sucesso!',
          'success'
        );
        this.onClose();
      },
      error: (err) => {
        this.snackbarService.showSnackBar(
          'Erro ao cadastrar stock.',
          'error'
        );
      },
    });
  }
}
