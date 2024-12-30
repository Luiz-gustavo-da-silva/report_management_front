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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
    ReactiveFormsModule,
  ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModalComponent implements OnInit {
  form!: FormGroup;
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
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {
    if (data) {
      this.action = true;
      this.product = { ...data };
    }
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      name: [this.product.name, [Validators.required]],
      price: [this.product.price, [Validators.required, Validators.min(0)]],
      category: [this.product.category, Validators.required],
      description: [this.product.description, Validators.required],
    });
  }

  onClose(): void {
    this.dialogRef.close();
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

    const product: Product = {
      name: formValues.name,
      price: formValues.price,
      category: formValues.category,
      description: formValues.description,
    };

    this.action ? this.updateProduct(product) : this.addProduct(product);
    this.dialogRef.close(this.product);
  }

  updateProduct(product: Product) {
    product.id = Number(this.product.id);
    this.productsService.updateProduct(product).subscribe({
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

  addProduct(product: Product) {
    this.productsService.addProduct(product).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar(
          'Produto adicionado com sucesso!',
          'success'
        );
        this.onClose();
      },
      error: (err) => {
        this.snackbarService.showSnackBar(
          'Erro ao cadastrar o produto.',
          'error'
        );
      },
    });
  }
}
