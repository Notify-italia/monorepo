import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
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
} from '@notify/ngx-shared';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
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
      quantity: number | null;
      parsedOptions: {
        qrCode?: boolean;
        color?: string;
      };
    }>
  >;

  public ngOnInit(): void {
    this.form = new FormGroup({
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      parsedOptions: new FormGroup({}),
    });

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
  }

  public shareProduct() {
    console.log('Sharing product...');

    if (!navigator.share) {
      navigator.clipboard.writeText(
        `${environment.shopUrl}?product=${this.item.id}`
      );
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
    this.form.controls['quantity'].setValue(
      (this.form.controls['quantity'].value || 0) + value
    );
  }

  public setImage(filename: string) {
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
