import {RankEnum} from './card-rank.enum';
import {SuitEnum} from './card-suit.enum';

export interface ICard {
  rank: RankEnum;
  suit: SuitEnum;
  isPicked: boolean;
}
