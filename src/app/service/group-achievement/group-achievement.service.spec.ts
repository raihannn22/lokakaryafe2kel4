import { TestBed } from '@angular/core/testing';

import { GroupAchievementService } from '../group-achievement/group-achievement.service';

describe('GroupAchievementService', () => {
  let service: GroupAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
