import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message: string, action: 'success' | 'error') {
    this.snackBar.open(message, action === 'success' ? '✔️' : '❌', {
      duration: 3000,
      panelClass: action === 'success' ? ['snack-success'] : ['snack-error'],
    });
  }
}
