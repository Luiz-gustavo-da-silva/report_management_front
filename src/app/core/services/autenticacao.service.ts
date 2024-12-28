import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoginForm } from '../models/login-form';
import { StorageService } from './storage.service';
import { SignupForm } from '../models/signup-form';
import { jwtDecode } from "jwt-decode";
import { User } from '../models/user';

const TOKEN_KEY = 'auth.token';

@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {
  readonly baseUrl = 'http://localhost:3000/api';

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
  ) {}

  obterToken(login: LoginForm): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/auth/login`, login);
  }

  login(login: LoginForm): Observable<void> {
    return this.obterToken(login).pipe(
      map((it) => this.storageService.put(TOKEN_KEY, it)),
    );
  }

  logout() {
    this.storageService.put(TOKEN_KEY, {});
  }

  isUsuarioLogado(): boolean {
    return this.usuarioLogado?.token != null;
  }

  get usuarioLogado(): AuthResponse | null {
    return this.storageService.get(TOKEN_KEY);
  }

  signup(signup: SignupForm):Observable<DefaultResponse> {
    return this.httpClient.post<DefaultResponse>(`${this.baseUrl}/auth/signup`, signup);
  }

  getRole(): string | null {
    const authResponse = this.usuarioLogado;
    if (!authResponse?.token) {
      return null;
    }
    return authResponse?.user.role;
  }
}

interface AuthResponse {
  token: string;
  user: User;
}

export interface DefaultResponse{
  massage: string;
}