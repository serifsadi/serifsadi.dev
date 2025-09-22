(function () {
    function setVhVars() {
        const h = window.innerHeight || document.documentElement.clientHeight;
        document.documentElement.style.setProperty('--viewport-height', h + 'px');
        document.documentElement.style.setProperty('--background-height', h + 'px');
    }

    setVhVars();
    window.addEventListener('resize', setVhVars);
    window.addEventListener('orientationchange', setVhVars);

    function startFlow() {
        const body = document.body;
        if (!body) return;

        body.classList.remove('is-ready');
        body.classList.add('is-loading');

        setTimeout(function () {
            body.classList.remove('is-loading');
            body.classList.add('is-playing');

            setTimeout(function () {
                body.classList.remove('is-playing');
                body.classList.add('is-ready');
            }, 900);
        }, 120);
    }

    const prefersReduced =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function reveal(selector, opts) {
        opts = opts || {};
        const delay = +opts.delay || 0;
        const distance = opts.distance || '0.75rem';
        const duration = +opts.duration || 600;
        const threshold = +opts.threshold || 0.25;

        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        els.forEach(function (el) {
            el.style.willChange = 'opacity, transform';
            el.style.opacity = '0';
            el.style.transform = 'translateY(' + (prefersReduced ? '0' : distance) + ')';
        });

        if (prefersReduced) {
            els.forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.willChange = 'auto';
            });
            return;
        }

        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                const el = e.target;
                io.unobserve(el);

                setTimeout(function () {
                    el.style.transition =
                        'opacity ' + duration + 'ms ease, transform ' + duration + 'ms ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    setTimeout(function () {
                        el.style.willChange = 'auto';
                    }, duration + 100);
                }, delay);
            });
        }, {root: null, rootMargin: '0px', threshold: threshold});

        els.forEach(function (el) {
            io.observe(el);
        });
    }

    function initAnimations() {
        reveal('.text-component.hero-title', {distance: '0.75rem', duration: 1000, threshold: 0.25});
        reveal('.text-component.subtitle', {distance: '0.75rem', duration: 1000, threshold: 0.25});
        reveal('.text-component.tagline', {distance: '0.75rem', duration: 1000, threshold: 0.25});
        reveal('.buttons-component.cta', {distance: '0.75rem', duration: 900, threshold: 0.25});
        reveal('.icons-component.social', {distance: '0.75rem', duration: 900, threshold: 0.25});
        reveal('.container-component.hero', {distance: '0.75rem', duration: 900, threshold: 0.25});
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            startFlow();
            initAnimations();
        });
    } else {
        startFlow();
        initAnimations();
    }
})();
