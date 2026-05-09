import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../core/pipes/translate.pipe';

@NgModule({
  declarations: [TranslatePipe],
  imports: [CommonModule],
  exports: [CommonModule, TranslatePipe]
})
export class SharedModule {}
