// Валидация формы регистрации
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            let isValid = true;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                isValid = false;
                alert('Пароли не совпадают');
            }
            
            // Проверка согласия с правилами
            const termsChecked = document.querySelector('input[name="terms"]').checked;
            if (!termsChecked) {
                isValid = false;
                alert('Необходимо согласиться с правилами и условиями');
            }
            
            if (isValid) {
                console.log('Форма валидна, отправляем запрос на регистрацию');
                // Здесь будет код для отправки запроса на сервер
                // В учебных целях просто перенаправим на главную
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
    
    // Плавная прокрутка к форме по клику на кнопку
    const promoBtn = document.querySelector('.login-promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const formElement = document.getElementById('registerForm');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}); 