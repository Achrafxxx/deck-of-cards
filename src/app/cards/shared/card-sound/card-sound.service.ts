import {Injectable} from '@angular/core';

@Injectable()
export class CardSoundService {

  audio: any = {
    shuffle: null,
    pick: null,
    melt: null,
  };

  constructor() {
    this.audio.shuffle = new Audio('/assets/audio/shuffle-cards.mp3');
    this.audio.shuffle.load();
    this.audio.shuffle.volume = 0.8;

    this.audio.pick = new Audio('/assets/audio/pick-card.mp3');
    this.audio.pick.load();
    this.audio.pick.volume = 0.5;

    this.audio.melt = new Audio('/assets/audio/melt-cards.mp3');
    this.audio.melt.load();
    this.audio.melt.volume = 0.8;
  }

  play(type: string) {
    this.audio[type].currentTime = 0;
    this.audio[type].play();
  }
}
