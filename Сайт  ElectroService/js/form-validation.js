document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('orderForm');
  
  if (form) {
    // Автоматическое форматирование телефона при вводе
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        const cleaned = e.target.value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        
        if (match) {
          e.target.value = !match[2] ? match[1] : 
            `+${match[1]}${match[2] ? ` (${match[2]}` : ''}${match[3] ? `) ${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`;
        }
      });
    }

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm()) {
        saveOrder();
        showSuccessMessage();
        form.reset();
      }
    });
  }

  function validateForm() {
    let isValid = true;
    
    // Валидация имени
    const name = document.getElementById('name');
    if (!name.value.trim()) {
      showError('name-error', 'Введите ваше имя');
      isValid = false;
    } else if (name.value.trim().length < 2) {
      showError('name-error', 'Имя должно содержать минимум 2 символа');
      isValid = false;
    } else {
      hideError('name-error');
    }
    
    // Валидация телефона (минимум 10 цифр)
    const phone = document.getElementById('phone');
    const phoneDigits = phone.value.replace(/\D/g, '');
    if (!phoneDigits) {
      showError('phone-error', 'Введите ваш телефон');
      isValid = false;
    } else if (phoneDigits.length < 10) {
      showError('phone-error', 'Введите минимум 10 цифр');
      isValid = false;
    } else {
      hideError('phone-error');
    }
    
    // Валидация типа оборудования
    const device = document.getElementById('device');
    if (!device.value) {
      showError('device-error', 'Выберите тип оборудования');
      isValid = false;
    } else {
      hideError('device-error');
    }
    
    // Валидация описания проблемы
    const problem = document.getElementById('problem');
    if (!problem.value.trim()) {
      showError('problem-error', 'Опишите проблему');
      isValid = false;
    } else if (problem.value.trim().length < 10) {
      showError('problem-error', 'Описание должно содержать минимум 10 символов');
      isValid = false;
    } else {
      hideError('problem-error');
    }
    
    return isValid;
  }
  
  function saveOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    const order = {
      id: '#' + Math.floor(Math.random() * 100000),
      device: document.getElementById('device').options[document.getElementById('device').selectedIndex].text,
      problem: document.getElementById('problem').value,
      address: document.getElementById('address').value,
      date: new Date().toLocaleDateString(),
      status: 'В обработке',
      price: '—'
    };
    
    user.orders = user.orders || [];
    user.orders.unshift(order); // Добавляем новый заказ в начало массива
    
    // Обновляем данные пользователя
    localStorage.setItem('user', JSON.stringify(user));
    
    // Обновляем список пользователей
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

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

  function showSuccessMessage() {
    alert('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    window.location.href = 'account.html';
  }
});