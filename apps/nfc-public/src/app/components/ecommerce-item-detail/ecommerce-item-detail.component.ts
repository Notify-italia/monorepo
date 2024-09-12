import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyEcommerceProduct } from '@notify/interfaces';
import {
  baseModalComponentProviders,
  controlsFromObject,
  ModalBaseComponent,
  TailwindFormsModule,
  UploadComponent,
} from '@notify/ngx-shared';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TailwindFormsModule,
    UploadComponent,
  ],
  providers: [...baseModalComponentProviders],
  templateUrl: './ecommerce-item-detail.component.html',
  styleUrl: './ecommerce-item-detail.component.scss',
})
export class EcommerceItemDetailComponent
  extends ModalBaseComponent
  implements OnInit
{
  @Input() item!: INotifyEcommerceProduct;

  public selectedImage = 0;
  public form!: FormGroup<
    controlsFromObject<{
      quantity?: number | null;
      parsedOptions: {
        qrCode?: boolean;
        color?: string;
        usersInfo?: {
          alias: string;
        }[];
      };
    }>
  >;

  public get iterableQuantity() {
    return Array.from({ length: this.form.value.quantity || 0 });
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      parsedOptions: new FormGroup({}),
    });

    if (!this.item.options.noQuantity) {
      this.form.controls['quantity'] = new FormControl(1, [
        Validators.required,
        Validators.min(1),
      ]);
    }

    if (this.item.options.qrCode) {
      this.form.controls['parsedOptions'].addControl(
        'qrCode',
        new FormControl(false, [Validators.required])
      );
    }

    if (this.item.options.colors?.length) {
      this.form.controls['parsedOptions'].addControl(
        'color',
        new FormControl(null, [Validators.required])
      );
    }

    if (this.item.options.usersInfo) {
      this.form.controls['parsedOptions'].addControl(
        'usersInfo',
        new FormArray([
          new FormGroup({
            alias: new FormControl(null, [Validators.required]),
          }),
        ])
      );
    }

    if (this.item.options.logo) {
      this.form.controls['parsedOptions'].addControl(
        'logo',
        new FormControl(null, [Validators.required])
      );
    }

    if (this.item.options.userCount) {
      this.form.controls['parsedOptions'].addControl(
        'userCount',
        new FormControl(null, [Validators.required])
      );
    }
  }

  public shareProduct() {
    console.log('Sharing product...');

    if (!navigator.share) {
      navigator.clipboard.writeText(`${environment.shopUrl}/${this.item.id}`);
      alert('Link copiato negli appunti');
      return;
    }

    navigator.share({
      title: this.item.name,
      text: this.item.short_description,
      url: `${environment.shopUrl}?product=${this.item.id}`,
    });
  }

  public updateQuantity(value: number) {
    value = Number(value);

    this.form.controls['quantity']?.setValue(
      (this.form.controls['quantity'].value || 0) + value
    );

    if (!this.item.options.usersInfo) {
      return;
    }

    Array.from({ length: Math.abs(value) }).forEach(() => {
      if (value > 0) {
        (
          this.form.controls.parsedOptions.controls
            .usersInfo as unknown as FormArray
        ).push(
          new FormGroup({
            alias: new FormControl(null, [Validators.required]),
          })
        );
      }

      if (value < 0) {
        (
          this.form.controls.parsedOptions.controls
            .usersInfo as unknown as FormArray
        ).removeAt(
          (
            this.form.controls.parsedOptions.controls
              .usersInfo as unknown as FormArray
          ).length - 1
        );
      }
    });
  }

  public setQuantity = (value: string) => {
    this.updateQuantity(
      Number(value) - (this.form.controls['quantity']?.value || 0)
    );
  };

  public setLogo = (blob: string | ArrayBuffer | null, filename: string) => {
    (this.form.controls['parsedOptions'] as FormGroup).controls[
      'logo'
    ]?.setValue({
      filename,
      blob: blob as string,
    });
  };

  public setCarouselImage(filename: string) {
    const index = this.item.images.findIndex((image) => image === filename);

    if (index === -1) {
      return;
    }

    this.selectedImage = index;
  }

  public submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted.next({
      ...this.form.value,
      item: this.item,
    });
    this.close();
  }
}
