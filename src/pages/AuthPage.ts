import { Locator, Page, expect } from '@playwright/test';
import { authSelectors } from '../selectors/auth.selectors';


export class AuthPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }


    async goto() {
        await this.page.goto('/login');
    }


    async signup(name: string, email: string) {
        await this.page.goto('/login');
    
        // Fill name & email in the "New User Signup" form
        await this.page.fill(authSelectors.signupNameInput, name);
        await this.page.fill(authSelectors.signupEmailInput, email);
        await this.page.click(authSelectors.signupBtn);
    
        // Wait for Enter Account Information form
        await this.page.waitForSelector('h2:has-text("Enter Account Information")');
    
        // Fill the "Enter Account Information" form
        await this.page.check('input[id="id_gender1"]'); // Mr.
        await this.page.fill('input[id="password"]', 'Password123!');
        await this.page.selectOption('select[id="days"]', '10');
        await this.page.selectOption('select[id="months"]', '5');
        await this.page.selectOption('select[id="years"]', '1995');
        await this.page.check('input[id="newsletter"]');
        await this.page.check('input[id="optin"]');
    
        // Address Information
        await this.page.fill('input[id="first_name"]', 'Playwright');
        await this.page.fill('input[id="last_name"]', 'User');
        await this.page.fill('input[id="address1"]', '123 Mock Street');
        await this.page.selectOption('select[id="country"]', 'India');
        await this.page.fill('input[id="state"]', 'Selangor');
        await this.page.fill('input[id="city"]', 'Shah Alam');
        await this.page.fill('input[id="zipcode"]', '40000');
        await this.page.fill('input[id="mobile_number"]', '0123456789');
    
        // Submit the form
        await this.page.click('button[data-qa="create-account"]');
    
        // Verify account creation
        await this.page.waitForSelector('h2:has-text("Account Created!")');
        await this.page.click('a[data-qa="continue-button"]');
    
        // Verify logged in
        await expect(this.page.locator('a:has-text("Logged in as")')).toBeVisible();
    }
    


    async login(email: string, password: string) {
        await this.page.goto('/login');
        await this.page.fill(authSelectors.loginEmail, email);
        await this.page.fill(authSelectors.loginPassword, password);
        await this.page.click(authSelectors.loginBtn);
        await this.page.waitForLoadState('networkidle');
    }
    

    // ✅ Add this method below
    async verifyLoggedIn() {
        // Check for logout link (visible after login)
        const logoutVisible = await this.page.locator(authSelectors.logoutLink).isVisible();
        if (!logoutVisible) {
        throw new Error('Login verification failed — Logout link not found!');
        }
        await expect(this.page.locator(authSelectors.logoutLink)).toBeVisible();
    }
}