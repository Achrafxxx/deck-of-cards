import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsComponent} from './cards.component';
import {OneCardComponent} from './one-card/one-card.component';
import {SharedModule} from '../shared/shared.module';
import {GamificationService} from './shared/gamification/gamification.service';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import {FormsModule} from '@angular/forms';
import {CardSoundService} from './shared/card-sound/card-sound.service';

@NgModule({
  declarations: [
    CardsComponent,
    OneCardComponent,
    LeaderboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    GamificationService,
    CardSoundService
  ],
  exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
