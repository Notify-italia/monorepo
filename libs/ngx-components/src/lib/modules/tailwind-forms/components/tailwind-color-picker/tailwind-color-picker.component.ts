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
import { Subject, startWith, takeUntil } from 'rxjs';
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
    '#ffffff',
    '#4270d6',
    '#6ba8ff',
    '#4d8bf7',
    '#00b563',
    '#66d57a',
    '#00cc00',
    '#e05154',
    '#ffb89a',
    '#d03430',
    '#ffd20a',
    '#fdeea9',
    '#f3f7e4',
    '#faa600',
    '#ffea4d',
    '#ffb300',
    '#00bfa6',
    '#64f8b4',
    '#00a689',
    '#8c65e2',
    '#f3dbfe',
    '#8c65e2',
    '#7b7f86',
    '#f1f3f6',
    '#6a6e73',
    '#041127',
    '#0A2859',
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

    this.color = this.defaultColor;

    if (formColor.length) {
      this.color = formColor;
    }

    this.parent.controls[this.name].valueChanges
      .pipe(startWith(this.color), takeUntil(this.destroy$))
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
