
describe('Sign Up: ', function(){
    let elSignUpLink = element(by.xpath('//*[@id="login-form"]/p/a/signupmodal/a'));
    let elRegisterHeader = element(by.xpath('/html/body/modal-container/div/div/div[1]/h4'));
    let firstNameInput;
    let lastNameInput;
    let usernameInput;
    let emailInput;
    let phoneInput;
    let addressInput;
    let cityInput;
    let stateInput;
    let zipCodeInput;
    let driverRadio;
    
    xit('Sign up link on login page opens Sign up modal', function() {
        browser.get('http://localhost:4200/');
        browser.driver.sleep(500);
        elSignUpLink.click();
        expect(elRegisterHeader.getText()).toBe('Sign Up');
    });

    xit ('After submit routes to landing page', function() {
        browser.get('http://localhost:4200/');
        browser.driver.sleep(500);
        elSignUpLink.click();
    });
    
});