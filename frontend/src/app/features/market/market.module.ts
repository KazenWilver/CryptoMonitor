import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MarketComponent } from './market.component';
import { CoinDetailComponent } from './coin-detail/coin-detail.component';
import { LayoutComponent } from '../../layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
    { path: '', component: MarketComponent },
    { path: ':id', component: CoinDetailComponent }
  ]}
];

@NgModule({
  declarations: [MarketComponent, CoinDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class MarketModule {}
