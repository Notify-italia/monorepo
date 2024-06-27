import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INotifyPopulatedLead, UnknownType } from '@notify/interfaces';
import {
  AuthService,
  EnumDicebearAvatarStyles,
  FormsService,
  UtilsService,
  controlsFromObject,
} from '../../../../services';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-lead-comments',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule, ReactiveFormsModule],
  providers: [FormsService, UtilsService],
  styleUrl: '../../lead-detail/lead-detail.component.scss',
  template: `
    <div class="box p-4 space-y-2">
      <div class="row justify-between !items-center">
        <h2 class="section-title">Commenti</h2>
      </div>
      <div class="column !space-y-2">
        @if(!comments?.length) {
        <div class="text-sm text-gray-400">Ancora nessun commento</div>
        } @for (item of comments; track item.createdBy?._id) {
        <div class="row">
          <div>
            <img
              [src]="item.createdBy?.avatar || ''"
              alt=""
              class="rounded-full w-8 h-8"
              [ngClass]="{
                'animate-pulse bg-gray-300/50  indent-[-10000px]':
                  !item.createdBy?.avatar?.length
              }"
            />
          </div>
          <div class="column !space-y-0 text-sm">
            <div class="row !space-x-2">
              <div class="text-sm text-gray-400">
                {{ item.createdBy?.alias }}
              </div>
              <span *ngIf="item.createdAt"> - </span>
              <div class="text-sm text-gray-400">
                {{ item.createdAt | date : 'dd/MM/yyyy HH:mm' }}
              </div>
            </div>
            <div class="text-sm text-white">{{ item.content }}</div>
          </div>
        </div>
        }

        <div class="row" [formGroup]="replyForm">
          <notify-tailwind-input
            [parent]="replyForm"
            placeholder="Scrivi un commento..."
            name="content"
            label=" "
            [compact]="true"
            [showClearInput]="false"
          ></notify-tailwind-input>
          <button
            (click)="addComment()"
            [disabled]="!replyForm.value.content?.length"
            class="form-button inline-row text-xs btn btn-primary btn-sm !mb-1.5"
            data-theme="notifytheme"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-4 -rotate-45"
            >
              <path
                d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
              />
            </svg>

            <span class="icon">Invia</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class LeadCommentsFormComponent {
  private _formsService = inject(FormsService);
  private _authService = inject(AuthService);
  private _utilsService = inject(UtilsService);

  @Input({ required: true }) form!: FormGroup<
    controlsFromObject<INotifyPopulatedLead>
  >;

  public replyForm = this._formsService.createFormGroup({
    content: '',
  });

  public get comments() {
    return this.form.value.comments;
  }

  public genAvatar(seed: string) {
    return this._utilsService.diceBearAvatar({
      seed,
      style: EnumDicebearAvatarStyles.BigSmile,
    });
  }

  public addComment() {
    const comments = this.form.controls.comments;
    comments.push(
      this._formsService.createFormGroup({
        content: this.replyForm.value.content || '',
        createdAt: '' as UnknownType,
        createdBy: {
          _id: this._authService.user?._id || '',
          alias: 'Aggiungo commento...',
          avatar: '',
        },
      })
    );

    this.replyForm.reset();
  }
}
