import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ReportsComponent } from './reports.component';
import { LayoutComponent } from '../../layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: [{ path: '', component: ReportsComponent }] }
];

@NgModule({
  declarations: [ReportsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ReportsModule {}
