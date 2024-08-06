import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ALL_DIRECTIVES } from './directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...ALL_DIRECTIVES
  ],
  exports: [
    ...ALL_DIRECTIVES,
  ]
})
export class SharedModule { }
