import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ISocketUserInfo } from '@notify/interfaces';
import {
  AuthService,
  ProfileService,
  SocketService,
} from '@notify/nfc-app-services';
import {
  DeviceCardComponent,
  LoadingComponent,
  NoItemsComponent,
  PageHeaderComponent,
  ShareFileFactory,
} from '@notify/ngx-components';
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
export class ShareFilesComponent implements OnInit, OnDestroy {
  public devices$ = this._socket.connectedDevices$.pipe();

  constructor(
    private _socket: SocketService,
    private _profileService: ProfileService,
    private _authService: AuthService,
    private _shareFileModal: ShareFileFactory
  ) {}

  public ngOnInit() {
    this._profileService.getProfile().subscribe((profile) => {
      this._socket.connect(
        profile._id,
        this._authService.user?.owner,
        this._authService.user?._id
      );
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public ngOnDestroy() {
    this._socket.disconnect();
  }

  public openShareFileForm(target: ISocketUserInfo) {
    const ref = this._shareFileModal.create();

    ref.instance.submitted
      .pipe(
        tap(async (file: File) => {
          this._socket.sendFile(await file.arrayBuffer(), file.name, target.id);
        })
      )
      .subscribe();
  }
}
