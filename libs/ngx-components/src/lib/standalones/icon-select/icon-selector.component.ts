import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SvgBoxIcon, SvgboxService } from '@notify/nfc-app-services';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  map,
  startWith,
} from 'rxjs';
import { TailwindFormsModule } from '../../modules/tailwind-forms/tailwind-forms.module';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';

@Component({
  selector: 'notify-icon-selector',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    SvgBoxIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.scss'],
})
export class IconSelectorComponent implements OnInit {
  @Input() public icon?: SvgBoxIcon['name'];
  @Output() public iconValue = new EventEmitter<SvgBoxIcon>();

  @ViewChildren('card') public cards?: QueryList<ElementRef>;

  public hideSelector = false;
  public MANUAL_REFRESH = true;

  public searchValue = new FormControl('');
  public availableIcons$ = new BehaviorSubject<SvgBoxIcon[]>(
    this._svgBox.availableIcons
  );
  public filteredIcons$ = new Observable<SvgBoxIcon[]>();

  public currentIcon: SvgBoxIcon = {
    expanded: 'Question',
    name: 'question',
    tags: [],
    set: 'octicons',
    score: 10,
  };

  constructor(private _svgBox: SvgboxService) {
    this._searchFilter();
  }

  public ngOnInit() {
    if (this.icon) {
      //if the icon is passed as input, we hide the selector and set the current icon
      this.hideSelector = true;
      this.currentIcon = this.availableIcons$.value.find(
        (icon) => icon.name === this.icon
      ) as SvgBoxIcon;
    }

    this.iconValue.emit(this.currentIcon);
  }

  public onMouseMove(event: MouseEvent) {
    this.cards?.forEach((card) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.nativeElement.style.setProperty('--xPos', `${x}px`);
      card.nativeElement.style.setProperty('--yPos', `${y}px`);
    });
  }

  public setIcon(icon: SvgBoxIcon) {
    this.currentIcon = icon;
    this.iconValue.emit(this.currentIcon);
    this.hideSelector = true;

    this._refresh();
  }

  private _refresh() {
    this.MANUAL_REFRESH = false;

    setTimeout(() => {
      this.MANUAL_REFRESH = true;
    }, 1);
  }

  @HostListener('document:keydown.escape')
  private _closeSelector() {
    this.hideSelector = true;
  }

  private _searchFilter() {
    const searchValue$ = this.searchValue.valueChanges.pipe(
      debounceTime(500),
      startWith('')
    );

    this.filteredIcons$ = combineLatest([
      this.availableIcons$,
      searchValue$,
    ]).pipe(
      map(([icons, searchValue]) => {
        if (!searchValue || searchValue?.length < 3) {
          return icons;
        }

        return icons.filter((icon) => {
          return [icon.name, icon.expanded]
            .join(' ')
            .toLowerCase()
            .includes(searchValue?.toLowerCase());
        });
      })
    );
  }
}
