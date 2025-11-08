import { Page } from '@playwright/test';
import type { Product } from '../models/product';

export class ProductDetailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(href: string) {
    await this.page.goto(href, { waitUntil: 'domcontentloaded' });
    await this.page.locator('div.product-information').waitFor({ state: 'visible' });
  }

  async getProduct(): Promise<Product> {
    const nameLocator = this.page.locator('div.product-information h2');
    const priceLocator = this.page.locator('div.product-information span span');

    await nameLocator.waitFor({ state: 'visible' });
    await priceLocator.waitFor({ state: 'visible' });

    const name = (await nameLocator.innerText()).trim();
    let priceText = await priceLocator.innerText();

    // Robust integer price parsing
    priceText = priceText.replace(/\D/g, ''); // remove everything except digits
    const price = parseFloat(priceText);

    console.log(`🧾 Price parsed: ${priceText} → ${price}`);
    return { name, price };
  }

  async addToCart() {
    const addToCartButton = this.page.locator('button.btn.btn-default.cart');
    await addToCartButton.waitFor({ state: 'visible' });
    await addToCartButton.click();
  
    // Wait for either modal OR "View Cart" link
    await Promise.race([
      this.page.locator('#cartModal').waitFor({ state: 'visible' }).catch(() => null),
      this.page.locator('.modal-content').waitFor({ state: 'visible' }).catch(() => null),
      this.page.locator('a[href="/view_cart"]').waitFor({ state: 'visible' }).catch(() => null),
    ]);
  
    // Close modal if it exists
    const closeModalButton = this.page.locator('button.close-modal');
    if ((await closeModalButton.count()) > 0) {
      await closeModalButton.click();
    }
  }
  

  async verifyProductDetails(expectedName: string, expectedPrice: number) {
    const product = await this.getProduct();

    if (product.name !== expectedName) {
      throw new Error(`Product name mismatch: expected "${expectedName}", got "${product.name}"`);
    }

    if (Math.abs(product.price - expectedPrice) > 0.01) {
      throw new Error(`Product price mismatch: expected ${expectedPrice}, got ${product.price}`);
    }
  }
}
