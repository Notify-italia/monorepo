import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[notify-open-item-button]',
  standalone: true,
  template: `
    <a type="button" class="btn btn-error my-auto btn-ghost !p-1 text-sm">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
        ></path>
        <path d="M15 3h6v6"></path>
        <path d="M10 14 21 3"></path>
      </svg>
      <span>Apri</span>
    </a>
  `,
})
export class OpenItemButtonComponent {}
