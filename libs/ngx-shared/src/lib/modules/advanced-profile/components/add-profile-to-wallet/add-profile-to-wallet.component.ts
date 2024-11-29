import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { catchError, Observable, switchMap, tap } from 'rxjs';
import {
  CapacitorService,
  IAddToAppleWalletError,
  IAddToAppleWalletErrorParsed,
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

    this._addToWallet$(profile).subscribe();
  }

  private _addToWallet$(profile: INotifyProfile['_id']) {
    switch (this.nativeDeviceType) {
      case 'ios':
        return this._addAppleWallet$(profile);

      case 'android':
        return this._addToGoogleWallet$(profile);
    }

    const ref = this._selectModal.create({
      title: 'Errore',
      subtitle: `Scegli il dispositivo su cui vuoi aggiungere il profilo al wallet.`,
      options: [
        {
          label: 'Android',
          value: 'android',
          style: EnumSelectOptionStyle.DEFAULT,
        },
        {
          label: 'iOS',
          value: 'ios',
          style: EnumSelectOptionStyle.DEFAULT,
        },
      ],
    });

    return ref.instance.optionSelected.pipe(
      switchMap((v) => {
        ref.instance.close();

        switch (v.value) {
          case 'android':
            return this._addToGoogleWallet$(profile);
          case 'ios':
            return this._addAppleWallet$(profile);
        }

        return new Observable();
      })
    );
  }

  private _addToGoogleWallet$(profile: INotifyProfile['_id']) {
    return this._profileSerivce.getGooglePass(profile).pipe(
      tap((v) => {
        window.open(v.passUrl, '_blank');
      }),
      catchError(() => {
        const ref = this._selectModal.create({
          title: 'Errore',
          subtitle: `Errore sconosciuto. Riprova più tardi o contattaci a supporto@notifyapp.it`,
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
        return new Observable();
      })
    );
  }

  private _addAppleWallet$(profile: INotifyProfile['_id']) {
    return this._profileSerivce.getPkpass(profile).pipe(
      tap(async (v) => {
        await this._capacitorService
          .addToWallet(v.base64)
          .catch((error: IAddToAppleWalletError) => {
            const errorParsed = JSON.parse(
              error.message
            ) as IAddToAppleWalletErrorParsed;
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
    );
  }
}
