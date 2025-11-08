import { Page, expect } from '@playwright/test';

interface CheckoutDetails {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  cardName: string;
  cardNumber: string;
  cvc: string;
  expiry: string;
  comment?: string;
}

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  async fillDetails(data: CheckoutDetails) {
    if (await this.page.locator('textarea[name="address"]').count()) {
      await this.page.fill('textarea[name="address"]', data.address);
    }
    if (data.comment && (await this.page.locator('textarea[name="message"]').count())) {
      await this.page.fill('textarea[name="message"]', data.comment);
    }

    await this.fillCardDetails(data);
  }

  async fillCardDetails(data: CheckoutDetails) {
    if (await this.page.locator('input[name="name_on_card"]').count()) {
      await this.page.fill('input[name="name_on_card"]', data.cardName);
      await this.page.fill('input[name="card_number"]', data.cardNumber);
      await this.page.fill('input[name="cvc"]', data.cvc);

      if (await this.page.locator('input[name="expiry_month"]').count()) {
        const [month, year] = data.expiry.split('/');
        await this.page.fill('input[name="expiry_month"]', month);
        await this.page.fill('input[name="expiry_year"]', year);
      } else if (await this.page.locator('input[name="expiry"]').count()) {
        await this.page.fill('input[name="expiry"]', data.expiry);
      }
    }
  }

  async submitPayment() {
    // Click submit button
    await this.page.click('button#submit');

    // Wait for the correct success message
    const successMessage = this.page.locator(
      'p:has-text("Congratulations! Your order has been confirmed!")'
    );

    await expect(successMessage).toBeVisible({ timeout: 20000 });
  }

  async verifyPaymentSuccess() {
    // This can be called separately if needed
    const successMessage = this.page.locator(
      'p:has-text("Congratulations! Your order has been confirmed!")'
    );
    await expect(successMessage).toBeVisible({ timeout: 20000 });
  }
  
  async fillAddress(data: CheckoutDetails) {
    // Fill address if visible
    if (await this.page.locator('textarea[name="address"]').count()) {
      await this.page.fill('textarea[name="address"]', data.address);
    }
    if (data.comment && (await this.page.locator('textarea[name="message"]').count())) {
      await this.page.fill('textarea[name="message"]', data.comment);
    }
  }

  async fillPaymentDetails(data: CheckoutDetails) {
    await this.page.fill('input[name="name_on_card"]', data.cardName);
    await this.page.fill('input[name="card_number"]', data.cardNumber);
    await this.page.fill('input[name="cvc"]', data.cvc);

    const [month, year] = data.expiry.split('/');
    await this.page.fill('input[name="expiry_month"]', month);
    await this.page.fill('input[name="expiry_year"]', year);
  }
}
