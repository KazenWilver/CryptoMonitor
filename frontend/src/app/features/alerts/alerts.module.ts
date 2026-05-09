import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AlertsComponent } from './alerts.component';
import { LayoutComponent } from '../../layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: [{ path: '', component: AlertsComponent }] }
];

@NgModule({
  declarations: [AlertsComponent],
  imports: [SharedModule, FormsModule, RouterModule.forChild(routes)]
})
export class AlertsModule {}
