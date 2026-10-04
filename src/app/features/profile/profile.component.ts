import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { UpdateUserRequest, UserService } from '../../core/services/user.service';
import { Address, AddressCreateRequest, AddressService, AddressUpdateRequest } from '../../core/services/address.service';

type ProfileTab = 'information' | 'addresses';
type Gender = 'Male' | 'Female';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  protected readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly addressService = inject(AddressService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly activeTab = signal<ProfileTab>('information');

  // Personal info — seeded from the current session. Saved locally only for now (no update-profile
  // API exists yet), so these edits won't persist across a reload until that's wired up.
  protected readonly firstName = signal(this.authService.session()?.firstName ?? '');
  protected readonly lastName = signal(this.authService.session()?.lastName ?? '');
  protected readonly gender = signal<string | null>(this.authService.session()?.gender ?? null);
  protected readonly email = signal(this.authService.session()?.emailId ?? '');
  protected readonly mobile = signal(this.authService.session()?.phoneNumber ?? '');

  protected readonly editingName = signal(false);
  protected readonly editingGender = signal(false);
  protected readonly editingEmail = signal(false);
  protected readonly editingMobile = signal(false);

  protected readonly displayName = computed(() => `${this.firstName()} ${this.lastName()}`.trim() || 'Guest');

  // Addresses live in AddressService — fetched on login and refreshed after a successful create.
  protected readonly addresses = this.addressService.addresses;
  protected readonly showAddressForm = signal(false);
  protected readonly editingAddressId = signal<string | null>(null);
  protected readonly openAddressMenuId = signal<string | null>(null);

  protected readonly addrCustomerName = signal('');
  protected readonly addrCustomerPhoneNumber = signal('');
  protected readonly addrAddressLine1 = signal('');
  protected readonly addrCity = signal('');
  protected readonly addrState = signal('');
  protected readonly addrPostalCode = signal('');
  protected readonly addrCountry = signal('');
  protected readonly addrIsDefault = signal(false);

  protected setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  protected selectGender(value: Gender): void {
    if (!this.editingGender()) {
      return;
    }
    this.gender.set(value);
  }

  /**
   * Builds the update payload: a field is only included (non-null) if its own "Edit" link was
   * clicked this cycle — untouched fields send null, per the agreed contract with the backend.
   */
  protected onSubmitProfile(): void {
    const userId = this.authService.session()?.userId;
    if (!userId) {
      return;
    }

    const payload: UpdateUserRequest = {
      firstName: this.editingName() ? this.firstName().trim() : null,
      lastName: this.editingName() ? this.lastName().trim() : null,
      phoneNumber: this.editingMobile() ? this.mobile().trim() : null,
      emailId: this.editingEmail() ? this.email().trim() : null,
      gender: this.editingGender() ? this.gender() : null
    };

    this.userService.updateUser(userId, payload).subscribe({
      next: (response) => {
        this.firstName.set(response.firstName);
        this.lastName.set(response.lastName);
        this.email.set(response.emailId);
        this.mobile.set(response.phoneNumber);
        this.gender.set(response.gender);

        this.authService.updateSession({
          firstName: response.firstName,
          lastName: response.lastName,
          emailId: response.emailId,
          phoneNumber: response.phoneNumber,
          role: response.role,
          gender: response.gender
        });

        this.editingName.set(false);
        this.editingGender.set(false);
        this.editingEmail.set(false);
        this.editingMobile.set(false);

        this.notifySaved('Profile');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Update failed',
          detail: 'We could not save your profile changes. Please try again.'
        });
      }
    });
  }

  private notifySaved(label: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Saved',
      detail: `${label} updated.`
    });
  }

  protected toggleAddressForm(): void {
    if (this.showAddressForm() && this.editingAddressId() === null) {
      this.showAddressForm.set(false);
      return;
    }

    this.editingAddressId.set(null);
    this.resetAddressDraft();
    this.showAddressForm.set(true);
  }

  protected editAddress(address: Address): void {
    this.editingAddressId.set(address.id);
    this.addrCustomerName.set(address.customerName);
    this.addrCustomerPhoneNumber.set(address.customerPhoneNumber);
    this.addrAddressLine1.set(address.addressLine1);
    this.addrCity.set(address.city);
    this.addrState.set(address.state);
    this.addrPostalCode.set(address.postalCode);
    this.addrCountry.set(address.country);
    this.addrIsDefault.set(address.isDefault);
    this.showAddressForm.set(true);
    this.openAddressMenuId.set(null);
  }

  protected deleteAddress(addressId: string): void {
    const userId = this.authService.session()?.userId;
    if (!userId) {
      return;
    }

    this.addressService.removeAddress({ userId, addressId }).subscribe({
      next: () => {
        this.addressService.loadAddressesForUser(userId);
        this.openAddressMenuId.set(null);
      },
      error: (err) => {
        console.error('Error removing address:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: err?.error?.detail ?? 'We could not remove this address. Please try again.'
        });
      }
    });
  }

  protected saveAddress(): void {
    const draft = {
      customerName: this.addrCustomerName().trim(),
      customerPhoneNumber: this.addrCustomerPhoneNumber().trim(),
      addressLine1: this.addrAddressLine1().trim(),
      city: this.addrCity().trim(),
      state: this.addrState().trim(),
      postalCode: this.addrPostalCode().trim(),
      country: this.addrCountry().trim(),
      isDefault: this.addrIsDefault()
    };

    const editingId = this.editingAddressId();
    const userId = this.authService.session()?.userId;
    if (!userId) {
      return;
    }

    if (editingId) {
      const updateRequest: AddressUpdateRequest = { userId, addressId: editingId, ...draft };

      this.addressService.updateAddress(updateRequest).subscribe({
        next: () => {
          this.addressService.loadAddressesForUser(userId);
          this.showAddressForm.set(false);
          this.editingAddressId.set(null);
          this.notifySaved('Address');
        },
        error: (err) => {
          console.error('Error updating address:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Update failed',
            detail: err?.error?.detail ?? 'We could not update this address. Please try again.'
          });
        }
      });
      return;
    }

    const createRequest: AddressCreateRequest = { userId, ...draft };

    this.addressService.createAddress(createRequest).subscribe({
      next: () => {
        this.addressService.loadAddressesForUser(userId);
        this.showAddressForm.set(false);
        this.notifySaved('Address');
      },
      error: (err) => {
        console.error('Error saving address:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: 'We could not save this address. Please try again.'
        });
      }
    });
  }

  protected cancelAddressForm(): void {
    this.showAddressForm.set(false);
    this.editingAddressId.set(null);
  }

  protected toggleAddressMenu(addressId: string): void {
    this.openAddressMenuId.set(this.openAddressMenuId() === addressId ? null : addressId);
  }

  private resetAddressDraft(): void {
    this.addrCustomerName.set('');
    this.addrCustomerPhoneNumber.set('');
    this.addrAddressLine1.set('');
    this.addrCity.set('');
    this.addrState.set('');
    this.addrPostalCode.set('');
    this.addrCountry.set('');
    this.addrIsDefault.set(false);
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
