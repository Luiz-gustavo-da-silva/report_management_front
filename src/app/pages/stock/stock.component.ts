import { Component } from '@angular/core';
import { LayoutComponent } from '../../layouts/layout/layout.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { StockService } from '../../core/services/stock.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { StockObj } from '../../core/models/stock-interface';
import { StockModalComponent } from '../../shared/stock-modal/stock-modal.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [LayoutComponent, MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent {
  displayedColumns: string[] = ['id', 'name', 'quantity', 'price', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  userRole: string | null = null;

  constructor(
    private stockService: StockService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.stockService.findAll().subscribe({
      next: (response: StockObj) => {
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
          'Produto deletado do estoque com sucesso!',
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
}
