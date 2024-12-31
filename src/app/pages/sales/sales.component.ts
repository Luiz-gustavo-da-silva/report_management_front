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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [LayoutComponent, MatTableModule, MatPaginatorModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  form!: FormGroup;

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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.salesService.findAll().subscribe({
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
          'Sale deletada com sucesso!',
          'success'
        );
        this.findAll();
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          'Erro ao deletar sale. Por favor, tente novamente!';
        this.snackbarService.showSnackBar(errorMessage, 'error');
      },
    });
  }
}
