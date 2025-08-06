import { TestBed } from '@angular/core/testing';

import { DbCategoriesService } from './db-categories.service';

describe('DbCategoriesService', () => {
  let service: DbCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
