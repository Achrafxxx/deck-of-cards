import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ICard} from './shared/card.model';
import {RankEnum} from './shared/card-rank.enum';
import {SuitEnum} from './shared/card-suit.enum';
import {ElementTourStep, HasGuidedTour, HTMLTourStep, TourStep} from 'telemachy';
import {DialogService} from 'ng2-bootstrap-modal';
import {ConfirmComponent} from '../shared/confirm-modal/confirm.component';
import {GamificationService} from './shared/gamification/gamification.service';
import {CommonModalComponent} from '../shared/common-modal/common-modal.component';

const maxCards = 52;

@Component({
  selector: 'cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, HasGuidedTour {

  @ViewChild('leaderboardModal') leaderboardModal: CommonModalComponent;

  cards: ICard[];
  pickedCards: ICard[];

  matchingCardsGroup: any[] = [];
  score = 0;
  isLeaderboardModalVisible: boolean;

  constructor(private dialogService: DialogService, private gamificationService: GamificationService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this._initCards();
  }

  tourAutoStart() {
    return !true;
  }

  getTour(): TourStep[] {
    return [
      new HTMLTourStep(`
        <h1>Hey there,</h1>
    `),
      // new ElementTourStep('#all-cards', 'Here, I will explain this.'),
      // new ElementTourStep('#pick-random-card-button', 'Here, I will explain this.'),
      // new ElementTourStep('#shuffle-cards-button', 'Here, I will explain this.'),
      new ElementTourStep('#picked-cards', 'Then, I will explain this.'),
      new ElementTourStep('#your-score', 'Then, I will explain this.'), new HTMLTourStep(`Finally, we are <em>done</em>!`)
    ];
  }

  pickCard(index?: number): void {
    if (isNaN(index)) {
      const remainingCardsIndex = this.cards
        .map((card, i) => card.isPicked ? undefined : i)
        .filter((i) => !isNaN(i));
      index = remainingCardsIndex[Math.floor(Math.random() * remainingCardsIndex.length)];
    }
    if (this.cards[index].isPicked) {
      return;
    }
    this.cards[index].isPicked = true;
    this.pickedCards.push(this._dealOneCard(index));
    this._checkPiles(this.cards[index]);
    if (!this.isCardAvailable()) {
      this._showLeaderboardModal();
    }
  }

  shuffleCards(): void {
    if (this.score > 0 && this.isCardAvailable()) {
      this._showShuffleConfirmationModal();
    } else {
      this._initCards();
    }
  }

  isCardAvailable(): boolean {
    return this.cards.some(c => !c.isPicked);
  }

  hideLeaderboardModal() {
    this.leaderboardModal.hide();
    this.isLeaderboardModalVisible = false;
  }

  private _initCards(): void {
    this._resetCards();
    this._shuffle();
    this.score = 0;
    this.matchingCardsGroup = [];
    this.gamificationService.resetDeck();
  }

  private _resetCards(): void {
    this.pickedCards = [];
    this.cards = [];
    for (const rank of Object.keys(RankEnum)) {
      for (const suit of Object.keys(SuitEnum)) {
        const card: ICard = {
          rank: <RankEnum>RankEnum[rank],
          suit: <SuitEnum>SuitEnum[suit],
          isPicked: false
        };
        this.cards.push(card);
      }
    }
  }

  private _shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  private _dealOneCard(index: number): ICard {
    if (this.pickedCards.length === maxCards) {
      return;
    }
    return this.cards[index];
  }

  private _checkPiles(card: ICard): void {

    const mappedCardsGroup = this.gamificationService.evaluateCard(card);

    if (mappedCardsGroup.length !== 0) {
      const matchingCards: ICard[] = [];
      mappedCardsGroup
        .sort((a, b) => b.idx - a.idx)
        .forEach((winningCard) => {
          const wCard: ICard = <ICard>this.gamificationService.cardUnmapper(winningCard);
          matchingCards.push(wCard);
          this.pickedCards = this.pickedCards.filter(c => !(c.suit === wCard.suit && c.rank === wCard.rank));
        });
      this.matchingCardsGroup.push(matchingCards);
      this.score += mappedCardsGroup.reduce((a, b) => a + Math.min(b.idx, 10), 0);
      this.gamificationService.removeGroupFromDeck(mappedCardsGroup);
    }
  }

  private _showShuffleConfirmationModal(): void {
    const data = {
      title: 'Are you sure?',
      message: 'Your score will be reinitialized'
    };
    this.dialogService.addDialog(ConfirmComponent, data)
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.score = 0;
          this._initCards();
          this._shuffle();
        }
      });
  }

  private _showLeaderboardModal() {
    this.isLeaderboardModalVisible = true;
    this.changeDetector.detectChanges();
    this.leaderboardModal.show();
  }
}
