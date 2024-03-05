import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService, PixelService } from '@notify/nfc-app-services';
import {
  SplineViewerComponent,
  TailwindFormsModule,
} from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'notify-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TailwindFormsModule,
    SplineViewerComponent,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  @Input() public title = 'Siamo riusciti a convincerti?';
  @Input() public extraData: {
    type: 'file' | 'text';
    content: string;
    title: string;
  }[] = [];

  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required]),
  });

  constructor(
    private _httpService: HttpService,
    private _pixel: PixelService,
    private _toastr: ToastrService
  ) {}

  public submit() {
    if (!this.form.valid) {
      return;
    }

    this._pixel.track('Contact');

    this._httpService
      .get('/v1/sales/contact', {
        name: this.form.value.name,
        email: this.form.value.email,
        message: this.form.value.message,
        source: 'website',
      })
      .subscribe(() => {
        this._toastr.success('Grazie per averci contattato!');
        this.form.reset();
      });
  }
}
