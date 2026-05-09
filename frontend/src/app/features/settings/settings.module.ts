import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { LayoutComponent } from '../../layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: [{ path: '', component: SettingsComponent }] }
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class SettingsModule {}
