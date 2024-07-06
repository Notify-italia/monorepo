import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ISocketUserInfo } from '@notify/interfaces';
import {
  AuthService,
  DeviceCardComponent,
  LoadingComponent,
  NoItemsComponent,
  PageHeaderComponent,
  ProfileService,
  ShareFileFactory,
  SocketService,
} from '@notify/ngx-shared';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';

@Component({
  selector: 'notify-share-files',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    DeviceCardComponent,
    NoItemsComponent,
  ],
  providers: [ProfileService, ShareFileFactory],
  templateUrl: './share-files.component.html',
  styleUrl: './share-files.component.scss',
})
export class ShareFilesComponent {
  public devices$ = this._socket.connectedDevices$.pipe();
  public instructions = `<ul class="text-start  space-y-4"><li>1. Fai visitare il tuo profilo alla persona a cui vuoi inviare il file</li> 
  <li>2. Seleziona il dispositivo dall'elenco e carica un file</li>
  <li> 3. Conferma l'invio</li>
  </ul>`;

  constructor(
    private _socket: SocketService,
    private _profileService: ProfileService,
    private _authService: AuthService,
    private _shareFileModal: ShareFileFactory,
    private _toastrService: ToastrService
  ) {}

  public openShareFileForm(target: ISocketUserInfo) {
    const ref = this._shareFileModal.create();

    ref.instance.submitted
      .pipe(
        tap(async (file: File) => {
          this._socket.sendFile(await file.arrayBuffer(), file.name, target.id);
          this._toastrService.success(
            `${target.device} lo riceverà a breve`,
            'File inviato'
          );
        })
      )
      .subscribe();
  }
}
