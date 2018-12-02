import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsComponent} from './cards.component';
import {OneCardComponent} from './one-card/one-card.component';
import {SharedModule} from '../shared/shared.module';
import {GamificationService} from './shared/gamification/gamification.service';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import {FormsModule} from '@angular/forms';
import { CardSoundDirective } from './shared/card-sound.directive';

@NgModule({
  declarations: [
    CardsComponent,
    OneCardComponent,
    LeaderboardComponent,
    CardSoundDirective],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    GamificationService
  ],
  exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
