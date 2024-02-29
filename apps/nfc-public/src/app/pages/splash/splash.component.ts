import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ProfileService, SSRDirective } from '@notify/nfc-app-services';
import {
  ProfileViewComponent,
  SplineViewerComponent,
} from '@notify/ngx-components';

@Component({
  selector: 'notify-splash',
  standalone: true,
  imports: [
    CommonModule,
    ProfileViewComponent,
    SSRDirective,
    SplineViewerComponent,
  ],
  providers: [ProfileService],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent {
  @Output() componentStable = new EventEmitter<void>();

  // public demoProfile$!: Observable<INotifyProfile>;

  constructor(private _profileService: ProfileService) {
    // afterNextRender(
    //   () => {
    //     this.demoProfile$ = this._profileService.getProfile(
    //       '655805c8f5638dc5ef4b3590'
    //     );
    //     this.componentStable.emit();
    //   },
    //   { phase: AfterRenderPhase.Read }
    // );
  }
}
