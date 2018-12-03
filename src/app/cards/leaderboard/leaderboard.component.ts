import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  @Input() score: number;

  isAddMode: boolean;
  oldRecords: any[];
  playerName: string;

  constructor() {

  }

  ngOnInit() {
    this.oldRecords = JSON.parse(localStorage.getItem('records')) || [];
    if (this.oldRecords.length < 5 || this.oldRecords.some(p => p.score < this.score)) {
      this.isAddMode = true;
    }
  }

  addPlayer() {
    const player = {
      name: this.playerName,
      score: this.score,
      date: new Date()
    };
    this.oldRecords.push(player);
    this.oldRecords = this.oldRecords.sort((a, b) => b.score - a.score);
    if (this.oldRecords.length > 5) {
      this.oldRecords.pop();
    }
    this.isAddMode = false;
    localStorage.setItem('records', JSON.stringify(this.oldRecords));
  }
}
