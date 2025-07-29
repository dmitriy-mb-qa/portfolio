document.addEventListener('DOMContentLoaded', function() {
  // Элементы модальных окон
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const closeButtons = document.querySelectorAll('.close');

  // Проверка авторизации при загрузке страницы
  checkAuth();

  // Открытие модальных окон
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'flex';
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      registerModal.style.display = 'flex';
    });
  }

  // Кнопка выхода
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Закрытие модальных окон
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });

  // Закрытие при клике вне окна
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // Валидация формы входа
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateLoginForm()) {
        login();
      }
    });
  }

  // Валидация формы регистрации
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateRegisterForm()) {
        register();
      }
    });
  }

  // Проверка доступа к странице заявки
  const orderForm = document.getElementById('orderForm');
  if (orderForm && !localStorage.getItem('user')) {
    window.location.href = 'index.html';
    alert('Пожалуйста, войдите или зарегистрируйтесь для оформления заявки');
  }

  // Функции валидации
  function validateLoginForm() {
    let isValid = true;
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    if (!email.value) {
      showError('loginEmail-error', 'Введите email');
      isValid = false;
    } else if (!validateEmail(email.value)) {
      showError('loginEmail-error', 'Введите корректный email');
      isValid = false;
    } else {
      hideError('loginEmail-error');
    }

    if (!password.value) {
      showError('loginPassword-error', 'Введите пароль');
      isValid = false;
    } else if (password.value.length < 6) {
      showError('loginPassword-error', 'Пароль должен содержать минимум 6 символов');
      isValid = false;
    } else {
      hideError('loginPassword-error');
    }

    return isValid;
  }

  function validateRegisterForm() {
    let isValid = true;
    const name = document.getElementById('regName');
    const email = document.getElementById('regEmail');
    const phone = document.getElementById('regPhone');
    const password = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('regConfirmPassword');

    if (!name.value) {
      showError('regName-error', 'Введите имя');
      isValid = false;
    } else if (name.value.length < 2) {
      showError('regName-error', 'Имя должно содержать минимум 2 символа');
      isValid = false;
    } else {
      hideError('regName-error');
    }

    if (!email.value) {
      showError('regEmail-error', 'Введите email');
      isValid = false;
    } else if (!validateEmail(email.value)) {
      showError('regEmail-error', 'Введите корректный email');
      isValid = false;
    } else {
      hideError('regEmail-error');
    }

    if (!phone.value) {
      showError('regPhone-error', 'Введите телефон');
      isValid = false;
    } else if (!validatePhone(phone.value)) {
      showError('regPhone-error', 'Введите корректный телефон');
      isValid = false;
    } else {
      hideError('regPhone-error');
    }

    if (!password.value) {
      showError('regPassword-error', 'Введите пароль');
      isValid = false;
    } else if (password.value.length < 6) {
      showError('regPassword-error', 'Пароль должен содержать минимум 6 символов');
      isValid = false;
    } else {
      hideError('regPassword-error');
    }

    if (!confirmPassword.value) {
      showError('regConfirmPassword-error', 'Подтвердите пароль');
      isValid = false;
    } else if (password.value !== confirmPassword.value) {
      showError('regConfirmPassword-error', 'Пароли не совпадают');
      isValid = false;
    } else {
      hideError('regConfirmPassword-error');
    }

    return isValid;
  }

  // Основные функции авторизации
  function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Проверка в localStorage (в реальном приложении - запрос к серверу)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      alert('Вход выполнен успешно!');
      window.location.href = 'account.html';
    } else {
      alert('Неверный email или пароль');
    }
  }

  function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    
    // Проверка на существующего пользователя
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
      alert('Пользователь с таким email уже существует');
      return;
    }
    
    // Создание нового пользователя
    const newUser = {
      name,
      email,
      phone,
      password,
      orders: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    
    alert('Регистрация прошла успешно!');
    window.location.href = 'account.html';
  }

  function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    }
  }

  function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Обновляем кнопки в шапке
    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'block';
      
      // Заполняем данные в личном кабинете
      if (window.location.pathname.includes('account.html')) {
        document.querySelector('.user-details h2').textContent = user.name;
        document.querySelector('.user-details p:nth-of-type(1)').textContent = user.email;
        document.querySelector('.user-details p:nth-of-type(2)').textContent = user.phone;
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'block';
      if (registerBtn) registerBtn.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  // Вспомогательные функции
  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\+]{0,1}[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
});