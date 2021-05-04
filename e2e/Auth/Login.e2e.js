describe('Login flow', () => {
  it('should login successfully', async () => {
    await device.reloadReactNative();

    await element(by.id('email')).typeText('john@example.com');
    await element(by.id('password')).typeText('123456');
    await element(by.id('loginButton')).tap();

    await expect(element(by.id('Welcome'))).toBeVisible();
  }); 
});
