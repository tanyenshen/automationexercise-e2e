import { test as base } from '@playwright/test';


export const test = base.extend<{ storageStatePath: string | null }>({
    storageStatePath: async ({ page }, use) => {
    // default: no persisted state. Tests may create accounts and authenticate inline.
        await use(null);
    }
});


export { expect } from '@playwright/test';