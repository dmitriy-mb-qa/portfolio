// Калькулятор стоимости
document.getElementById('calculateBtn').addEventListener('click', function() {
  const deviceType = document.getElementById('device-type').value;
  const problemType = document.getElementById('problem-type').value;
  
  if(deviceType === '0' || problemType === '0') {
    alert('Пожалуйста, заполните все поля');
    return;
  }
  
  let price = 0;
  
  // Простая логика расчета (можно усложнить)
  if(deviceType === 'household') {
    price = problemType === 'simple' ? 1500 : problemType === 'medium' ? 3000 : 5000;
  } 
  else if(deviceType === 'tools') {
    price = problemType === 'simple' ? 1000 : problemType === 'medium' ? 2500 : 4000;
  }
  else {
    price = problemType === 'simple' ? 2500 : problemType === 'medium' ? 5000 : 8000;
  }
  
  const resultHTML = `
    <div class="result-content">
      <h3>Примерная стоимость:</h3>
      <div class="result-price">${price} ₽</div>
      <p>Точную цену назовет мастер после диагностики</p>
      <a href="order.html" class="btn btn-primary">Оставить заявку</a>
    </div>
  `;
  
  document.getElementById('calculatorResult').innerHTML = resultHTML;
});

// Переключение таблиц цен
document.querySelectorAll('.price-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelector('.price-tab.active').classList.remove('active');
    this.classList.add('active');
    
    document.querySelector('.price-table.active').style.display = 'none';
    document.querySelector('.price-table.active').classList.remove('active');
    
    const tabId = this.getAttribute('data-tab');
    document.getElementById(tabId).style.display = 'block';
    document.getElementById(tabId).classList.add('active');
  });
});

// Добавьте этот код в main.js
document.addEventListener('DOMContentLoaded', function() {
  // Обработка кликов по карточкам услуг
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
      window.location.href = 'services.html';
    });
  });

  // Мобильное меню
  document.querySelector('.btn-mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav').classList.toggle('active');
    document.querySelector('.auth-buttons').classList.toggle('active');
  });
});