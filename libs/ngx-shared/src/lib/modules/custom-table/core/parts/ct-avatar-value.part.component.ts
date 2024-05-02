import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import { DaisyUIAvatarMasks } from '@notify/interfaces';
import {
  CustomTableValueBaseComponent,
  INotifyCustomTableValueBase,
} from '../../../../constructors/custom-table-value.base.component';
import { UtilsService } from '../../../../services';
import { AvatarComponent } from '../../../../standalones';

export interface ICTAvatarValue extends INotifyCustomTableValueBase {
  valueType: 'avatar';
  avatarSize: string;
  fields: {
    src: string;
    mask: string;
    backgroundColor: string;
    placeholderSeed: string;
    userName: string;
    userSurname: string;
    userEmail: string;
  };
}

@Component({
  standalone: true,
  selector: 'notify-custom-table-avatar-value',
  imports: [CommonModule, AvatarComponent],
  providers: [UtilsService],
  template: ` <div
    class="flex items-center gap-3 "
    *ngIf="iteratedValues as values"
  >
    <div class="w-14 h-14">
      <notify-avatar [avatarConfig]="values"></notify-avatar>
    </div>
    <div>
      <div class="font-bold">
        {{ values.userName }} {{ values.userSurname }}
      </div>
      <div class="text-sm opacity-50">{{ values.userEmail }}</div>
    </div>
  </div>`,
})
export class CustomTableAvatarValueComponent
  extends CustomTableValueBaseComponent
  implements OnInit, OnChanges
{
  override value!: ICTAvatarValue;

  public iteratedValues: {
    src: string;
    mask: DaisyUIAvatarMasks;
    size: string;
    backgroundColor: string;
    placeholderSeed: string;
    userName: string;
    userSurname: string;
    userEmail: string;
  } | null = null;

  ngOnInit(): void {
    this._setIteratedValues();
  }

  ngOnChanges(): void {
    this._setIteratedValues();
  }

  private _setIteratedValues() {
    const { fields } = this.value;

    const result = {
      src:
        (this._utils.deepSearchKey(this.iterate, fields.src)[0] as string) ||
        '',
      mask: this._utils.deepSearchKey(
        this.iterate,
        fields.mask
      )[0] as DaisyUIAvatarMasks,
      size: this.value.avatarSize,
      backgroundColor: this._utils.deepSearchKey(
        this.iterate,
        fields.backgroundColor
      )[0] as string,
      placeholderSeed: this._utils.deepSearchKey(
        this.iterate,
        fields.placeholderSeed
      )[0] as string,
      userName: this._utils.deepSearchKey(
        this.iterate,
        fields.userName
      )[0] as string,
      userSurname: this._utils.deepSearchKey(
        this.iterate,
        fields.userSurname
      )[0] as string,
      userEmail: this._utils.deepSearchKey(
        this.iterate,
        fields.userEmail
      )[0] as string,
    };

    if (!result.src && !result.userName) {
      this.iteratedValues = null;
      return;
    }

    this.iteratedValues = result;
  }
}
