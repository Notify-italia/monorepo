import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService } from '@notify/nfc-app-services';
import { TailwindFormsModule } from '@notify/ngx-components';

@Component({
  selector: 'notify-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required]),
  });

  constructor(private _httpService: HttpService) {}

  public submit() {
    if (!this.form.valid) {
      return;
    }

    this._httpService
      .get('/v1/sales/contact', {
        name: this.form.value.name,
        email: this.form.value.email,
        message: this.form.value.message,
        source: 'website',
      })
      .subscribe(() => {
        this.form.reset();
      });
  }
}
