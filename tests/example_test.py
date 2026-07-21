from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Запуск браузера
driver = webdriver.Chrome()

try:
    # Открытие тестовой страницы (например, https://the-internet.herokuapp.com/checkboxes)
    driver.get("https://the-internet.herokuapp.com/checkboxes")

    # Нахождение первого чекбокса по CSS-селектору (локатор)
    checkbox = driver.find_element(By.CSS_SELECTOR, "input[type='checkbox']:nth-child(1)")
    
    # Клик по нему
    checkbox.click()
    
    # Проверка, что чекбокс стал отмеченным (атрибут checked)
    assert checkbox.is_selected(), "Чекбокс не выбран после клика"
    
    # Нахождение кнопки на другой странице — с явным ожиданием
    driver.get("https://the-internet.herokuapp.com/dynamic_controls")
    
    # Ожидание, когда кнопка "Enable" станет кликабельной и кликаем
    enable_btn = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Enable']"))
    )
    enable_btn.click()
    
    # После клика должно появиться поле ввода — проверка, что оно есть
    input_field = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
    )
    assert input_field.is_enabled(), "Поле ввода не стало активным"
    
    print("✅ Все проверки пройдены")

finally:
    driver.quit()
