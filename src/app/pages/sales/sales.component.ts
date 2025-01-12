import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StockModalComponent } from '../../shared/stock-modal/stock-modal.component';
import { SalesService } from '../../core/services/sales.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LayoutComponent } from '../../layouts/layout/layout.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { SaleModalComponent } from '../../shared/sale-modal/sale-modal.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FilterSale } from '../../core/models/filter-sale-interface';
import { SaleObj } from '../../core/models/sale-interface';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    LayoutComponent,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  form!: FormGroup;
  totalSales: number = 0;
  totalProductsSold: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    'saleId',
    'name',
    'price',
    'quantity',
    'totalPrice',
    'saleDate',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  userRole: string | null = null;

  constructor(
    private salesService: SalesService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);

    this.form = this.fb.nonNullable.group(
      {
        name: '',
        startDate: this.formatDate(firstDayOfMonth),
        endDate: this.formatDate(lastDayOfMonth),
      },
      { updateOn: 'submit' }
    );

    this.findAll();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  findAll() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();

    const form: FilterSale = {
      name: formValues.name,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
    };

    this.salesService.findAll(form).subscribe({
      next: (response: SaleObj) => {
        this.dataSource.data = response.data;
        this.totalSales = response.totalSales;
        this.totalProductsSold = response.totalProductsSold;
      },
      error: (err) => {
        this.snackbarService.showSnackBar(
          'Erro ao localizar tudo. Por favor, tente novamente',
          'error'
        );
      },
    });
  }

  addSale() {
    const dialogRef = this.dialog.open(SaleModalComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  deleteSale(id: number) {
    this.salesService.deleteSale(id).subscribe({
      next: () => {
        this.snackbarService.showSnackBar(
          'Venda deletada com sucesso!',
          'success'
        );
        this.findAll();
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          'Erro ao deletar Venda. Por favor, tente novamente!';
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
      startDate: '',
      endDate: '',
    });

    this.findAll();
  }
}
