import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AutenticacaoService } from './autenticacao.service';
import { StorageService } from './storage.service';

describe('AutenticacaoService', () => {
  let service: AutenticacaoService;
  let storageService = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StorageService, useValue: storageService },
      ],
    });
    service = TestBed.inject(AutenticacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
