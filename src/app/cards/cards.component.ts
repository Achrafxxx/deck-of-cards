import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ICard} from './shared/card.model';
import {RankEnum} from './shared/card-rank.enum';
import {SuitEnum} from './shared/card-suit.enum';
import {ElementTourStep, HasGuidedTour, HTMLTourStep, TourStep} from 'telemachy';
import {DialogService} from 'ng2-bootstrap-modal';
import {ConfirmComponent} from '../shared/confirm-modal/confirm.component';
import {GamificationService} from './shared/gamification/gamification.service';
import {CommonModalComponent} from '../shared/common-modal/common-modal.component';
import {CardSoundService} from './shared/card-sound/card-sound.service';

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

  constructor(private dialogService: DialogService, private gamificationService: GamificationService,
              private cardSoundService: CardSoundService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this._initCards();
  }

  tourAutoStart() {
    return true;
  }

  getTour(): TourStep[] {
    return [
      new HTMLTourStep(`
        <h3>👋 Hey there,</h3>
        <p class="lead">Welcome to Jive gaming Server !</p>
    `),
      new ElementTourStep('#all-cards', 'This deck consists of 52 Cards in each of the 4 suits of Spades, Hearts, Diamonds, and' +
        ' Clubs. Each suit contains 13 cards: Ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King. You can pick any card by clicking on it'),
      new ElementTourStep('#pick-random-card-button', 'You can Pick a card randomly'),
      new ElementTourStep('#shuffle-cards-button', 'Randomize the card\'s positions\n'),
      new ElementTourStep('#picked-cards', 'This area represents the picked cards that are not melded yet'),
      new ElementTourStep('#your-score', 'The total scored points'),
      new HTMLTourStep(`
      <h2>We are <em>done</em> here!</h2>
      <h4>Good Luck🔥</h4>
      `)
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
    this.cardSoundService.play('pick');
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
    this.cardSoundService.play('shuffle');
    this._resetCards();
    this.score = 0;
    this.matchingCardsGroup = [];
    this.gamificationService.resetDeck();
  }

  private _resetCards(): void {
    this.pickedCards = [];
    this.cards = [];
    const tmpCards = [];
    for (const rank of Object.keys(RankEnum)) {
      for (const suit of Object.keys(SuitEnum)) {
        const card: ICard = {
          rank: <RankEnum>RankEnum[rank],
          suit: <SuitEnum>SuitEnum[suit],
          isPicked: false
        };
        tmpCards.push(card);
      }
    }
    let i = 0;
    const interval = setInterval(() => {
      this.cards.push(tmpCards[i]);
      i++;
      if (i > tmpCards.length - 1) {
        this._shuffle();
        clearInterval(interval);
      }
    }, 10);
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
        }
      });
  }

  private _showLeaderboardModal() {
    this.isLeaderboardModalVisible = true;
    this.changeDetector.detectChanges();
    this.leaderboardModal.show();
  }
}
