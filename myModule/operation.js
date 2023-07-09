
//To check a password between 8 to 15 characters which contain at least one lowercase letter,
// one uppercase letter, one numeric digit, and one special character
const passwordValidation = (password) => {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    return regex.test(password);
}
//email validation
const mailValidation = (mail) => {
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(mail);
}

//indian mobile number validation
const numberValidation = (pNumber) => {
    var regex = /^(0|91)?[6-9][0-9]{9}$/;
    return regex.test(pNumber);
}

//indian PinCode validation
const pinCodeValidation = (pin) => {
    var regex = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
    return regex.test(pin);
}

//console.log(pinCodeValidation(721124))


module.exports={passwordValidation, mailValidation, numberValidation, pinCodeValidation};