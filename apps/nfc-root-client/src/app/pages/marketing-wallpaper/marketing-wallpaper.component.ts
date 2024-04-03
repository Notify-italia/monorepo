import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppTitleComponent, WallpaperComponent } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    WallpaperComponent,
    AppTitleComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './marketing-wallpaper.component.html',
  styleUrl: './marketing-wallpaper.component.scss',
})
export class MarketingWallpaperComponent {
  public form = new FormGroup({
    gradient: new FormGroup({
      start: new FormControl('#ff0000'),
      end: new FormControl('#0000ff'),
    }),
    blur: new FormGroup({
      amount: new FormControl(10),
      threshold: new FormControl(1.2),
    }),
    scale: new FormGroup({
      min: new FormControl(0.6),
      max: new FormControl(1.4),
    }),
    evenItemsOffsets: new FormGroup({
      min: new FormControl(0),
      max: new FormControl(40),
    }),
    oddItemsOffsets: new FormGroup({
      min: new FormControl(60),
      max: new FormControl(90),
    }),
    cards: new FormControl(20),
    delay: new FormGroup({
      fastCards: new FormGroup({
        items: new FormControl(5),
        min: new FormControl(0),
        max: new FormControl(4),
      }),
      items: new FormGroup({
        min: new FormControl(0),
        max: new FormControl(20),
      }),
    }),
  });

  constructor() {
    const savedForm = localStorage.getItem('savedForm');
    if (savedForm) {
      this.form.setValue(JSON.parse(savedForm));
    }

    this.form.valueChanges.subscribe(() => {
      this.saveChanges();
    });
  }

  saveChanges() {
    localStorage.setItem('savedForm', JSON.stringify(this.form.value));
  }

  resetForm() {
    localStorage.removeItem('savedForm');
    this.form.setValue({
      gradient: {
        start: '#ff0000',
        end: '#0000ff',
      },
      blur: {
        amount: 10,
        threshold: 1.2,
      },
      scale: {
        min: 0.6,
        max: 1.4,
      },
      evenItemsOffsets: {
        min: 0,
        max: 40,
      },
      oddItemsOffsets: {
        min: 60,
        max: 90,
      },
      cards: 20,
      delay: {
        fastCards: {
          items: 5,
          min: 0,
          max: 4,
        },
        items: {
          min: 0,
          max: 20,
        },
      },
    });
  }
}
