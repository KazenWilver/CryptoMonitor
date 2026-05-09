import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MarketComponent } from './market.component';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';

const routes: Routes = [
  { path: '', component: MarketComponent },
  { path: ':id', component: CoinDetailComponent }
];

@NgModule({
  declarations: [MarketComponent, CoinDetailComponent],
  imports: [SharedModule, FormsModule, RouterModule.forChild(routes)]
})
export class MarketModule {}
