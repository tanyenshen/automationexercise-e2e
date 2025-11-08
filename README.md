AutomationExercise E2E Test Suite

Project: MODE FAIR SDN BHD – Take-Home Assessment
Role: Software Engineer, Automation

This project implements an end-to-end automated test flow for https://automationexercise.com/ using Playwright + TypeScript.

Project Structure:

/automationexercise-e2e
  playwright.config.ts        # Playwright configuration
  package.json                # Node project dependencies
  README.md                   # Project documentation
  /src
    /pages                    # Page Object Model (POM)
    /selectors                # Element selectors
    /models                   # Interfaces/Models (Product, CartItem)
    /fixtures                 # Fixtures for sessions/auth
  /test-data                  # Test data files (optional)
  /tests                      # Test specs (*.spec.ts)
  /test-results               # Screenshots, traces, HTML reports

Installation:

npm install
npx playwright install

Running Tests:

# Run all tests (headed)
npx playwright test --headed --project=chromium

# Run tests in headless mode
npx playwright test

Generating & Viewing HTML Reports:

npx playwright show-report

Test Flow:

1. Register a new account on AutomationExercise.
2. Login with the created account.
3. Navigate to product page and filter products by category.
4. Verify filtered results are correct (at least the first item).
5. Add a product to cart and verify its price.
6. Go back and verify filter persists.
7. View another product details, verify attributes, add to cart.
8. Open cart, remove the first item, verify removal.
9. Proceed to checkout, fill forms with mock data.
10. Complete payment and verify success message: "Congratulations! Your order has been confirmed!"

Test Artifacts:

- Screenshots: test-results/*/test-failed-1.png
- Traces: test-results/*/trace.zip
- HTML Report: test-results/html-report/index.html

Tools & External Assistance:

- Playwright Test + TypeScript
- Browser DevTools and Playwright Selector Picker
- ChatGPT (for generating selectors and helper methods)
- Prettier for code formatting

Notes:

- Fixtures used for session management and authenticated flows.
- Page Object Model (POM) implemented for maintainability.
- Robust waits used; no hard-coded sleeps.
- Failure artifacts included for HTML report demonstration.

Author:

Tan Yen Shen
Software Engineer Candidate
