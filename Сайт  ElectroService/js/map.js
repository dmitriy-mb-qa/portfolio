// Инициализация Яндекс.Карты
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('map')) {
    ymaps.ready(init);
  }
});

function init() {
  const map = new ymaps.Map('map', {
    center: [55.998373, 92.910867], // Координаты проспекта Красноярский рабочий, 156
    zoom: 16,
    controls: ['zoomControl']
  });

  const placemark = new ymaps.Placemark([56.008691, 92.870361], {
    hintContent: 'ElectroService Красноярск',
    balloonContent: 'ул. Проспект Красноярский рабочий, 156'
  }, {
    iconLayout: 'default#image',
    iconImageHref: 'images/map-marker.svg',
    iconImageSize: [40, 40],
    iconImageOffset: [-20, -40]
  });

  map.geoObjects.add(placemark);
  map.behaviors.disable('scrollZoom');
}