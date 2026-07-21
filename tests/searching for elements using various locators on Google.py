# Импорт: драйвер и стратегии поиска
from selenium import webdriver
from selenium.webdriver.common.by import By

# Запуск браузер Chrome
driver = webdriver.Chrome()

# Открытие главную страницу Google
driver.get("https://www.google.com")

try:
    # Поиск по ID. ID элемента должен быть уникальным на странице.
    # На момент написания кода у Google поле поиска имело id='APjFqb'.
    # Этот локатор самый быстрый и предпочтительный.
    search_box = driver.find_element(By.ID, "APjFqb")
    # Ввод в поле поиска слова "Selenium"
    search_box.send_keys("Selenium")
    
    # Поиск по атрибуту name. У поля поиска также есть name='q'.
    # Это альтернативный способ найти тот же элемент.
    search_box2 = driver.find_element(By.NAME, "q")
    # Проверка, что элемент действительно найден (не None).
    # Если элемент не найден, find_element выбросит исключение,
    # но здесь дополнительная проверка через assert.
    assert search_box2 is not None
    
    # Поиск по CSS-классу. У кнопки "Поиск в Google" на странице Google
    # класс "gNO89b" (может меняться со временем).
    search_button = driver.find_element(By.CLASS_NAME, "gNO89b")
    # Клик по кнопке поиска — это инициирует отправку формы.
    search_button.click()
    
    # Поиск по XPath. XPath — мощный язык запросов к элементам DOM.
    # Здесь поиск первого заголовка <h3> с классом "LC20lb MBeuO DKV0Md", который обычно содержит название первого результата поиска.
    # Этот селектор очень специфичный и хрупкий (может легко сломаться),
    # но для примера демонстрирует использование XPath.
    first_result = driver.find_element(By.XPATH, "//h3[@class='LC20lb MBeuO DKV0Md']")
    # Вывод текста найденного элемента (название первого результата) в консоль.
    print("Первый результат:", first_result.text)
    
    # Проверка, что найденный элемент виден на странице.
    # is_displayed() возвращает True, если элемент не скрыт CSS-свойствами.
    # Если он невидим — тест упадёт.
    assert first_result.is_displayed(), "Результат не виден"
    
    # Если дошли сюда — все локаторы сработали, и элементы найдены.
    print("✅ Все локаторы сработали")

finally:
    # Обязательно закрываем браузер после всех действий.
    driver.quit()
