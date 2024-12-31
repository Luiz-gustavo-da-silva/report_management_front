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
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './stock-modal.component.html',
  styleUrl: './stock-modal.component.scss',
})
export class StockModalComponent implements OnInit {
  form!: FormGroup;
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
      description: '',
    },
  };

  getlistProductId!: ProductRedu[];

  action: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<StockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService,
    private productService: ProductsService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {
    if (data) {
      this.action = true;
      this.stock = { ...data };
    } else {
      this.action = false;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group(
      {
        productId: [this.stock.productId, [Validators.required, Validators.min(0)]],
        quantity: [
          this.stock.quantity,
          [
            Validators.required,
            Validators.min(1),
            Validators.pattern('^[0-9]*$'),
          ],
        ],
      }
    );

    if (this.action) {
      this.form.controls['productId'].disable();
    }

    this.findAllProductRedu();
  }

  onClose(): void {
    this.dialogRef.close();
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

  onSave(): void {
    if (this.form.invalid) {
      this.snackbarService.showSnackBar(
        'Por favor, corrija os erros antes de salvar.',
        'error'
      );
      return;
    }

    const formValues = this.form.getRawValue();

    const stock: Stock = {
      productId: Number(formValues.productId),
      quantity: Number(formValues.quantity),
    };
  
    this.action ? this.updateStock(stock) : this.addStock(stock);
    this.dialogRef.close();
  }
  
  updateStock(stock: Stock): void {
    this.stockService.updateStock(stock).subscribe({
      next: () => {
        this.snackbarService.showSnackBar(
          'Produto atualizado com sucesso!',
          'success'
        );
        this.onClose();
      },
      error: () => {
        this.snackbarService.showSnackBar(
          'Erro ao atualizar o produto.',
          'error'
        );
      },
    });
  }
  
  addStock(stock: Stock): void {
    this.stockService.addStock(stock).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar(
          'Stock do produto adicionado com sucesso!',
          'success'
        );
        this.onClose();
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          'Erro ao cadastrar stock!';
        this.snackbarService.showSnackBar(errorMessage, 'error');
      },
    });
  }
}
