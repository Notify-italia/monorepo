import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  AuthService,
  ProfileService,
  SocketService,
} from '@notify/nfc-app-services';
import { LoadingComponent, PageHeaderComponent } from '@notify/ngx-components';
import { tap } from 'rxjs';

@Component({
  selector: 'notify-share-files',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LoadingComponent],
  providers: [ProfileService],
  templateUrl: './share-files.component.html',
  styleUrl: './share-files.component.scss',
})
export class ShareFilesComponent implements OnInit, OnDestroy {
  public socketConnection$ = this._socket.connection$.pipe(
    tap((status) => {
      this.loading = !status;
    })
  );

  public devices$ = this._socket.connectedDevices$;

  public loading = false;

  constructor(
    private _socket: SocketService,
    private _profileService: ProfileService,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this._profileService.getProfile().subscribe((profile) => {
      this._socket.connect(
        profile._id,
        this._authService.user?.owner,
        this._authService.user?._id
      );
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy() {
    this._socket.disconnect();
  }
}
