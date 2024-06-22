import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class LeadsService {
  private _httpService = inject(HttpService);
}
