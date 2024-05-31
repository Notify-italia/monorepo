import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { INotifyCustomTableConfig } from '../custom-table/custom-table.component';
import {
  CustomTableSorterComponent,
  INotifyCustomTableSorter,
} from './ct-sorter.part.component';

@Component({
  standalone: true,
  selector: '[notify-custom-table-header]',
  imports: [CommonModule, CustomTableSorterComponent],
  template: `
    <tr>
      @for (item of config.columns; track $index) {
      <th *ngIf="!item.hidden(item)" class="px-6 py-3" scope="col">
        <div class="flex space-x-2 items-center">
          <span class=" whitespace-nowrap"> {{ item.label }}</span>
          <notify-custom-table-sorter
            [column]="item.id"
            [sorter]="item.sorter"
            [resetSort]="activeSorter"
            [defaultSorter]="config.defaultSorter"
            (sortChange)="sorter$.emit($event); activeSorter.next(item.id)"
          ></notify-custom-table-sorter>
        </div>
      </th>
      }
    </tr>
  `,
})
export class CustomTableHeaderComponent {
  @Input() config!: INotifyCustomTableConfig;
  @Output() sorter$ = new EventEmitter<INotifyCustomTableSorter>();

  public activeSorter = new Subject<string>();
}
