/*$(document).ready(function () {

  // 1. АКОРДЕОНИ ФІЛЬТРА (Виправлено повторний клік)
  $(document).on("click", ".js-filter-toggle", function (e) {
    e.preventDefault();
    
    const $item = $(this).closest(".fl-item");
    const $content = $item.find(".fl-item__content");

    // Зупиняємо анімацію та плавно перемикаємо
    $content.stop(true, true).slideToggle(200, function () {
      // Додаємо/прибираємо клас is-open за фактичною видимістю блоку
      $item.toggleClass("is-open", $content.is(":visible"));
    });
  });

  // 2. МОБІЛЬНИЙ ФІЛЬТР
  const $wrap = $(".fl-menu__wrap");
  const toggleMenu = (isOpen) => {
    $wrap.toggleClass("is-open", isOpen);
    $("body").toggleClass("is-filter-open", isOpen);
  };

  $(document).on("click", ".btn-filter", () => toggleMenu(true));
  $(document).on("click", ".fl-menu__close-btn, .fl-menu__overlay", () => toggleMenu(false));

  // 3. СЛАЙДЕР ЦІНИ (jQuery UI)
  const $slider = $("#slider");
  const $from = $(".js-price-from");
  const $to = $(".js-price-to");

  if ($slider.length) {
    $slider.slider({
      range: true,
      min: 0,
      max: 10000,
      values: [+$from.val() || 0, +$to.val() || 10000],
      slide: (e, ui) => {
        $from.val(ui.values[0]);
        $to.val(ui.values[1]);
      }
    });

    $(".js-price-from, .js-price-to").on("change", function () {
      $slider.slider("values", [+$from.val(), +$to.val()]);
    });
  }

  // 4. RESET ФОРМИ
  $("#filter").on("reset", function () {
    setTimeout(() => $slider.length && $slider.slider("values", [+$from.val(), +$to.val()]), 0);
  });

});*/
$(document).on('click', '.fl-title', function () {
  const th = $(this);
  const block = $(this).closest('.fl-block');
  const container = $(".fl-menu");

  th.toggleClass('is-active');
  block.find('.fl-toggle').slideToggle("slow");
});
