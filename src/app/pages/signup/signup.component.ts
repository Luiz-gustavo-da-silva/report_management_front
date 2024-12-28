import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { CommonModule } from '@angular/common';
import { SignupForm } from '../../core/models/signup-form';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [provideNgxMask()],
})
export class SignupComponent {
  form!: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group(
      {
        name: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
      },
      { updateOn: 'submit' }
    );
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();

    const form: SignupForm = {
      email: formValues.email,
      name: formValues.name,
      password: formValues.password,
    };

    this.autenticacaoService.signup(form).subscribe({
      next: (response) => {
        this.snackbarService.showSnackBar('sigup successfully!', 'success');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        this.snackbarService.showSnackBar('Error signup!', 'error');
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
