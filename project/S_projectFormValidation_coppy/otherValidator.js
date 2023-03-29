
function Validator(formSelector) {
    var _this = this;

    //Khai báo báo biến
    var formElement = document.querySelector(formSelector);
    var inputs;
    var ruleInfor;
    var rules;
    var isRuleHasValue;
    var ruleFunc;
    var formGroup;
    var formMesg;

    //Định nghĩa biến function validator rules (kiểu dữ liệu là object)
    /*
        Quy ước tạo rules:
        1. Nếu có lỗi ==> return `error message.`
        2. Nếu không có lỗi ==> return undifined.
    */
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này!';
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email!';
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Mật khẩu phải tối thiểu ${min} ký tự!!`;
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Mật khẩu chỉ tối đa ${max} ký tự!!`;
            }
        }
    };
    //Chuyển đổi sang Object
    var formRules = {};

    //Định nghĩa function
    function getParrentElement(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }


    //Chỉ xử lý khi có form element trong HTML DOM
    if (formElement) {
        inputs = formElement.querySelectorAll('[name][rules]');

        for (var input of inputs) {
            rules = input.getAttribute('rules').split('|');

            for (var rule of rules) {
                isRuleHasValue = rule.includes(':');
                if (isRuleHasValue) {
                    ruleInfor = rule.split(':');
                    rule = ruleInfor[0];
                }

                ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfor[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }

            }

            //Lắng nghe sự kiện để validate
            //blur
            input.onblur = handleValidate;
            //onchange
            input.oninput = handleClearError;
        }


        //handle validate funtion (on blur) (hàm thực hiện validate)
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMesg;

            for(var rule of rules) {
                errorMesg = rule(event.target.value);
                if(errorMesg) break;
            }

            //Nếu có lỗi => hiển thị mesg lỗi ra UI
            if (errorMesg) {
                formGroup = getParrentElement(event.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');

                    formMesg = formGroup.querySelector('.form-message');
                    if (formMesg) {
                        formMesg.innerText = errorMesg;
                    }
                }
            }

            return !errorMesg;
        }

        //Hàm clear mesg lỗi khi nhập
        function handleClearError(event) {
            formGroup = getParrentElement(event.target, '.form-group');
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');

                formMesg = formGroup.querySelector('.form-message');
                if (formMesg) {
                    formMesg.innerText = '';
                }
            }
        }
    }

    //xử lý hành vi submit form
    formElement.onsubmit = function (event) {
        event.preventDefault();

        var isValid = true;
        inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false;
            }
        }

        //Khi không có lỗi => submit form
        if (isValid) {
            if (typeof _this.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]');
                var formValues = Array.from(enableInputs).reduce(function (values, input) {

                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"] :checked').value;
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = '';
                                return values;
                            }
                            if (!Array.isArray(values[input.name])) {
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

                _this.onSubmit(formValues);
            } 
            else formElement.submit();
        }
    }

}