document.addEventListener('DOMContentLoaded', function() {
  // Данные для входа администратора (в реальном приложении должны быть на сервере)
  const ADMIN_CREDENTIALS = {
    login: 'admin',
    password: 'ElectroService123'
  };

  // Элементы
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminContent = document.getElementById('adminContent');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const refreshBtn = document.getElementById('refreshBtn');

  // Проверяем, авторизован ли администратор
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    adminLoginModal.style.display = 'none';
    adminContent.style.display = 'block';
    loadOrders();
  }

  // Обработчик входа
  adminLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const login = document.getElementById('adminLogin').value;
    const password = document.getElementById('adminPassword').value;
    
 if (!login) {
    alert('Введите логин');
    return;
  }
  
  if (!password) {
    alert('Введите пароль');
    return;
  }
  
  if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('adminLoggedIn', 'true');
    adminLoginModal.style.display = 'none';
    adminContent.style.display = 'block';
    loadOrders();
  } else {
    alert('Неверный логин или пароль');
  }
  });

  // Обработчик выхода
  adminLogoutBtn.addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.reload();
  });

  // Кнопка закрытия модального окна
  adminCloseBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
  });

  // Кнопка обновления данных
  refreshBtn.addEventListener('click', loadOrders);

  // Загрузка заказов
  function loadOrders() {
    // В реальном приложении здесь должен быть запрос к серверу
    // Мы будем использовать данные из localStorage пользователей
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let allOrders = [];
    let todayOrders = 0;
    let inProgressOrders = 0;
    
    users.forEach(user => {
      if (user.orders && user.orders.length > 0) {
        user.orders.forEach(order => {
          order.userName = user.name;
          order.userPhone = user.phone;
          allOrders.push(order);
          
          // Считаем заказы за сегодня
          const today = new Date().toLocaleDateString();
          if (order.date === today) {
            todayOrders++;
          }
          
          // Считаем заказы в работе
          if (order.status === 'В работе' || order.status === 'В обработке') {
            inProgressOrders++;
          }
        });
      }
    });
    
    // Сортируем заказы по дате (новые сначала)
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Обновляем статистику
    document.getElementById('totalOrders').textContent = allOrders.length;
    document.getElementById('todayOrders').textContent = todayOrders;
    document.getElementById('inProgressOrders').textContent = inProgressOrders;
    
    // Отображаем заказы в таблице
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '';
    
    if (allOrders.length === 0) {
      tableBody.innerHTML = '<div class="no-orders">Нет заказов</div>';
      return;
    }
    
    allOrders.forEach(order => {
      const row = document.createElement('div');
      row.className = 'order-row';
      
      row.innerHTML = `
        <div>${order.id}</div>
        <div>${order.userName}</div>
        <div>${order.userPhone}</div>
        <div>${order.device}</div>
        <div>${order.problem}</div>
        <div>${order.date}</div>
        <div>
          <select class="status-select" data-order-id="${order.id}">
            <option value="В обработке" ${order.status === 'В обработке' ? 'selected' : ''}>В обработке</option>
            <option value="В работе" ${order.status === 'В работе' ? 'selected' : ''}>В работе</option>
            <option value="Завершён" ${order.status === 'Завершён' ? 'selected' : ''}>Завершён</option>
            <option value="Отменён" ${order.status === 'Отменён' ? 'selected' : ''}>Отменён</option>
          </select>
        </div>
        <div class="action-buttons">
          <button class="btn btn-sm btn-primary" data-order-id="${order.id}">Сохранить</button>
        </div>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Добавляем обработчики для кнопок сохранения
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', function() {
        const saveBtn = this.closest('.order-row').querySelector('.btn-primary');
        saveBtn.textContent = 'Сохранить*';
        saveBtn.classList.add('btn-outline');
      });
    });
    
    document.querySelectorAll('.action-buttons .btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        const statusSelect = document.querySelector(`.status-select[data-order-id="${orderId}"]`);
        const newStatus = statusSelect.value;
        
        // Обновляем статус в localStorage (в реальном приложении - запрос к серверу)
        updateOrderStatus(orderId, newStatus);
        
        this.textContent = 'Сохранено!';
        this.classList.remove('btn-outline');
        setTimeout(() => {
          this.textContent = 'Сохранить';
        }, 2000);
        
        // Обновляем статистику
        loadOrders();
      });
    });
  }
  
  // Функция обновления статуса заказа
  function updateOrderStatus(orderId, newStatus) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    users.forEach(user => {
      if (user.orders) {
        user.orders.forEach(order => {
          if (order.id === orderId) {
            order.status = newStatus;
          }
        });
      }
    });
    
    localStorage.setItem('users', JSON.stringify(users));
  }
});