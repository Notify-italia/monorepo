import { CommonModule } from '@angular/common';
import {
  AfterRenderPhase,
  Component,
  EventEmitter,
  Output,
  afterNextRender,
} from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { ProfileService, SSRDirective } from '@notify/nfc-app-services';
import { ProfileViewComponent } from '@notify/ngx-components';
import { Observable } from 'rxjs';

@Component({
  selector: 'notify-splash',
  standalone: true,
  imports: [CommonModule, ProfileViewComponent, SSRDirective],
  providers: [ProfileService],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent {
  @Output() componentStable = new EventEmitter<void>();

  public canvasSize = {
    width: 1080,
    height: 1080,
  };

  public isProfileReady = false;

  public demoProfile$!: Observable<INotifyProfile>;

  constructor(private _profileService: ProfileService) {
    afterNextRender(
      () => {
        this.demoProfile$ = this._profileService.getProfile(
          '655805c8f5638dc5ef4b3590'
        );

        this.componentStable.emit();
      },
      { phase: AfterRenderPhase.Read }
    );
  }
}
