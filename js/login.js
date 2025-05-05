// Валидация формы авторизации
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            let isValid = true;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                isValid = false;
                alert('Пожалуйста, заполните все поля');
            }
            
            if (isValid) {
                console.log('Форма валидна, отправляем запрос на авторизацию');
                // Здесь будет код для отправки запроса на сервер
                // В учебных целях просто перенаправим на главную
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
}); 