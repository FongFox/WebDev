function showSuccessToast() {
    toast({
        title: "Thành công!",
        message: "Bạn đã đăng ký thành công tài khoản tại F8.",
        type: "success",
        duration: 5000
    });
}
function showErrorToast() {
    toast({
        title: "Thất bại!",
        message: "Có lỗi xảy ra, vui lòng liên hệ quản trị viên.",
        type: "error",
        duration: 5000
    });
}

function toast({title = '', message = '', type = 'infor', duration = 3000}) {
    var toastElement = document.querySelector('#toast');
    var icons = {
        success: 'fas fa-check-circle',
        infor: 'fas fa-infor-circle',
        warning: 'fas fa-exclamation-circle',
        error: 'fas fa-exclamation-circle'
    };

    var icon = icons[type];
    var delay = (duration/1000).toFixed(2);

    if(toastElement) {
        var newToast = document.createElement('div');
        newToast.classList.add('toast', `toast--${type}`);
        newToast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
        
        //auto remove toast
        var autoRemove = setTimeout(function() {
            toastElement.removeChild(newToast);
        }, duration + 1000);
        //remove toast when clicked
        newToast.onclick = function(event) {
            if(event.target.closest('.toast__close')) {
                toastElement.removeChild(newToast);
                clearTimeout(autoRemove);
            }
        }

        newToast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>
            </div>
        `;
        toastElement.appendChild(newToast);
    }
}
