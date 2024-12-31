import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SalesService } from '../../core/services/sales.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Stock, StockProduct } from '../../core/models/stock-interface';
import { ProductsService } from '../../core/services/products.service';
import { ProductRedu } from '../../core/models/product-interface';
import { StockService } from '../../core/services/stock.service';

@Component({
  selector: 'app-sale-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sale-modal.component.html',
  styleUrl: './sale-modal.component.scss',
})
export class SaleModalComponent implements OnInit {
  form!: FormGroup;
  action: boolean = false;
  getlistProductId!: ProductRedu[];

  sale: Stock = {
    productId: -1,
    quantity: 0,
  };

  stockProduct: StockProduct = {
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
      description: '',
    },
  };

  constructor(
    public dialogRef: MatDialogRef<SaleModalComponent>,
    private salesService: SalesService,
    private snackbarService: SnackbarService,
    private productService: ProductsService,
    private stockService: StockService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      productId: [-1, [Validators.required, Validators.min(0),]],
      quantity: [
        0,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
    this.findAllProductRedu();
  }

  findAllProductRedu() {
    this.productService.getlistProductId().subscribe({
      next: (response) => {
        this.getlistProductId = response;
      },
      error: (err) => {
        this.snackbarService.showSnackBar('Erro ao buscar produtos.', 'error');
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  addSale() {
    if (this.form.invalid) {
      this.snackbarService.showSnackBar(
        'Por favor, corrija os erros antes de salvar.',
        'error'
      );
      return;
    }

    const formValues = this.form.getRawValue();

    const sale: Stock = {
      productId: Number(formValues.productId),
      quantity: Number(formValues.quantity),
    };

    this.salesService.addSale(sale).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar(
          'Sale adicionada com sucesso!',
          'success'
        );
        this.onClose();
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Erro ao deletar a sale.';
        this.snackbarService.showSnackBar(errorMessage, 'error');
      },
    });
  }

  getStockById() {
    this.stockProduct.quantity = 0;
    this.stockProduct.product.price = 0;

    const formValues = this.form.getRawValue();

    this.stockService.getStockById(formValues.productId).subscribe({
      next: (response) => {
        if (response) {
          this.stockProduct = response;
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Erro ao deletar a sale.';
        this.snackbarService.showSnackBar(errorMessage, 'error');
      },
    });
  }
}
