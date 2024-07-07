import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersReadyComponent } from './players-ready.component';

describe('PlayersReadyComponent', () => {
  let component: PlayersReadyComponent;
  let fixture: ComponentFixture<PlayersReadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersReadyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayersReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
