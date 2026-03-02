import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBuildingPage } from './create-building-page';

describe('CreateBuildingPage', () => {
  let component: CreateBuildingPage;
  let fixture: ComponentFixture<CreateBuildingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBuildingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBuildingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
