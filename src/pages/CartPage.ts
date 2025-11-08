import { Page, expect } from '@playwright/test';
import { cartSelectors } from '../selectors/cart.selectors';
import type { CartItem } from '../models/cartItem';

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
        await this.page.waitForSelector('#cart_info_table', { timeout: 15000 });
    }

    /**
     * Extracts all cart items (name, price, qty)
     */
    async getItems(): Promise<CartItem[]> {
        const rows = this.page.locator(cartSelectors.cartTableRows);
        const count = await rows.count();
        const items: CartItem[] = [];

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);

            const name = (await row.locator('td.cart_description h4 a').innerText()).trim();

            // 🧾 Price extraction (normalize Rs., commas, etc.)
            const priceText = (await row.locator('td.cart_price').innerText()).trim();
            const normalizedPrice = priceText.replace(/[^0-9]/g, ''); // remove Rs., commas, spaces
            const price = parseInt(normalizedPrice, 10);
            console.log(`🧾 Cart extracted priceText="${priceText}", parsed=${price}`);

            // 🧮 Quantity
            const qtyText = (await row.locator('td.cart_quantity button').innerText()).trim();
            const qty = parseInt(qtyText, 10) || 1;

            items.push({ name, price, quantity: qty });
        }

        console.log('🛒 Cart items parsed:', items);
        return items;
    }

    /**
     * Verify that a specific product (by name) exists in the cart and price matches
     */
    async verifyProductInCart(name: string, expectedPrice: number) {
        const items = await this.getItems();
        const match = items.find(i => i.name.includes(name));

        expect(match, `❌ Product "${name}" should be in cart`).toBeTruthy();

        if (match) {
            console.log(`✅ Verifying "${match.name}" — expectedPrice=${expectedPrice}, found=${match.price}`);
            expect(match.price).toBeCloseTo(expectedPrice, 0);
        }
    }

    /**
     * Remove a product by partial name match
     * ⚡ Updated to avoid toBeHidden strict errors
     */
    async removeProductByName(name: string) {
        const rows = this.page.locator(cartSelectors.cartTableRows);
        const count = await rows.count();

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const productName = (await row.locator('td.cart_description h4 a').innerText()).trim();

            if (productName.includes(name)) {
                console.log(`🗑️ Removing "${productName}" from cart`);
                await row.locator(cartSelectors.removeItem).click();

                // Wait for the row to disappear from DOM instead of using toBeHidden
                try {
                    await row.waitFor({ state: 'detached', timeout: 10000 });
                    console.log(`✅ "${productName}" removed successfully`);
                } catch (err) {
                    console.warn(`⚠️ Timeout waiting for "${productName}" to be removed, proceeding anyway`);
                }
                break;
            }
        }
    }

    /**
     * Ensure a product no longer exists in cart
     */
    async verifyProductNotInCart(name: string) {
        const items = await this.getItems();
        const match = items.find(i => i.name.includes(name));
        expect(match, `🚫 Product "${name}" should NOT be in cart`).toBeFalsy();
    }

    /**
     * Remove first cart item (fallback utility)
     */
    async removeFirstItem() {
        const firstRow = this.page.locator(cartSelectors.cartTableRows).first();
        await firstRow.locator(cartSelectors.removeItem).click();
        try {
            await firstRow.waitFor({ state: 'detached', timeout: 10000 });
        } catch {
            console.warn('⚠️ Timeout waiting for first item to be removed');
        }
    }

    /**
     * Proceed to checkout button click
     */
    async proceedToCheckout() {
        await this.page.click(cartSelectors.checkoutBtn);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    }
}
