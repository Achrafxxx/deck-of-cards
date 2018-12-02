import {Injectable} from '@angular/core';

@Injectable()
export class GamificationService {
  deck: any = {};

  constructor() {
    this._initDeck();
  }

  resetDeck(): void {
    this._initDeck();
  }

  cardMapper(card) {
    let idx = -1;

    switch (card.rank) {
      case '2':
        idx = 2;
        break;
      case '3':
        idx = 3;
        break;
      case '4':
        idx = 4;
        break;
      case '5':
        idx = 5;
        break;
      case '6':
        idx = 6;
        break;
      case '7':
        idx = 7;
        break;
      case '8':
        idx = 8;
        break;
      case '9':
        idx = 9;
        break;
      case '10':
        idx = 10;
        break;
      case 'J':
        idx = 11;
        break;
      case 'Q':
        idx = 12;
        break;
      case 'K':
        idx = 13;
        break;
      case 'A':
        idx = 1;
        break;
    }

    return {
      idx: idx,
      suit: card.suit
    };
  }

  cardUnmapper(mappedCard) {
    let rank;

    switch (mappedCard.idx) {
      case 1:
        rank = 'A';
        break;
      case 2:
        rank = '2';
        break;
      case 3:
        rank = '3';
        break;
      case 4:
        rank = '4';
        break;
      case 5:
        rank = '5';
        break;
      case 6:
        rank = '6';
        break;
      case 7:
        rank = '7';
        break;
      case 8:
        rank = '8';
        break;
      case 9:
        rank = '9';
        break;
      case 10:
        rank = '10';
        break;
      case 11:
        rank = 'J';
        break;
      case 12:
        rank = 'Q';
        break;
      case 13:
        rank = 'K';
        break;
      case 14:
        rank = 'A';
        break;
    }

    return {
      rank: rank,
      suit: mappedCard.suit,
      isPicked: true
    };
  }

  getPropagationFromIndex(startIdx, cardSuit) {
    let left = startIdx;
    let right = startIdx;

    const combination = [{idx: startIdx, suit: cardSuit}];

    while (right + 1 < this.deck[cardSuit].length && this.deck[cardSuit][right + 1] === 1) {
      right++;
      combination.push({idx: right, suit: cardSuit});
    }

    while (left - 1 >= 0 && this.deck[cardSuit][left - 1] === 1) {
      left--;
      combination.push({idx: left, suit: cardSuit});
    }
    return combination;
  }

  getSameRankCombination(mappedCard) {
    const combination = [];

    if (mappedCard.idx === 1) {
      mappedCard.idx = this.deck[mappedCard.suit].length - 1;
    }

    if (this.deck['D'][mappedCard.idx] === 1) {
      combination.push({idx: mappedCard.idx, suit: 'D'});
    }
    if (this.deck['C'][mappedCard.idx] === 1) {
      combination.push({idx: mappedCard.idx, suit: 'C'});
    }
    if (this.deck['H'][mappedCard.idx] === 1) {
      combination.push({idx: mappedCard.idx, suit: 'H'});
    }
    if (this.deck['S'][mappedCard.idx] === 1) {
      combination.push({idx: mappedCard.idx, suit: 'S'});
    }

    return combination;
  }

  getSerieCombination(mappedCard) {
    let defaultCombination = this.getPropagationFromIndex(mappedCard.idx, mappedCard.suit);
    if (mappedCard.idx === 1) {
      const alternateCombination = this.getPropagationFromIndex(this.deck[mappedCard.suit].length - 1, mappedCard.suit);
      if (alternateCombination.length >= 3) {
        defaultCombination = alternateCombination;
      }
    }
    return defaultCombination;
  }

  tryGroup(mappedCard) {
    const serieCombinations = this.getSerieCombination(mappedCard);
    const sameRankCombination = this.getSameRankCombination(mappedCard);

    const serieScore = serieCombinations.reduce((a, b) => a + Math.min(b.idx, 10), 0);
    const sameRankScore = sameRankCombination.reduce((a, b) => a + Math.min(b.idx, 10), 0);

    if (serieScore >= sameRankScore && serieCombinations.length >= 3) {
      return serieCombinations;
    } else if (serieScore < sameRankScore && sameRankCombination.length >= 3) {
      return sameRankCombination;
    }
    return [];
  }

  removeGroupFromDeck(mappedCards) {
    mappedCards.forEach((mappedCard) => {
      if (mappedCard.idx === 1) {
        this.deck[mappedCard.suit][this.deck[mappedCard.suit].length - 1] = 0;
        this.deck[mappedCard.suit][1] = 0;
      } else {
        this.deck[mappedCard.suit][mappedCard.idx] = 0;
      }
    });
  }

  addToDeck(mappedCard) {
    this.deck[mappedCard.suit][mappedCard.idx]++;
    if (mappedCard.idx === 1) {
      this.deck[mappedCard.suit][this.deck[mappedCard.suit].length - 1]++;
    }
  }

  evaluateCard(card) {
    const mappedCard = this.cardMapper(card);
    this.addToDeck(mappedCard);
    return this.tryGroup(mappedCard);
  }

  private _initDeck(): void {
    this.deck = {
      'D': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'C': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'H': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'S': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }
}
