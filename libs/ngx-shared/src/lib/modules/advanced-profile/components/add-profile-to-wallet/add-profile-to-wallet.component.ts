import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { tap } from 'rxjs';
import {
  CapacitorService,
  IAddToWalletError,
  IAddToWalletErrorParsed,
  ProfileService,
} from '../../../../services';
import { EnumSelectOptionStyle, SelectModalFactory } from '../../../modals';

@Component({
  selector: 'notify-add-profile-to-wallet',
  standalone: true,
  imports: [CommonModule],
  providers: [CapacitorService, ProfileService, SelectModalFactory],
  templateUrl: './add-profile-to-wallet.component.html',
  styleUrl: './add-profile-to-wallet.component.scss',
})
export class AddProfileToWalletComponent {
  private _capacitorService = inject(CapacitorService);
  private _profileSerivce = inject(ProfileService);
  private _selectModal = inject(SelectModalFactory);

  @Input({ required: true }) profile!: INotifyProfile;

  public get nativeDeviceType() {
    if (!this._capacitorService.isNative) {
      return null;
    }

    return this._capacitorService.devicePlatform;
  }

  public addToWallet(profile: INotifyProfile['_id']) {
    this._capacitorService.triggerHapticFeedback(
      this._capacitorService.hFeedbackStyles.Heavy
    );

    this._profileSerivce
      .getPkpass(profile)
      .pipe(
        tap(async (v) => {
          await this._capacitorService
            .addToWallet(v.base64)
            .catch((error: IAddToWalletError) => {
              const errorParsed = JSON.parse(
                error.message
              ) as IAddToWalletErrorParsed;
              console.log('errorParsed', errorParsed);
              const ref = this._selectModal.create({
                title: 'Errore',
                subtitle:
                  errorParsed.code === 100
                    ? `Questo profilo è già presente nel tuo wallet.`
                    : `Errore sconosciuto. Riprova più tardi o contattaci a supporto@notifyapp.it`,
                hideCancel: true,
                options: [
                  {
                    label: 'Ok',
                    value: null,
                    style: EnumSelectOptionStyle.DEFAULT,
                  },
                ],
              });

              ref.instance.optionSelected.subscribe(() => {
                ref.instance.close();
              });
            });
        })
      )
      .subscribe();
  }
}
