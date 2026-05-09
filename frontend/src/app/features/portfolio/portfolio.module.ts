import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PortfolioComponent } from './portfolio.component';

const routes: Routes = [
  { path: '', component: PortfolioComponent }
];

@NgModule({
  declarations: [PortfolioComponent],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class PortfolioModule {}
