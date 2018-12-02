import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsComponent} from './cards.component';
import {CardListComponent} from './card-list/card-list.component';
import {OneCardComponent} from './one-card/one-card.component';

@NgModule({
  declarations: [
    CardsComponent,
    CardListComponent,
    OneCardComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
