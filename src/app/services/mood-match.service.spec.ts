import { TestBed } from '@angular/core/testing';

import { MoodMatchService } from './mood-match.service';

describe('MoodMatchService', () => {
  let service: MoodMatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodMatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
