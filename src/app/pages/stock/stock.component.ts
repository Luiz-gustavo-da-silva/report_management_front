import { Component, ViewChild } from '@angular/core';
import { LayoutComponent } from '../../layouts/layout/layout.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { StockService } from '../../core/services/stock.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { StockObj } from '../../core/models/stock-interface';
import { StockModalComponent } from '../../shared/stock-modal/stock-modal.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FilterStock } from '../../core/models/filter-stock-interface';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    LayoutComponent,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent {
  form!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'quantity',
    'price',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  userRole: string | null = null;

  constructor(
    private stockService: StockService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group(
      {
        name: '',
        category: '',
        belowQuantity: [null, [Validators.min(0)]],
        aboveQuantity: [null, [Validators.min(0)]],
      },
      { updateOn: 'submit' }
    );
    this.findAll();
  }

  findAll() {
    const formValues = this.form.getRawValue();

    const form: FilterStock = {
      name: formValues.name,
      category: formValues.category,
      belowQuantity: formValues.belowQuantity,
      aboveQuantity: formValues.aboveQuantity,
    };

    this.stockService.findAll(form).subscribe({
      next: (response: StockObj) => {
        this.dataSource.data = response.data;
      },
      error: (err) => {
        this.snackbarService.showSnackBar(
          'Erro ao localizar tudo. Por favor, tente novamente',
          'error'
        );
      },
    });
  }

  addStock() {
    const dialogRef = this.dialog.open(StockModalComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  updateStock(element: any) {
    const dialogRef = this.dialog.open(StockModalComponent, {
      width: '400px',
      data: element,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  deleteStock(id: number) {
    this.stockService.deleteStock(id).subscribe({
      next: () => {
        this.snackbarService.showSnackBar(
          'Stock do Produto deletado com sucesso!',
          'success'
        );
        this.findAll();
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          'Erro ao deletar stock do produto. Por favor, tente novamente!';
        this.snackbarService.showSnackBar(errorMessage, 'error');
      },
    });
  }

  onSubmit() {
    this.findAll();
  }

  clearFilters() {
    this.form.reset({
      name: '',
      category: '',
      belowQuantity: null,
      aboveQuantity: null
    });

    this.findAll();
  }
}
