import {Component, Input, OnInit} from '@angular/core';
import {ICard} from '../shared/card.model';

@Component({
  selector: 'one-card',
  templateUrl: './one-card.component.html',
  styleUrls: ['./one-card.component.scss']
})
export class OneCardComponent implements OnInit {

  @Input() card: ICard;
  @Input() isAlwaysFlipped: boolean;
  @Input() cardClass: string;

  constructor() {
  }

  ngOnInit() {
  }

}
