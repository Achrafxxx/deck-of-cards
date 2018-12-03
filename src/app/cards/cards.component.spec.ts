import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsComponent} from './cards.component';
import {SharedModule} from '../shared/shared.module';
import {CardSoundService} from './shared/card-sound/card-sound.service';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {FormsModule} from '@angular/forms';
import {GamificationService} from './shared/gamification/gamification.service';
import {OneCardComponent} from './one-card/one-card.component';
import {CommonModule} from '@angular/common';
import {ICard} from './shared/card.model';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the cards component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an array filled by 52 cards', () => {
    component = fixture.componentInstance;
    expect(component.cards.length).toEqual(52);
  });

  it('should have a shuffled array', () => {
    component = fixture.componentInstance;
    const initalCards = component.cards.slice(0);
    component.shuffle();
    expect(initalCards).not.toEqual(component.cards);
  });

  it('should deal one card', () => {
    component = fixture.componentInstance;

    for (let i = 0; i < 52; i++) {
      const card: ICard = component.dealOneCard(i);
      expect(card).toBeDefined();
    }

  });

  it('should not deal a card on a 53rd call', () => {
    component = fixture.componentInstance;
    const card: ICard = component.dealOneCard(52);
    expect(card).toBeUndefined();
  });
});
