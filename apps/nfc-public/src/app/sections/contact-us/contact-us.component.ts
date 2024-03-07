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
import { Attachment } from 'nodemailer/lib/mailer';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: Attachment;
    title: string;
  } | null = null;

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

  public async submit() {
    if (!this.form.valid || (this.extraData && !this.extraData?.content)) {
      return;
    }

    this._pixel.track('Purchase');

    this._httpService
      .post('/v1/sales/contact', {
        name: this.form.value.name,
        email: this.form.value.email,
        message: this.form.value.message,
        source: 'website',
        attachments: [
          {
            content: await this._arrayBufferToBase64(
              this.extraData?.content.content as ArrayBuffer
            ),
            filename: this.extraData?.content.filename,
          },
        ],
      })
      .subscribe(() => {
        this._toastr.success('Grazie per averci contattato!');
        this.form.reset();
      });
  }

  private async _arrayBufferToBase64(buffer: ArrayBuffer) {
    //arraybuffer to blob
    const blob = new Blob([buffer]);

    const result = new Promise<string | ArrayBuffer | null>((resolve) => {
      //blob to base64 without using FileReader
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        return resolve(reader.result);
      };
    });

    return result;
  }
}
