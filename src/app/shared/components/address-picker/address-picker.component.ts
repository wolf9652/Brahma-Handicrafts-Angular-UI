import { Component, effect, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { AddressCreateRequest, AddressService } from '../../../core/services/address.service';
import { INDIAN_STATES } from '../../../core/data/indian-states';

@Component({
  selector: 'app-address-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './address-picker.component.html',
  styleUrl: './address-picker.component.scss'
})
export class AddressPickerComponent {
  protected readonly authService = inject(AuthService);
  protected readonly addressService = inject(AddressService);
  private readonly messageService = inject(MessageService);

  label = input('Address');
  protected readonly indianStates = INDIAN_STATES;
  // Two-way with the parent, so checkout can read which saved address is selected for this section.
  selectedAddressId = model<string | null>(null);

  protected readonly showForm = signal(false);
  protected readonly saving = signal(false);

  protected readonly customerName = signal('');
  protected readonly customerPhoneNumber = signal('');
  protected readonly addressLine1 = signal('');
  protected readonly city = signal('');
  protected readonly state = signal('');
  protected readonly postalCode = signal('');
  protected readonly country = signal('');
  protected readonly isDefault = signal(false);

  private hasAutoSelectedDefault = false;

  constructor() {
    // Once the saved addresses are available, pick the default one, if there is one and nothing is
    // selected yet. Only happens once — picking a different address afterwards must stick.
    effect(() => {
      const addresses = this.addressService.addresses();
      if (this.hasAutoSelectedDefault || addresses.length === 0) {
        return;
      }
      this.hasAutoSelectedDefault = true;

      if (this.selectedAddressId() === null) {
        const defaultAddress = addresses.find((address) => address.isDefault);
        if (defaultAddress) {
          this.selectedAddressId.set(defaultAddress.id);
        }
      }
    });
  }

  protected select(addressId: string): void {
    this.selectedAddressId.set(addressId);
  }

  protected toggleForm(): void {
    this.showForm.update((open) => !open);
    if (this.showForm()) {
      this.resetDraft();
    }
  }

  protected cancelForm(): void {
    this.showForm.set(false);
  }

  protected saveAddress(): void {
    const userId = this.authService.session()?.userId;
    if (!userId || this.saving()) {
      return;
    }

    const request: AddressCreateRequest = {
      userId,
      customerName: this.customerName().trim(),
      customerPhoneNumber: this.customerPhoneNumber().trim(),
      addressLine1: this.addressLine1().trim(),
      city: this.city().trim(),
      state: this.state().trim(),
      postalCode: this.postalCode().trim(),
      country: this.country().trim(),
      isDefault: this.isDefault()
    };

    this.saving.set(true);
    this.addressService.createAddress(request).subscribe({
      next: (response) => {
        this.addressService.loadAddressesForUser(userId);
        this.selectedAddressId.set(response.addressId);
        this.saving.set(false);
        this.showForm.set(false);
      },
      error: (err) => {
        console.error('Error saving address:', err);
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: 'We could not save this address. Please try again.'
        });
      }
    });
  }

  private resetDraft(): void {
    this.customerName.set('');
    this.customerPhoneNumber.set('');
    this.addressLine1.set('');
    this.city.set('');
    this.state.set('');
    this.postalCode.set('');
    this.country.set('');
    this.isDefault.set(false);
  }
}
