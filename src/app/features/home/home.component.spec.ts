import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders featured product action buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('[data-testid="featured-add-to-cart"]').length).toBeGreaterThan(0);
    expect(compiled.querySelector('[data-testid="featured-wishlist"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="featured-share"]')).not.toBeNull();
  });
});
