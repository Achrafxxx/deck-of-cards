import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CardsComponent} from './cards/cards.component';
import {CardsModule} from './cards/cards.module';

const routes: Routes = [
  {
    path: '',
    component: CardsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CardsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
