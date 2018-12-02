import { TestBed } from '@angular/core/testing';

import { CardSoundService } from './card-sound.service';

describe('CardSoundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardSoundService = TestBed.get(CardSoundService);
    expect(service).toBeTruthy();
  });
});
