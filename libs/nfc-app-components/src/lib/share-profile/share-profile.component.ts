import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'notify-share-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss'],
})
export class ShareProfileComponent {
  public copyToClipboard() {
    console.log('copyToClipboard');
  }
}
