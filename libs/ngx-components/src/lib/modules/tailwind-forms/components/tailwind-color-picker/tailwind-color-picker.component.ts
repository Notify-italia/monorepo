import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TailwindFormsService } from '../../services/tailwind-forms.service';

@Component({
  selector: 'notify-tailwind-color-picker',
  templateUrl: './tailwind-color-picker.component.html',
  styleUrls: ['./tailwind-color-picker.component.scss'],
})
export class TailwindColorPickerComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() parent!: FormGroup;
  @Input() name!: string;
  @Input() validationErrors!: { [key: string]: string };
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  //an array colors to be used as default colors
  @Input() colors: string[] = [
    //white
    '#ffffff',

    //blue
    '#2CCCE4',
    '#1677FF',

    //green
    '#37D67A',
    '#006600',

    //yellow
    '#FFCC00',
    '#ff9300',

    //red
    '#F47373',

    //pink
    '#FF7BAC',
    '#FF00FF',

    //gray
    '#555555',
  ];

  public colorPickerOpen = false;
  public color = '';
  public defaultColor = '#ffffff';

  private destroy$ = new Subject<void>();

  constructor(private tailwindFormService: TailwindFormsService) {}

  handleColorPickerChange() {
    this.parent.controls[this.name].setValue(this.color);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    const formColor = this.parent.controls[this.name].value;
    if (formColor.length) {
      this.color = formColor;
    }

    this.parent.controls[this.name].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.color = value;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['validationErrors']) {
      this.validationErrors =
        this.tailwindFormService.fillValidationErrorsWithMissing(
          this.parent.get(this.name),
          this.validationErrors
        );
    }

    this.color = this.parent.controls[this.name].value;
  }

  togglePasswordVisibility() {
    if (this.inputRef.nativeElement.type === 'text') {
      return (this.inputRef.nativeElement.type = 'password');
    }

    return (this.inputRef.nativeElement.type = 'text');
  }

  get hasErrors() {
    return this.parent.get(this.name)?.errors;
  }

  get touched() {
    return this.parent.get(this.name)?.touched;
  }

  get showValidationErrors() {
    return this.hasErrors && this.touched;
  }
}
