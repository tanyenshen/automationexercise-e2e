import { test, expect } from '@playwright/test';
import { AuthPage } from '../src/pages/AuthPage';
import { ProductListPage } from '../src/pages/ProductListPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { ProductDetailPage } from '../src/pages/ProductDetailsPage';


test.describe('AutomationExercise End-to-End Flow', () => {
  test('Full purchase flow from login to payment', async ({ page }) => {
    // -------------------------------
    // STEP 1: LOGIN (or Register)
    // -------------------------------
    const authPage = new AuthPage(page);
    await page.goto('https://automationexercise.com/login');
    const email = `test_${Date.now()}@mail.com`;
    await authPage.signup('Playwright User', email);
    await authPage.verifyLoggedIn();

    // -------------------------------
    // STEP 2: FILTER PRODUCTS BY CATEGORY
    // -------------------------------
    const productPage = new ProductListPage(page);
    await productPage.goto();
    await productPage.filterByCategory('Women', 'Dress');
    const firstProduct = await productPage.getFirstProduct();
    await expect(firstProduct.name).not.toBeNull();
    console.log('Filtered product:', firstProduct);

    // -------------------------------
    // STEP 3: ADD ITEM TO CART & VERIFY
    // -------------------------------
    await productPage.addProductToCartByIndex(0);
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.verifyProductInCart(firstProduct.name, firstProduct.price);

    // -------------------------------
    // STEP 4: GO BACK & VERIFY FILTER STILL VALID
    // -------------------------------
    await productPage.goto(); // go directly back to /products
    await productPage.filterByCategory('Women', 'Dress'); // reapply same filter
    await productPage.verifyFilterStillValid('Women');

    // -------------------------------
    // STEP 5: VIEW ANOTHER ITEM, VERIFY DETAILS & ADD TO CART
    // -------------------------------
    const secondProduct = await productPage.getProductByIndex(1);

    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.goto(secondProduct.href!);  // ensure href is defined
    await productDetailPage.verifyProductDetails(secondProduct.name, secondProduct.price);
    await productDetailPage.addToCart();


    // -------------------------------
    // STEP 6: REMOVE FIRST PRODUCT
    // -------------------------------
    await cartPage.goto();
    await cartPage.removeProductByName(firstProduct.name);
    await cartPage.verifyProductNotInCart(firstProduct.name);

    // -------------------------------
    // STEP 7: CHECKOUT & PAYMENT
    // -------------------------------
    
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await page.click('a.btn.check_out[href="/payment"]');
    await page.waitForLoadState('domcontentloaded');
    
    await checkoutPage.fillAddress({
      name: 'Playwright User',
      address: '123 Mock Street',
      country: 'Malaysia',
      state: 'Selangor',
      city: 'Shah Alam',
      zip: '40000',
      cardName: 'Playwright User',
      cardNumber: '4111111111111111',
      cvc: '123',
      expiry: '12/29'
    });
    await checkoutPage.fillPaymentDetails({
      cardName: 'Playwright User',
      cardNumber: '4111111111111111',
      cvc: '123',
      expiry: '12/29',
      name: '', address: '', country: '', state: '', city: '', zip: ''
    });
    await checkoutPage.submitPayment();
    await checkoutPage.verifyPaymentSuccess();
  });
});
