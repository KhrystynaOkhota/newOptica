var _functions = {}, winWidth, shareButton;

jQuery(function ($) {
    // 1. ПЕРЕВІРКА ПРИСТРОЇВ ТА БРАУЗЕРІВ
    const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchScreen) {
        $('html').addClass('touch-screen');
    }

    const userAgent = navigator.userAgent;
    const is_Mac = (navigator.userAgentData?.platform || navigator.platform).toUpperCase().indexOf('MAC') >= 0;
    const is_IE = /MSIE 9/i.test(userAgent) || /rv:11.0/i.test(userAgent) || /MSIE 10/i.test(userAgent) || /Edge\/\d+/.test(userAgent);
    const is_Chrome = userAgent.indexOf('Chrome') >= 0 && userAgent.indexOf('Edge') < 0;

    winWidth = $(window).width();
    let winHeight = $(window).height();

    if (is_Mac) $('html').addClass('mac');
    if (is_IE) $('html').addClass('ie');
    if (is_Chrome) $('html').addClass('chrome');

    // 2. МОДАЛЬНІ ВІКНА (POPUP)
    let popupTop = 0;

    _functions.removeScroll = function () {
        popupTop = $(window).scrollTop();$('html').css({
            "position": "fixed",
            "top": -popupTop,
            "width": "100%"
        });
    };

    _functions.addScroll = function () {
        $('html').css({ "position": "static" });
        window.scroll(0, popupTop);
    };

    _functions.openPopup = function (popup) {
        $('.popup-content').removeClass('active');$(popup + ', .popup-wrapper').addClass('active');
        _functions.removeScroll();
    };

    _functions.closePopup = function () {
        $('.popup-wrapper, .popup-content').removeClass('active');
        _functions.addScroll();
    };

    // ==========================================
    // FILTER TOGGLE (СПИСКИ ФІЛЬТРІВ)
    // ==========================================
    _functions.initFilterLists = function (selector = document) {
        $(selector).find('.fl-list').not('.full').each(function () {
            let th = $(this);
            let li = th.find("li");
            let extra = li.filter(':gt(4)');
            let btn = th.siblings('.fl-list-btn');

            if (li.length > 3) {
                th.addClass('more-options');

                let isUserOpened = btn.data('user-opened') === true;
                let hasChecked = extra.find('input:checked').length > 0;

                if (isUserOpened || hasChecked) {
                    extra.show();
                    btn.addClass('is-active');
                } else {
                    extra.hide();
                    btn.removeClass('is-active');
                }
            }
        });
    };

    // Ініціалізація фільтрів
    _functions.initFilterLists();

    // Перемикання заголовка блоку фільтра
    $(document).on('click', '.fl-title', function () {
        const th = $(this);
        const block = $(this).closest('.fl-block');
        const container = $(".fl-menu");

        th.toggleClass('is-active');
        block.find('.fl-toggle').slideToggle("slow");
    });

    // Клік на кнопку "Показати ще / Сховати"
    $(document).on('click', '.fl-list-btn', function () {
        let $btn =$(this);
        let list = $btn.closest('.fl-toggle').find('.fl-list');
        let li = list.find("li:gt(4)");
        let isVisible = li.is(":visible");

        // Запам'ятовуємо ручний вибір користувача
        $btn.data('user-opened', !isVisible);$btn.toggleClass('is-active', !isVisible);

        if (isVisible) {
            li.hide("slow");
        } else {
            li.show("slow");
        }
    });
    $(document).on("click", ".js_fl_open", function () {
        $("html").addClass("filter-is-open");
        _functions.removeScroll();
    });

    $(document).on("click", ".js_fl_close", function () {
        $("html").removeClass("filter-is-open");
        _functions.addScroll();
    });

    // Слайдер ціни / діапазону
    if ($('#slider').length) {
        var $slider =$("#slider");
        var $inputFrom =$(".js-price-from");
        var $inputTo =$(".js-price-to");

        var minVal = 0;
        var maxVal = 10000;
        var startFrom = parseInt($inputFrom.val(), 10) || 299;
        var startTo = parseInt($inputTo.val(), 10) || 10000;

        $slider.slider({
            range: true,
            min: minVal,
            max: maxVal,
            values: [startFrom, startTo],
            slide: function (event, ui) {
                $inputFrom.val(ui.values[0]);$inputTo.val(ui.values[1]);
            }
        });

        $inputFrom.on("change input", function () {
            var val1 = parseInt($inputFrom.val(), 10) || minVal;
            var val2 = parseInt($inputTo.val(), 10) || maxVal;

            if (val1 < minVal) val1 = minVal;
            if (val1 > val2) val1 = val2;

            $slider.slider("values", 0, val1);
        });

        $inputTo.on("change input", function () {
            var val1 = parseInt($inputFrom.val(), 10) || minVal;
            var val2 = parseInt($inputTo.val(), 10) || maxVal;

            if (val2 > maxVal) val2 = maxVal;
            if (val2 < val1) val2 = val1;

            $slider.slider("values", 1, val2);
        });
    }

    // ==========================================
    // ІНШІ ОБРОБНИКИ ПОДІЙ
    // ==========================================
    $(document).on('click', '.open-popup', function (e) {
        e.preventDefault();
        _functions.openPopup('.popup-content[data-rel="' + $(this).data('rel') + '"]');
    });

    $(document).on('click', '.popup-wrapper .btn--close, .popup-wrapper .layer-close', function (e) {
        e.preventDefault();
        _functions.closePopup();
    });

    // 3. СКРОЛ ФУНКЦІЇ (ХЕДЕР ТА АНІМАЦІЇ ЕЛЕМЕНТІВ)
    let prev_scroll = 0;

    _functions.scrollCall = function () {
        const winScr = $(window).scrollTop();

        if (winScr > prev_scroll) {
            $("header").addClass("scrolled");
        }
        prev_scroll = winScr;

        if (winScr <= 10) {
            $("header").removeClass("scrolled");
            prev_scroll = 0;
        }

        scrollAnime(winScr);
    };

    function scrollAnime(winScr) {
        const $animationElements =$('.animation').not('.animated');
        if ($animationElements.length) {
            const currentWinWidth = $(window).width();
            const currentWinHeight = $(window).height();

            $animationElements.each(function () {
                const $th =$(this);
                const triggerCoef = currentWinWidth < 768 ? 0.95 : 0.85;

                if (winScr >= $th.offset().top - (currentWinHeight * triggerCoef)) {$th.addClass('animated');
                }
            });
        }
    }

    window.addEventListener('scroll', _functions.scrollCall, { passive: true });
    _functions.scrollCall();
    window.addEventListener('load', _functions.scrollCall);

    // 4. МОБІЛЬНЕ МЕНЮ
    /* Open menu */
    $(document).on('click', '.js-open-menu', function () {
        const isOpen = !$('header').hasClass('open-menu');

        $('html').toggleClass('overflow-menu');$('header').removeClass('hide');
        $('header').toggleClass('open-menu');$('header').removeClass('open-search');

        $('.h-search-form input').val("");
        $(".h-search-results").removeClass("is-active");
    });

    /* Close menu */
    $(document).on('click', '.h-menu-overlay', function () {$('html').removeClass('overflow-menu');
        $('header').removeClass('open-menu open-search');$('.h-search-form input').val("");
        $(".h-search-results").removeClass("is-active");
    });

    // 5. ТАБИ (DESKTOP) ТА АКОРДЕОН (MOBILE)
    const $tabBtns =$('.p-tabs__nav-btn');
    const $tabPanels =$('.p-tabs__panel');

    function initTabs() {
        $tabBtns.removeClass('is-active');$tabPanels.removeClass('is-active');

        const $firstBtn =$tabBtns.first();
        const $firstPanel =$tabPanels.first();

        $firstBtn.addClass('is-active');$firstPanel.addClass('is-active');

        if ($(window).width() < 992) {$firstPanel.find('.p-tabs__body').show();
        }
    }

    initTabs();

    $(document).on('click', '.p-tabs__nav-btn', function () {
        const targetId = $(this).data('tab');

        $tabBtns.removeClass('is-active');$(this).addClass('is-active');

        $tabPanels.removeClass('is-active')
            .find('.p-tabs__body')
            .removeAttr('style');

        $(`#${targetId}`).addClass('is-active');
    });

    $(document).on('click', '.js-tab-acc-btn', function () {
        const $currentPanel =$(this).closest('.p-tabs__panel');
        const $currentBody =$currentPanel.find('.p-tabs__body');
        const isOpen = $currentPanel.hasClass('is-active');

        $tabPanels.not($currentPanel).removeClass('is-active');
        $('.p-tabs__body').not($currentBody).stop(true, true).slideUp(300);

        if (isOpen) {
            $currentPanel.removeClass('is-active');
            $currentBody.stop(true, true).slideUp(300);$tabBtns.removeClass('is-active');
        } else {
            $currentPanel.addClass('is-active');$currentBody.stop(true, true).slideDown(300);

            const panelId = $currentPanel.attr('id');
            $tabBtns.removeClass('is-active');$tabBtns.filter(`[data-tab="${panelId}"]`).addClass('is-active');
        }
    });

    // 6. ПОШУК
    $(document).on("click", ".js-open-search", function () {
        $("header").addClass("search-open");
        setTimeout(function () {
            $(".h-search").find("input").focus();
        }, 100);
    });

    $(document).on("click", ".js-close-search", function () {
        $("header").removeClass("search-open");
        $(".h-search").find("input").val("");
        $(".cab-search, .search__results-wrap").removeClass("active");
    });

    $(document).on("input", ".search input", function () {
        const val = $(this).val();
        const $res =$(this).closest(".search").find(".search__results-wrap");
        $res.toggleClass("active", val.length > 0);
    });

    // 7. СЕЛЕКТИ (SumoSelect)
    _functions.initSelect = function (parent) {
        var $container = parent ? $(parent) :$(document);

        $container.find('.SelectBox select').each(function () {
            var $select =$(this);

            $select.SumoSelect({
                floatWidth: 0,
                nativeOnDevice: [],
                placeholder: ''
            });

            var $box =$select.closest('.SelectBox');
            $box.toggleClass('value', !!$select.val());

            $select.on('sumo:opened', function () {$box.addClass('focus');
            });

            $select.on('sumo:closed', function () {$box.removeClass('focus');
            });
        });
    };

    _functions.initSelect('body');

    $(document).on('change', '.SelectBox select', function () {
        $(this).closest('.SelectBox').toggleClass('value', !!$(this).val());
    });
});

// ==========================================================================
// НАТИВНИЙ JAVASCRIPT
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. АКОРДЕОНИ
    document.addEventListener('click', function (e) {
        const $title =$(e.target).closest('.accordeon-title');
        if (!$title.length) return;

        const $item =$title.closest('.accordeon-item');
        const $accordeon =$title.closest('.accordeon');
        const isOpen = $item.hasClass('active');

        $accordeon.find('.accordeon-item.active').not($item).removeClass('active').find('.accordeon-title').next().slideUp();
        $item.toggleClass('active', !isOpen);$title.next().slideToggle(!isOpen);
    });

    // 2. КЛІКЕР КІЛЬКОСТІ
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.quantity-picker__btn');
        if (!btn) return;

        const container = btn.closest('.quantity-picker');
        const input = container.querySelector('.quantity-picker__input');
        if (!input) return;

        const isIncrement = btn.classList.contains('quantity-picker__btn--increment');
        const value = parseInt(input.value, 10) || 0;
        const min = input.dataset.min ? Number(input.dataset.min) : 1;
        const max = input.dataset.max ? Number(input.dataset.max) : Infinity;

        if (isIncrement && value < max) {
            input.value = value + 1;
        } else if (!isIncrement && value > min) {
            input.value = value - 1;
        }

        input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // 3. ВІДЕОПЛЕЄР
    jQuery(document).on('click', '.media__btn', function () {
        const $btn = jQuery(this);
        const $container =$btn.closest('.media');
        const $video =$container.find('.media__video');
        const videoItem = $video.get(0);

        if (!videoItem) return;

        if (videoItem.paused) {
            videoItem.play();
            $video.attr('controls', '');
            $btn.addClass('hide');$container.find('.heading').hide();
        } else {
            videoItem.pause();
            $video.removeAttr('controls');
            $btn.removeClass('hide');$container.find('.heading').show();
        }
    });

    // Додатково: повертаємо кнопку та ховаємо controls, якщо відео закінчилося
    jQuery(document).on('ended', '.media__video', function () {
        const $video = jQuery(this);
        const $container =$video.closest('.media');

        $video.removeAttr('controls');
        $container.find('.media__btn').removeClass('hide');$container.find('.heading').show();
    });

    // 4. ТАБИ
    const tabs = document.querySelectorAll(".tab");
    function tabify(tab) {
        const tabList = tab.querySelector(".tab__list");
        if (tabList) {
            const tabItems = [...tabList.children];
            const tabContent = tab.querySelector(".tab__content");
            const tabContentItems = [...tabContent.children];

            let tabIndex = tabItems.findIndex(item => item.classList.contains("is--active"));
            if (tabIndex === -1) tabIndex = 0;

            function setTab(index) {
                tabItems.forEach(x => x.classList.remove("is--active"));
                tabContentItems.forEach(x => x.classList.remove("is--active"));
                tabItems[index].classList.add("is--active");
                tabContentItems[index].classList.add("is--active");
            }

            tabItems.forEach((x, index) => x.addEventListener("click", () => setTab(index)));
            setTab(tabIndex);
        }
    }
    tabs.forEach(tabify);

    // 5. ЛІЧИЛЬНИКИ
    if ('IntersectionObserver' in window) {
        const obsCounter = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("animated");

                $(entry.target).find(".stats__value--number").each(function () {
                    $(this).prop("Counter", 0).animate({
                        Counter: $(this).text(),
                    }, {
                        duration: 1500,
                        easing: "swing",
                        step: function (now) {
                            $(this).text(Math.ceil(now));
                        },
                    });
                });
                observer.unobserve(entry.target);
            });
        });
        document.querySelectorAll(".stats__grid").forEach(block => obsCounter.observe(block));
    }

    // 6. ФУТЕР-АКОРДЕОН (МОБІЛЬНА ВЕРСІЯ)
    const accordions = document.querySelectorAll('.js-footer-accordion');
    accordions.forEach(accordion => {
        const title = accordion.querySelector('.footer-nav__title');
        if (title) {
            title.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    accordion.classList.toggle('is-open');
                }
            });
        }
    });
});