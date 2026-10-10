let map = null;
let markers = [];
let customTooltip = null;

// Головна функція ініціалізації
window.initMapComponent = async function initMapComponent() {
  const mapContainer = document.getElementById('map');
  const pickerItems = document.querySelectorAll('.picker__item');

  // Якщо DOM ще не готовий, чекаємо завантаження сторінки
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initMapComponent());
    return;
  }

  if (!mapContainer || !pickerItems.length) return;

  try {
    // Динамічний імпорт біблотеки маркерів
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    class CustomTooltip extends google.maps.OverlayView {
      constructor() {
        super();
        this.div = null;
        this.position = null;
        this.text = '';
      }

      onAdd() {
        this.div = document.createElement('div');
        this.div.className = 'map-custom-tooltip';
        this.div.innerHTML = `<div class="map-custom-tooltip__content"></div>`;

        const panes = this.getPanes();
        if (panes && panes.floatPane) {
          panes.floatPane.appendChild(this.div);
        }
      }

      draw() {
        if (!this.div || !this.position) return;

        const overlayProjection = this.getProjection();
        if (!overlayProjection) return;

        const point = overlayProjection.fromLatLngToDivPixel(this.position);

        if (point) {
          this.div.style.left = `${point.x}px`;
          this.div.style.top = `${point.y}px`;
          const contentEl = this.div.querySelector('.map-custom-tooltip__content');
          if (contentEl) contentEl.textContent = this.text;
        }
      }

      onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }

      show(position, text, mapInstance) {
        this.position = position;
        this.text = text;
        this.setMap(mapInstance);
        this.draw();
      }

      hide() {
        this.setMap(null);
      }
    }

    const firstItem = pickerItems[0];
    const initialCenter = {
      lat: parseFloat(firstItem.dataset.lat),
      lng: parseFloat(firstItem.dataset.lng),
    };

    map = new google.maps.Map(mapContainer, {
      zoom: 15,
      center: initialCenter,
      disableDefaultUI: true,
      zoomControl: true,
      mapId: 'DEMO_MAP_ID',
    });

    customTooltip = new CustomTooltip();
    markers = [];

    pickerItems.forEach((item) => {
      const id = item.dataset.id;
      const lat = parseFloat(item.dataset.lat);
      const lng = parseFloat(item.dataset.lng);

      const pinImg = document.createElement('img');
      pinImg.src = 'assets/img/pin.svg';
      pinImg.style.width = '32px';
      pinImg.style.height = '40px';

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat, lng },
        content: pinImg,
      });

      markers.push({ id, marker, item });

      marker.addListener('click', () => {
        setActiveLocation(item);
      });
    });

    setActiveLocation(firstItem);
  } catch (error) {
    console.error('Помилка завантаження Google Maps:', error);
  }
};

window.initMap = window.initMapComponent;

function setActiveLocation(targetItem) {
  const id = targetItem.dataset.id;
  const lat = parseFloat(targetItem.dataset.lat);
  const lng = parseFloat(targetItem.dataset.lng);
  const address = targetItem.dataset.address;
  const phone = targetItem.dataset.phone;

  const match = markers.find((m) => m.id === id);

  if (map && match && customTooltip) {
    map.panTo({ lat, lng });
    map.setZoom(14);

    const latLng = new google.maps.LatLng(lat, lng);
    customTooltip.show(latLng, address, map);
  }

  document.querySelectorAll('.picker__item').forEach((el) => {
    el.classList.remove('is-active');
    el.setAttribute('aria-selected', 'false');
  });

  targetItem.classList.add('is-active');
  targetItem.setAttribute('aria-selected', 'true');

  const currentText = document.getElementById('picker-current-text');
  if (currentText) currentText.textContent = address;

  const phoneLink = document.getElementById('card-phone');
  if (phoneLink) {
    phoneLink.textContent = phone;
    phoneLink.href = `tel:${phone.replace(/[^+\d]/g, '')}`;
  }

  closePicker();
}

function closePicker() {
  const picker = document.getElementById('locations-picker');
  if (!picker) return;

  picker.classList.remove('is-open');

  const trigger = picker.querySelector('.picker__trigger');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.getElementById('locations-picker');
  if (picker) {
    const trigger = picker.querySelector('.picker__trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = picker.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen.toString());
      });
    }

    picker.querySelectorAll('.picker__item').forEach((item) => {
      item.addEventListener('click', () => setActiveLocation(item));
    });

    document.addEventListener('click', (e) => {
      if (!picker.contains(e.target)) closePicker();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePicker();
    });
  }

  // Перевірка: якщо Google Maps API завантажився до DOMContentLoaded
  if (window.google && window.google.maps && typeof window.initMapComponent === 'function') {
    window.initMapComponent();
  }
});