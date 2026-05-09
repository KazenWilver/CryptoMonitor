import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WatchlistComponent } from './watchlist.component';

const routes: Routes = [
  { path: '', component: WatchlistComponent }
];

@NgModule({
  declarations: [WatchlistComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class WatchlistModule {}
