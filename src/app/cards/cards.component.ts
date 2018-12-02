import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ICard} from './shared/card.model';
import {RankEnum} from './shared/card-rank.enum';
import {SuitEnum} from './shared/card-suit.enum';
import {ElementTourStep, HasGuidedTour, HTMLTourStep, TourStep, YoutubeTourStep} from 'telemachy';

const cardWidth = 200;
const smallCardWidth = 100;
const totalCards = 52;
const maxCards = 52;

@Component({
  selector: 'cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, AfterViewInit, HasGuidedTour {

  @ViewChild('allCardsWrapper') allCardsElement: ElementRef;
  @ViewChild('pickedCardsWrapper') pickedCardsElement: ElementRef;

  cards: ICard[];
  pickedCards: ICard[];
  score: number;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.score = 45;
    this._initCards();
    // this._shuffle();
  }

  ngAfterViewInit(): void {
    const allCardsWrapper = this.allCardsElement.nativeElement;
    const pickedCardsWrapper = this.pickedCardsElement.nativeElement;

    const allCardsStyle = (allCardsWrapper.offsetWidth - cardWidth) / totalCards;
    const maxCardsStyle = (pickedCardsWrapper.offsetWidth - smallCardWidth) / maxCards;

    this.renderer.setStyle(allCardsWrapper,
      'grid-template-columns',
      'repeat(' + totalCards + ', ' + (allCardsStyle + (allCardsStyle / totalCards)) + 'px)');
    this.renderer.setStyle(pickedCardsWrapper,
      'grid-template-columns',
      'repeat(' + maxCards + ', ' + (maxCardsStyle + (maxCardsStyle / maxCards)) + 'px)');
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
      new ElementTourStep('#second-complex-thing', 'Then, I will explain this.'),
      new HTMLTourStep(`Finally, we are <em>done</em>!`)
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
    /*if (this._checkPiles()) {

    }*/
  }

  shuffleCards() {
    this._initCards();
    this._shuffle();
  }

  private _initCards(): void {
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

  private _checkPiles(): void {
    /* console.log(this.pickedCards.sort((a, b) => {
       if (a.rank < b.rank) {
         return -1;
       }
       if (a.rank > b.rank) {
         return 1;
       }
       return 0;
     }));*/
  }
}
