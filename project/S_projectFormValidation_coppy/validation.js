function Validator(formSelector, options) {
    function getParrent(element, selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }else element = element.parentElement;
        }
    }
    
    var selectorRules = {};

    function validate(inputElement, rule) {
        var errorElement = getParrent(inputElement, formSelector.formGroupSelector).querySelector(formSelector.errorSelector);
        var errorMesg; /*= rule.test(inputElement.value)*/
        
        //Lấy các rules của selecor 
        var rules = selectorRules[rule.selector];
        
        //lặp qua từng rule và kiểm tra
        //Nếu có lỗi thì dừng việc kiểm tra 
        for(var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMesg = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                default:
                    errorMesg = rules[i](inputElement.value);
                    break;
            }
            errorMesg = rules[i](inputElement.value);
            if(errorMesg) break;
        }
        
        if(errorMesg) {
            errorElement.innerText = errorMesg;
            getParrent(inputElement, formSelector.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText= '';
            getParrent(inputElement, formSelector.formGroupSelector).classList.remove('invalid');
        }

        return !errorMesg;
    }

    var formElement = document.querySelector(formSelector.form);

    if(formElement) {
        //Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            //Thực hiện lặp qua từng rules và validate
            formSelector.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if(isFormValid) {
                //trường hợp submit với js
                if(typeof formSelector.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name +'"] :checked').value; 
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    formSelector.onSubmit(formValues);
                } else {
                    //trường hợp submit với hành vi mặc định
                    formElement.submit();
                }
            }
        }

        formSelector.rules.forEach(function(rule) {
            //Save rules for input (using array)
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement) {
                if(inputElement) {
                    //handle when user typing in input
                    inputElement.oninput = function() {
                        var errorElement = getParrent(inputElement, formSelector.formGroupSelector).querySelector(formSelector.errorSelector);
                        errorElement.innerText= '';
                        getParrent(inputElement, formSelector.formGroupSelector).classList.remove('invalid');
                    }
                    //handle blur out of input
                    inputElement.onblur = function() {
                        validate(inputElement, rule);
                    }
                };
            });
        });
    }
}
//---------------------
//Declare rules
Validator.isRequired = function(selector, messg) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : messg || 'Vui lòng nhập trường này!';
        }
    }
}
Validator.isEmail = function(selector, messg) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : messg || 'Trường này phải là email!';
        }
    }
}
Validator.minLength = function(selector, min, messg) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : messg || `Mật khẩu phải hơn ${min} ký tự!`;
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue, messg) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : messg || 'Giá trị nhập vào không chính xác!';
        }
    }
}