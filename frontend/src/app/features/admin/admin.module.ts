import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminComponent } from './admin.component';
import { LayoutComponent } from '../../layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: [{ path: '', component: AdminComponent }] }
];

@NgModule({
  declarations: [AdminComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AdminModule {}
