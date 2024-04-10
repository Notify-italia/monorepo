import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UtilsService } from '../../../../services';
import { AvatarComponent } from '../../../../standalones';
import { INotifyCustomTableConfig } from '../custom-table/custom-table.component';

@Component({
  standalone: true,
  selector: '[notify-custom-table-skeleton]',
  imports: [CommonModule, AvatarComponent],
  providers: [UtilsService],
  template: `
    @for (col of columns; track $index) {
    <td *ngIf="!col.hidden" class="h-20 px-6">
      @switch (col.value.valueType) { @case ('field') {
      <div
        class="h-4 skeleton"
        [style]="{ width: col.value.skeletonLength + 'ch' }"
      ></div>
      } @case ('badge') {
      <div
        class="flex whitespace-nowrap h-6 w-32 text-xs  justify-center skeleton !rounded-full"
      ></div>
      } @case ('avatar') {
      <div class="flex space-x-2 ">
        <div class="w-14 h-14 skeleton !rounded-full"></div>
        <div class="flex flex-col justify-center space-y-2">
          <div class="h-4 skeleton w-24"></div>

          <div class="h-3 skeleton w-48"></div>
        </div>
      </div>
      } @case ('actions') {
      <div
        class="space-x-4 py-2 px-4 rounded-2xl"
        [ngClass]="{
        'bg-white/5': col.value.actions.length > 1,
      }"
      >
        @for (action of col.value.actions; track $index) {
        <div class="skeleton h-6 w-6 rounded"></div>
        }
      </div>
      } }
    </td>
    }
  `,
})
export class CustomTableSkeletonComponent {
  @Input() columns: INotifyCustomTableConfig['columns'] = [];
}
