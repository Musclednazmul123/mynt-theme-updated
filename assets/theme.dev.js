
/*
* @license
* Broadcast Theme (c) Invisible Themes
*
* This file is included for advanced development by
* Shopify Agencies.  Modified versions of the theme 
* code are not supported by Shopify or Invisible.
*
* In order to use this file you will need to change 
* theme.js to theme.dev.js in /layout/theme.liquid
*
*/

(function (bodyScrollLock, themeCurrency, themeImages, themeAddresses, Sqrl, Flickity, Rellax, ellipsed, FlickityFade, AOS) {
  'use strict';

  window.theme = window.theme || {};

  window.theme.sizes = {
    mobile: 480,
    small: 750,
    large: 990,
    widescreen: 1400,
  };

  window.theme.keyboardKeys = {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    LEFTARROW: 37,
    RIGHTARROW: 39,
  };

  window.theme.focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function floatLabels(container) {
    const floats = container.querySelectorAll('.form-field');
    floats.forEach((element) => {
      const label = element.querySelector('label');
      const input = element.querySelector('input, textarea');
      if (label && input) {
        input.addEventListener('keyup', (event) => {
          if (event.target.value !== '') {
            label.classList.add('label--float');
          } else {
            label.classList.remove('label--float');
          }
        });
        if (input.value && input.value.length) {
          label.classList.add('label--float');
        }
      }
    });
  }

  function readHeights() {
    const h = {};
    h.windowHeight = window.innerHeight;
    h.announcementHeight = getHeight('[data-section-type*="announcement"]');
    h.footerHeight = getHeight('[data-section-type*="footer"]');
    h.menuHeight = getHeight('[data-header-height]');
    h.headerHeight = h.menuHeight + h.announcementHeight;
    h.logoHeight = getFooterLogoWithPadding();
    return h;
  }

  function setVarsOnResize() {
    document.addEventListener('theme:resize', resizeVars);
    setVars();
  }

  function setVars() {
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight} = readHeights();
    document.documentElement.style.setProperty('--full-screen', `${windowHeight}px`);
    document.documentElement.style.setProperty('--three-quarters', `${windowHeight * (3 / 4)}px`);
    document.documentElement.style.setProperty('--two-thirds', `${windowHeight * (2 / 3)}px`);
    document.documentElement.style.setProperty('--one-half', `${windowHeight / 2}px`);
    document.documentElement.style.setProperty('--one-third', `${windowHeight / 3}px`);

    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
    document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);
  }

  function resizeVars() {
    // restrict the heights that are changed on resize to avoid iOS jump when URL bar is shown and hidden
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight} = readHeights();
    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
    document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);
  }

  function getHeight(selector) {
    const el = document.querySelector(selector);
    if (el) {
      return el.clientHeight;
    } else {
      return 0;
    }
  }

  function getFooterLogoWithPadding() {
    const height = getHeight('[data-footer-logo]');
    if (height > 0) {
      return height + 20;
    } else {
      return 0;
    }
  }

  function singles(frame, wrappers) {
    // sets the height of any frame passed in with the
    // tallest preventOverflowContent as well as any image in that frame
    let padding = 64;
    let tallest = 0;

    wrappers.forEach((wrap) => {
      if (wrap.offsetHeight > tallest) {
        const getMarginTop = parseInt(window.getComputedStyle(wrap).marginTop);
        const getMarginBottom = parseInt(window.getComputedStyle(wrap).marginBottom);
        const getMargin = getMarginTop + getMarginBottom;
        if (getMargin > padding) {
          padding = getMargin;
        }

        tallest = wrap.offsetHeight;
      }
    });
    const images = frame.querySelectorAll('[data-overflow-background]');
    const frames = [frame, ...images];
    frames.forEach((el) => {
      el.style.setProperty('min-height', `calc(${tallest + padding}px + var(--header-padding)`);
    });
  }

  function doubles(section) {
    if (window.innerWidth <= window.theme.sizes.small) {
      // if we are below the small breakpoint, the double section acts like two independent
      // single frames
      let singleFrames = section.querySelectorAll('[data-overflow-frame]');
      singleFrames.forEach((singleframe) => {
        const wrappers = singleframe.querySelectorAll('[data-overflow-content]');
        singles(singleframe, wrappers);
      });
      return;
    }

    const padding = parseInt(getComputedStyle(section).getPropertyValue('--outer')) * 2;
    let tallest = 0;

    const frames = section.querySelectorAll('[data-overflow-frame]');
    const contentWrappers = section.querySelectorAll('[data-overflow-content]');
    contentWrappers.forEach((content) => {
      if (content.offsetHeight > tallest) {
        tallest = content.offsetHeight;
      }
    });
    const images = section.querySelectorAll('[data-overflow-background]');
    let applySizes = [...frames, ...images];
    applySizes.forEach((el) => {
      el.style.setProperty('min-height', `${tallest + padding}px`);
    });
    section.style.setProperty('min-height', `${tallest + padding + 2}px`);
  }

  function preventOverflow(container) {
    const singleFrames = container.querySelectorAll('.js-overflow-container');
    if (singleFrames) {
      singleFrames.forEach((frame) => {
        const wrappers = frame.querySelectorAll('.js-overflow-content');
        singles(frame, wrappers);
        document.addEventListener('theme:resize', () => {
          singles(frame, wrappers);
        });
      });
    }

    const doubleSections = container.querySelectorAll('[data-overflow-wrapper]');
    if (doubleSections) {
      doubleSections.forEach((section) => {
        doubles(section);
        document.addEventListener('theme:resize', () => {
          doubles(section);
        });
      });
    }
  }

  function debounce(fn, time) {
    let timeout;
    return function () {
      // eslint-disable-next-line prefer-rest-params
      if (fn) {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
      }
    };
  }

  function dispatch() {
    document.dispatchEvent(
      new CustomEvent('theme:resize', {
        bubbles: true,
      })
    );
  }

  function resizeListener() {
    window.addEventListener(
      'resize',
      debounce(function () {
        dispatch();
      }, 50)
    );
  }

  let prev = window.pageYOffset;
  let up = null;
  let down = null;
  let wasUp = null;
  let wasDown = null;
  let scrollLockTimeout = 0;

  function dispatch$1() {
    const position = window.pageYOffset;
    if (position > prev) {
      down = true;
      up = false;
    } else if (position < prev) {
      down = false;
      up = true;
    } else {
      up = null;
      down = null;
    }
    prev = position;
    document.dispatchEvent(
      new CustomEvent('theme:scroll', {
        detail: {
          up,
          down,
          position,
        },
        bubbles: false,
      })
    );
    if (up && !wasUp) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:up', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    if (down && !wasDown) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:down', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    wasDown = down;
    wasUp = up;
  }

  function lock(e) {
    bodyScrollLock.disableBodyScroll(e.detail, {
      allowTouchMove: (el) => el.tagName === 'TEXTAREA',
    });
    document.documentElement.setAttribute('data-scroll-locked', '');
  }

  function unlock() {
    // Prevent body scroll lock race conditions
    scrollLockTimeout = setTimeout(() => {
      document.body.removeAttribute('data-drawer-closing');
    }, 20);

    if (document.body.hasAttribute('data-drawer-closing')) {
      document.body.removeAttribute('data-drawer-closing');

      if (scrollLockTimeout) {
        clearTimeout(scrollLockTimeout);
      }

      return;
    } else {
      document.body.setAttribute('data-drawer-closing', '');
    }

    document.documentElement.removeAttribute('data-scroll-locked');
    bodyScrollLock.clearAllBodyScrollLocks();
  }

  function scrollListener() {
    let timeout;
    window.addEventListener(
      'scroll',
      function () {
        if (timeout) {
          window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(function () {
          dispatch$1();
        });
      },
      {passive: true}
    );

    window.addEventListener('theme:scroll:lock', lock);
    window.addEventListener('theme:scroll:unlock', unlock);
  }

  const wrap = (toWrap, wrapperClass = '', wrapperOption) => {
    const wrapper = wrapperOption || document.createElement('div');
    wrapper.classList.add(wrapperClass);
    toWrap.parentNode.insertBefore(wrapper, toWrap);
    return wrapper.appendChild(toWrap);
  };

  function wrapElements(container) {
    // Target tables to make them scrollable
    const tableSelectors = '.rte table';
    const tables = container.querySelectorAll(tableSelectors);
    tables.forEach((table) => {
      wrap(table, 'rte__table-wrapper');
    });

    // Target iframes to make them responsive
    const iframeSelectors = '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"], .rte iframe#admin_bar_iframe';
    const frames = container.querySelectorAll(iframeSelectors);
    frames.forEach((frame) => {
      wrap(frame, 'rte__video-wrapper');
    });
  }

  function wasTouched() {
    window.theme.touched = true;
    document.removeEventListener('touchstart', wasTouched, {passive: true});
    document.querySelector('body').classList.add('supports-touch');
    document.dispatchEvent(
      new CustomEvent('theme:touch', {
        bubbles: true,
      })
    );
  }

  document.addEventListener('touchstart', wasTouched, {passive: true});

  function getScript(url, callback, callbackError) {
    let head = document.getElementsByTagName('head')[0];
    let done = false;
    let script = document.createElement('script');
    script.src = url;

    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        done = true;
        callback();
      } else {
        callbackError();
      }
    };

    head.appendChild(script);
  }

  const loaders = {};
  window.isYoutubeAPILoaded = false;
  window.isPlyrLoaded = false;

  function loadScript(options = {}) {
    if (!options.type) {
      options.type = 'json';
    }

    if (options.url) {
      if (loaders[options.url]) {
        return loaders[options.url];
      } else {
        return getScriptWithPromise(options.url, options.type);
      }
    } else if (options.json) {
      if (loaders[options.json]) {
        return Promise.resolve(loaders[options.json]);
      } else {
        return window
          .fetch(options.json)
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            loaders[options.json] = response;
            return response;
          });
      }
    } else if (options.name) {
      const key = ''.concat(options.name, options.version);
      if (loaders[key]) {
        return loaders[key];
      } else {
        return loadShopifyWithPromise(options);
      }
    } else {
      return Promise.reject();
    }
  }

  function getScriptWithPromise(url, type) {
    const loader = new Promise((resolve, reject) => {
      if (type === 'text') {
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        getScript(
          url,
          function () {
            resolve();
          },
          function () {
            reject();
          }
        );
      }
    });

    loaders[url] = loader;
    return loader;
  }

  function loadShopifyWithPromise(options) {
    const key = ''.concat(options.name, options.version);
    const loader = new Promise((resolve, reject) => {
      try {
        window.Shopify.loadFeatures([
          {
            name: options.name,
            version: options.version,
            onLoad: (err) => {
              onLoadFromShopify(resolve, reject, err);
            },
          },
        ]);
      } catch (err) {
        reject(err);
      }
    });
    loaders[key] = loader;
    return loader;
  }

  function onLoadFromShopify(resolve, reject, err) {
    if (err) {
      return reject(err);
    } else {
      return resolve();
    }
  }

  const sections = {};

  const selectors = {
    dataEnableSound: 'data-enable-sound',
    dataEnableBackground: 'data-enable-background',
    dataEnableAutoplay: 'data-enable-autoplay',
    dataEnableLoop: 'data-enable-loop',
    dataVideoId: 'data-video-id',
    dataVideoType: 'data-video-type',
    videoIframe: '[data-video-id]',
  };

  const classes = {
    loaded: 'loaded',
  };

  class LoadVideoVimeo {
    constructor(container) {
      this.container = container;
      this.player = this.container.querySelector(selectors.videoIframe);

      if (this.player) {
        this.videoID = this.player.getAttribute(selectors.dataVideoId);
        this.videoType = this.player.getAttribute(selectors.dataVideoType);
        this.enableBackground = this.player.getAttribute(selectors.dataEnableBackground) === 'true';
        this.disableSound = this.player.getAttribute(selectors.dataEnableSound) === 'false';
        this.enableAutoplay = this.player.getAttribute(selectors.dataEnableAutoplay) !== 'false';
        this.enableLoop = this.player.getAttribute(selectors.dataEnableLoop) !== 'false';

        if (this.videoType == 'vimeo') {
          this.init();
        }
      }
    }

    init() {
      this.loadVimeoPlayer();
    }

    loadVimeoPlayer() {
      const oembedUrl = 'https://vimeo.com/api/oembed.json';
      const vimeoUrl = 'https://vimeo.com/' + this.videoID;
      let paramsString = '';
      const state = this.player;

      const params = {
        url: vimeoUrl,
        background: this.enableBackground,
        muted: this.disableSound,
        autoplay: this.enableAutoplay,
        loop: this.enableLoop,
      };

      for (let key in params) {
        paramsString += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
      }

      fetch(`${oembedUrl}?${paramsString}`)
        .then((response) => response.json())
        .then(function (data) {
          state.innerHTML = data.html;

          setTimeout(function () {
            state.parentElement.classList.add(classes.loaded);
          }, 1000);
        })
        .catch(function () {
          console.log('error');
        });
    }
  }

  const loadVideoVimeo = {
    onLoad() {
      sections[this.id] = new LoadVideoVimeo(this.container);
    },
  };

  const throttle = (fn, wait) => {
    let prev, next;
    return function invokeFn(...args) {
      const now = Date.now();
      next = clearTimeout(next);
      if (!prev || now - prev >= wait) {
        // eslint-disable-next-line prefer-spread
        fn.apply(null, args);
        prev = now;
      } else {
        next = setTimeout(invokeFn.bind(null, ...args), wait - (now - prev));
      }
    };
  };

  const sections$1 = {};

  const selectors$1 = {
    dataSectionId: 'data-section-id',
    dataEnableSound: 'data-enable-sound',
    dataHideOptions: 'data-hide-options',
    dataCheckPlayerVisibility: 'data-check-player-visibility',
    dataVideoId: 'data-video-id',
    dataVideoType: 'data-video-type',
    videoIframe: '[data-video-id]',
    videoWrapper: '.video-wrapper',
    youtubeWrapper: '[data-youtube-wrapper]',
  };

  const classes$1 = {
    loaded: 'loaded',
  };

  const players = [];

  class LoadVideoYT {
    constructor(container) {
      this.container = container;
      this.player = this.container.querySelector(selectors$1.videoIframe);

      if (this.player) {
        this.videoOptionsVars = {};
        this.videoID = this.player.getAttribute(selectors$1.dataVideoId);
        this.videoType = this.player.getAttribute(selectors$1.dataVideoType);
        if (this.videoType == 'youtube') {
          this.checkPlayerVisibilityFlag = this.player.getAttribute(selectors$1.dataCheckPlayerVisibility) === 'true';
          this.playerID = this.player.querySelector(selectors$1.youtubeWrapper) ? this.player.querySelector(selectors$1.youtubeWrapper).id : this.player.id;
          if (this.player.hasAttribute(selectors$1.dataHideOptions)) {
            this.videoOptionsVars = {
              cc_load_policy: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              autohide: 0,
              controls: 0,
              branding: 0,
              showinfo: 0,
              rel: 0,
              fs: 0,
              wmode: 'opaque',
            };
          }

          this.init();

          this.container.addEventListener('touchstart', function (e) {
            if (e.target.matches(selectors$1.videoWrapper) || e.target.closest(selectors$1.videoWrapper)) {
              const playerID = e.target.querySelector(selectors$1.videoIframe).id;
              players[playerID].playVideo();
            }
          });
        }
      }
    }

    init() {
      if (window.isYoutubeAPILoaded) {
        this.loadYoutubePlayer();
      } else {
        // Load Youtube API if not loaded yet
        loadScript({url: 'https://www.youtube.com/iframe_api'}).then(() => this.loadYoutubePlayer());
      }
    }

    loadYoutubePlayer() {
      const defaultYoutubeOptions = {
        height: '720',
        width: '1280',
        playerVars: this.videoOptionsVars,
        events: {
          onReady: (event) => {
            const eventIframe = event.target.getIframe();
            const id = eventIframe.id;
            const enableSound = document.querySelector(`#${id}`).getAttribute(selectors$1.dataEnableSound) === 'true';

            eventIframe.setAttribute('tabindex', '-1');

            if (enableSound) {
              event.target.unMute();
            } else {
              event.target.mute();
            }
            event.target.playVideo();

            if (this.checkPlayerVisibilityFlag) {
              this.checkPlayerVisibility(id);

              window.addEventListener(
                'scroll',
                throttle(() => {
                  this.checkPlayerVisibility(id);
                }, 150)
              );
            }
          },
          onStateChange: (event) => {
            // Loop video if state is ended
            if (event.data == 0) {
              event.target.playVideo();
            }
            if (event.data == 1) {
              // video is playing
              event.target.getIframe().parentElement.classList.add(classes$1.loaded);
            }
          },
        },
      };

      const currentYoutubeOptions = {...defaultYoutubeOptions};
      currentYoutubeOptions.videoId = this.videoID;
      if (this.videoID.length) {
        YT.ready(() => {
          players[this.playerID] = new YT.Player(this.playerID, currentYoutubeOptions);
        });
      }
      window.isYoutubeAPILoaded = true;
    }

    checkPlayerVisibility(id) {
      let playerID;
      if (typeof id === 'string') {
        playerID = id;
      } else if (id.data != undefined) {
        playerID = id.data.id;
      } else {
        return;
      }

      const playerElement = document.getElementById(playerID + '-container');
      if (!playerElement) return;
      const player = players[playerID];
      const box = playerElement.getBoundingClientRect();
      let isVisible = visibilityHelper.isElementPartiallyVisible(playerElement) || visibilityHelper.isElementTotallyVisible(playerElement);

      // Fix the issue when element height is bigger than the viewport height
      if (box.top < 0 && playerElement.clientHeight + box.top >= 0) {
        isVisible = true;
      }

      if (isVisible && player && typeof player.playVideo === 'function') {
        player.playVideo();
      } else if (!isVisible && player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
    }

    onUnload() {
      const playerID = 'youtube-' + this.container.getAttribute(selectors$1.dataSectionId);
      if (!players[playerID]) return;
      players[playerID].destroy();
    }
  }

  const loadVideoYT = {
    onLoad() {
      sections$1[this.id] = new LoadVideoYT(this.container);
    },
    onUnload(e) {
      sections$1[this.id].onUnload(e);
    },
  };

  const selectors$2 = {
    popupContainer: '.pswp',
    popupCloseBtn: '.pswp__custom-close',
    popupIframe: 'iframe',
    popupCustomIframe: '.pswp__custom-iframe',
    popupThumbs: '.pswp__thumbs',
    dataOptionClasses: 'data-pswp-option-classes',
    dataVideoType: 'data-video-type',
  };

  const classes$2 = {
    classCurrent: 'is-current',
    classCustomLoader: 'pswp--custom-loader',
    classCustomOpen: 'pswp--custom-opening',
    classLoader: 'pswp__loader',
  };

  const loaderHTML = `<div class="${classes$2.classLoader}"><div class="loader pswp__loader-line"><div class="loader-indeterminate"></div></div></div>`;

  class LoadPhotoswipe {
    constructor(items, options = '') {
      this.items = items;
      this.pswpElement = document.querySelectorAll(selectors$2.popupContainer)[0];
      this.popup = null;
      this.popupThumbs = null;
      this.popupThumbsContainer = this.pswpElement.querySelector(selectors$2.popupThumbs);
      this.closeBtn = this.pswpElement.querySelector(selectors$2.popupCloseBtn);
      const defaultOptions = {
        history: false,
        focus: false,
        mainClass: '',
      };
      this.options = options !== '' ? options : defaultOptions;

      this.init();
    }

    init() {
      this.pswpElement.classList.add(classes$2.classCustomOpen);

      this.initLoader();

      loadScript({url: window.theme.assets.photoswipe})
        .then(() => this.loadPopup())
        .catch((e) => console.error(e));
    }

    initLoader() {
      if (this.pswpElement.classList.contains(classes$2.classCustomLoader) && this.options !== '' && this.options.mainClass) {
        this.pswpElement.setAttribute(selectors$2.dataOptionClasses, this.options.mainClass);
        let loaderElem = document.createElement('div');
        loaderElem.innerHTML = loaderHTML;
        loaderElem = loaderElem.firstChild;
        this.pswpElement.appendChild(loaderElem);
      } else {
        this.pswpElement.setAttribute(selectors$2.dataOptionClasses, '');
      }
    }

    loadPopup() {
      const PhotoSwipe = window.themePhotoswipe.PhotoSwipe.default;
      const PhotoSwipeUI = window.themePhotoswipe.PhotoSwipeUI.default;

      if (this.pswpElement.classList.contains(classes$2.classCustomLoader)) {
        this.pswpElement.classList.remove(classes$2.classCustomLoader);
      }

      this.pswpElement.classList.remove(classes$2.classCustomOpen);

      this.popup = new PhotoSwipe(this.pswpElement, PhotoSwipeUI, this.items, this.options);
      this.popup.init();

      this.initVideo();

      this.thumbsActions();

      this.popup.listen('close', () => this.onClose());

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.popup.close());
      }
    }

    initVideo() {
      const videoContainer = this.pswpElement.querySelector(selectors$2.popupCustomIframe);
      if (videoContainer) {
        const videoType = videoContainer.getAttribute(selectors$2.dataVideoType);

        if (videoType == 'youtube') {
          new LoadVideoYT(videoContainer.parentElement);
        } else if (videoType == 'vimeo') {
          new LoadVideoVimeo(videoContainer.parentElement);
        }
      }
    }

    thumbsActions() {
      if (this.popupThumbsContainer && this.popupThumbsContainer.firstChild) {
        this.popupThumbsContainer.addEventListener('wheel', (e) => this.stopDisabledScroll(e));
        this.popupThumbsContainer.addEventListener('mousewheel', (e) => this.stopDisabledScroll(e));
        this.popupThumbsContainer.addEventListener('DOMMouseScroll', (e) => this.stopDisabledScroll(e));

        this.popupThumbs = this.pswpElement.querySelectorAll(`${selectors$2.popupThumbs} > *`);
        this.popupThumbs.forEach((element, i) => {
          element.addEventListener('click', (e) => {
            e.preventDefault();
            element.parentElement.querySelector(`.${classes$2.classCurrent}`).classList.remove(classes$2.classCurrent);
            element.classList.add(classes$2.classCurrent);
            this.popup.goTo(i);
          });
        });

        this.popup.listen('imageLoadComplete', () => this.setCurrentThumb());
        this.popup.listen('beforeChange', () => this.setCurrentThumb());
      }
    }

    stopDisabledScroll(e) {
      e.stopPropagation();
    }

    onClose() {
      const popupIframe = this.pswpElement.querySelector(selectors$2.popupIframe);
      if (popupIframe) {
        popupIframe.setAttribute('src', '');
        popupIframe.parentNode.removeChild(popupIframe);
      }

      if (this.popupThumbsContainer && this.popupThumbsContainer.firstChild) {
        while (this.popupThumbsContainer.firstChild) this.popupThumbsContainer.removeChild(this.popupThumbsContainer.firstChild);
      }

      this.pswpElement.setAttribute(selectors$2.dataOptionClasses, '');
      const loaderElem = this.pswpElement.querySelector(`.${classes$2.classLoader}`);
      if (loaderElem) {
        this.pswpElement.removeChild(loaderElem);
      }
    }

    setCurrentThumb() {
      const lastCurrentThumb = this.pswpElement.querySelector(`${selectors$2.popupThumbs} > .${classes$2.classCurrent}`);
      if (lastCurrentThumb) {
        lastCurrentThumb.classList.remove(classes$2.classCurrent);
      }

      if (!this.popupThumbs) return;
      const currentThumb = this.popupThumbs[this.popup.getCurrentIndex()];
      currentThumb.classList.add(classes$2.classCurrent);
      this.scrollThumbs(currentThumb);
    }

    scrollThumbs(currentThumb) {
      const thumbsContainerLeft = this.popupThumbsContainer.scrollLeft;
      const thumbsContainerWidth = this.popupThumbsContainer.offsetWidth;
      const thumbsContainerPos = thumbsContainerLeft + thumbsContainerWidth;
      const currentThumbLeft = currentThumb.offsetLeft;
      const currentThumbWidth = currentThumb.offsetWidth;
      const currentThumbPos = currentThumbLeft + currentThumbWidth;

      if (thumbsContainerPos <= currentThumbPos || thumbsContainerPos > currentThumbLeft) {
        const currentThumbMarginLeft = parseInt(window.getComputedStyle(currentThumb).marginLeft);
        this.popupThumbsContainer.scrollTo({
          top: 0,
          left: currentThumbLeft - currentThumbMarginLeft,
          behavior: 'smooth',
        });
      }
    }
  }

  function ariaToggle(container) {
    const toggleButtons = container.querySelectorAll('[data-aria-toggle]');
    if (toggleButtons.length) {
      toggleButtons.forEach((element) => {
        element.addEventListener('click', function (event) {
          event.preventDefault();
          const currentTarget = event.currentTarget;
          currentTarget.setAttribute('aria-expanded', currentTarget.getAttribute('aria-expanded') == 'false' ? 'true' : 'false');
          const toggleID = currentTarget.getAttribute('aria-controls');
          document.querySelector(`#${toggleID}`).classList.toggle('expanding');
          setTimeout(function () {
            document.querySelector(`#${toggleID}`).classList.toggle('expanded');
          }, 40);
        });
      });
    }
  }

  function videoPopups(container) {
    const videoPopups = container.querySelectorAll('[data-video-popup]');
    if (videoPopups.length) {
      videoPopups.forEach((element) => {
        element.addEventListener('click', function (e) {
          const videoPopupHtml = element.getAttribute('data-video-popup');
          if (videoPopupHtml.trim() !== '') {
            e.preventDefault();

            const items = [
              {
                html: videoPopupHtml,
              },
            ];

            new LoadPhotoswipe(items);
          }
        });
      });
    }
  }

  function lazyImageBackgrounds() {
    document.addEventListener('lazyloaded', function (e) {
      const lazyImage = e.target.parentNode;
      if (lazyImage.classList.contains('lazy-image')) {
        lazyImage.style.backgroundImage = 'none';
      }
    });
  }

  resizeListener();
  scrollListener();
  lazyImageBackgrounds();

  window.addEventListener('load', () => {
    setVarsOnResize();
    floatLabels(document);
    preventOverflow(document);
    videoPopups(document);
    ariaToggle(document);
    wrapElements(document);
  });

  document.addEventListener('shopify:section:load', (e) => {
    const container = e.target;
    floatLabels(container);
    preventOverflow(container);
    videoPopups(container);
    wrapElements(container);
    ariaToggle(document);
  });

  (function () {
    function n(n) {
      var i = window.innerWidth || document.documentElement.clientWidth,
        r = window.innerHeight || document.documentElement.clientHeight,
        t = n.getBoundingClientRect();
      return t.top >= 0 && t.bottom <= r && t.left >= 0 && t.right <= i;
    }
    function t(n) {
      var i = window.innerWidth || document.documentElement.clientWidth,
        r = window.innerHeight || document.documentElement.clientHeight,
        t = n.getBoundingClientRect(),
        u = (t.left >= 0 && t.left <= i) || (t.right >= 0 && t.right <= i),
        f = (t.top >= 0 && t.top <= r) || (t.bottom >= 0 && t.bottom <= r);
      return u && f;
    }
    function i(n, i) {
      function r() {
        var r = t(n);
        r != u && ((u = r), typeof i == 'function' && i(r, n));
      }
      var u = t(n);
      window.addEventListener('load', r);
      window.addEventListener('resize', r);
      window.addEventListener('scroll', r);
    }
    function r(t, i) {
      function r() {
        var r = n(t);
        r != u && ((u = r), typeof i == 'function' && i(r, t));
      }
      var u = n(t);
      window.addEventListener('load', r);
      window.addEventListener('resize', r);
      window.addEventListener('scroll', r);
    }
    window.visibilityHelper = {isElementTotallyVisible: n, isElementPartiallyVisible: t, inViewportPartially: i, inViewportTotally: r};
  })();

  const showElement = (elem, removeProp = false, prop = 'block') => {
    if (elem) {
      if (removeProp) {
        elem.style.removeProperty('display');
      } else {
        elem.style.display = prop;
      }
    }
  };

  /**
   * Module to show Recently Viewed Products
   *
   * Copyright (c) 2014 Caroline Schnapp (11heavens.com)
   * Dual licensed under the MIT and GPL licenses:
   * http://www.opensource.org/licenses/mit-license.php
   * http://www.gnu.org/licenses/gpl.html
   *
   */

  Shopify.Products = (function () {
    const config = {
      howManyToShow: 4,
      howManyToStoreInMemory: 10,
      wrapperId: 'recently-viewed-products',
      templateId: 'recently-viewed-product-template',
      onComplete: null,
    };

    let productHandleQueue = [];
    let wrapper = null;
    let template = null;
    let howManyToShowItems = null;

    const cookie = {
      configuration: {
        expires: 90,
        path: '/',
        domain: window.location.hostname,
      },
      name: 'shopify_recently_viewed',
      write: function (recentlyViewed) {
        const recentlyViewedString = recentlyViewed.join(' ');
        document.cookie = `${this.name}=${recentlyViewedString}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      },
      read: function () {
        let recentlyViewed = [];
        let cookieValue = null;
        const templateProduct = document.querySelector('#template-product');

        if (templateProduct) {
          const currentProduct = templateProduct.getAttribute('data-product-handle');

          if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
            cookieValue = document.cookie
              .split('; ')
              .find((row) => row.startsWith(this.name))
              .split('=')[1];
          }

          if (cookieValue !== null) {
            recentlyViewed = cookieValue.split(' ');
          }

          // Remove current product from the array
          if (recentlyViewed.indexOf(currentProduct) != -1) {
            const currentProductIndex = recentlyViewed.indexOf(currentProduct);
            recentlyViewed.splice(currentProductIndex, 1);
          }
        }

        return recentlyViewed;
      },
      destroy: function () {
        const cookieVal = null;
        document.cookie = `${this.name}=${cookieVal}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      },
      remove: function (productHandle) {
        const recentlyViewed = this.read();
        const position = recentlyViewed.indexOf(productHandle);
        if (position !== -1) {
          recentlyViewed.splice(position, 1);
          this.write(recentlyViewed);
        }
      },
    };

    const finalize = () => {
      showElement(wrapper, true);
      const cookieItemsLength = cookie.read().length;

      if (Shopify.recentlyViewed && howManyToShowItems && cookieItemsLength && cookieItemsLength < howManyToShowItems && wrapper.children.length) {
        let allClassesArr = [];
        let addClassesArr = [];
        let objCounter = 0;
        for (const property in Shopify.recentlyViewed) {
          objCounter += 1;
          const objString = Shopify.recentlyViewed[property];
          const objArr = objString.split(' ');
          const propertyIdx = parseInt(property.split('_')[1]);
          allClassesArr = [...allClassesArr, ...objArr];

          if (cookie.read().length === propertyIdx || (objCounter === Object.keys(Shopify.recentlyViewed).length && !addClassesArr.length)) {
            addClassesArr = [...addClassesArr, ...objArr];
          }
        }

        for (let i = 0; i < wrapper.children.length; i++) {
          const element = wrapper.children[i];
          if (allClassesArr.length) {
            element.classList.remove(...allClassesArr);
          }

          if (addClassesArr.length) {
            element.classList.add(...addClassesArr);
          }
        }
      }

      // If we have a callback.
      if (config.onComplete) {
        try {
          config.onComplete();
        } catch (error) {
          console.log('error');
        }
      }
    };

    const moveAlong = (shown) => {
      if (productHandleQueue.length && shown < config.howManyToShow) {
        fetch('/products/' + productHandleQueue[0] + '.js')
          .then((response) => response.json())
          .then((product) => {
            product.priceFormatted = themeCurrency.formatMoney(product.price, theme.moneyFormat);
            product.compareFormatted = themeCurrency.formatMoney(product.compare_at_price, theme.moneyFormat);
            product.topImage = product.media[0] ? themeImages.getSizedImageUrl(product.media[0].preview_image.src, '900x900') : '';
            product.bottomImage = product.media[1] ? themeImages.getSizedImageUrl(product.media[1].preview_image.src, '900x900') : '';

            let doubleImageClass = '';
            let bottomImageClass = '';
            let saleClass = 'is-hidden hidden';
            let priceClass = '';
            let fromClass = 'is-hidden hidden';

            if (product.media.length > 1) {
              doubleImageClass = 'double__image';
            } else {
              bottomImageClass = 'is-hidden hidden';
            }

            if (product.compare_at_price > product.price) {
              priceClass = 'sale';
              saleClass = '';
            }

            if (product.price_varies) {
              fromClass = '';
            }

            const stripHtmlRegex = /(<([^>]+)>)/gi;
            const productTitleStripped = product.title.replace(stripHtmlRegex, '');

            let markup = template.innerHTML;
            markup = markup.replace(/\|\|itemUrl\|\|/g, product.url);
            markup = markup.replace(/\|\|itemDoubleImageClass\|\|/g, doubleImageClass);
            markup = markup.replace(/\|\|itemTopImage\|\|/g, product.topImage);
            markup = markup.replace(/\|\|itemBottomImage\|\|/g, product.bottomImage);
            markup = markup.replace(/\|\|itemBottomImageClass\|\|/g, bottomImageClass);
            markup = markup.replace(/\|\|itemSaleClass\|\|/g, saleClass);
            markup = markup.replace(/\|\|itemPriceClass\|\|/g, priceClass);
            markup = markup.replace(/\|\|itemFromClass\|\|/g, fromClass);
            markup = markup.replace(/\|\|itemTitle\|\|/g, productTitleStripped);
            markup = markup.replace(/\|\|itemComparedPrice\|\|/g, product.compareFormatted);
            markup = markup.replace(/\|\|itemPrice\|\|/g, product.priceFormatted);
            markup = markup.replace(/\|\|itemHandle\|\|/g, product.handle);

            if (product.options[0].name === 'Title' && product.options.length === 1 && product.options[0].values[0] === 'Default Title') {
              markup = markup.replace(/\|\|itemHasOnlyDefault\|\|/g, 'data-quick-add-button');
            } else {
              markup = markup.replace(/\|\|itemHasOnlyDefault\|\|/g, '');
            }

            const colorArray = product.options.filter((option) => {
              for (let index = 0; index < theme.swatchLabels.length; index++) {
                const label = theme.swatchLabels[index].trim();

                if (Object.values(option).includes(label)) {
                  return option;
                }
              }
            });

            markup = markup.replace(/\|\|itemSwatchesHidden\|\|/g, colorArray.length > 0 ? '' : 'hide');
            markup = markup.replace(/\|\|itemColorLabel\|\|/g, colorArray.length > 0 ? colorArray[0].name : '');

            wrapper.innerHTML += markup;

            productHandleQueue.shift();
            shown++;
            moveAlong(shown);
          })
          .catch(() => {
            cookie.remove(productHandleQueue[0]);
            productHandleQueue.shift();
            moveAlong(shown);
          });
      } else {
        finalize();
      }
    };

    return {
      showRecentlyViewed: function (params) {
        const paramsNew = params || {};
        const shown = 0;

        // Update defaults.
        Object.assign(config, paramsNew);

        // Read cookie.
        productHandleQueue = cookie.read();

        // Template and element where to insert.
        template = document.querySelector(`#${config.templateId}`);
        wrapper = document.querySelector(`#${config.wrapperId}`);

        // How many products to show.
        howManyToShowItems = config.howManyToShow;
        config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);

        // If we have any to show.
        if (config.howManyToShow && template && wrapper) {
          // Getting each product with an Ajax call and rendering it on the page.
          moveAlong(shown);
        }
      },

      getConfig: function () {
        return config;
      },

      clearList: function () {
        cookie.destroy();
      },

      recordRecentlyViewed: function (params) {
        const paramsNew = params || {};

        // Update defaults.
        Object.assign(config, paramsNew);

        // Read cookie.
        let recentlyViewed = cookie.read();

        // If we are on a product page.
        if (window.location.pathname.indexOf('/products/') !== -1) {
          // What is the product handle on this page.
          const productHandle = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
          // In what position is that product in memory.
          const position = recentlyViewed.indexOf(productHandle);
          // If not in memory.
          if (position === -1) {
            // Add product at the start of the list.
            recentlyViewed.unshift(productHandle);
            // Only keep what we need.
            recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
          } else {
            // Remove the product and place it at start of list.
            recentlyViewed.splice(position, 1);
            recentlyViewed.unshift(productHandle);
          }

          // Update cookie.
          cookie.write(recentlyViewed);
        }
      },

      hasProducts: cookie.read().length > 0,
    };
  })();

  const getUrlString = (params, keys = [], isArray = false) => {
    const p = Object.keys(params)
      .map((key) => {
        let val = params[key];

        if ('[object Object]' === Object.prototype.toString.call(val) || Array.isArray(val)) {
          if (Array.isArray(params)) {
            keys.push('');
          } else {
            keys.push(key);
          }
          return getUrlString(val, keys, Array.isArray(val));
        } else {
          let tKey = key;

          if (keys.length > 0) {
            const tKeys = isArray ? keys : [...keys, key];
            tKey = tKeys.reduce((str, k) => {
              return '' === str ? k : `${str}[${k}]`;
            }, '');
          }
          if (isArray) {
            return `${tKey}[]=${val}`;
          } else {
            return `${tKey}=${val}`;
          }
        }
      })
      .join('&');

    keys.pop();
    return p;
  };

  const hideElement = (elem) => {
    if (elem) {
      elem.style.display = 'none';
    }
  };

  const fadeIn = (el, display, callback = null) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      let val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }

      if (val === 1 && typeof callback === 'function') {
        callback();
      }
    })();
  };

  /**
   * Module to add a shipping rates calculator to cart page.
   *
   * Copyright (c) 2011-2012 Caroline Schnapp (11heavens.com)
   * Dual licensed under the MIT and GPL licenses:
   * http://www.opensource.org/licenses/mit-license.php
   * http://www.gnu.org/licenses/gpl.html
   *
   * Modified version -- coupled with Broadcast theme markup
   *
   */

  if (typeof Shopify.Cart === 'undefined') {
    Shopify.Cart = {};
  }

  Shopify.Cart.ShippingCalculator = (function () {
    const _config = {
      submitButton: theme.strings.shippingCalcSubmitButton,
      submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
      templateId: 'shipping-calculator-response-template',
      wrapperId: 'wrapper-response',
      customerIsLoggedIn: false,
    };
    const _render = function (response) {
      const template = document.querySelector(`#${_config.templateId}`);
      const wrapper = document.querySelector(`#${_config.wrapperId}`);

      if (template && wrapper) {
        wrapper.innerHTML = '';
        let ratesList = '';
        let ratesText = '';
        let successClass = 'error center';
        let markup = template.innerHTML;
        const rateRegex = /[^[\]]+(?=])/g;

        if (response.rates && response.rates.length) {
          let rateTemplate = rateRegex.exec(markup)[0];
          response.rates.forEach((rate) => {
            let rateHtml = rateTemplate;
            rateHtml = rateHtml.replace(/\|\|rateName\|\|/, rate.name);
            rateHtml = rateHtml.replace(/\|\|ratePrice\|\|/, Shopify.Cart.ShippingCalculator.formatRate(rate.price));
            ratesList += rateHtml;
          });
        }

        if (response.success) {
          successClass = 'success center';
          const createdNewElem = document.createElement('div');
          createdNewElem.innerHTML = template.innerHTML;
          const noShippingElem = createdNewElem.querySelector('[data-template-no-shipping]');

          if (response.rates.length < 1 && noShippingElem) {
            ratesText = noShippingElem.getAttribute('data-template-no-shipping');
          }
        } else {
          ratesText = response.errorFeedback;
        }

        markup = markup.replace(rateRegex, '').replace('[]', '');
        markup = markup.replace(/\|\|ratesList\|\|/g, ratesList);
        markup = markup.replace(/\|\|successClass\|\|/g, successClass);
        markup = markup.replace(/\|\|ratesText\|\|/g, ratesText);

        wrapper.innerHTML += markup;
      }
    };
    const _enableButtons = function () {
      const getRatesButton = document.querySelector('.get-rates');
      getRatesButton.removeAttribute('disabled');
      getRatesButton.classList.remove('disabled');
      getRatesButton.value = _config.submitButton;
    };
    const _disableButtons = function () {
      const getRatesButton = document.querySelector('.get-rates');
      getRatesButton.setAttribute('disabled', 'disabled');
      getRatesButton.classList.add('disabled');
      getRatesButton.value = _config.submitButtonDisabled;
    };
    const _getCartShippingRatesForDestination = function (shipping_address) {
      const encodedShippingAddressData = encodeURI(
        getUrlString({
          shipping_address: shipping_address,
        })
      );
      const url = `${window.theme.routes.cart}/shipping_rates.json?${encodedShippingAddressData}`;
      const request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const response = JSON.parse(this.response);
          const rates = response.shipping_rates;
          _onCartShippingRatesUpdate(rates, shipping_address);
        } else {
          _onError(this);
        }
      };

      request.onerror = function () {
        _onError(this);
      };

      request.send();
    };
    const _fullMessagesFromErrors = function (errors) {
      const fullMessages = [];

      for (const error in errors) {
        for (const message of errors[error]) {
          fullMessages.push(error + ' ' + message);
        }
      }

      return fullMessages;
    };
    const _onError = function (XMLHttpRequest) {
      hideElement(document.querySelector('#estimated-shipping'));

      const shippingChild = document.querySelector('#estimated-shipping em');
      if (shippingChild) {
        while (shippingChild.firstChild) shippingChild.removeChild(shippingChild.firstChild);
      }
      _enableButtons();
      let feedback = '';
      const data = eval('(' + XMLHttpRequest.responseText + ')');
      if (data.message) {
        feedback = data.message + '(' + data.status + '): ' + data.description;
      } else {
        feedback = 'Error : ' + _fullMessagesFromErrors(data).join('; ');
      }
      if (feedback === 'Error : country is not supported.') {
        feedback = 'We do not ship to this destination.';
      }
      _render({
        rates: [],
        errorFeedback: feedback,
        success: false,
      });

      showElement(document.querySelector(`#${_config.wrapperId}`));
    };
    const _onCartShippingRatesUpdate = function (rates, shipping_address) {
      _enableButtons();
      let readable_address = '';
      if (shipping_address.zip) {
        readable_address += shipping_address.zip + ', ';
      }
      if (shipping_address.province) {
        readable_address += shipping_address.province + ', ';
      }
      readable_address += shipping_address.country;
      const shippingChild = document.querySelector('#estimated-shipping em');
      if (rates.length && shippingChild) {
        if (rates[0].price == '0.00') {
          shippingChild.textContent = 'FREE';
        } else {
          shippingChild.textContent = themeCurrency.formatMoney(rates[0].price, theme.moneyFormat);
        }
      }
      _render({
        rates: rates,
        address: readable_address,
        success: true,
      });

      const fadeElements = document.querySelectorAll(`#${_config.wrapperId}, #estimated-shipping`);

      if (fadeElements.length) {
        fadeElements.forEach((element) => {
          fadeIn(element);
        });
      }
    };

    const _init = function () {
      const getRatesButton = document.querySelector('.get-rates');
      const fieldsContainer = document.querySelector('#address_container');
      const selectCountry = document.querySelector('#address_country');
      const selectProvince = document.querySelector('#address_province');
      const htmlEl = document.querySelector('html');
      let locale = 'en';
      if (htmlEl.hasAttribute('lang') && htmlEl.getAttribute('lang') !== '') {
        locale = htmlEl.getAttribute('lang');
      }

      if (fieldsContainer) {
        themeAddresses.AddressForm(fieldsContainer, locale, {
          shippingCountriesOnly: true,
        });
      }

      if (selectCountry && selectCountry.hasAttribute('data-default') && selectProvince && selectProvince.hasAttribute('data-default')) {
        selectCountry.addEventListener('change', function () {
          selectCountry.removeAttribute('data-default');
          selectProvince.removeAttribute('data-default');
        });
      }

      if (getRatesButton) {
        getRatesButton.addEventListener('click', function (e) {
          _disableButtons();
          const wrapper = document.querySelector(`#${_config.wrapperId}`);
          while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
          hideElement(wrapper);
          const shippingAddress = {};
          let elemCountryVal = selectCountry.value;
          let elemProvinceVal = selectProvince.value;
          const elemCountryData = selectCountry.getAttribute('data-default-fullname');
          if (elemCountryVal === '' && elemCountryData && elemCountryData !== '') {
            elemCountryVal = elemCountryData;
          }
          const elemProvinceData = selectProvince.getAttribute('data-default-fullname');
          if (elemProvinceVal === '' && elemProvinceData && elemProvinceData !== '') {
            elemProvinceVal = elemProvinceData;
          }
          shippingAddress.zip = document.querySelector('#address_zip').value || '';
          shippingAddress.country = elemCountryVal || '';
          shippingAddress.province = elemProvinceVal || '';
          _getCartShippingRatesForDestination(shippingAddress);
        });

        if (_config.customerIsLoggedIn && getRatesButton.classList.contains('get-rates--trigger')) {
          const zipElem = document.querySelector('#address_zip');
          if (zipElem && zipElem.value) {
            getRatesButton.dispatchEvent(new Event('click'));
          }
        }
      }
    };
    return {
      show: function (params) {
        params = params || {};
        Object.assign(_config, params);
        document.addEventListener('DOMContentLoaded', function () {
          _init();
        });
      },
      getConfig: function () {
        return _config;
      },
      formatRate: function (cents) {
        return themeCurrency.formatMoney(cents, theme.moneyFormat);
      },
    };
  })();

  /**
   * A11y Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help make your theme more accessible
   */

  /**
   * Moves focus to an HTML element
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects. Used in bindInPageLinks()
   * eg move focus to a modal that is opened. Used in trapFocus()
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */
  function forceFocus(element, options) {
    options = options || {};

    var savedTabIndex = element.tabIndex;

    element.tabIndex = -1;
    element.dataset.tabIndex = savedTabIndex;
    element.focus();
    if (typeof options.className !== 'undefined') {
      element.classList.add(options.className);
    }
    element.addEventListener('blur', callback);

    function callback(event) {
      event.target.removeEventListener(event.type, callback);

      element.tabIndex = savedTabIndex;
      delete element.dataset.tabIndex;
      if (typeof options.className !== 'undefined') {
        element.classList.remove(options.className);
      }
    }
  }

  /**
   * If there's a hash in the url, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - Selector for elements to not include.
   */

  function focusHash(options) {
    options = options || {};
    var hash = window.location.hash;
    var element = document.getElementById(hash.slice(1));

    // if we are to ignore this element, early return
    if (element && options.ignore && element.matches(options.ignore)) {
      return false;
    }

    if (hash && element) {
      forceFocus(element, options);
    }
  }

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - CSS selector for elements to not include.
   */

  function bindInPageLinks(options) {
    options = options || {};
    var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));

    function queryCheck(selector) {
      return document.getElementById(selector) !== null;
    }

    return links.filter(function (link) {
      if (link.hash === '#' || link.hash === '') {
        return false;
      }

      if (options.ignore && link.matches(options.ignore)) {
        return false;
      }

      if (!queryCheck(link.hash.substr(1))) {
        return false;
      }

      var element = document.querySelector(link.hash);

      if (!element) {
        return false;
      }

      link.addEventListener('click', function () {
        forceFocus(element, options);
      });

      return true;
    });
  }

  function focusable(container) {
    var elements = Array.prototype.slice.call(
      container.querySelectorAll('[tabindex],' + '[draggable],' + 'a[href],' + 'area,' + 'button:enabled,' + 'input:not([type=hidden]):enabled,' + 'object,' + 'select:enabled,' + 'textarea:enabled')
    );

    // Filter out elements that are not visible.
    // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
    return elements.filter(function (element) {
      return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    });
  }

  /**
   * Traps the focus in a particular container
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Element} elementToFocus - Element to be focused on first
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */

  var trapFocusHandlers = {};

  function trapFocus(container, options) {
    options = options || {};
    var elements = focusable(container);
    var elementToFocus = options.elementToFocus || container;
    var first = elements[0];
    var last = elements[elements.length - 1];

    removeTrapFocus();

    trapFocusHandlers.focusin = function (event) {
      if (container !== event.target && !container.contains(event.target)) {
        first.focus();
      }

      if (event.target !== container && event.target !== last && event.target !== first) return;
      document.addEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.focusout = function () {
      document.removeEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.keydown = function (event) {
      if (event.keyCode !== 9) return; // If not TAB key

      // On the last focusable element and tab forward, focus the first element.
      if (event.target === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      }

      //  On the first focusable element and tab backward, focus the last element.
      if ((event.target === container || event.target === first) && event.shiftKey) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('focusout', trapFocusHandlers.focusout);
    document.addEventListener('focusin', trapFocusHandlers.focusin);

    forceFocus(elementToFocus, options);
  }

  /**
   * Removes the trap of focus from the page
   */
  function removeTrapFocus() {
    document.removeEventListener('focusin', trapFocusHandlers.focusin);
    document.removeEventListener('focusout', trapFocusHandlers.focusout);
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  }

  /**
   * Add a preventive message to external links and links that open to a new window.
   * @param {string} elements - Specific elements to be targeted
   * @param {object} options.messages - Custom messages to overwrite with keys: newWindow, external, newWindowExternal
   * @param {string} options.messages.newWindow - When the link opens in a new window (e.g. target="_blank")
   * @param {string} options.messages.external - When the link is to a different host domain.
   * @param {string} options.messages.newWindowExternal - When the link is to a different host domain and opens in a new window.
   * @param {object} options.prefix - Prefix to namespace "id" of the messages
   */
  function accessibleLinks(elements, options) {
    if (typeof elements !== 'string') {
      throw new TypeError(elements + ' is not a String.');
    }

    elements = document.querySelectorAll(elements);

    if (elements.length === 0) {
      return;
    }

    options = options || {};
    options.messages = options.messages || {};

    var messages = {
      newWindow: options.messages.newWindow || 'Opens in a new window.',
      external: options.messages.external || 'Opens external website.',
      newWindowExternal: options.messages.newWindowExternal || 'Opens external website in a new window.',
    };

    var prefix = options.prefix || 'a11y';

    var messageSelectors = {
      newWindow: prefix + '-new-window-message',
      external: prefix + '-external-message',
      newWindowExternal: prefix + '-new-window-external-message',
    };

    function generateHTML(messages) {
      var container = document.createElement('ul');
      var htmlMessages = Object.keys(messages).reduce(function (html, key) {
        return (html += '<li id=' + messageSelectors[key] + '>' + messages[key] + '</li>');
      }, '');

      container.setAttribute('hidden', true);
      container.innerHTML = htmlMessages;

      document.body.appendChild(container);
    }

    function externalSite(link) {
      return link.hostname !== window.location.hostname;
    }

    elements.forEach(function (link) {
      var target = link.getAttribute('target');
      var rel = link.getAttribute('rel');
      var isExternal = externalSite(link);
      var isTargetBlank = target === '_blank';
      var missingRelNoopener = rel === null || rel.indexOf('noopener') === -1;

      if (isTargetBlank && missingRelNoopener) {
        var relValue = rel === null ? 'noopener' : rel + ' noopener';
        link.setAttribute('rel', relValue);
      }

      if (isExternal && isTargetBlank) {
        link.setAttribute('aria-describedby', messageSelectors.newWindowExternal);
      } else if (isExternal) {
        link.setAttribute('aria-describedby', messageSelectors.external);
      } else if (isTargetBlank) {
        link.setAttribute('aria-describedby', messageSelectors.newWindow);
      }
    });

    generateHTML(messages);
  }

  var a11y = /*#__PURE__*/Object.freeze({
    __proto__: null,
    forceFocus: forceFocus,
    focusHash: focusHash,
    bindInPageLinks: bindInPageLinks,
    focusable: focusable,
    trapFocus: trapFocus,
    removeTrapFocus: removeTrapFocus,
    accessibleLinks: accessibleLinks
  });

  const slideDown = (target, duration = 500, checkHidden = true) => {
    let display = window.getComputedStyle(target).display;
    if (checkHidden && display !== 'none') {
      return;
    }
    target.style.removeProperty('display');
    if (display === 'none') display = 'block';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  };

  const slideUp = (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  };

  const slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === 'none') {
      return slideDown(target, duration);
    } else {
      return slideUp(target, duration);
    }
  };

  const getSiblings = (el) => {
    return Array.prototype.filter.call(el.parentNode.children, function (child) {
      return child !== el;
    });
  };

  function FetchError(object) {
    this.status = object.status || null;
    this.headers = object.headers || null;
    this.json = object.json || null;
    this.body = object.body || null;
  }
  FetchError.prototype = Error.prototype;

  const selectors$3 = {
    quantityHolder: '[data-quantity-holder]',
    quantityField: '[data-quantity-field]',
    quantityButton: '[data-quantity-button]',
    quantityMinusButton: '[data-quantity-minus]',
    quantityPlusButton: '[data-quantity-plus]',
    quantityReadOnly: 'read-only',
    isDisabled: 'is-disabled',
  };

  class QuantityCounter {
    constructor(holder, inCart = false) {
      this.holder = holder;
      this.quantityUpdateCart = inCart;
    }

    init() {
      // Settings
      this.settings = selectors$3;

      // DOM Elements
      this.quantity = this.holder.querySelector(this.settings.quantityHolder);
      this.field = this.quantity.querySelector(this.settings.quantityField);
      this.buttons = this.quantity.querySelectorAll(this.settings.quantityButton);
      this.increaseButton = this.quantity.querySelector(this.settings.quantityPlusButton);

      // Set value or classes
      this.quantityValue = Number(this.field.value || 0);
      this.cartItemID = this.field.getAttribute('data-id');
      this.maxValue = Number(this.field.getAttribute('max')) > 0 ? Number(this.field.getAttribute('max')) : null;
      this.minValue = Number(this.field.getAttribute('min')) > 0 ? Number(this.field.getAttribute('min')) : 0;
      this.disableIncrease = this.disableIncrease.bind(this);

      // Flags
      this.emptyField = false;

      // Methods
      this.updateQuantity = this.updateQuantity.bind(this);
      this.decrease = this.decrease.bind(this);
      this.increase = this.increase.bind(this);

      this.disableIncrease();

      // Events
      if (!this.quantity.classList.contains(this.settings.quantityReadOnly)) {
        this.changeValueOnClick();
        this.changeValueOnInput();
      }
    }

    /**
     * Change field value when click on quantity buttons
     *
     * @return  {Void}
     */

    changeValueOnClick() {
      const that = this;

      this.buttons.forEach((element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault();
          const clickedElement = event.target;
          const isDescrease = clickedElement.matches(that.settings.quantityMinusButton) || clickedElement.closest(that.settings.quantityMinusButton);
          const isIncrease = clickedElement.matches(that.settings.quantityPlusButton) || clickedElement.closest(that.settings.quantityPlusButton);

          if (isDescrease) {
            that.decrease();
          }

          if (isIncrease) {
            that.increase();
          }

          that.updateQuantity();
        });
      });
    }

    /**
     * Change field value when input new value in a field
     *
     * @return  {Void}
     */

    changeValueOnInput() {
      const that = this;

      this.field.addEventListener(
        'input',
        function () {
          that.quantityValue = this.value;

          if (this.value === '') {
            that.emptyField = true;
          }

          that.updateQuantity();
        },
        this
      );
    }

    /**
     * Update field value
     *
     * @return  {Void}
     */

    updateQuantity() {
      if (this.maxValue < this.quantityValue && this.maxValue !== null) {
        this.quantityValue = this.maxValue;
      }

      if (this.minValue > this.quantityValue) {
        this.quantityValue = this.minValue;
      }

      this.field.value = this.quantityValue;

      this.disableIncrease();

      document.dispatchEvent(new CustomEvent('popout:updateValue'));

      if (this.quantityUpdateCart) {
        this.updateCart();
      }
    }

    /**
     * Decrease value
     *
     * @return  {Void}
     */

    decrease() {
      if (this.quantityValue > this.minValue) {
        this.quantityValue--;

        return;
      }

      this.quantityValue = 0;
    }

    /**
     * Increase value
     *
     * @return  {Void}
     */

    increase() {
      this.quantityValue++;
    }

    /**
     * Disable increase
     *
     * @return  {[type]}  [return description]
     */

    disableIncrease() {
      this.increaseButton.classList.toggle(this.settings.isDisabled, this.quantityValue >= this.maxValue && this.maxValue !== null);
    }

    /**
     * Update cart
     *
     * @return  {Void}
     */

    updateCart() {
      const event = new CustomEvent('update-cart', {
        bubbles: true,
        detail: {
          id: this.cartItemID,
          quantity: this.quantityValue,
          valueIsEmpty: this.emptyField,
        },
      });

      this.holder.dispatchEvent(event);
    }
  }

  const settings = {
    cartDrawerEnabled: window.theme.cartDrawerEnabled,
    times: {
      timeoutAddProduct: 1000,
      closeDropdownAfter: 5000,
    },
    classes: {
      hidden: 'is-hidden',
      added: 'is-added',
      htmlClasses: 'has-open-cart-dropdown',
      open: 'is-open',
      active: 'is-active',
      visible: 'is-visible',
      loading: 'is-loading',
      disabled: 'is-disabled',
      success: 'is-success',
      error: 'has-error',
      headerStuck: 'js__header__stuck',
      drawerVisible: 'drawer--visible',
    },
    attributes: {
      transparent: 'data-header-transparent',
      upsellButton: 'data-upsell-btn',
    },
    elements: {
      html: 'html',
      cartDropdown: '#cart-dropdown',
      cartDropdownBody: '[data-cart-dropdown-body]',
      emptyMessage: '[data-empty-message]',
      buttonHolder: '[data-foot-holder]',
      itemsHolder: '[data-items-holder]',
      item: '[data-item]',
      cartToggleElement: '[data-cart-toggle]',
      cartItemRemove: '[data-item-remove]',
      cartCount: '[data-cart-count]',
      cartCountValue: 'data-cart-count',
      clickedElementForExpanding: '[data-expand-button]',
      cartWidget: '[data-cart-widget]',
      cartTotal: '[data-cart-total]',
      cartMessage: '[data-cart-message]',
      cartMessageValue: 'data-cart-message',
      buttonAddToCart: '[data-add-to-cart]',
      formErrorsContainer: '[data-cart-errors-container]',
      cartErrors: '[data-cart-errors]',
      cartCloseError: '[data-cart-error-close]',
      formCloseError: '[data-close-error]',
      quickAddHolder: '[data-quick-add-holder]',
      cartProgress: '[data-cart-progress]',
      cartOriginalTotal: '[data-cart-original-total]',
      cartOriginaTotalPrice: '[data-cart-original-total-price]',
      cartDiscountsHolder: '[data-cart-discounts-holder]',
      headerWrapper: '[data-header-wrapper]',
      burgerButton: '[data-drawer-toggle]',
      upsellHolder: '[data-upsell-holder]',
      errorMessage: '[data-error-message]',
      navDrawer: '[data-drawer]',
    },
    formatMoney: theme.moneyFormat,
    cartTotalDiscountsTemplate: '[data-cart-total-discount]',
  };

  class CartDrawer {
    constructor() {
      if (window.location.pathname === '/password') {
        return;
      }

      this.init();
    }

    init() {
      this.settings = settings;

      // DOM Elements
      this.document = document;
      this.html = this.document.querySelector(this.settings.elements.html);
      this.cartDropdown = this.document.querySelector(this.settings.elements.cartDropdown);
      this.cartDropdownBody = this.document.querySelector(this.settings.elements.cartDropdownBody);
      this.emptyMessage = this.document.querySelector(this.settings.elements.emptyMessage);
      this.buttonHolder = this.document.querySelector(this.settings.elements.buttonHolder);
      this.itemsHolder = this.document.querySelector(this.settings.elements.itemsHolder);
      this.items = this.document.querySelectorAll(this.settings.elements.item);
      this.counterHolders = this.document.querySelectorAll(this.settings.elements.cartCount);
      this.cartTotal = this.document.querySelector(this.settings.elements.cartTotal);
      this.cartMessage = this.document.querySelector(this.settings.elements.cartMessage);
      this.cartOriginalTotal = this.document.querySelector(this.settings.elements.cartOriginalTotal);
      this.cartOriginaTotalPrice = this.document.querySelector(this.settings.elements.cartOriginaTotalPrice);
      this.cartDiscountHolder = this.document.querySelector(this.settings.elements.cartDiscountsHolder);
      this.clickedElementForExpanding = this.document.querySelectorAll(this.settings.elements.clickedElementForExpanding);
      this.cartTotalDiscountTemplate = this.document.querySelector(this.settings.cartTotalDiscountsTemplate).innerHTML;
      this.cartErrorHolder = this.document.querySelector(this.settings.elements.cartErrors);
      this.cartCloseErrorMessage = this.document.querySelector(this.settings.elements.cartCloseError);
      this.headerWrapper = this.document.querySelector(this.settings.elements.headerWrapper);
      this.headerIsTransparent = this.headerWrapper.getAttribute(this.settings.attributes.transparent) !== 'false';
      this.accessibility = a11y;
      this.navDrawer = this.document.querySelector(this.settings.elements.navDrawer);

      this.form = null;

      this.build = this.build.bind(this);

      // AJAX request
      this.addToCart = this.addToCart.bind(this);
      this.updateCart = this.updateCart.bind(this);

      // Cart events
      this.openCartDropdown = this.openCartDropdown.bind(this);
      this.closeCartDropdown = this.closeCartDropdown.bind(this);
      this.toggleCartDropdown = this.toggleCartDropdown.bind(this);

      // Checking
      this.hasItemsInCart = this.hasItemsInCart.bind(this);

      // Set classes
      this.toggleClassesOnContainers = this.toggleClassesOnContainers.bind(this);

      // Flags
      this.cartDropdownIsBuilded = this.items.length > 0;
      this.totalItems = this.cartDropdownIsBuilded;
      this.cartDropdownIsOpen = false;
      this.cartDiscounts = 0;
      this.cartDrawerEnabled = this.settings.cartDrawerEnabled;
      this.cartLimitErrorIsHidden = true;

      this.html.style.setProperty('--scrollbar-width', `${window.innerWidth - this.html.clientWidth}px`);

      // Cart Events
      this.eventToggleCart();
      this.expandEvents();
      this.cartEvents();
      this.cartEventAdd();

      // Init quantity for fields
      this.initQuantity();

      this.customEventAddProduct();

      // Init estimate shipping calculator
      this.estimateShippingCalculator();

      // Attributes
      if (this.cartMessage) {
        this.cartFreeLimitShipping = Number(this.cartMessage.getAttribute('data-limit')) * 100;
        this.subtotal = 0;
        this.progress = this.document.querySelector(this.settings.elements.cartProgress);
        this.circumference = 28 * Math.PI; // radius - stroke * 4 * PI

        this.setProgress(this.progress.getAttribute('data-percent'));
      }
    }

    /**
     * Init quantity field functionality
     *
     * @return  {Void}
     */

    initQuantity() {
      this.items = this.document.querySelectorAll(this.settings.elements.item);

      this.items.forEach((item) => {
        const initQuantity = new QuantityCounter(item, true);

        initQuantity.init();
        this.customEventsHandle(item);
      });
    }

    /**
     * Expand blocks and close siblings
     *
     * @return  {Void}
     */

    expandEvents() {
      const that = this;

      this.clickedElementForExpanding.forEach((item) => {
        item.addEventListener('click', function (event) {
          event.preventDefault();

          item.classList.toggle(that.settings.classes.active);
          slideToggle(that.document.querySelector(item.getAttribute('href')), 400);

          const otherCartWidget = getSiblings(item.closest(that.settings.elements.cartWidget)).filter((el) => el.hasAttribute(that.settings.elements.cartWidget.replace('[', '').replace(']', '')))[0];

          if (otherCartWidget) {
            const otherClickedElementForExpanding = otherCartWidget.querySelector(that.settings.elements.clickedElementForExpanding);

            otherClickedElementForExpanding.classList.remove(that.settings.classes.active);
            slideUp(otherClickedElementForExpanding.nextElementSibling, 400);
          }
        });
      });
    }

    /**
     * Custom event who change the cart
     *
     * @return  {Void}
     */

    customEventsHandle(holder) {
      holder.addEventListener(
        'update-cart',
        debounce((event) => {
          this.updateCart(
            {
              id: event.detail.id,
              quantity: event.detail.quantity,
            },
            holder,
            event.detail.valueIsEmpty
          );
        }, 500)
      );
    }

    /**
     *  Custom event for add product to the cart
     */
    customEventAddProduct() {
      this.html.addEventListener(
        'cart:add-to-cart',
        debounce((event) => {
          this.addToCart(JSON.stringify(event.detail.data), event.detail);
        }, 500)
      );
    }

    /**
     * Cart events
     *
     * @return  {Void}
     */

    cartEvents() {
      const that = this;
      const cartItemRemove = this.document.querySelectorAll(that.settings.elements.cartItemRemove);

      cartItemRemove.forEach((item) => {
        item.addEventListener('click', function (event) {
          event.preventDefault();

          that.updateCart({
            id: this.getAttribute('data-id'),
            quantity: 0,
          });
        });
      });

      if (this.cartCloseErrorMessage) {
        this.cartCloseErrorMessage.addEventListener('click', (event) => {
          event.preventDefault();

          slideUp(this.cartErrorHolder, 400);
        });
      }
    }

    /**
     * Cart event add product to cart
     *
     * @return  {Void}
     */

    cartEventAdd() {
      this.document.addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement.matches(this.settings.elements.buttonAddToCart) || (clickedElement.closest(this.settings.elements.buttonAddToCart) && clickedElement)) {
          event.preventDefault();

          let button = clickedElement.matches(this.settings.elements.buttonAddToCart) ? clickedElement : clickedElement.closest(this.settings.elements.buttonAddToCart);

          if (button.hasAttribute(this.settings.attributes.upsellButton)) {
            button.classList.add(this.settings.classes.loading);
          } else {
            button = null;
          }

          if (clickedElement.hasAttribute('disabled') || clickedElement.parentNode.hasAttribute('disabled')) {
            return;
          }

          this.form = clickedElement.closest('form');
          const formData = new FormData(this.form);

          if (this.form.querySelector('[type="file"]')) {
            return;
          }

          const formString = new URLSearchParams(formData).toString();

          this.addToCart(formString, null, button);

          this.html.dispatchEvent(
            new CustomEvent('cart:add-item', {
              bubbles: true,
              detail: {
                selector: clickedElement,
              },
            })
          );
        }
      });
    }

    /**
     * Estimate shippint calculator
     *
     * @return  {Void}
     */

    estimateShippingCalculator() {
      Shopify.Cart.ShippingCalculator.show({
        submitButton: theme.strings.shippingCalcSubmitButton,
        submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
        customerIsLoggedIn: theme.customerLoggedIn,
        moneyFormat: theme.moneyWithCurrencyFormat,
      });
    }

    /**
     * Get response from the cart
     *
     * @return  {Void}
     */

    getCart() {
      fetch('/cart.js')
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((response) => {
          this.updateCounter(response.item_count);
          this.newTotalItems = response.items.length;

          this.buildTotalPrice(response);
          this.freeShippingMessageHandle(response.total_price);

          if (this.cartMessage) {
            this.subtotal = response.total_price;
            this.updateProgress();
          }

          return fetch('/cart?view=items');
        })
        .then((response) => response.text())
        .then((response) => {
          this.build(response);
        })
        .catch((error) => console.log(error));
    }

    /**
     * Add item(s) to the cart and show the added item(s)
     *
     * @param   {String}  data
     * @param   {DOM Element/Object}  quickAddHolder
     * @param   {DOM Element}  button
     *
     * @return  {Void}
     */

    addToCart(data, quickAddHolder = null, button = null) {
      // Get Quick Add form
      if (this.form === null && quickAddHolder !== null && quickAddHolder.label) {
        this.form = quickAddHolder.label.parentNode.querySelector('form');
      }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
        .then((response) => response.json())
        .then((response) => {
          if (button) {
            button.setAttribute('disabled', 'disabled');
          }

          if (response.status) {
            if (quickAddHolder !== null) {
              this.addToCartError(response, quickAddHolder.element, button);
            } else {
              this.addToCartError(response, null, button);
            }

            return;
          }

          if (this.cartDrawerEnabled) {
            if (quickAddHolder !== null && quickAddHolder.label) {
              quickAddHolder.label.classList.remove(this.settings.classes.hidden, this.settings.classes.loading);
              quickAddHolder.label.classList.add(this.settings.classes.added);
            }

            this.getCart();

            setTimeout(() => {
              if (button !== null) {
                button.classList.remove(this.settings.classes.loading);
                button.removeAttribute('disabled');
                button.classList.add(this.settings.classes.success);
              }

              this.openCartDropdown();
              this.cartDropdownIsOpen = true;
            }, this.settings.times.timeoutAddProduct);
          } else {
            window.location = theme.routes.cart;
          }
        })
        .catch((error) => console.log(error));
    }

    /**
     * Update cart
     *
     * @param   {Object}  updateData
     *
     * @return  {Void}
     */

    updateCart(updateData = {}, holder = null, valueIsEmpty = false) {
      let newCount = null;
      let oldCount = null;
      let newItem = null;
      let settedQuantity = updateData.quantity;

      if (holder !== null) {
        holder.closest(this.settings.elements.item).classList.add(this.settings.classes.loading);
      }

      this.items.forEach((item) => {
        item.classList.add(this.settings.classes.disabled);
        item.querySelector('input').blur();
      });

      fetch('/cart.js')
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((response) => {
          const matchKeys = (item) => item.key === updateData.id;
          const index = response.items.findIndex(matchKeys);
          oldCount = response.item_count;
          newItem = response.items[index].title;

          const data = {
            line: `${index + 1}`,
            quantity: settedQuantity,
          };

          return fetch('/cart/change.js', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
          });
        })
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((response) => {
          newCount = response.item_count;

          if (valueIsEmpty) {
            settedQuantity = 1;
          }

          if (settedQuantity !== 0) {
            this.cartLimitErrorIsHidden = newCount !== oldCount;

            this.toggleLimitError(newItem);
          }

          this.updateCounter(newCount);

          // Change the cart total and hide message if missing discounts and the changed product is not deleted
          this.buildTotalPrice(response);
          this.freeShippingMessageHandle(response.total_price);
          this.cartDiscounts = response.total_discount;

          // Build cart again if the quantity of the changed product is 0 or cart discounts are changed
          if (this.cartMessage) {
            this.subtotal = response.total_price;
            this.updateProgress();
          }

          this.getCart();
        })
        .catch((error) => console.log(error));
    }

    /**
     * Show/hide limit error
     *
     * @param   {String}  itemTitle
     *
     * @return  {Void}
     */

    toggleLimitError(itemTitle) {
      this.cartErrorHolder.querySelector(this.settings.elements.errorMessage).innerText = itemTitle;

      if (this.cartLimitErrorIsHidden) {
        slideUp(this.cartErrorHolder, 400);
      } else {
        slideDown(this.cartErrorHolder, 400);
      }
    }

    /**
     * Handle errors
     *
     * @param   {Object}  response
     *
     * @return  {Object}
     */

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }

    /**
     * Add to cart error handle
     *
     * @param   {Object}  data
     * @param   {DOM Element/Null} quickAddHolder
     * @param   {DOM Element/Null} button
     *
     * @return  {Void}
     */

    addToCartError(data, quickAddHolder, button) {
      if (this.cartDrawerEnabled) {
        this.closeCartDropdown();
      }

      let errorContainer = this.document.querySelector(this.settings.elements.formErrorsContainer);

      if (button !== null) {
        errorContainer = button.closest(this.settings.elements.upsellHolder).querySelector(this.settings.elements.formErrorsContainer);
        button.classList.remove(this.settings.classes.loading);
        button.removeAttribute('disabled');
      }

      if (errorContainer) {
        errorContainer.innerHTML = `<div class="errors">${data.message}: ${data.description}<span class="errors__close" data-close-error><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-close-thin" viewBox="0 0 27 27"><g stroke="#979797" fill="none" fill-rule="evenodd" stroke-linecap="square"><path d="M.5.5l26 26M26.5.5l-26 26"></path></g></svg></span></div>`;

        errorContainer.classList.add(this.settings.classes.visible);

        document.dispatchEvent(new CustomEvent('product:bar:error', {bubbles: false}));
      }

      if (quickAddHolder) {
        this.html.dispatchEvent(
          new CustomEvent('cart:add-to-error', {
            bubbles: true,
            detail: {
              message: data.message,
              description: data.description,
              holder: quickAddHolder,
            },
          })
        );
      }

      this.document.addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement.matches(this.settings.elements.formCloseError) || clickedElement.closest(this.settings.elements.formCloseError)) {
          event.preventDefault();

          errorContainer.classList.remove(this.settings.classes.visible);
        }
      });
    }

    /**
     * Open cart dropdown and add class on body
     *
     * @return  {Void}
     */

    openCartDropdown() {
      document.dispatchEvent(
        new CustomEvent('theme:drawer:close', {
          bubbles: false,
        })
      );

      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: this.cartDropdown}));
      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: this.cartDropdownBody}));

      this.html.classList.add(this.settings.classes.htmlClasses);
      this.cartDropdown.classList.add(this.settings.classes.open);

      this.accessibility.removeTrapFocus();
      this.accessibility.trapFocus(this.cartDropdown, {
        elementToFocus: this.cartDropdown.querySelector('a:first-child, input:first-child'),
      });

      this.headerIsTransparent = this.headerWrapper.getAttribute(this.settings.attributes.transparent) !== 'false';
      this.headerWrapper.setAttribute(this.settings.attributes.transparent, false);

      if (!this.cartDropdownIsBuilded) {
        this.getCart();
      }
    }

    /**
     * Close cart dropdown and remove class on body
     *
     * @return  {Void}
     */

    closeCartDropdown() {
      this.document.dispatchEvent(
        new CustomEvent('theme:cart-close', {
          bubbles: true,
        })
      );

      this.accessibility.removeTrapFocus();

      slideUp(this.cartErrorHolder, 400);

      if (this.html.classList.contains('is-focused')) {
        const button = this.document.querySelector(`${this.settings.elements.cartToggleElement}[data-focus-element]`);

        setTimeout(() => {
          button.focus();
        }, 200);
      }

      const upsellButton = this.document.querySelector(`[${this.settings.attributes.upsellButton}].${this.settings.classes.success}`);

      if (upsellButton) {
        setTimeout(() => {
          upsellButton.classList.remove(this.settings.classes.success);
        }, 2000);
      }

      this.headerWrapper.setAttribute(this.settings.attributes.transparent, this.headerIsTransparent);
      this.html.classList.remove(this.settings.classes.htmlClasses);
      this.cartDropdown.classList.remove(this.settings.classes.open);

      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }

    /**
     * Toggle cart dropdown
     *
     * @return  {Void}
     */

    toggleCartDropdown() {
      this.cartDropdownIsOpen = !this.cartDropdownIsOpen;

      if (this.cartDropdownIsOpen) {
        this.openCartDropdown();
      } else {
        this.closeCartDropdown();
      }
    }

    /**
     * Event click to element to open cart dropdown
     *
     * @return  {Void}
     */

    eventToggleCart() {
      this.document.addEventListener('click', (event) => {
        const clickedElement = event.target;
        const isNotCartButton = !(clickedElement.matches(this.settings.elements.cartToggleElement) || clickedElement.closest(this.settings.elements.cartToggleElement));
        const isNotCartDropdownOrCartDropdownChild = !(clickedElement.matches(this.settings.elements.cartDropdown) || clickedElement.closest(this.settings.elements.cartDropdown));
        const isBurgerButton = clickedElement.matches(this.settings.elements.burgerButton) || clickedElement.closest(this.settings.elements.burgerButton);

        if (clickedElement.matches(this.settings.elements.cartToggleElement) || clickedElement.closest(this.settings.elements.cartToggleElement)) {
          event.preventDefault();

          this.toggleCartDropdown();
        } else if (this.cartDropdownIsOpen && isNotCartButton && isNotCartDropdownOrCartDropdownChild) {
          this.cartDropdownIsOpen = false;

          if (isBurgerButton && !this.headerWrapper.classList.contains(this.settings.classes.headerStuck)) {
            this.headerIsTransparent = false;
          }

          this.closeCartDropdown();
        }
      });
    }

    /**
     * Toggle classes on different containers and messages
     *
     * @return  {Void}
     */

    toggleClassesOnContainers() {
      const that = this;

      this.emptyMessage.classList.toggle(that.settings.classes.hidden, that.hasItemsInCart());
      this.buttonHolder.classList.toggle(that.settings.classes.hidden, !that.hasItemsInCart());
      this.itemsHolder.classList.toggle(that.settings.classes.hidden, !that.hasItemsInCart());
    }

    /**
     * Build cart depends on results
     *
     * @param   {Object}  data
     *
     * @return  {Void}
     */

    build(data) {
      if (this.totalItems !== this.newTotalItems) {
        this.totalItems = this.newTotalItems;

        this.toggleClassesOnContainers();
      }

      this.itemsHolder.innerHTML = data;

      this.cartEvents();
      this.initQuantity();
    }

    /**
     * Update cart count
     *
     * @param   {Number}  countItems
     *
     * @return  {Void}
     */

    updateCounter(countItems) {
      if (!this.counterHolders.length) {
        return;
      }

      this.counterHolders.forEach((holder) => {
        holder.innerHTML = countItems;
        holder.setAttribute(settings.elements.cartCountValue, countItems);
      });
    }

    /**
     * Check for items in the cart
     *
     * @return  {Void}
     */

    hasItemsInCart() {
      return this.totalItems > 0;
    }

    /**
     * Build total cart total price
     *
     * @param   {Object}  data
     *
     * @return  {Void}
     */

    buildTotalPrice(data) {
      if (data.original_total_price > data.total_price && data.cart_level_discount_applications.length > 0) {
        this.cartOriginalTotal.classList.remove(this.settings.classes.hidden);
        this.cartOriginaTotalPrice.innerHTML = themeCurrency.formatMoney(data.original_total_price, this.settings.formatMoney);
      } else {
        this.cartOriginalTotal.classList.add(this.settings.classes.hidden);
      }

      this.cartTotal.innerHTML = themeCurrency.formatMoney(data.total_price, this.settings.formatMoney);

      if (data.cart_level_discount_applications.length > 0) {
        const discountsMarkup = this.buildCartTotalDiscounts(data.cart_level_discount_applications);

        this.cartDiscountHolder.classList.remove(this.settings.classes.hidden);
        this.cartDiscountHolder.innerHTML = discountsMarkup;
      } else {
        this.cartDiscountHolder.classList.add(this.settings.classes.hidden);
      }
    }

    /**
     * Build cart total discounts
     *
     * @param   {Array}  discounts
     *
     * @return  {String}
     */

    buildCartTotalDiscounts(discounts) {
      let discountMarkup = '';

      discounts.forEach((discount) => {
        discountMarkup += Sqrl.render(this.cartTotalDiscountTemplate, {
          discountTitle: discount.title,
          discountTotalAllocatedAmount: themeCurrency.formatMoney(discount.total_allocated_amount, this.settings.formatMoney),
        });
      });

      return discountMarkup;
    }

    /**
     * Show/hide free shipping message
     *
     * @param   {Number}  total
     *
     * @return  {Void}
     */

    freeShippingMessageHandle(total) {
      if (this.cartMessage) {
        let cartMessageClass = this.settings.classes.hidden;
        if (this.cartMessage.hasAttribute(this.settings.elements.cartMessageValue) && this.cartMessage.getAttribute(this.settings.elements.cartMessageValue) === 'true' && total !== 0) {
          cartMessageClass = this.settings.classes.success;
        }
        this.cartMessage.classList.toggle(cartMessageClass, total >= this.cartFreeLimitShipping || total === 0);
      }
    }

    /**
     * Set circle progress
     *
     * @param   {Number}  percent
     *
     * @return  {Void}
     */

    setProgress(percent) {
      const offset = this.circumference - ((percent / 100) * this.circumference) / 2;

      this.progress.style.strokeDashoffset = offset;
    }

    /**
     * Update progress when update cart
     *
     * @return  {Void}  [return description]
     */

    updateProgress() {
      const newPercentValue = (this.subtotal / this.cartFreeLimitShipping) * 100;

      this.setProgress(newPercentValue > 100 ? 100 : newPercentValue);
    }
  }

  window.cart = new CartDrawer();

  const settings$1 = {
    elements: {
      html: 'html',
      body: 'body',
      inPageLink: '[data-skip-content]',
      linkesWithOnlyHash: 'a[href="#"]',
      triggerFocusElement: '[data-focus-element]',
      cartDropdown: '#cart-dropdown',
      search: '#search-popdown',
      accordionContent: '.accordion-content',
      tabs: '.tabs',
      accordionDataToggle: 'data-accordion-toggle',
    },
    classes: {
      focus: 'is-focused',
      open: 'is-open',
      accordionToggle: 'accordion-toggle',
      tabLink: 'tab-link',
    },
    keysCodes: {
      escapeCode: 27,
      tabCode: 9,
      enterCode: 13,
      spaceCode: 32,
    },
  };

  class Accessibility {
    constructor() {
      this.init();
    }

    init() {
      this.settings = settings$1;
      this.window = window;
      this.document = document;
      this.a11y = a11y;
      this.cart = this.window.cart;

      // DOM Elements
      this.inPageLink = this.document.querySelector(this.settings.elements.inPageLink);
      this.linkesWithOnlyHash = this.document.querySelectorAll(this.settings.elements.linkesWithOnlyHash);
      this.html = this.document.querySelector(this.settings.elements.html);
      this.body = this.document.querySelector(this.settings.elements.body);
      this.cartDropdown = this.document.querySelector(this.settings.elements.cartDropdown);
      this.lastFocused = null;

      // Flags
      this.isFocused = false;

      // A11Y init methods
      this.a11y.focusHash();
      this.a11y.bindInPageLinks();

      // Events
      this.clickEvents();
      this.focusEvents();
      this.focusEventsOff();
      this.closeExpandedElements();
    }

    /**
     * Clicked events accessibility
     *
     * @return  {Void}
     */

    clickEvents() {
      if (this.inPageLink) {
        this.inPageLink.addEventListener('click', (event) => {
          event.preventDefault();
        });
      }

      if (this.linkesWithOnlyHash) {
        this.linkesWithOnlyHash.forEach((item) => {
          item.addEventListener('click', (event) => {
            event.preventDefault();
          });
        });
      }
    }

    /**
     * Focus events
     *
     * @return  {Void}
     */

    focusEvents() {
      this.document.addEventListener('keyup', (event) => {
        if (event.keyCode !== this.settings.keysCodes.tabCode) {
          return;
        }

        this.body.classList.add(this.settings.classes.focus);
        this.isFocused = true;
      });

      // Expand modals
      this.document.addEventListener('keyup', (event) => {
        if (!this.isFocused) {
          return;
        }

        const target = event.target;
        const pressEnterOrSpace = event.keyCode === this.settings.keysCodes.enterCode || event.keyCode === this.settings.keysCodes.spaceCode;
        const targetElement = target.matches(this.settings.elements.triggerFocusElement) || target.closest(this.settings.elements.triggerFocusElement);
        const isAccordion =
          target.classList.contains(this.settings.classes.accordionToggle) ||
          target.parentNode.classList.contains(this.settings.classes.accordionToggle) ||
          target.hasAttribute(this.settings.elements.accordionDataToggle) ||
          target.parentNode.hasAttribute(this.settings.elements.accordionDataToggle);
        const isTab = target.classList.contains(this.settings.classes.tabLink) || target.parentNode.classList.contains(this.settings.classes.tabLink);

        const isSearchModal =
          target.hasAttribute('data-popdown-toggle') ||
          (target.closest(this.settings.elements.triggerFocusElement) && target.closest(this.settings.elements.triggerFocusElement).hasAttribute('data-popdown-toggle'));

        if (pressEnterOrSpace && targetElement) {
          if (this.lastFocused === null) {
            this.lastFocused = target;
          }

          let container = this.document.querySelector(this.settings.elements.cartDropdown);

          if (isSearchModal) {
            container = this.document.querySelector(this.settings.elements.search);
          }

          if (isAccordion) {
            container = target.nextElementSibling;
            target.click();
          }

          if (isTab) {
            const selector = `.tab-content-${target.getAttribute('data-tab')}`;

            container = this.document.querySelector(selector);
            target.click();
          }

          if (container.querySelector('a, input')) {
            this.a11y.trapFocus(container, {
              elementToFocus: container.querySelector('a:first-child, input:first-child'),
            });
          }
        }
      });

      // Focus addToCart button or quickview button
      this.html.addEventListener('cart:add-item', (event) => {
        this.lastFocused = event.detail.selector;
      });
    }

    /**
     * Focus events off
     *
     * @return  {Void}
     */

    focusEventsOff() {
      this.document.addEventListener('mousedown', () => {
        this.body.classList.remove(this.settings.classes.focus);
        this.isFocused = false;
      });
    }

    /**
     * Close expanded elements with when press escape
     *
     * @return  {Void}
     */

    closeExpandedElements() {
      document.addEventListener('keyup', (event) => {
        if (event.keyCode !== this.settings.keysCodes.escapeCode) {
          return;
        }

        this.a11y.removeTrapFocus();

        if (this.html.classList.contains(this.cart.settings.classes.htmlClasses)) {
          this.cart.toggleCartDropdown();
          this.html.classList.remove(this.cart.settings.classes.htmlClasses);
          this.cartDropdown.classList.remove(this.cart.settings.classes.open);
        }

        const accordionContents = document.querySelectorAll(this.settings.elements.accordionContent);

        if (accordionContents.length) {
          for (let i = 0; i < accordionContents.length; i++) {
            if (accordionContents[i].style.display !== 'block') {
              continue;
            }

            const accordionArrow = accordionContents[i].previousElementSibling;
            accordionArrow.classList.remove(this.settings.classes.open);

            slideUp(accordionContents[i]);
          }
        }

        if (this.lastFocused !== null) {
          setTimeout(() => {
            this.lastFocused.focus();
            this.lastFocused = null;
          }, 600);
        }
      });
    }
  }

  window.accessibility = new Accessibility();

  theme.ProductModel = (function () {
    let modelJsonSections = {};
    let models = {};
    let xrButtons = {};
    const selectors = {
      productMediaWrapper: '[data-product-single-media-wrapper]',
      productSlideshow: '[data-product-slideshow]',
      productXr: '[data-shopify-xr]',
      dataMediaId: 'data-media-id',
      dataModelId: 'data-model-id',
      dataModel3d: 'data-shopify-model3d-id',
      modelViewer: 'model-viewer',
      modelJson: '#ModelJson-',
      classMediaHidden: 'media--hidden',
    };

    function init(modelViewerContainer, sectionId) {
      modelJsonSections[sectionId] = {
        loaded: false,
      };

      const mediaId = modelViewerContainer.getAttribute(selectors.dataMediaId);
      const modelViewerElement = modelViewerContainer.querySelector(selectors.modelViewer);
      const modelId = modelViewerElement.getAttribute(selectors.dataModelId);
      const xrButton = modelViewerContainer.closest(selectors.productSlideshow).parentElement.querySelector(selectors.productXr);
      xrButtons[sectionId] = {
        $element: xrButton,
        defaultId: modelId,
      };

      models[mediaId] = {
        modelId: modelId,
        mediaId: mediaId,
        sectionId: sectionId,
        $container: modelViewerContainer,
        $element: modelViewerElement,
      };

      window.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: setupShopifyXr,
        },
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: setupModelViewerUi,
        },
      ]);
    }

    function setupShopifyXr(errors) {
      if (errors) {
        console.warn(errors);
        return;
      }
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', function () {
          setupShopifyXr();
        });
        return;
      }

      for (const sectionId in modelJsonSections) {
        if (modelJsonSections.hasOwnProperty(sectionId)) {
          const modelSection = modelJsonSections[sectionId];
          if (modelSection.loaded) continue;

          const modelJson = document.querySelector(`${selectors.modelJson}${sectionId}`);
          if (modelJson) {
            window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
            modelSection.loaded = true;
          }
        }
      }
      window.ShopifyXR.setupXRElements();
    }

    function setupModelViewerUi(errors) {
      if (errors) {
        console.warn(errors);
        return;
      }

      for (const key in models) {
        if (models.hasOwnProperty(key)) {
          const model = models[key];
          if (!model.modelViewerUi) {
            model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
          }
          setupModelViewerListeners(model);
        }
      }
    }

    function setupModelViewerListeners(model) {
      const xrButton = xrButtons[model.sectionId];

      model.$container.addEventListener('mediaVisible', function () {
        xrButton.$element.setAttribute(selectors.dataModel3d, model.modelId);

        pauseOtherMedia(model.mediaId);

        if (window.theme.touched) return;
        model.modelViewerUi.play();
      });

      model.$container.addEventListener('mediaHidden', function () {
        xrButton.$element.setAttribute(selectors.dataModel3d, xrButton.defaultId);
        model.modelViewerUi.pause();
      });

      model.$container.addEventListener('xrLaunch', function () {
        model.modelViewerUi.pause();
      });

      model.$element.addEventListener('shopify_model_viewer_ui_toggle_play', function () {
        pauseOtherMedia(model.mediaId);
      });
    }

    function pauseOtherMedia(mediaId) {
      const mediaIdString = `[${selectors.dataMediaId}="${mediaId}"]`;
      const currentMedia = document.querySelector(`${selectors.productMediaWrapper}${mediaIdString}`);
      const otherMedia = document.querySelectorAll(`${selectors.productMediaWrapper}:not(${mediaIdString})`);

      currentMedia.classList.remove(selectors.classMediaHidden);
      if (otherMedia.length) {
        otherMedia.forEach((element) => {
          element.dispatchEvent(new CustomEvent('mediaHidden'));
          element.classList.add(selectors.classMediaHidden);
        });
      }
    }

    function removeSectionModels(sectionId) {
      for (const key in models) {
        if (models.hasOwnProperty(key)) {
          const model = models[key];
          if (model.sectionId === sectionId) {
            delete models[key];
          }
        }
      }
      delete modelJsonSections[sectionId];
      delete theme.mediaInstances[sectionId];
    }

    return {
      init: init,
      removeSectionModels: removeSectionModels,
    };
  })();

  const selectors$4 = {
    templateAddresses: '.template-addresses',
    addressNewForm: '#AddressNewForm',
    btnNew: '.address-new-toggle',
    btnEdit: '.address-edit-toggle',
    btnDelete: '.address-delete',
    classHide: 'hide',
    dataFormId: 'data-form-id',
    dataConfirmMessage: 'data-confirm-message',
    defaultConfirmMessage: 'Are you sure you wish to delete this address?',
    editAddress: '#EditAddress',
    addressCountryNew: 'AddressCountryNew',
    addressProvinceNew: 'AddressProvinceNew',
    addressProvinceContainerNew: 'AddressProvinceContainerNew',
    addressCountryOption: '.address-country-option',
    addressCountry: 'AddressCountry',
    addressProvince: 'AddressProvince',
    addressProvinceContainer: 'AddressProvinceContainer',
  };

  class Addresses {
    constructor(section) {
      this.section = section;
      this.addressNewForm = this.section.querySelector(selectors$4.addressNewForm);

      this.init();
    }

    init() {
      if (this.addressNewForm) {
        const section = this.section;
        const newAddressForm = this.addressNewForm;
        this.customerAddresses();

        const newButtons = section.querySelectorAll(selectors$4.btnNew);
        if (newButtons.length) {
          newButtons.forEach((element) => {
            element.addEventListener('click', function () {
              newAddressForm.classList.toggle(selectors$4.classHide);
            });
          });
        }

        const editButtons = section.querySelectorAll(selectors$4.btnEdit);
        if (editButtons.length) {
          editButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$4.dataFormId);
              section.querySelector(`${selectors$4.editAddress}_${formId}`).classList.toggle(selectors$4.classHide);
            });
          });
        }

        const deleteButtons = section.querySelectorAll(selectors$4.btnDelete);
        if (deleteButtons.length) {
          deleteButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$4.dataFormId);
              const confirmMessage = this.getAttribute(selectors$4.dataConfirmMessage);
              if (confirm(confirmMessage || selectors$4.defaultConfirmMessage)) {
                Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
              }
            });
          });
        }
      }
    }

    customerAddresses() {
      // Initialize observers on address selectors, defined in shopify_common.js
      if (Shopify.CountryProvinceSelector) {
        new Shopify.CountryProvinceSelector(selectors$4.addressCountryNew, selectors$4.addressProvinceNew, {
          hideElement: selectors$4.addressProvinceContainerNew,
        });
      }

      // Initialize each edit form's country/province selector
      const countryOptions = this.section.querySelectorAll(selectors$4.addressCountryOption);
      countryOptions.forEach((element) => {
        const formId = element.getAttribute(selectors$4.dataFormId);
        const countrySelector = `${selectors$4.addressCountry}_${formId}`;
        const provinceSelector = `${selectors$4.addressProvince}_${formId}`;
        const containerSelector = `${selectors$4.addressProvinceContainer}_${formId}`;

        new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
          hideElement: containerSelector,
        });
      });
    }
  }

  const template = document.querySelector(selectors$4.templateAddresses);
  if (template) {
    new Addresses(template);
  }

  const selectors$5 = {
    accountTemplateLogged: '.customer-logged-in',
    account: '.account',
    accountSidebarMobile: '.account-sidebar--mobile',
  };

  class Account {
    constructor(section) {
      this.section = section;

      this.init();
    }

    init() {
      if (this.section.querySelector(selectors$5.account)) {
        this.accountMobileSidebar();
      }
    }

    accountMobileSidebar() {
      this.section.querySelector(selectors$5.accountSidebarMobile).addEventListener('click', function () {
        const nextElem = this.nextElementSibling;

        if (nextElem && nextElem.tagName === 'UL') {
          nextElem.classList.toggle('visible');
        }
      });
    }
  }

  const template$1 = document.querySelector(selectors$5.accountTemplateLogged);
  if (template$1) {
    new Account(template$1);
  }

  const selectors$6 = {
    form: '[data-account-form]',
    showReset: '[data-show-reset]',
    hideReset: '[data-hide-reset]',
    recover: '[data-recover-password]',
    login: '[data-login-form]',
    recoverHash: '#recover',
    hideClass: 'is-hidden',
  };

  class Login {
    constructor(form) {
      this.form = form;
      this.showButton = form.querySelector(selectors$6.showReset);
      this.hideButton = form.querySelector(selectors$6.hideReset);
      this.recover = form.querySelector(selectors$6.recover);
      this.login = form.querySelector(selectors$6.login);
      this.init();
    }

    init() {
      if (window.location.hash == selectors$6.recoverHash) {
        this.showRecoverPasswordForm();
      } else {
        this.hideRecoverPasswordForm();
      }
      this.showButton.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          this.showRecoverPasswordForm();
        }.bind(this),
        false
      );
      this.hideButton.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          this.hideRecoverPasswordForm();
        }.bind(this),
        false
      );
    }

    showRecoverPasswordForm() {
      this.login.classList.add(selectors$6.hideClass);
      this.recover.classList.remove(selectors$6.hideClass);
      window.location.hash = selectors$6.recoverHash;
      return false;
    }

    hideRecoverPasswordForm() {
      this.recover.classList.add(selectors$6.hideClass);
      this.login.classList.remove(selectors$6.hideClass);
      window.location.hash = '';
      return false;
    }
  }

  const loginForm = document.querySelector(selectors$6.form);
  if (loginForm) {
    new Login(loginForm);
  }

  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};
  window.Shopify.theme.sections = window.Shopify.theme.sections || {};

  window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
  window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
  const registered = window.Shopify.theme.sections.registered;
  const instances = window.Shopify.theme.sections.instances;

  const selectors$7 = {
    id: 'data-section-id',
    type: 'data-section-type',
  };

  class Registration {
    constructor(type = null, components = []) {
      this.type = type;
      this.components = validateComponentsArray(components);
      this.callStack = {
        onLoad: [],
        onUnload: [],
        onSelect: [],
        onDeselect: [],
        onBlockSelect: [],
        onBlockDeselect: [],
        onReorder: [],
      };
      components.forEach((comp) => {
        for (const [key, value] of Object.entries(comp)) {
          const arr = this.callStack[key];
          if (Array.isArray(arr) && typeof value === 'function') {
            arr.push(value);
          } else {
            console.warn(`Unregisted function: '${key}' in component: '${this.type}'`);
            console.warn(value);
          }
        }
      });
    }

    getStack() {
      return this.callStack;
    }
  }

  class Section {
    constructor(container, registration) {
      this.container = validateContainerElement(container);
      this.id = container.getAttribute(selectors$7.id);
      this.type = registration.type;
      this.callStack = registration.getStack();

      try {
        this.onLoad();
      } catch (e) {
        console.warn(`Error in section: ${this.id}`);
        console.warn(this);
        console.warn(e);
      }
    }

    callFunctions(key, e = null) {
      this.callStack[key].forEach((func) => {
        const props = {
          id: this.id,
          type: this.type,
          container: this.container,
        };
        if (e) {
          func.call(props, e);
        } else {
          func.call(props);
        }
      });
    }

    onLoad() {
      this.callFunctions('onLoad');
    }

    onUnload() {
      this.callFunctions('onUnload');
    }

    onSelect(e) {
      this.callFunctions('onSelect', e);
    }

    onDeselect(e) {
      this.callFunctions('onDeselect', e);
    }

    onBlockSelect(e) {
      this.callFunctions('onBlockSelect', e);
    }

    onBlockDeselect(e) {
      this.callFunctions('onBlockDeselect', e);
    }

    onReorder(e) {
      this.callFunctions('onReorder', e);
    }
  }

  function validateContainerElement(container) {
    if (!(container instanceof Element)) {
      throw new TypeError('Theme Sections: Attempted to load section. The section container provided is not a DOM element.');
    }
    if (container.getAttribute(selectors$7.id) === null) {
      throw new Error('Theme Sections: The section container provided does not have an id assigned to the ' + selectors$7.id + ' attribute.');
    }

    return container;
  }

  function validateComponentsArray(value) {
    if ((typeof value !== 'undefined' && typeof value !== 'object') || value === null) {
      throw new TypeError('Theme Sections: The components object provided is not a valid');
    }

    return value;
  }

  /*
   * @shopify/theme-sections
   * -----------------------------------------------------------------------------
   *
   * A framework to provide structure to your Shopify sections and a load and unload
   * lifecycle. The lifecycle is automatically connected to theme editor events so
   * that your sections load and unload as the editor changes the content and
   * settings of your sections.
   */

  function register(type, components) {
    if (typeof type !== 'string') {
      throw new TypeError('Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered');
    }

    if (typeof registered[type] !== 'undefined') {
      throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
    }

    if (!Array.isArray(components)) {
      components = [components];
    }

    const section = new Registration(type, components);
    registered[type] = section;

    return registered;
  }

  function load(types, containers) {
    types = normalizeType(types);

    if (typeof containers === 'undefined') {
      containers = document.querySelectorAll('[' + selectors$7.type + ']');
    }

    containers = normalizeContainers(containers);

    types.forEach(function (type) {
      const registration = registered[type];

      if (typeof registration === 'undefined') {
        return;
      }

      containers = containers.filter(function (container) {
        // Filter from list of containers because container already has an instance loaded
        if (isInstance(container)) {
          return false;
        }

        // Filter from list of containers because container doesn't have data-section-type attribute
        if (container.getAttribute(selectors$7.type) === null) {
          return false;
        }

        // Keep in list of containers because current type doesn't match
        if (container.getAttribute(selectors$7.type) !== type) {
          return true;
        }

        instances.push(new Section(container, registration));

        // Filter from list of containers because container now has an instance loaded
        return false;
      });
    });
  }

  function unload(selector) {
    var instancesToUnload = getInstances(selector);

    instancesToUnload.forEach(function (instance) {
      var index = instances
        .map(function (e) {
          return e.id;
        })
        .indexOf(instance.id);
      instances.splice(index, 1);
      instance.onUnload();
    });
  }

  function getInstances(selector) {
    var filteredInstances = [];

    // Fetch first element if its an array
    if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
      var firstElement = selector[0];
    }

    // If selector element is DOM element
    if (selector instanceof Element || firstElement instanceof Element) {
      var containers = normalizeContainers(selector);

      containers.forEach(function (container) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.container === container;
          })
        );
      });

      // If select is type string
    } else if (typeof selector === 'string' || typeof firstElement === 'string') {
      var types = normalizeType(selector);

      types.forEach(function (type) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.type === type;
          })
        );
      });
    }

    return filteredInstances;
  }

  function getInstanceById(id) {
    var instance;

    for (var i = 0; i < instances.length; i++) {
      if (instances[i].id === id) {
        instance = instances[i];
        break;
      }
    }
    return instance;
  }

  function isInstance(selector) {
    return getInstances(selector).length > 0;
  }

  function normalizeType(types) {
    // If '*' then fetch all registered section types
    if (types === '*') {
      types = Object.keys(registered);

      // If a single section type string is passed, put it in an array
    } else if (typeof types === 'string') {
      types = [types];

      // If single section constructor is passed, transform to array with section
      // type string
    } else if (types.constructor === Section) {
      types = [types.prototype.type];

      // If array of typed section constructors is passed, transform the array to
      // type strings
    } else if (Array.isArray(types) && types[0].constructor === Section) {
      types = types.map(function (Section) {
        return Section.type;
      });
    }

    types = types.map(function (type) {
      return type.toLowerCase();
    });

    return types;
  }

  function normalizeContainers(containers) {
    // Nodelist with entries
    if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
      containers = Array.prototype.slice.call(containers);

      // Empty Nodelist
    } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
      containers = [];

      // Handle null (document.querySelector() returns null with no match)
    } else if (containers === null) {
      containers = [];

      // Single DOM element
    } else if (!Array.isArray(containers) && containers instanceof Element) {
      containers = [containers];
    }

    return containers;
  }

  if (window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$7.id + '="' + id + '"]');

      if (container !== null) {
        load(container.getAttribute(selectors$7.type), container);
      }
    });

    document.addEventListener('shopify:section:reorder', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$7.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        unload(container);
      }

      if (container !== null) {
        load(container.getAttribute(selectors$7.type), container);
      }
    });

    document.addEventListener('shopify:section:unload', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$7.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        unload(container);
      }
    });

    document.addEventListener('shopify:section:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onSelect(event);
      }
    });

    document.addEventListener('shopify:section:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onDeselect(event);
      }
    });

    document.addEventListener('shopify:block:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockSelect(event);
      }
    });

    document.addEventListener('shopify:block:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockDeselect(event);
      }
    });
  }

  const selectors$8 = {
    slider: '[data-slider]',
    slide: '[data-slide]',
    slideValue: 'data-slide',
    prevArrow: '[data-prev-arrow]',
    nextArrow: '[data-next-arrow]',
    slideshowSlideImg: '.slide-image-img',
    heroContent: '.hero__content',
    heroContentWrapper: '.hero__content__wrapper',
    dataSliderAnimate: 'data-slider-animate',
    dataAspectRatio: 'data-aspectratio',
    dataDots: 'data-dots',
    dataAutoplay: 'data-autoplay',
    dataAutoplaySpeed: 'data-speed',
    dataColor: 'data-color',
    dataInfinite: 'data-infinite',
    dataSetHeight: 'data-set-height',
    dataWatchCss: 'data-watch-css',
    dataAdaptiveHeight: 'data-adaptive-height',
    dataCellAlign: 'data-cell-align',
    dataButtons: 'data-buttons',
    dataDraggable: 'data-draggable',
    dataPercentPosition: 'data-percent-position',
    dataSlideIndex: 'data-slide-index',
    dataSlidesLargeDesktop: 'data-slides-large-desktop',
    dataSlidesDesktop: 'data-slides-desktop',
    dataSlidesTabletDesktop: 'data-slides-tablet',
    dataSlidesMobileDesktop: 'data-slides-mobile',
    dataSliderStartIndex: 'data-slider-start-index',
    dataGroupCells: 'data-group-cells',
  };

  const classes$3 = {
    classIsSelected: 'is-selected',
    textDark: 'text-dark',
    textLight: 'text-light',
    transparentWrapper: 'transparent__wrapper',
    heroContentTransparent: 'hero__content--transparent',
    classSliderInitialized: 'js-slider--initialized',
    classSliderArrowsHidden: 'flickity-button-hide',
    classAosAnimate: 'aos-animate',
    classAosAnimated: 'aos-animated',
  };

  const sections$2 = {};

  class Slider {
    constructor(container) {
      this.container = container;
      this.slideshow = this.container.querySelector(selectors$8.slider);
      if (!this.slideshow) return;
      this.slideshowSlides = this.slideshow.querySelectorAll(selectors$8.slide);
      this.sliderPrev = this.container.querySelector(selectors$8.prevArrow);
      this.sliderNext = this.container.querySelector(selectors$8.nextArrow);
      this.currentSlideColor = this.slideshowSlides[0].getAttribute(selectors$8.dataColor);
      this.showDots = this.slideshow.getAttribute(selectors$8.dataDots) === 'true';
      this.autoPlay = this.slideshow.getAttribute(selectors$8.dataAutoplay) === 'true';
      this.autoPlaySpeed = this.slideshow.getAttribute(selectors$8.dataAutoplaySpeed);
      this.infinite = this.slideshow.getAttribute(selectors$8.dataInfinite) !== 'false';
      this.setMinHeightFlag = this.slideshow.getAttribute(selectors$8.dataSetHeight) === 'true';
      this.watchCss = this.slideshow.getAttribute(selectors$8.dataWatchCss) === 'true';
      this.adaptiveHeight = this.slideshow.getAttribute(selectors$8.dataAdaptiveHeight) !== 'false';
      this.buttons = this.slideshow.getAttribute(selectors$8.dataButtons) !== 'false';
      this.cellAlignLeft = this.slideshow.getAttribute(selectors$8.dataCellAlign) === 'left';
      this.cellAlignRight = this.slideshow.getAttribute(selectors$8.dataCellAlign) === 'right';
      this.draggable = this.slideshow.getAttribute(selectors$8.dataDraggable) !== 'false';
      this.percentPosition = this.slideshow.getAttribute(selectors$8.dataPercentPosition) !== 'false';
      this.multipleSlides = this.slideshow.hasAttribute(selectors$8.dataSlidesLargeDesktop);
      this.sliderStartIndex = this.slideshow.hasAttribute(selectors$8.dataSliderStartIndex);
      this.groupCells = this.slideshow.getAttribute(selectors$8.dataGroupCells) === 'true';
      this.sliderAnimate = this.slideshow.getAttribute(selectors$8.dataSliderAnimate) === 'true';
      this.resizeEvent = debounce(() => this.resizeEvents(), 100);
      this.flkty = null;

      this.init();
    }

    init() {
      this.setMinHeight();

      this.flkty = new Flickity(this.slideshow, {
        initialIndex: this.sliderStartIndex ? parseInt(this.slideshow.getAttribute(selectors$8.dataSliderStartIndex)) : 0,
        autoPlay: this.autoPlay && this.autoPlaySpeed ? parseInt(this.autoPlaySpeed) : false,
        prevNextButtons: this.buttons,
        contain: true,
        pageDots: this.showDots,
        adaptiveHeight: this.adaptiveHeight,
        wrapAround: this.infinite,
        percentPosition: this.percentPosition,
        watchCSS: this.watchCss,
        cellAlign: this.cellAlignLeft ? 'left' : this.cellAlignRight ? 'right' : 'center',
        groupCells: this.groupCells,
        draggable: this.draggable ? '>1' : false,
        on: {
          ready: () => {
            if (this.sliderAnimate && !this.autoPlay) {
              const currentSlide = this.slideshow.querySelector(`.${classes$3.classIsSelected}`);
              currentSlide.classList.add(classes$3.classAosAnimated);
            }

            this.slideActions();

            if (this.slideshow.classList.contains(classes$3.classIsSelected)) {
              this.slideshow.classList.remove(classes$3.classIsSelected);
            }

            this.showArrows();
          },
        },
      });

      if (this.sliderPrev) {
        this.sliderPrev.addEventListener('click', (e) => {
          e.preventDefault();

          this.flkty.previous(true);
        });
      }

      if (this.sliderNext) {
        this.sliderNext.addEventListener('click', (e) => {
          e.preventDefault();

          this.flkty.next(true);
        });
      }

      this.flkty.on('change', () => this.slideActions());

      if (this.sliderAnimate) {
        this.flkty.on('settle', () => this.sliderSettle());
      }

      if (this.setMinHeightFlag || this.multipleSlides) {
        window.addEventListener('resize', this.resizeEvent);
      }
    }

    sliderSettle() {
      const animatedItems = this.slideshow.querySelectorAll(`.${classes$3.classIsSelected}:not(.${classes$3.classAosAnimated}) .${classes$3.classAosAnimated}`);
      if (animatedItems.length) {
        animatedItems.forEach((animatedItem) => {
          animatedItem.classList.add(classes$3.classAosAnimate);
          animatedItem.closest(`.${classes$3.classIsSelected}`).classList.add(classes$3.classAosAnimated);
        });
      }
    }

    resizeEvents() {
      this.setMinHeight();

      if (this.multipleSlides) {
        this.showArrows();
        this.flkty.resize();
        if (!this.slideshow.classList.contains(classes$3.classSliderInitialized)) {
          this.flkty.select(0);
        }
      }
    }

    slideActions() {
      const currentSlide = this.slideshow.querySelector(`.${classes$3.classIsSelected}`);
      this.currentSlideColor = currentSlide.getAttribute(selectors$8.dataColor);

      if (this.currentSlideColor) {
        this.slideshow.classList.remove(classes$3.textLight, classes$3.textDark);
        this.slideshow.classList.add(this.currentSlideColor);
      }

      this.container.classList.remove(classes$3.transparentWrapper);
      const heroContentWrapper = currentSlide.querySelector(selectors$8.heroContentWrapper);
      if (heroContentWrapper && heroContentWrapper.classList.contains(classes$3.heroContentTransparent)) {
        this.container.classList.add(classes$3.transparentWrapper);
      }

      this.setMinHeight();

      if (this.sliderAnimate) {
        const animatedItems = this.slideshow.querySelectorAll(`.${classes$3.classIsSelected}:not(.${classes$3.classAosAnimated}) .${classes$3.classAosAnimate}`);
        if (animatedItems.length) {
          animatedItems.forEach((animatedItem) => {
            animatedItem.classList.remove(classes$3.classAosAnimate);
            animatedItem.classList.add(classes$3.classAosAnimated);
          });
        }
      }
    }

    setMinHeight() {
      if (!this.setMinHeightFlag) return;
      this.slideshowSlides.forEach((element) => {
        const slideImageImg = element.querySelector(selectors$8.slideshowSlideImg);
        let slideAspectRatio = '';
        if (slideImageImg && slideImageImg.hasAttribute(selectors$8.dataAspectRatio)) {
          slideAspectRatio = slideImageImg.getAttribute(selectors$8.dataAspectRatio);
        }

        let slideTextContentHeight = 0;
        let getMargin = 0;
        const slideTextContent = element.querySelector(selectors$8.heroContent);
        if (slideTextContent) {
          const getMarginTop = parseInt(window.getComputedStyle(slideTextContent).marginTop);
          const getMarginBottom = parseInt(window.getComputedStyle(slideTextContent).marginBottom);
          getMargin = getMarginTop + getMarginBottom;
          slideTextContentHeight = slideTextContent.offsetHeight + getMargin;
        }

        const slideWidth = parseInt(getComputedStyle(element, null).width.replace('px', ''));
        let slideHeight = parseInt(slideWidth / slideAspectRatio) || 0;
        const isCurrentSlide = element.classList.contains(classes$3.classIsSelected);

        if (slideTextContentHeight > slideHeight) {
          slideHeight = slideTextContentHeight;
        }

        const minHeightValue = `calc(${slideHeight}px + var(--header-padding)`;
        element.style.setProperty('min-height', minHeightValue);
        const heroContentWrapper = element.querySelector(selectors$8.heroContentWrapper);
        if (heroContentWrapper) {
          heroContentWrapper.style.setProperty('min-height', minHeightValue);
        }
        if (isCurrentSlide) {
          this.slideshow.parentElement.style.setProperty('min-height', minHeightValue);
        }
      });
    }

    showArrows() {
      if (!this.multipleSlides) return;
      const slidesNumberCustom = parseInt(this.slideshow.getAttribute(selectors$8.dataSlidesLargeDesktop));
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const desktopSlides = this.slideshow.hasAttribute(selectors$8.dataSlidesDesktop) ? parseInt(this.slideshow.getAttribute(selectors$8.dataSlidesDesktop)) : 3;
      const tabletSlides = this.slideshow.hasAttribute(selectors$8.dataSlidesTabletDesktop) ? parseInt(this.slideshow.getAttribute(selectors$8.dataSlidesTabletDesktop)) : 2;
      const mobileSlides = this.slideshow.hasAttribute(selectors$8.dataSlidesMobileDesktop) ? parseInt(this.slideshow.getAttribute(selectors$8.dataSlidesMobileDesktop)) : 1;
      const largeDesktopCheck = windowWidth > 1339 && this.slideshowSlides.length > slidesNumberCustom;
      const desktopCheck = windowWidth <= 1339 && windowWidth > 1023 && this.slideshowSlides.length > desktopSlides;
      const tabletCheck = windowWidth <= 1023 && windowWidth > 750 && this.slideshowSlides.length > tabletSlides;
      const mobileCheck = windowWidth <= 750 && this.slideshowSlides.length > mobileSlides;
      const flag = Boolean(largeDesktopCheck || desktopCheck || tabletCheck || mobileCheck);
      this.slideshow.classList.toggle(classes$3.classSliderArrowsHidden, !flag);
      this.slideshow.classList.toggle(classes$3.classSliderInitialized, flag);
    }

    onUnload() {
      if (this.setMinHeightFlag || this.multipleSlides) {
        window.removeEventListener('resize', this.resizeEvent);
      }

      if (!this.slideshow) return;
      this.flkty.destroy();
    }

    onBlockSelect(evt) {
      if (!this.slideshow) return;
      // Ignore the cloned version
      const slide = this.slideshow.querySelector(`[${selectors$8.slideValue}="${evt.detail.blockId}"]`);
      if (!slide) return;
      let slideIndex = parseInt(slide.getAttribute(selectors$8.dataSlideIndex));

      if (this.multipleSlides && !this.slideshow.classList.contains(classes$3.classSliderInitialized)) {
        slideIndex = 0;
      }

      this.slideshow.classList.add(classes$3.classIsSelected);

      // Go to selected slide, pause autoplay
      this.flkty.select(slideIndex);
      this.flkty.stopPlayer();
    }

    onBlockDeselect() {
      if (!this.slideshow) return;
      this.slideshow.classList.remove(classes$3.classIsSelected);

      if (!this.autoPlay) return;
      this.flkty.playPlayer();
    }
  }

  const slider = {
    onLoad() {
      sections$2[this.id] = new Slider(this.container);
    },
    onUnload(e) {
      sections$2[this.id].onUnload(e);
    },
    onBlockSelect(e) {
      sections$2[this.id].onBlockSelect(e);
    },
    onBlockDeselect(e) {
      sections$2[this.id].onBlockDeselect(e);
    },
  };

  const selectors$9 = {
    copyClipboard: '[data-copy-clipboard]',
  };

  const sections$3 = {};

  class CopyClipboard {
    constructor(section) {
      this.container = section.container;
      this.copyButton = this.container.querySelector(selectors$9.copyClipboard);

      if (this.copyButton) {
        this.init();
      }
    }

    init() {
      this.copyButton.addEventListener('click', function (e) {
        e.preventDefault();
        const copyText = this.getAttribute('href');
        let inputElem = document.createElement('input');
        inputElem.type = 'text';
        this.appendChild(inputElem);
        const newInput = this.querySelector('input');
        newInput.value = copyText;
        newInput.select();
        newInput.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand('copy');
        this.removeChild(newInput);
      });
    }
  }

  const copyClipboard = {
    onLoad() {
      sections$3[this.id] = new CopyClipboard(this);
    },
  };

  var sections$4 = {};

  const parallaxHero = {
    onLoad() {
      sections$4[this.id] = [];
      const frames = this.container.querySelectorAll('[data-parallax-wrapper]');
      frames.forEach((frame) => {
        const inner = frame.querySelector('[data-parallax-img]');

        sections$4[this.id].push(
          new Rellax(inner, {
            center: true,
            round: true,
            frame: frame,
          })
        );
      });

      window.addEventListener('load', () => {
        sections$4[this.id].forEach((image) => {
          if (typeof image.refresh === 'function') {
            image.refresh();
          }
        });
      });
    },
    onUnload: function () {
      sections$4[this.id].forEach((image) => {
        if (typeof image.destroy === 'function') {
          image.destroy();
        }
      });
    },
  };

  const selectors$a = {
    sidebar: '.sidebar',
    widgetCategories: '.widget--categories',
    widgetLinksEl: '.widget__links',
    widgetLinks: '.widget__links .has-sub-nav > a',
    widgetLinksSub: '.widget__links .submenu > li > a',
    listEl: 'li',
    linkEl: 'a',
    articleSingle: '.article--single',
    sidebarContents: '.sidebar__contents',
    hasSubNav: '.has-sub-nav',
  };

  const classes$4 = {
    classOpen: 'open',
    classActive: 'active',
    classSubmenu: 'submenu',
  };

  const sections$5 = {};

  class Article {
    constructor(section) {
      this.container = section.container;
      this.sidebar = this.container.querySelector(selectors$a.sidebar);
      this.widgetCategories = this.container.querySelector(selectors$a.widgetCategories);
      this.resizeEvent = () => this.categories();
      this.flkty = null;

      this.init();
    }

    init() {
      if (this.sidebar) {
        this.sidebarNav();
      }
    }

    sidebarNav() {
      this.navStates();

      // Dropdown Menus
      this.container.addEventListener('click', function (e) {
        const checkLinkTag = e.target.tagName.toLowerCase() === selectors$a.linkEl;
        const checkLinkParent = e.target.closest(`${selectors$a.listEl}${selectors$a.hasSubNav}`);
        const checkLinkClosest = e.target.closest(selectors$a.widgetLinksEl);
        const checkLink = checkLinkTag && checkLinkParent && checkLinkClosest;
        const submenu = e.target.nextElementSibling;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const isMobile = windowWidth < 750;

        if (!isMobile && checkLink && submenu) {
          submenu.parentElement.classList.toggle(classes$4.classActive);
          submenu.classList.toggle(classes$4.classOpen);
          submenu.setAttribute('aria-expanded', submenu.classList.contains(classes$4.classOpen));
          slideToggle(submenu);

          e.preventDefault();
        }
      });

      if (this.widgetCategories) {
        this.categories();

        document.addEventListener('theme:resize', this.resizeEvent);
      }
    }

    navStates() {
      // Nav Active States
      const links = this.container.querySelectorAll(`${selectors$a.widgetLinks}, ${selectors$a.widgetLinksSub}`);

      if (links.length) {
        links.forEach((element) => {
          const href = element.getAttribute('href');
          const location = window.location.pathname;

          if (href === location) {
            const elementClosest = element.closest(selectors$a.hasSubNav);
            element.closest('li').classList.add(classes$4.classActive);
            if (!elementClosest) return;
            elementClosest.classList.add(classes$4.classActive);
            const submenu = elementClosest.querySelector(`.${classes$4.classSubmenu}`);

            if (submenu) {
              submenu.classList.toggle(classes$4.classOpen);
              submenu.setAttribute('aria-expanded', submenu.classList.contains(classes$4.classOpen));
              showElement(submenu);
            }
          }
        });
      }
    }

    categories() {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const isMobile = windowWidth < 750;
      const widgetCategories = document.querySelector(selectors$a.widgetCategories);

      if (isMobile) {
        document.querySelector(selectors$a.articleSingle).prepend(widgetCategories);
      } else {
        document.querySelector(selectors$a.sidebarContents).prepend(widgetCategories);
      }
    }

    onUnload() {
      if (this.widgetCategories) {
        document.removeEventListener('theme:resize', this.resizeEvent);
      }
    }
  }

  const articleSection = {
    onLoad() {
      sections$5[this.id] = new Article(this);
    },
    onUnload(e) {
      sections$5[this.id].onUnload(e);
    },
  };

  register('article', [articleSection, slider, copyClipboard, parallaxHero]);

  const selectors$b = {
    slider: '[data-slider]',
  };

  const sections$6 = {};

  class Blog {
    constructor(section) {
      this.container = section.container;
      this.slideshows = this.container.querySelectorAll(selectors$b.slider);

      if (this.slideshows.length > 1) {
        this.init();
      }
    }

    init() {
      const [, ...slideshows] = this.slideshows;
      slideshows.forEach((element) => {
        if (element.parentElement) {
          new Slider(element.parentElement);
        }
      });
    }
  }

  const blogSection = {
    onLoad() {
      sections$6[this.id] = new Blog(this);
    },
  };

  register('blog-template', [blogSection, slider]);

  register('hero', parallaxHero);

  const selectors$c = {
    popoutWrapper: '[data-popout]',
    popoutList: '[data-popout-list]',
    popoutToggle: '[data-popout-toggle]',
    popoutInput: '[data-popout-input]',
    popoutOptions: '[data-popout-option]',
    popoutPrevent: 'data-popout-prevent',
    popoutQuantity: 'data-quantity-field',
    dataValue: 'data-value',
    ariaExpanded: 'aria-expanded',
    ariaCurrent: 'aria-current',
    productGridImage: '[data-product-image]',
    productGrid: '[data-product-grid-item]',
  };

  const classes$5 = {
    listVisible: 'popout-list--visible',
    currentSuffix: '--current',
    classPopoutAlternative: 'popout-container--alt',
    visible: 'is-visible',
  };

  let sections$7 = {};

  class Popout {
    constructor(popout) {
      this.container = popout;
      this.popoutList = this.container.querySelector(selectors$c.popoutList);
      this.popoutToggle = this.container.querySelector(selectors$c.popoutToggle);
      this.popoutInput = this.container.querySelector(selectors$c.popoutInput);
      this.popoutOptions = this.container.querySelectorAll(selectors$c.popoutOptions);
      this.popoutPrevent = this.container.getAttribute(selectors$c.popoutPrevent) === 'true';
      this.popupToggleFocusoutEvent = (evt) => this.popupToggleFocusout(evt);
      this.popupListFocusoutEvent = (evt) => this.popupListFocusout(evt);
      this.popupToggleClickEvent = (evt) => this.popupToggleClick(evt);
      this.containerKeyupEvent = (evt) => this.containerKeyup(evt);
      this.popupOptionsClickEvent = (evt) => this.popupOptionsClick(evt);
      this._connectOptionsDispatchEvent = (evt) => this._connectOptionsDispatch(evt);

      this._connectOptions();
      this._connectToggle();
      this._onFocusOut();

      if (this.popoutInput && this.popoutInput.hasAttribute(selectors$c.popoutQuantity)) {
        document.addEventListener('popout:updateValue', this.updatePopout.bind(this));
      }
    }

    unload() {
      if (this.popoutOptions.length) {
        this.popoutOptions.forEach((element) => {
          element.removeEventListener('clickDetails', this.popupOptionsClickEvent);
          element.removeEventListener('click', this._connectOptionsDispatchEvent);
        });
      }

      this.popoutToggle.removeEventListener('click', this.popupToggleClickEvent);

      this.popoutToggle.removeEventListener('focusout', this.popupToggleFocusoutEvent);

      this.popoutList.removeEventListener('focusout', this.popupListFocusoutEvent);

      this.container.removeEventListener('keyup', this.containerKeyupEvent);
    }

    popupToggleClick(evt) {
      const ariaExpanded = evt.currentTarget.getAttribute(selectors$c.ariaExpanded) === 'true';

      if (this.popoutList.closest(selectors$c.productGrid)) {
        const productGridItemImage = this.popoutList.closest(selectors$c.productGrid).querySelector(selectors$c.productGridImage);

        if (productGridItemImage) {
          productGridItemImage.classList.toggle(classes$5.visible, !ariaExpanded);
        }
      }

      evt.currentTarget.setAttribute(selectors$c.ariaExpanded, !ariaExpanded);
      this.popoutList.classList.toggle(classes$5.listVisible);
    }

    popupToggleFocusout(evt) {
      const popoutLostFocus = this.container.contains(evt.relatedTarget);

      if (!popoutLostFocus) {
        this._hideList();
      }
    }

    popupListFocusout(evt) {
      const childInFocus = evt.currentTarget.contains(evt.relatedTarget);
      const isVisible = this.popoutList.classList.contains(classes$5.listVisible);

      if (isVisible && !childInFocus) {
        this._hideList();
      }
    }

    popupOptionsClick(evt) {
      const link = evt.target.closest(selectors$c.popoutOptions);
      if (link.attributes.href.value === '#') {
        evt.preventDefault();

        let attrValue = '';

        if (evt.currentTarget.getAttribute(selectors$c.dataValue)) {
          attrValue = evt.currentTarget.getAttribute(selectors$c.dataValue);
        }

        this.popoutInput.value = attrValue;

        if (this.popoutPrevent) {
          this.popoutInput.dispatchEvent(new Event('change'));

          if (!evt.detail.preventTrigger && this.popoutInput.hasAttribute(selectors$c.popoutQuantity)) {
            this.popoutInput.dispatchEvent(new Event('input'));
          }

          const currentElement = this.popoutList.querySelector(`[class*="${classes$5.currentSuffix}"]`);
          let targetClass = classes$5.currentSuffix;

          if (currentElement && currentElement.classList.length) {
            for (const currentElementClass of currentElement.classList) {
              if (currentElementClass.includes(classes$5.currentSuffix)) {
                targetClass = currentElementClass;
                break;
              }
            }
          }

          const listTargetElement = this.popoutList.querySelector(`.${targetClass}`);

          if (listTargetElement) {
            listTargetElement.classList.remove(`${targetClass}`);
            evt.currentTarget.parentElement.classList.add(`${targetClass}`);
          }

          const targetAttribute = this.popoutList.querySelector(`[${selectors$c.ariaCurrent}]`);

          if (targetAttribute && targetAttribute.hasAttribute(`${selectors$c.ariaCurrent}`)) {
            targetAttribute.removeAttribute(`${selectors$c.ariaCurrent}`);
            evt.currentTarget.setAttribute(`${selectors$c.ariaCurrent}`, 'true');
          }

          if (attrValue !== '') {
            this.popoutToggle.textContent = attrValue;
          }

          this.popupToggleFocusout(evt);
          this.popupListFocusout(evt);
        } else {
          this._submitForm(attrValue);
        }
      }
    }

    updatePopout() {
      const targetElement = this.popoutList.querySelector(`[${selectors$c.dataValue}="${this.popoutInput.value}"]`);
      if (targetElement) {
        targetElement.dispatchEvent(
          new CustomEvent('clickDetails', {
            cancelable: true,
            bubbles: true,
            detail: {
              preventTrigger: true,
            },
          })
        );

        if (!targetElement.parentElement.nextSibling) {
          this.container.classList.add(classes$5.classPopoutAlternative);
        }
      } else {
        this.container.classList.add(classes$5.classPopoutAlternative);
      }
    }

    containerKeyup(evt) {
      if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }
      this._hideList();
      this.popoutToggle.focus();
    }

    bodyClick(evt) {
      const isOption = this.container.contains(evt.target);
      const isVisible = this.popoutList.classList.contains(classes$5.listVisible);

      if (isVisible && !isOption) {
        this._hideList();
      }
    }

    _connectToggle() {
      this.popoutToggle.addEventListener('click', this.popupToggleClickEvent);
    }

    _connectOptions() {
      if (this.popoutOptions.length) {
        this.popoutOptions.forEach((element) => {
          element.addEventListener('clickDetails', this.popupOptionsClickEvent);
          element.addEventListener('click', this._connectOptionsDispatchEvent);
        });
      }
    }

    _connectOptionsDispatch(evt) {
      const event = new CustomEvent('clickDetails', {
        cancelable: true,
        bubbles: true,
        detail: {
          preventTrigger: false,
        },
      });

      if (!evt.target.dispatchEvent(event)) {
        evt.preventDefault();
      }
    }

    _onFocusOut() {
      this.popoutToggle.addEventListener('focusout', this.popupToggleFocusoutEvent);

      this.popoutList.addEventListener('focusout', this.popupListFocusoutEvent);

      this.container.addEventListener('keyup', this.containerKeyupEvent);

      document.body.addEventListener('click', this.bodyClick.bind(this));
    }

    _submitForm() {
      const form = this.container.closest('form');
      if (form) {
        form.submit();
      }
    }

    _hideList() {
      this.popoutList.classList.remove(classes$5.listVisible);
      this.popoutToggle.setAttribute(selectors$c.ariaExpanded, false);
    }
  }

  const popoutSection = {
    onLoad() {
      sections$7[this.id] = [];
      const wrappers = this.container.querySelectorAll(selectors$c.popoutWrapper);
      wrappers.forEach((wrapper) => {
        sections$7[this.id].push(new Popout(wrapper));
      });
    },
    onUnload() {
      sections$7[this.id].forEach((popout) => {
        if (typeof popout.unload === 'function') {
          popout.unload();
        }
      });
    },
  };

  const footerSection = {
    onLoad() {
      // Lighthouse fires security warning for the Shopify link.
      var shopifyLink = document.querySelector('[data-powered-link] a');
      if (shopifyLink) {
        shopifyLink.relList.add('noopener');
      }
    },
  };

  register('footer', [popoutSection, footerSection, parallaxHero]);

  const selectors$d = {
    reviews: 'data-reviews',
  };

  class ProductGridReviews {
    constructor(section) {
      this.container = section.container;
      this.showReviews = this.container.getAttribute(selectors$d.reviews) !== 'false';
      this.reviewsAppInstalled = typeof window.SPR === 'function';

      this.init();
    }

    init() {
      if (this.showReviews && typeof yotpo !== 'undefined') {
        yotpo.initialized ? yotpo.refreshWidgets() : yotpo.initWidgets();
      } else if (this.showReviews && this.reviewsAppInstalled) {
        window.SPR.initDomEls();
        window.SPR.loadBadges();
      }
    }
  }
  const productGridReviews = {
    onLoad() {
      new ProductGridReviews(this);
    },
  };

  function Listeners() {
    this.entries = [];
  }

  Listeners.prototype.add = function (element, event, fn) {
    this.entries.push({element: element, event: event, fn: fn});
    element.addEventListener(event, fn);
  };

  Listeners.prototype.removeAll = function () {
    this.entries = this.entries.filter(function (listener) {
      listener.element.removeEventListener(listener.event, listener.fn);
      return false;
    });
  };

  /**
   * Find a match in the project JSON (using a ID number) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Number} value Accepts Number (e.g. 6908023078973)
   * @returns {Object} The variant object once a match has been successful. Otherwise null will be return
   */

  /**
   * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromSerializedArray(product, collection) {
    _validateProductStructure(product);

    // If value is an array of options
    var optionArray = _createOptionArrayFromOptionCollection(product, collection);
    return getVariantFromOptionArray(product, optionArray);
  }

  /**
   * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromOptionArray(product, options) {
    _validateProductStructure(product);
    _validateOptionsArray(options);

    var result = product.variants.filter(function (variant) {
      return options.every(function (option, index) {
        return variant.options[index] === option;
      });
    });

    return result[0] || null;
  }

  /**
   * Creates an array of selected options from the object
   * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
   * @param {Object} product Product JSON object
   * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
   */
  function _createOptionArrayFromOptionCollection(product, collection) {
    _validateProductStructure(product);
    _validateSerializedArray(collection);

    var optionArray = [];

    collection.forEach(function (option) {
      for (var i = 0; i < product.options.length; i++) {
        var name = product.options[i].name || product.options[i];
        if (name.toLowerCase() === option.name.toLowerCase()) {
          optionArray[i] = option.value;
          break;
        }
      }
    });

    return optionArray;
  }

  /**
   * Check if the product data is a valid JS object
   * Error will be thrown if type is invalid
   * @param {object} product Product JSON object
   */
  function _validateProductStructure(product) {
    if (typeof product !== 'object') {
      throw new TypeError(product + ' is not an object.');
    }

    if (Object.keys(product).length === 0 && product.constructor === Object) {
      throw new Error(product + ' is empty.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted like jQuery's serializeArray()
   * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
   */
  function _validateSerializedArray(collection) {
    if (!Array.isArray(collection)) {
      throw new TypeError(collection + ' is not an array.');
    }

    if (collection.length === 0) {
      throw new Error(collection + ' is empty.');
    }

    if (collection[0].hasOwnProperty('name')) {
      if (typeof collection[0].name !== 'string') {
        throw new TypeError('Invalid value type passed for name of option ' + collection[0].name + '. Value should be string.');
      }
    } else {
      throw new Error(collection[0] + 'does not contain name key.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted as list of values
   * @param {Array} collection Array of object (e.g. ['36', 'Black'])
   */
  function _validateOptionsArray(options) {
    if (Array.isArray(options) && typeof options[0] === 'object') {
      throw new Error(options + 'is not a valid array of options.');
    }
  }

  var selectors$e = {
    idInput: '[name="id"]',
    planInput: '[name="selling_plan"]',
    optionInput: '[name^="options"]',
    quantityInput: '[name="quantity"]',
    propertyInput: '[name^="properties"]',
  };

  // Public Methods
  // -----------------------------------------------------------------------------

  /**
   * Returns a URL with a variant ID query parameter. Useful for updating window.history
   * with a new URL based on the currently select product variant.
   * @param {string} url - The URL you wish to append the variant ID to
   * @param {number} id  - The variant ID you wish to append to the URL
   * @returns {string} - The new url which includes the variant ID query parameter
   */

  function getUrlWithVariant(url, id) {
    if (/variant=/.test(url)) {
      return url.replace(/(variant=)[^&]+/, '$1' + id);
    } else if (/\?/.test(url)) {
      return url.concat('&variant=').concat(id);
    }

    return url.concat('?variant=').concat(id);
  }

  /**
   * Constructor class that creates a new instance of a product form controller.
   *
   * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
   * @param {Object} product - A product object
   * @param {Object} options - Optional options object
   * @param {Function} options.onOptionChange - Callback for whenever an option input changes
   * @param {Function} options.onPlanChange - Callback for changes to name=selling_plan
   * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
   * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
   * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
   */
  class ProductForm {
    constructor(element, product, options) {
      this.element = element;
      this.form = this.element.tagName == 'FORM' ? this.element : this.element.querySelector('form');
      this.product = this._validateProductObject(product);
      this.variantElement = this.element.querySelector(selectors$e.idInput);

      options = options || {};

      this._listeners = new Listeners();
      this._listeners.add(this.element, 'submit', this._onSubmit.bind(this, options));

      this.optionInputs = this._initInputs(selectors$e.optionInput, options.onOptionChange);

      this.planInputs = this._initInputs(selectors$e.planInput, options.onPlanChange);

      this.quantityInputs = this._initInputs(selectors$e.quantityInput, options.onQuantityChange);

      this.propertyInputs = this._initInputs(selectors$e.propertyInput, options.onPropertyChange);
    }

    /**
     * Cleans up all event handlers that were assigned when the Product Form was constructed.
     * Useful for use when a section needs to be reloaded in the theme editor.
     */
    destroy() {
      this._listeners.removeAll();
    }

    /**
     * Getter method which returns the array of currently selected option values
     *
     * @returns {Array} An array of option values
     */
    options() {
      return this._serializeInputValues(this.optionInputs, function (item) {
        var regex = /(?:^(options\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the currently selected variant, or `null` if variant
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    variant() {
      const opts = this.options();
      if (opts.length) {
        return getVariantFromSerializedArray(this.product, opts);
      } else {
        return this.product.variants[0];
      }
    }

    /**
     * Getter method which returns the current selling plan, or `null` if plan
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    plan(variant) {
      let plan = {
        allocation: null,
        group: null,
        detail: null,
      };
      const formData = new FormData(this.form);
      const id = formData.get('selling_plan');

      if (id && variant) {
        plan.allocation = variant.selling_plan_allocations.find(function (item) {
          return item.selling_plan_id.toString() === id.toString();
        });
      }
      if (plan.allocation) {
        plan.group = this.product.selling_plan_groups.find(function (item) {
          return item.id.toString() === plan.allocation.selling_plan_group_id.toString();
        });
      }
      if (plan.group) {
        plan.detail = plan.group.selling_plans.find(function (item) {
          return item.id.toString() === id.toString();
        });
      }

      if (plan && plan.allocation && plan.detail && plan.allocation) {
        return plan;
      } else return null;
    }

    /**
     * Getter method which returns a collection of objects containing name and values
     * of property inputs
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    properties() {
      return this._serializeInputValues(this.propertyInputs, function (item) {
        var regex = /(?:^(properties\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'properties[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the current quantity or 1 if no quantity input is
     * included in the form
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    quantity() {
      return this.quantityInputs[0] ? Number.parseInt(this.quantityInputs[0].value, 10) : 1;
    }

    getFormState() {
      const variant = this.variant();
      return {
        options: this.options(),
        variant: variant,
        properties: this.properties(),
        quantity: this.quantity(),
        plan: this.plan(variant),
      };
    }

    // Private Methods
    // -----------------------------------------------------------------------------
    _setIdInputValue(variant) {
      if (variant && variant.id) {
        this.variantElement.value = variant.id.toString();
      } else {
        this.variantElement.value = '';
      }

      this.variantElement.dispatchEvent(new Event('change'));
    }

    _onSubmit(options, event) {
      event.dataset = this.getFormState();
      if (options.onFormSubmit) {
        options.onFormSubmit(event);
      }
    }

    _onOptionChange(event) {
      this._setIdInputValue(event.dataset.variant);
    }

    _onFormEvent(cb) {
      if (typeof cb === 'undefined') {
        return Function.prototype.bind();
      }

      return function (event) {
        event.dataset = this.getFormState();
        this._setIdInputValue(event.dataset.variant);
        cb(event);
      }.bind(this);
    }

    _initInputs(selector, cb) {
      var elements = Array.prototype.slice.call(this.element.querySelectorAll(selector));

      return elements.map(
        function (element) {
          this._listeners.add(element, 'change', this._onFormEvent(cb));
          return element;
        }.bind(this)
      );
    }

    _serializeInputValues(inputs, transform) {
      return inputs.reduce(function (options, input) {
        if (
          input.checked || // If input is a checked (means type radio or checkbox)
          (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
        ) {
          options.push(transform({name: input.name, value: input.value}));
        }

        return options;
      }, []);
    }

    _validateProductObject(product) {
      if (typeof product !== 'object') {
        throw new TypeError(product + ' is not an object.');
      }

      if (typeof product.variants[0].options === 'undefined') {
        throw new TypeError('Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route');
      }
      return product;
    }
  }

  function fetchProduct(handle) {
    let root = window.theme.routes.root_url || '';
    if (root[root.length - 1] !== '/') {
      root = `${root}/`;
    }
    const requestRoute = `${root}products/${handle}.js`;
    return window
      .fetch(requestRoute)
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function t(t){var e=t.getBoundingClientRect(),i=e.left,n=e.right,o=e.top,s=e.bottom,r=window.pageYOffset;return {height:s-o,width:n-i,top:{y:r+o,x:i+(n-i)/2},bottom:{y:r+s,x:i+(n-i)/2},left:{y:o+(s-o)/2,x:i},right:{y:o+(s-o)/2,x:n},topLeft:{y:r+o,x:i},bottomLeft:{y:r+s,x:i},topRight:{y:r+o,x:n},bottomRight:{y:r+s,x:n}}}function e(e,i,n){var o=t(i)[n],s=t(e),r=window.pageYOffset,a={top:r,bottom:r+window.innerHeight,left:0,right:window.innerWidth},h={top:{x:s.width/2,y:s.height},bottom:{x:s.width/2,y:0},left:{x:s.width,y:s.height/2},right:{x:0,y:s.height/2},topLeft:{x:s.width,y:s.height},topRight:{x:0,y:s.height},bottomLeft:{x:s.width,y:0},bottomRight:{x:0,y:0}},p=o.x-h[n].x,u=o.y-h[n].y;p<a.left?p=a.left:p+s.width>a.right&&(p=a.right-s.width),u<a.top?u=a.top:u+s.height>a.bottom&&(u=a.bottom-s.height),e.style.transform="translateX("+Math.round(p)+"px) translateY("+Math.round(u)+"px)";}function i(t){t.length>0&&t.shift().apply(this,t);}function n(t,e){t(),i(e);}function o(t,e){return function(){var i=[].slice.call(arguments),s=i[0];if("number"==typeof s)return o(t,s);"number"==typeof e?setTimeout(function(){n(t,i);},e):n(t,i);}}function s(){var t=[].slice.call(arguments);return o(function(){i(t.slice(0));})}var r=function(t){var e=t.popover;void 0===e&&(e=null);var i=t.position;void 0===i&&(i="bottom");var n=t.transitionSpeed;void 0===n&&(n=0);var o=t.onChange;void 0===o&&(o=null),this.target=t.target,this.popover=this.createPopover(e),this.position=i,this.transitionSpeed=n,this.onChange=o,this.state={pinned:!1,busy:!1,requestClose:!1},this.pin=this.pin.bind(this),this.unpin=this.unpin.bind(this),this.block=this.block.bind(this),this.unblock=this.unblock.bind(this),this.isExternalClick=this.isExternalClick.bind(this),this.handleKeyup=this.handleKeyup.bind(this),this.focusNode=null;};r.prototype.setState=function(t,e){this.state=Object.assign(this.state,t),e&&o(e,0)();},r.prototype.block=function(){this.setState({busy:!0});},r.prototype.unblock=function(){var t=this;this.setState({busy:!1},function(){t.state.requestClose&&t.unpin();});},r.prototype.toggle=function(){this.state.pinned?this.unpin():this.pin();},r.prototype.pin=function(){var t=this;if(!this.state.busy&&!this.state.pinned){this.setState({busy:!0}),this.focusNode=document.activeElement;var i=o(function(){return document.body.appendChild(t.popover)}),n=o(function(){return n=t.target,o=t.position,(i=t.popover).classList.add("is-tacked"),e(i,n,o),{update:function(){e(i,n,o);},destroy:function(){i.style.transform="",i.classList.remove("is-tacked");}};var i,n,o;}),r=o(function(){t.popover.classList.add("is-visible"),t.popover.setAttribute("tabindex","0"),t.popover.setAttribute("aria-hidden","false");}),a=o(function(){return t.popover.focus()}),h=o(function(){return t.setState({busy:!1,pinned:!0})});s(i,n,r(0),a(0),h)(),this.popover.addEventListener("mouseenter",this.block),this.popover.addEventListener("mouseleave",this.unblock),window.addEventListener("click",this.isExternalClick),window.addEventListener("touchstart",this.isExternalClick),window.addEventListener("keyup",this.handleKeyup),window.addEventListener("resize",this.unpin),this.onChange&&this.onChange({pinned:!0});}},r.prototype.unpin=function(t){var e=this;this.setState({requestClose:!0}),(t||!this.state.busy&&this.state.pinned)&&o(function(){e.setState({busy:!0}),e.popover.removeEventListener("mouseenter",e.block),e.popover.removeEventListener("mouseleave",e.unblock),window.removeEventListener("click",e.isExternalClick),window.removeEventListener("touchstart",e.isExternalClick),window.removeEventListener("keyup",e.handleKeyup),window.removeEventListener("resize",e.unpin);var t=o(function(){return e.popover.classList.add("is-hiding")}),i=o(function(){return document.body.removeChild(e.popover)}),n=o(function(){return e.focusNode.focus()}),r=o(function(){e.popover.classList.remove("is-hiding"),e.popover.classList.remove("is-visible"),e.setState({busy:!1,pinned:!1,requestClose:!1});});s(t,i(e.transitionSpeed),n,r)(),e.onChange&&e.onChange({pinned:!1});},0)();},r.prototype.handleKeyup=function(t){27===t.keyCode&&this.unpin();},r.prototype.isExternalClick=function(t){t.target===this.popover||this.popover.contains(t.target)||t.target===this.target||this.target.contains(t.target)||this.unpin();},r.prototype.createPopover=function(t){var e=document.createElement("div");return e.className="poppy",e.role="dialog",e.setAttribute("aria-label","Share Dialog"),e.setAttribute("aria-hidden","true"),"string"==typeof t?e.innerHTML=t:e.appendChild(t),e};

  const selectors$f = {
    tooltip: 'data-tooltip',
  };

  const classes$6 = {
    tooltipDefault: 'poppy__tooltip',
  };

  let sections$8 = {};

  class Tooltip {
    constructor(el, options = {}) {
      this.tooltip = el;
      if (!this.tooltip.hasAttribute(selectors$f.tooltip)) return;
      this.label = this.tooltip.getAttribute(selectors$f.tooltip);
      this.pop = null;
      this.class = options.class || classes$6.tooltipDefault;
      this.transitionSpeed = options.transitionSpeed || 200;
      this.tooltipPosition = options.position || 'bottom';
      this.mouseEnterEvent = null;
      this.removePinEvent = () => this.removePin();
      this.init();
    }

    init() {
      this.pop = new r({
        target: this.tooltip,
        popover: `
      <div class="${this.class}__wrapper">
      <div class="${this.class}">
      ${this.label}
      </div>
      </div>
      `,
        position: this.tooltipPosition,
        transitionSpeed: this.transitionSpeed,
      });

      this.mouseEnterEvent = debounce(this.pop.pin, 200);
      this.tooltip.addEventListener('mouseenter', this.mouseEnterEvent);
      this.tooltip.addEventListener('mouseleave', this.removePinEvent);
      document.addEventListener('poppy:close', this.removePinEvent);
      document.addEventListener('theme:scroll', this.removePinEvent);
    }

    removePin() {
      if (this.pop && this.pop.state.pinned) {
        this.pop.unpin();
      }
    }

    unload() {
      if (!this.pop) return;
      this.tooltip.removeEventListener('mouseenter', this.mouseEnterEvent);
      this.tooltip.removeEventListener('mouseleave', this.removePinEvent);
      document.removeEventListener('poppy:close', this.removePinEvent);
      document.removeEventListener('theme:scroll', this.removePinEvent);
    }
  }

  const tooltipSection = {
    onLoad() {
      sections$8[this.id] = [];
      const els = this.container.querySelectorAll(`[${selectors$f.tooltip}]`);
      els.forEach((el) => {
        sections$8[this.id].push(new Tooltip(el));
      });
    },
    onUnload: function () {
      sections$8[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$g = {
    elements: {
      scrollbar: 'data-scrollbar-slider',
      scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
      scrollbarArrowNext: '[data-scrollbar-arrow-next]',
    },
    classes: {
      hide: 'is-hidden',
    },
    times: {
      delay: 200,
    },
  };

  class NativeScrollbar {
    constructor(scrollbar) {
      this.scrollbar = scrollbar;

      this.arrowNext = this.scrollbar.parentNode.querySelector(selectors$g.elements.scrollbarArrowNext);
      this.arrowPrev = this.scrollbar.parentNode.querySelector(selectors$g.elements.scrollbarArrowPrev);

      this.init();
      this.resize();

      if (this.scrollbar.hasAttribute(selectors$g.elements.scrollbar)) {
        this.scrollToVisibleElement();
      }
    }

    init() {
      if (this.arrowNext && this.arrowPrev) {
        this.toggleNextArrow();

        this.events();
      }
    }

    resize() {
      document.addEventListener('theme:resize', () => {
        this.toggleNextArrow();
      });
    }

    events() {
      this.arrowNext.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToNext();
      });

      this.arrowPrev.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToPrev();
      });

      this.scrollbar.addEventListener('scroll', () => {
        this.togglePrevArrow();
        this.toggleNextArrow();
      });
    }

    goToNext() {
      const position = this.scrollbar.getBoundingClientRect().width / 2 + this.scrollbar.scrollLeft;

      this.move(position);

      this.arrowPrev.classList.remove(selectors$g.classes.hide);

      this.toggleNextArrow();
    }

    goToPrev() {
      const position = this.scrollbar.scrollLeft - this.scrollbar.getBoundingClientRect().width / 2;

      this.move(position);

      this.arrowNext.classList.remove(selectors$g.classes.hide);

      this.togglePrevArrow();
    }

    toggleNextArrow() {
      setTimeout(() => {
        this.arrowNext.classList.toggle(selectors$g.classes.hide, Math.round(this.scrollbar.scrollLeft + this.scrollbar.getBoundingClientRect().width + 1) >= this.scrollbar.scrollWidth);
      }, selectors$g.times.delay);
    }

    togglePrevArrow() {
      setTimeout(() => {
        this.arrowPrev.classList.toggle(selectors$g.classes.hide, this.scrollbar.scrollLeft <= 0);
      }, selectors$g.times.delay);
    }

    scrollToVisibleElement() {
      [].forEach.call(this.scrollbar.children, (element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault();

          this.move(element.offsetLeft - element.clientWidth);
        });
      });
    }

    move(offsetLeft) {
      this.scrollbar.scrollTo({
        top: 0,
        left: offsetLeft,
        behavior: 'smooth',
      });
    }
  }

  const defaults = {
    color: 'ash',
  };

  const selectors$h = {
    formGridSwatch: '[data-grid-swatch-form]',
    swatch: 'data-swatch',
    outerGrid: '[data-product-grid-item]',
    slide: '[data-grid-slide]',
    image: 'data-swatch-image',
    variant: 'data-swatch-variant',
    button: '[data-swatch-button]',
    link: '[data-grid-link]',
    wrapper: '[data-grid-swatches]',
    template: '[data-swatch-template]',
    handle: 'data-swatch-handle',
    label: 'data-swatch-label',
    tooltip: 'data-tooltip',
    swatchCount: 'data-swatch-count',
    scrollbar: 'data-scrollbar',
  };

  const classes$7 = {
    visible: 'is-visible',
    stopEvents: 'no-events',
  };

  class ColorMatch {
    constructor(options = {}) {
      this.settings = {
        ...defaults,
        ...options,
      };

      this.match = this.init();
    }

    getColor() {
      return this.match;
    }

    init() {
      const getColors = loadScript({json: window.theme.assets.swatches});
      return getColors
        .then((colors) => {
          return this.matchColors(colors, this.settings.color);
        })
        .catch((e) => {
          console.log('failed to load swatch colors script');
          console.log(e);
        });
    }

    matchColors(colors, name) {
      let bg = '#E5E5E5';
      let img = null;
      const path = window.theme.assets.base || '/';
      const comparisonName = name.toLowerCase().replace(/\s/g, '');
      const array = colors.colors;

      if (array) {
        let indexArray = null;

        const hexColorArr = array.filter((colorObj, index) => {
          const neatName = Object.keys(colorObj).toString().toLowerCase().replace(/\s/g, '');

          if (neatName === comparisonName) {
            indexArray = index;

            return colorObj;
          }
        });

        if (hexColorArr.length && indexArray !== null) {
          const value = Object.values(array[indexArray])[0];
          bg = value;

          if (value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.includes('.svg')) {
            img = `${path}${value}`;
            bg = '#888888';
          }
        }
      }

      return {
        color: this.settings.color,
        path: img,
        hex: bg,
      };
    }
  }

  class Swatch {
    constructor(element) {
      this.element = element;
      this.colorString = element.getAttribute(selectors$h.swatch);
      this.image = element.getAttribute(selectors$h.image);
      this.variant = element.getAttribute(selectors$h.variant);
      const matcher = new ColorMatch({color: this.colorString});
      matcher.getColor().then((result) => {
        this.colorMatch = result;
        this.init();
      });
    }

    init() {
      this.setStyles();
      if (this.variant) {
        this.handleEvents();
      }
    }

    setStyles() {
      if (this.colorMatch.hex) {
        this.element.style.setProperty('--swatch', `${this.colorMatch.hex}`);
      }
      if (this.colorMatch.path) {
        this.element.style.setProperty('background-image', `url(${this.colorMatch.path})`);
        this.element.style.setProperty('background-size', 'cover');
        this.element.style.setProperty('background-position', 'center center');
      }
    }

    handleEvents() {
      this.outer = this.element.closest(selectors$h.outerGrid);
      if (this.outer) {
        this.slide = this.outer.querySelector(selectors$h.slide);

        this.linkElement = this.outer.querySelector(selectors$h.link);
        this.linkElementAll = this.outer.querySelectorAll(selectors$h.link);
        this.linkDestination = getUrlWithVariant(this.linkElement.getAttribute('href'), this.variant);
        this.button = this.element.closest(selectors$h.button);

        if (this.button.closest(selectors$h.formGridSwatch)) {
          this.button.addEventListener(
            'mouseenter',
            function () {
              this.changeImage();
            }.bind(this)
          );
        }

        if (!this.button.closest(selectors$h.formGridSwatch)) {
          this.button.addEventListener(
            'click',
            function () {
              this.changeImage();
            }.bind(this)
          );
        }
      }
    }

    changeImage() {
      this.linkElementAll.forEach((link) => {
        link.setAttribute('href', this.linkDestination);
      });

      this.slide.setAttribute('src', this.linkDestination);
      if (this.image) {
        // container width rounded to the nearest 180 pixels
        // increses likelihood that the image will be cached
        let widthRounded = Math.ceil(this.slide.offsetWidth / 180) * 180;
        let sizedImage = themeImages.getSizedImageUrl(this.image, `${widthRounded}x`);
        window
          .fetch(sizedImage)
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            var objectURL = URL.createObjectURL(blob);
            this.slide.style.setProperty('background-color', '#fff');
            this.slide.style.setProperty('background-image', `url("${objectURL}")`);
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          });
      }
    }
  }

  class GridSwatch {
    constructor(wrap, container) {
      this.counterSwatches = wrap.parentNode.previousElementSibling;
      this.template = document.querySelector(selectors$h.template).innerHTML;
      this.wrap = wrap;
      this.container = container;
      this.handle = wrap.getAttribute(selectors$h.handle);
      const label = wrap.getAttribute(selectors$h.label).trim().toLowerCase();
      fetchProduct(this.handle).then((product) => {
        this.product = product;
        this.colorOption = product.options.find(function (element) {
          return element.name.toLowerCase() === label || null;
        });

        if (this.colorOption) {
          this.swatches = this.colorOption.values;
          this.init();
        }
      });
    }

    init() {
      this.wrap.innerHTML = '';
      this.count = 0;

      this.swatches.forEach((swatch) => {
        let variant = this.product.variants.find((variant) => {
          return variant.options.includes(swatch);
        });

        if (variant) {
          this.count++;
          const image = variant.featured_media ? variant.featured_media.preview_image.src : '';

          this.wrap.innerHTML += Sqrl.render(this.template, {
            color: swatch,
            uniq: `${this.product.id}-${variant.id}`,
            variant: variant.id,
            available: variant.available,
            image,
          });
        }
      });

      this.swatchElements = this.wrap.querySelectorAll(`[${selectors$h.swatch}]`);

      if (this.counterSwatches.hasAttribute(selectors$h.swatchCount)) {
        this.counterSwatches.innerText = `${this.count} ${this.count > 1 ? theme.strings.otherColor : theme.strings.oneColor}`;

        this.counterSwatches.addEventListener('mouseenter', () => {
          this.wrap.closest(selectors$h.link).classList.add(classes$7.stopEvents);
          this.counterSwatches.nextElementSibling.classList.add(classes$7.visible);
        });

        this.counterSwatches.closest(selectors$h.outerGrid).addEventListener('mouseleave', () => {
          this.wrap.closest(selectors$h.link).classList.remove(classes$7.stopEvents);
          this.counterSwatches.nextElementSibling.classList.remove(classes$7.visible);
        });
      }

      if (this.wrap.hasAttribute(selectors$h.scrollbar)) {
        new NativeScrollbar(this.wrap);
      }

      this.swatchElements.forEach((el) => {
        new Swatch(el);
        const tooltipEl = el.closest(`[${selectors$h.tooltip}]`);

        if (tooltipEl) {
          new Tooltip(tooltipEl);
        }
      });
    }
  }

  const makeGridSwatches = (section) => {
    const gridSwatchWrappers = section.container.querySelectorAll(selectors$h.wrapper);
    gridSwatchWrappers.forEach((wrap) => {
      new GridSwatch(wrap, undefined);
    });
  };

  const swatchSection = {
    onLoad() {
      this.swatches = [];
      const els = this.container.querySelectorAll(`[${selectors$h.swatch}]`);
      els.forEach((el) => {
        this.swatches.push(new Swatch(el));
      });
    },
  };

  const swatchGridSection = {
    onLoad() {
      makeGridSwatches(this);
    },
  };

  const selectors$i = {
    elements: {
      html: 'html',
      body: 'body',
      productGrid: 'data-product-grid-item',
      formQuickAdd: '[data-form-quick-add]',
      quickAddLabel: 'data-quick-add-label',
      quickCollectionHande: 'data-collection-handle',
      selectOption: '[data-select-option]:not([data-quick-add-button])',
      holderFormQuickAdd: '[data-quick-add-holder]',
      goToNextElement: 'data-go-to-next',
      quickAddElement: 'data-quick-add-button',
      productJson: '[data-product-json]',
      productOptionsJson: '[data-product-options-json]',
      quickAddFormHolder: '[data-quick-add-form-holder]',
      featuredImageHolder: '[data-grid-slide]',
      productImagesHolder: '[data-product-image]',
      productInformationHolder: '[data-product-information]',
      scrollbarHolder: '[data-scrollbar]',
      scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
      scrollbarArrowNext: '[data-scrollbar-arrow-next]',
      radioOption: '[data-radio-option]',
      popoutWrapper: '[data-popout]',
      popupList: '[data-popout-list]',
      popupoutOption: '[data-popout-option]',
      popupoutOptionValue: 'data-value',
      popupoutToggle: '[data-popout-toggle]',
      selectPosition: 'data-select-position',
      swatch: 'data-swatch',
      backButton: '[data-back-button]',
      messageError: '[data-message-error]',
      idInput: '[name="id"]',
      buttonQuickAddMobile: '[data-button-quick-add-mobile]',
      ariaExpanded: 'aria-expanded',
      input: 'input',
    },
    classes: {
      active: 'is-active',
      select: 'is-selected',
      disable: 'is-disable',
      hide: 'is-hidden',
      added: 'is-added',
      loading: 'is-loading',
      visible: 'is-visible',
      error: 'has-error',
      focus: 'is-focused',
      popupoutVisible: 'popout-list--visible',
    },
    times: {
      debounce: 500,
      delay: 400,
      delaySmall: 200,
      delayMedium: 2000,
      delayLarge: 5000,
    },
    imageSize: '800x800',
  };

  const instances$1 = [];

  class QuickAddProduct {
    constructor(el) {
      this.cart = window.cart;
      this.a11y = a11y;
      this.themeAccessibility = window.accessibility;

      this.document = document;
      this.html = this.document.querySelector(selectors$i.elements.html);
      this.body = this.document.querySelector(selectors$i.elements.body);

      this.productGrid = el;
      this.holder = this.productGrid.querySelector(selectors$i.elements.holderFormQuickAdd);
      this.quickAddLabel = this.productGrid.querySelector(`[${selectors$i.elements.quickAddLabel}]`);
      this.quickAddFormHolder = this.productGrid.querySelector(selectors$i.elements.quickAddFormHolder);
      this.featuredImageHolder = this.productGrid.querySelector(selectors$i.elements.featuredImageHolder);
      this.productInformationHolder = this.productGrid.querySelector(selectors$i.elements.productInformationHolder);
      this.buttonQuickAddMobile = this.productGrid.querySelector(selectors$i.elements.buttonQuickAddMobile);

      this.productJSON = null;
      this.productOptionsJSON = null;
      this.productForm = null;

      this.selectedOptions = [];
      this.filteredOptions = [];

      this.enableMobileMode = false;
      this.accessibilityStopEvent = false;
      this.quickAddFormIsLoaded = false;

      if (theme.enableQuickAdd) {
        this.accessibility();
        this.show();
        this.hide();
        this.errorHandle();
      }
    }

    /**
     * Init native scrollbar for product options
     */
    initNativeScrollbar() {
      if (this.scrollbarHolder.length) {
        this.scrollbarHolder.forEach((scrollbar) => {
          new NativeScrollbar(scrollbar);
        });
      }
    }

    /**
     * Handle AJAX product grid item form
     */
    getForm() {
      if (this.quickAddFormIsLoaded) {
        return;
      }

      this.quickAddFormIsLoaded = true;
      const root = theme.routes.root === '/' ? '' : theme.routes.root;

      fetch(root + '/products/' + this.quickAddLabel.getAttribute(selectors$i.elements.quickAddLabel) + '?view=ajax_quickview')
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          this.quickAddFormHolder.innerHTML = data.replaceAll('||collection-index||', this.quickAddLabel.getAttribute(selectors$i.elements.quickCollectionHande));
          this.loadForm();
        })
        .catch((e) => {
          console.warn(e);
        });
    }

    /**
     * Load form and cache elements
     */
    loadForm() {
      this.form = this.quickAddFormHolder.querySelector(selectors$i.elements.formQuickAdd);
      this.selectOption = this.quickAddFormHolder.querySelectorAll(selectors$i.elements.selectOption);
      this.productElemJSON = this.quickAddFormHolder.querySelector(selectors$i.elements.productJson);
      this.productOptionsElemJSON = this.quickAddFormHolder.querySelector(selectors$i.elements.productOptionsJson);
      this.scrollbarHolder = this.quickAddFormHolder.querySelectorAll(selectors$i.elements.scrollbarHolder);
      this.popoutWrapper = this.quickAddFormHolder.querySelectorAll(selectors$i.elements.popoutWrapper);
      this.swatches = this.quickAddFormHolder.querySelectorAll(`[${selectors$i.elements.swatch}]`);
      this.backButtons = this.quickAddFormHolder.querySelectorAll(selectors$i.elements.backButton);

      // Init Swatches
      if (this.swatches.length) {
        this.swatches.forEach((swatch) => {
          new Swatch(swatch);
        });

        this.changeVariantImageOnHover();
      }

      // Init Popout
      if (this.popoutWrapper.length) {
        this.popoutWrapper.forEach((wrapper) => {
          new Popout(wrapper);
        });
      }

      // Init native scrollbar
      this.initNativeScrollbar();

      // Init back buttons to return one step
      this.initGoToBack();

      const hasProductJSON = this.productElemJSON && this.productElemJSON.innerHTML !== '';
      const hasProductOptionsJSON = this.productOptionsElemJSON && this.productOptionsElemJSON.innerHTML !== '';

      if (hasProductJSON && hasProductOptionsJSON) {
        this.productJSON = JSON.parse(this.productElemJSON.innerHTML);
        this.productOptionsJSON = JSON.parse(this.productOptionsElemJSON.innerHTML);

        this.initForm();
      } else {
        console.error('Missing product JSON or product options with values JSON');
      }
    }

    /**
     * Init product form
     */
    initForm() {
      this.filterFirstOptionValues();

      this.productForm = new ProductForm(this.form, this.productJSON, {
        onOptionChange: this.onOptionChange.bind(this),
      });

      if (this.enableMobileMode) {
        this.addFirstVariantIsDefault(this.buttonQuickAddMobile.hasAttribute(selectors$i.elements.quickAddElement));

        this.buttonQuickAddMobile.classList.add(selectors$i.classes.hide);
        this.buttonQuickAddMobile.classList.remove(selectors$i.classes.loading);

        this.quickAddLabel.classList.add(selectors$i.classes.hide);

        this.toggleClasses();
      } else {
        this.quickAddLabel.classList.remove(selectors$i.classes.disable, selectors$i.classes.hide);
      }
    }

    /**
     * Init one step go to back
     */
    onOptionChange(event) {
      const targetElement = event.target;
      const optionHolder = targetElement.closest(selectors$i.elements.selectOption);
      const position = Number(optionHolder.getAttribute(selectors$i.elements.selectPosition));
      const firstOptionValue = event.dataset.variant ? event.dataset.variant.options[position - 1] : event.dataset.options[position - 1];
      const focusedIsEnable = this.body.classList.contains(selectors$i.classes.focus);

      this.changeVariantImage(event.dataset.variant);

      // Stop change when focus is enabled
      if (focusedIsEnable && this.accessibilityStopEvent) {
        return;
      }

      this.selectedOptions.push(event.target.value);

      optionHolder.classList.add(selectors$i.classes.select);

      this.filterAvailableOptions(firstOptionValue, position);

      if (targetElement.hasAttribute(selectors$i.elements.goToNextElement)) {
        optionHolder.classList.remove(selectors$i.classes.active);
        optionHolder.nextElementSibling.classList.add(selectors$i.classes.active);
      }

      if (targetElement.hasAttribute(selectors$i.elements.quickAddElement) && event.dataset.variant.available) {
        if (theme.cartDrawerEnabled) {
          this.quickAddLabel.classList.remove(selectors$i.classes.hide);
          this.quickAddLabel.classList.add(selectors$i.classes.loading);
        }

        this.html.dispatchEvent(
          new CustomEvent('cart:add-to-cart', {
            bubbles: true,
            detail: {
              element: this.holder,
              label: this.quickAddLabel,
              data: {
                id: event.dataset.variant.id,
                quantity: 1,
              },
            },
          })
        );

        setTimeout(() => {
          this.selectedOptions = [];
          this.resetInputsOfInstance();
        }, selectors$i.times.delayMedium);

        optionHolder.classList.remove(selectors$i.classes.active);
      }

      if (focusedIsEnable && targetElement.hasAttribute(selectors$i.elements.goToNextElement)) {
        this.accessibilityTrapFocus(optionHolder.nextElementSibling);
      }

      this.accessibilityStopEvent = false;
    }

    /**
     * Init one-step go to back
     */
    initGoToBack() {
      if (this.backButtons.length) {
        this.backButtons.forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();

            const isFocused = this.body.classList.contains(selectors$i.classes.focus);

            // Remove last added option value
            this.selectedOptions.pop();

            const optionHolder = button.closest(selectors$i.elements.selectOption);

            let previousHolder = optionHolder.previousElementSibling.matches(selectors$i.elements.selectOption) ? optionHolder.previousElementSibling : this.quickAddLabel;

            if (previousHolder === this.quickAddLabel && isFocused) {
              this.themeAccessibility.lastFocused = this.quickAddLabel;
            }

            if (previousHolder === this.quickAddLabel && this.enableMobileMode) {
              previousHolder = this.buttonQuickAddMobile;
            }

            // Return inputs and selects to primary states
            if (previousHolder !== this.quickAddLabel) {
              if (isFocused) {
                this.accessibilityTrapFocus(previousHolder);
              }

              const inputs = optionHolder.querySelectorAll(selectors$i.elements.input);
              const selects = optionHolder.querySelectorAll(selectors$i.elements.popupoutOption);

              const previousInputs = previousHolder.querySelectorAll(selectors$i.elements.input);
              const previousSelects = previousHolder.querySelectorAll(selectors$i.elements.popupoutOption);

              if (inputs) {
                inputs.forEach((input) => {
                  input.checked = false;
                });
              }

              if (selects) {
                selects.forEach((option) => {
                  option.classList.remove(selectors$i.classes.visible);
                });
              }

              if (previousInputs) {
                previousInputs.forEach((input) => {
                  input.checked = false;
                });
              }

              if (previousSelects) {
                previousSelects.forEach((option) => {
                  option.classList.remove(selectors$i.classes.visible);
                });
              }
            }

            if (previousHolder !== this.buttonQuickAddMobile) {
              if (isFocused) {
                this.accessibilityTrapFocus(previousHolder);
              }

              previousHolder.classList.add(selectors$i.classes.active, selectors$i.classes.select);
            }

            if (previousHolder === this.buttonQuickAddMobile) {
              this.holder.classList.remove(selectors$i.classes.visible);
            }

            previousHolder.classList.remove(selectors$i.classes.hide);

            optionHolder.classList.remove(selectors$i.classes.active, selectors$i.classes.select);

            if (isFocused) {
              previousHolder.focus();
            }
          });
        });
      }
    }

    /**
     * Toggle classes
     */
    toggleClasses() {
      this.holder.classList.add(selectors$i.classes.visible);

      if (this.selectOption && this.selectOption.length && this.quickAddFormHolder.innerHTML !== '') {
        this.quickAddLabel.classList.add(selectors$i.classes.hide);

        const options = Array.from(this.selectOption);
        const hasActiveOption = options.filter((option) => {
          return option.classList.contains(selectors$i.classes.active);
        });

        if (hasActiveOption.length === 0) {
          this.selectOption[0].classList.add(selectors$i.classes.active);

          if (this.body.classList.contains(selectors$i.classes.focus) && this.accessibilityStopEvent) {
            setTimeout(() => {
              this.accessibilityTrapFocus(this.selectOption[0]);
            }, selectors$i.times.delaySmall);
          }
        }
      }
    }

    /**
     * Add first variant if it is the default variant
     *
     * @param { Boolean } targetHasQuickAddAttribute
     */
    addFirstVariantIsDefault(targetHasQuickAddAttribute) {
      const firstVariant = this.productJSON.variants[0];

      if (targetHasQuickAddAttribute && firstVariant.available) {
        this.html.dispatchEvent(
          new CustomEvent('cart:add-to-cart', {
            bubbles: true,
            detail: {
              element: this.holder,
              label: this.quickAddLabel,
              data: {
                id: firstVariant.id,
                quantity: 1,
              },
            },
          })
        );
      }
    }

    /**
     * Show quick add
     */
    show() {
      // Button quick view (touch devices)
      if (this.buttonQuickAddMobile) {
        this.buttonQuickAddMobile.addEventListener('click', () => {
          this.enableMobileMode = true;

          this.buttonQuickAddMobile.classList.add(selectors$i.classes.loading);

          if (this.quickAddFormHolder.innerHTML === '' && !this.quickAddFormIsLoaded) {
            this.getForm();
          } else {
            this.toggleClasses();

            this.buttonQuickAddMobile.classList.remove(selectors$i.classes.loading);
            this.buttonQuickAddMobile.classList.add(selectors$i.classes.hide);
            this.holder.classList.add(selectors$i.classes.visible);
          }

          if (this.productJSON !== null) {
            this.addFirstVariantIsDefault(this.buttonQuickAddMobile.hasAttribute(selectors$i.elements.quickAddElement));
          }
        });
      }

      // Do AJAX when hover on product grid item
      if (this.productGrid) {
        this.productGrid.addEventListener('mouseenter', () => {
          this.enableMobileMode = false;

          this.hideOtherHolders();

          if (this.quickAddFormHolder && this.quickAddFormHolder.innerHTML === '' && !this.quickAddFormIsLoaded) {
            this.getForm();
          }
        });
      }

      if (this.quickAddLabel) {
        // Do AJAX when focus on quick add label
        this.quickAddLabel.addEventListener('focusin', () => {
          this.enableMobileMode = false;

          if (this.quickAddFormHolder.innerHTML === '' && !this.quickAddFormIsLoaded) {
            this.getForm();
          }
        });

        // Open the first product option values or
        // add product to the cart if it is enable
        this.quickAddLabel.addEventListener('click', () => {
          this.enableMobileMode = false;

          const stopEvent = this.quickAddLabel.classList.contains(selectors$i.classes.added) || this.quickAddLabel.classList.contains(selectors$i.classes.disable);

          if (stopEvent || this.productJSON === null) {
            return;
          }

          this.selectedOptions = [];

          this.addFirstVariantIsDefault(this.quickAddLabel.hasAttribute(selectors$i.elements.quickAddElement));

          if (this.quickAddFormHolder.innerHTML !== '') {
            this.toggleClasses();
          }
        });
      }

      this.productInformationHolder.addEventListener('mouseenter', () => {
        this.featuredImageHolder.closest(selectors$i.elements.productImagesHolder).classList.remove(selectors$i.classes.visible);
      });
    }

    /**
     * Hide quick add
     */
    hide() {
      if (this.quickAddLabel || this.buttonQuickAddMobile) {
        if (theme.cartDrawerEnabled) {
          this.document.addEventListener('theme:cart-close', () => {
            setTimeout(() => {
              this.resetButtonsOfInstance();
            }, selectors$i.times.delayLarge);
          });
        } else {
          setTimeout(() => {
            this.resetButtonsOfInstance();
          }, selectors$i.times.delayLarge);
        }
      }
    }

    accessibility() {
      this.productGrid.addEventListener('keyup', (event) => {
        if (event.keyCode === window.theme.keyboardKeys.TAB) {
          this.accessibilityStopEvent = true;
        }

        if (event.keyCode === window.theme.keyboardKeys.ENTER) {
          this.accessibilityStopEvent = false;
          const element = event.target.hasAttribute(selectors$i.elements.popupoutOptionValue) ? event.target.closest(selectors$i.elements.popupList).nextElementSibling : event.target;

          element.dispatchEvent(new Event('change'));
        }
      });
    }

    /**
     * Enable trap focus
     *
     * @param { DOM Element } container
     */
    accessibilityTrapFocus(container) {
      this.a11y.removeTrapFocus();
      this.a11y.trapFocus(container, {
        elementToFocus: container.querySelector(selectors$i.elements.backButton),
      });
    }

    /**
     * Filter available options based on variants
     *
     * @param { String } value
     * @param { Number } optionIndex
     * @param { Boolean } enableCheck
     */
    filterAvailableOptions(value, optionIndex, enableCheck = true) {
      const variants = this.productJSON.variants.filter((variant) => {
        if (variant.options.length > 1) {
          let available = [];

          this.selectedOptions.forEach((option, index) => {
            available.push(variant[`option${optionIndex}`] === value && variant.options[index] === option && variant.available);
          });

          if (!available.includes(false) && available.length > 0) {
            return variant;
          }
        } else {
          return variant[`option${optionIndex}`] === value && variant.available;
        }
      });

      this.productOptionsJSON.forEach((option) => {
        if (option.position !== optionIndex) {
          const filteredObject = {};
          filteredObject.name = option.name;
          filteredObject.position = option.position;
          filteredObject.values = [];

          option.values.forEach((value) => {
            const availableVariants = variants.filter((variant) => variant[`option${option.position}`] === value);

            if (availableVariants.length) {
              filteredObject.values.push(value);
            }
          });

          this.filteredOptions = [...this.filteredOptions, filteredObject];
        }
      });

      if (enableCheck) {
        this.disableUnavailableValues();
        this.filteredOptions = [];
      }
    }

    /**
     * Filter first option values based on the variants
     * on load or when the product is added
     */
    filterFirstOptionValues() {
      this.productOptionsJSON[0].values.forEach((value) => {
        const variants = this.productJSON.variants.filter((variant) => {
          return variant.option1 === value && variant.available;
        });

        if (variants.length === 0) {
          const currentInput = this.selectOption[0].querySelector(`input[value="${value}"]`);
          const currentOption = this.selectOption[0].querySelector(`[${selectors$i.elements.popupoutOptionValue}="${value}"]`);

          if (currentInput) {
            currentInput.checked = false;
            currentInput.disabled = true;
          }

          if (currentOption) {
            currentOption.classList.add(selectors$i.classes.disable);
            currentOption.setAttribute('tabindex', -1);
          }
        }
      });
    }

    /**
     * Disable/Enable option values
     */
    disableUnavailableValues() {
      if (this.selectOption) {
        this.selectOption.forEach((option) => {
          const inputs = option.querySelectorAll(selectors$i.elements.input);
          const selects = option.querySelectorAll(selectors$i.elements.popupoutOption);

          // Disable/Enable swatches and boxes
          inputs.forEach((input) => {
            if (!option.classList.contains(selectors$i.classes.select)) {
              input.checked = false;
              input.disabled = true;
            }

            this.filteredOptions.forEach((data) => {
              if (data.values.includes(input.value)) {
                input.disabled = false;
              }
            });
          });

          // Disable/Enable select options
          selects.forEach((item) => {
            if (!option.classList.contains(selectors$i.classes.select)) {
              item.setAttribute('tabindex', -1);
              item.classList.add(selectors$i.classes.disable);
            }

            this.filteredOptions.forEach((data) => {
              if (data.values.includes(item.getAttribute(`${selectors$i.elements.popupoutOptionValue}`))) {
                item.classList.remove(selectors$i.classes.disable);
                item.setAttribute('tabindex', 1);
              }
            });
          });
        });
      }
    }

    /**
     * Change variant image on hover
     */
    changeVariantImageOnHover() {
      this.swatches.forEach((swatch) => {
        swatch.addEventListener('mouseover', () => {
          for (let index = 0; index < this.productJSON.variants.length; index++) {
            const variant = this.productJSON.variants[index];

            if (variant.featured_media !== undefined && variant.options[this.selectedOptions.length] === swatch.getAttribute(selectors$i.elements.swatch)) {
              this.changeVariantImage(variant);
              break;
            }
          }
        });
      });
    }

    /**
     * Change image with a variant image if exists
     *
     * @param { Object } currentVariant
     */
    changeVariantImage(currentVariant) {
      const imageExists = currentVariant && currentVariant.featured_media && currentVariant.featured_media !== undefined;

      if (imageExists) {
        const currentImage = themeImages.getSizedImageUrl(currentVariant.featured_media.preview_image.src, selectors$i.imageSize);

        this.featuredImageHolder.style.setProperty('background-image', `url(${currentImage})`);
        this.featuredImageHolder.closest(selectors$i.elements.productImagesHolder).classList.add(selectors$i.classes.visible);
      }
    }

    /**
     *  Reset option values
     *
     * @param { DOM Element } option
     */
    resetOptions(option) {
      option.querySelectorAll(selectors$i.elements.input).forEach((input) => {
        input.checked = false;
        input.disabled = false;
      });

      option.querySelectorAll(selectors$i.elements.popupoutOption).forEach((option) => {
        option.classList.remove(selectors$i.classes.disable);
        option.setAttribute('tabindex', 1);
      });
    }

    /**
     * Hide other holders if they are visible
     */
    hideOtherHolders() {
      const otherHolderFormQuickAdd = this.document.querySelectorAll(selectors$i.elements.holderFormQuickAdd);

      if (otherHolderFormQuickAdd) {
        otherHolderFormQuickAdd.forEach((holder) => {
          if (holder !== this.holder) {
            holder.classList.remove(selectors$i.classes.visible);
            const selectToggleButton = holder.querySelector(selectors$i.elements.popupoutToggle);

            if (selectToggleButton) {
              selectToggleButton.setAttribute(selectors$i.elements.ariaExpanded, false);
              selectToggleButton.nextElementSibling.classList.remove(selectors$i.classes.popupoutVisible);
            }

            if (this.popoutWrapper) {
              holder.closest(`[${selectors$i.elements.productGrid}]`).querySelector(selectors$i.elements.productImagesHolder).classList.remove(selectors$i.classes.visible);
            }
          }
        });
      }
    }

    /**
     * Reset inputs of this instance
     */
    resetInputsOfInstance() {
      if (this.selectOption) {
        this.quickAddLabel.classList.remove(selectors$i.classes.hide);
        this.initNativeScrollbar();

        this.selectOption.forEach((option) => {
          option.classList.remove(selectors$i.classes.active, selectors$i.classes.select);
          const selectToggleButton = option.querySelector(selectors$i.elements.popupoutToggle);

          if (selectToggleButton) {
            selectToggleButton.innerText = theme.strings.selectValue;
            selectToggleButton.setAttribute(selectors$i.elements.ariaExpanded, false);
          }

          this.resetOptions(option);
        });

        this.filterFirstOptionValues();
        this.filteredOptions = [];
      }
    }

    /**
     * Reset buttons to default states
     */
    resetButtonsOfInstance() {
      this.quickAddLabel.classList.remove(selectors$i.classes.select, selectors$i.classes.added, selectors$i.classes.visible);

      this.buttonQuickAddMobile.classList.remove(selectors$i.classes.hide);
    }

    /**
     * Handle error cart response
     */
    errorHandle() {
      this.html.addEventListener('cart:add-to-error', (event) => {
        const holder = event.detail.holder;
        const errorMessageHolder = holder.querySelector(selectors$i.elements.messageError);

        holder.querySelector(`[${selectors$i.elements.quickAddLabel}]`).classList.remove(selectors$i.classes.visible, selectors$i.classes.added, selectors$i.classes.loading);

        holder.classList.add(selectors$i.classes.error);

        errorMessageHolder.innerText = event.detail.description;

        setTimeout(() => {
          holder.classList.remove(selectors$i.classes.error);
          holder.classList.add(selectors$i.classes.visible);
          holder.previousElementSibling.classList.remove(selectors$i.classes.hide);
        }, selectors$i.times.delayLarge);
      });
    }
  }

  const quickAddProduct = {
    onLoad() {
      this.container.querySelectorAll(`[${selectors$i.elements.productGrid}]`).forEach((item) => {
        instances$1.push(new QuickAddProduct(item));
      });
    },
  };

  var selectors$j = {
    sort: '[data-sort-enabled]',
    sortLinks: '[data-sort-link]',
    sortValue: 'data-value',
    collectionNavGrouped: '.collection-nav--grouped',
    collectionSidebarHeading: '.collection__sidebar__heading',
    linkAdd: '.link--add',
    linkRemove: '.link--remove',
  };

  class Collection {
    constructor(section) {
      this.container = section.container;
      this.sort = this.container.querySelector(selectors$j.sort);
      this.sortLinks = this.container.querySelectorAll(selectors$j.sortLinks);
      this.init();
    }

    init() {
      if (this.sort) {
        this.initClick();
      }
      this.removeUnusableFilters();
    }

    onClick(e) {
      const sort = e.currentTarget.getAttribute(selectors$j.sortValue);
      const url = new window.URL(window.location.href);
      const params = url.searchParams;
      params.set('sort_by', sort);
      url.search = params.toString();
      window.location.replace(url.toString());
    }

    initClick() {
      this.sortLinks.forEach((link) => {
        link.addEventListener(
          'click',
          function (e) {
            this.onClick(e);
          }.bind(this)
        );
      });
    }

    removeUnusableFilters() {
      const collectionNavGrouped = this.container.querySelectorAll(selectors$j.collectionNavGrouped);
      if (collectionNavGrouped.length > 0) {
        collectionNavGrouped.forEach((element) => {
          const linkAdd = element.querySelector(selectors$j.linkAdd);
          const linkRemove = element.querySelector(selectors$j.linkRemove);

          if (!linkAdd && !linkRemove) {
            hideElement(element);
            hideElement(element.parentElement.querySelector(selectors$j.collectionSidebarHeading));
          }
        });
      }
    }
  }

  const collectionSection = {
    onLoad() {
      this.collection = new Collection(this);
    },
  };

  register('collection', [parallaxHero, productGridReviews, quickAddProduct, collectionSection, popoutSection, swatchGridSection]);

  const selectors$k = {
    frame: '[data-ticker-frame]',
    scale: '[data-ticker-scale]',
    text: '[data-ticker-text]',
    clone: 'data-clone',
    animationClass: 'ticker--animated',
    unloadedClass: 'ticker--unloaded',
    comparitorClass: 'ticker__comparitor',
  };

  const sections$9 = {};

  class Ticker {
    constructor(el) {
      this.frame = el;
      this.scale = this.frame.querySelector(selectors$k.scale);
      this.text = this.frame.querySelector(selectors$k.text);

      this.comparitor = this.text.cloneNode(true);
      this.comparitor.classList.add(selectors$k.comparitorClass);
      this.frame.appendChild(this.comparitor);
      this.scale.classList.remove(selectors$k.unloadedClass);
      this.resizeEvent = () => this.checkWidth();
      this.listen();
    }

    unload() {
      document.removeEventListener('theme:resize', this.resizeEvent);
    }

    listen() {
      document.addEventListener('theme:resize', this.resizeEvent);
      this.checkWidth();
    }

    checkWidth() {
      if (this.frame.clientWidth < this.comparitor.clientWidth) {
        this.text.classList.add(selectors$k.animationClass);
        if (this.scale.childElementCount === 1) {
          this.clone = this.text.cloneNode(true);
          this.clone.setAttribute(selectors$k.clone, '');
          this.scale.appendChild(this.clone);
        }
      } else {
        let clone = this.scale.querySelector(`[${selectors$k.clone}]`);
        if (clone) {
          this.scale.removeChild(clone);
        }
        this.text.classList.remove(selectors$k.animationClass);
      }
    }
  }

  const ticker = {
    onLoad() {
      sections$9[this.id] = [];
      const el = this.container.querySelectorAll(selectors$k.frame);
      el.forEach((el) => {
        sections$9[this.id].push(new Ticker(el));
      });
    },
    onUnload() {
      sections$9[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  register('announcement', ticker);

  const selectors$l = {
    body: 'body',
    drawerWrappper: '[data-drawer]',
    drawerInner: '[data-drawer-inner]',
    underlay: '[data-drawer-underlay]',
    stagger: '[data-stagger-animation]',
    wrapper: '[data-header-transparent]',
    transparent: 'data-header-transparent',
    drawerToggle: 'data-drawer-toggle',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$8 = {
    isVisible: 'drawer--visible',
    isFocused: 'is-focused',
    headerStuck: 'js__header__stuck',
  };

  let sections$a = {};

  class Drawer {
    constructor(el) {
      this.drawer = el;
      this.drawerWrapper = this.drawer.closest(selectors$l.drawerWrappper);
      this.drawerInner = this.drawer.querySelector(selectors$l.drawerInner);
      this.underlay = this.drawer.querySelector(selectors$l.underlay);
      this.wrapper = this.drawer.closest(selectors$l.wrapper);
      this.primaryState = this.wrapper.getAttribute(selectors$l.transparent);
      this.key = this.drawer.dataset.drawer;
      const btnSelector = `[${selectors$l.drawerToggle}='${this.key}']`;
      this.buttons = document.querySelectorAll(btnSelector);
      this.staggers = this.drawer.querySelectorAll(selectors$l.stagger);
      this.body = document.querySelector(selectors$l.body);

      this.initWatchFocus = (evt) => this.watchFocus(evt);

      this.connectToggle();
      this.connectDrawer();
      this.closers();
      this.staggerChildAnimations();
    }

    connectToggle() {
      this.buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.drawer.dispatchEvent(
            new CustomEvent('theme:drawer:toggle', {
              bubbles: false,
            })
          );
        });
      });
    }

    connectDrawer() {
      this.drawer.addEventListener('theme:drawer:toggle', () => {
        if (this.drawer.classList.contains(classes$8.isVisible)) {
          this.drawer.dispatchEvent(
            new CustomEvent('theme:drawer:close', {
              bubbles: true,
            })
          );
        } else {
          this.drawer.dispatchEvent(
            new CustomEvent('theme:drawer:open', {
              bubbles: true,
            })
          );
        }
      });

      document.addEventListener('theme:drawer:close', this.hideDrawer.bind(this));
      document.addEventListener('theme:drawer:open', this.showDrawer.bind(this));
    }

    staggerChildAnimations() {
      this.staggers.forEach((el) => {
        const children = el.querySelectorAll(':scope > * > [data-animates]');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 50 + 10}ms`;
        });
      });
    }

    watchFocus(evt) {
      let drawerInFocus = this.wrapper.contains(evt.target);
      if (!drawerInFocus && this.body.classList.contains(classes$8.isFocused)) {
        this.hideDrawer();
      }
    }

    closers() {
      this.wrapper.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideDrawer();
          this.buttons[0].focus();
        }.bind(this)
      );

      this.underlay.addEventListener('click', () => {
        this.hideDrawer();
      });
    }

    showDrawer() {
      document.dispatchEvent(
        new CustomEvent('theme:drawer:close', {
          bubbles: false,
        })
      );

      this.buttons.forEach((el) => {
        el.setAttribute('aria-expanded', true);
        el.classList.add(classes$8.isVisible);
      });

      this.drawer.classList.add(classes$8.isVisible);
      this.drawer.querySelector(selectors$l.focusable).focus();
      this.wrapper.setAttribute(selectors$l.transparent, !this.primaryState);
      document.addEventListener('focusin', this.initWatchFocus);

      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: this.drawerInner}));
    }

    hideDrawer() {
      this.buttons.forEach((el) => {
        el.setAttribute('aria-expanded', true);
        el.classList.remove(classes$8.isVisible);
      });

      this.drawer.classList.remove(classes$8.isVisible);
      document.removeEventListener('focusin', this.initWatchFocus);

      if (this.wrapper.classList.contains(classes$8.headerStuck)) {
        this.wrapper.setAttribute(selectors$l.transparent, !this.primaryState);
      } else {
        this.wrapper.setAttribute(selectors$l.transparent, this.primaryState);
      }

      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      document.dispatchEvent(new CustomEvent('theme:sliderule:close', {bubbles: false}));
    }
  }

  const drawer = {
    onLoad() {
      sections$a[this.id] = [];
      const els = this.container.querySelectorAll(selectors$l.drawerWrappper);
      els.forEach((el) => {
        sections$a[this.id].push(new Drawer(el));
      });
    },
  };

  const selectors$m = {
    announcement: '[data-announcement-wrapper]',
    transparent: 'data-header-transparent',
    header: '[data-header-wrapper] header',
    headerIsNotFixed: '[data-header-sticky="static"]',
  };

  const classes$9 = {
    stuck: 'js__header__stuck',
    stuckAnimated: 'js__header__stuck--animated',
    triggerAnimation: 'js__header__stuck--trigger-animation',
    stuckBackdrop: 'js__header__stuck__backdrop',
    headerIsNotVisible: 'is-not-visible',
  };

  let sections$b = {};

  class Sticky {
    constructor(el) {
      this.wrapper = el;
      this.type = this.wrapper.dataset.headerSticky;
      this.transparent = this.wrapper.dataset.headerTransparent;
      this.sticks = this.type === 'sticky';
      this.static = this.type === 'static';
      this.win = window;
      this.animated = this.type === 'directional';
      this.currentlyStuck = false;
      this.cls = this.wrapper.classList;
      const announcementEl = document.querySelector(selectors$m.announcement);
      const announcementHeight = announcementEl ? announcementEl.clientHeight : 0;
      this.headerHeight = document.querySelector(selectors$m.header).clientHeight;
      this.blur = this.headerHeight + announcementHeight;
      this.stickDown = this.headerHeight + announcementHeight;
      this.stickUp = announcementHeight;
      this.scrollEventStatic = () => this.checkIsVisible();
      this.scrollEventListen = (e) => this.listenScroll(e);
      this.scrollEventUpListen = () => this.scrollUpDirectional();
      this.scrollEventDownListen = () => this.scrollDownDirectional();
      if (this.wrapper.getAttribute(selectors$m.transparent) !== 'false') {
        this.blur = announcementHeight;
      }
      if (this.sticks) {
        this.stickDown = announcementHeight;
        this.scrollDownInit();
      }

      if (this.static) {
        document.addEventListener('theme:scroll', this.scrollEventStatic);
      }

      this.listen();
    }

    unload() {
      if (this.sticks || this.animated) {
        document.removeEventListener('theme:scroll', this.scrollEventListen);
      }

      if (this.animated) {
        document.removeEventListener('theme:scroll:up', this.scrollEventUpListen);
        document.removeEventListener('theme:scroll:down', this.scrollEventDownListen);
      }

      if (this.static) {
        document.removeEventListener('theme:scroll', this.scrollEventStatic);
      }
    }

    listen() {
      if (this.sticks || this.animated) {
        document.addEventListener('theme:scroll', this.scrollEventListen);
      }

      if (this.animated) {
        document.addEventListener('theme:scroll:up', this.scrollEventUpListen);
        document.addEventListener('theme:scroll:down', this.scrollEventDownListen);
      }
    }

    listenScroll(e) {
      if (e.detail.down) {
        if (!this.currentlyStuck && e.detail.position > this.stickDown) {
          this.stickSimple();
        }
        if (!this.currentlyBlurred && e.detail.position > this.blur) {
          this.addBlur();
        }
      } else {
        if (e.detail.position <= this.stickUp) {
          this.unstickSimple();
        }
        if (e.detail.position <= this.blur) {
          this.removeBlur();
        }
      }
    }

    stickSimple() {
      if (this.animated) {
        this.cls.add(classes$9.stuckAnimated);
      }
      this.cls.add(classes$9.stuck);
      this.wrapper.setAttribute(selectors$m.transparent, false);
      this.currentlyStuck = true;
    }

    unstickSimple() {
      if (!document.documentElement.hasAttribute('data-scroll-locked')) {
        // check for scroll lock
        this.cls.remove(classes$9.stuck);
        this.wrapper.setAttribute(selectors$m.transparent, this.transparent);
        if (this.animated) {
          this.cls.remove(classes$9.stuckAnimated);
        }
        this.currentlyStuck = false;
      }
    }

    scrollDownInit() {
      if (window.scrollY > this.stickDown) {
        this.stickSimple();
      }
      if (window.scrollY > this.blur) {
        this.addBlur();
      }
    }

    stickDirectional() {
      this.cls.add(classes$9.triggerAnimation);
    }

    unstickDirectional() {
      this.cls.remove(classes$9.triggerAnimation);
    }

    scrollDownDirectional() {
      this.unstickDirectional();
    }

    scrollUpDirectional() {
      if (window.scrollY <= this.stickDown) {
        this.unstickDirectional();
      } else {
        this.stickDirectional();
      }
    }

    addBlur() {
      this.cls.add(classes$9.stuckBackdrop);
      this.currentlyBlurred = true;
    }

    removeBlur() {
      this.cls.remove(classes$9.stuckBackdrop);
      this.currentlyBlurred = false;
    }

    checkIsVisible() {
      const header = document.querySelector(selectors$m.headerIsNotFixed);
      const currentScroll = this.win.pageYOffset;

      if (header) {
        header.classList.toggle(classes$9.headerIsNotVisible, currentScroll >= this.headerHeight);
      }
    }
  }

  const stickyHeader = {
    onLoad() {
      sections$b = new Sticky(this.container);
    },
    onUnload: function () {
      if (typeof sections$b.unload === 'function') {
        sections$b.unload();
      }
    },
  };

  const selectors$n = {
    disclosureToggle: 'data-hover-disclosure-toggle',
    disclosureWrappper: '[data-hover-disclosure]',
    link: '[data-top-link]',
    meganavVisible: 'meganav--visible',
    wrapper: '[data-header-wrapper]',
    stagger: '[data-stagger]',
    staggerPair: '[data-stagger-first]',
    staggerAfter: '[data-stagger-second]',
    staggerImage: '[data-grid-item], [data-header-image]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$a = {
    isVisible: 'is-visible',
  };

  let sections$c = {};
  let disclosures = {};

  class HoverDisclosure {
    
    constructor(el) {
      this.disclosure = el;
      this.wrapper = el.closest(selectors$n.wrapper);
      this.key = this.disclosure.id;
      const btnSelector = `[${selectors$n.disclosureToggle}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.link = this.trigger.querySelector(selectors$n.link);
      this.grandparent = this.trigger.classList.contains('grandparent');

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.connectHoverToggle();
      this.handleTablets();
      this.staggerChildAnimations();
    }

    onBlockSelect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.showDisclosure();
      }
    }

    onBlockDeselect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.hideDisclosure();
      }
    }

    showDisclosure() {
      if (this.grandparent) {
        this.wrapper.classList.add(selectors$n.meganavVisible);
      } else {
        this.wrapper.classList.remove(selectors$n.meganavVisible);
      }
      this.trigger.setAttribute('aria-expanded', true);
      this.trigger.classList.add(classes$a.isVisible);
      this.disclosure.classList.add(classes$a.isVisible);
    }

    hideDisclosure() {
      this.disclosure.classList.remove(classes$a.isVisible);
      this.trigger.classList.remove(classes$a.isVisible);
      this.trigger.setAttribute('aria-expanded', false);
      this.wrapper.classList.remove(selectors$n.meganavVisible);
    }

    staggerChildAnimations() {
      const simple = this.disclosure.querySelectorAll(selectors$n.stagger);
      simple.forEach((el, index) => {
        el.style.transitionDelay = `${index * 50 + 10}ms`;
      });

      const pairs = this.disclosure.querySelectorAll(selectors$n.staggerPair);
      pairs.forEach((child, i) => {
        const d1 = i * 150;
        child.style.transitionDelay = `${d1}ms`;
        child.parentElement.querySelectorAll(selectors$n.staggerAfter).forEach((grandchild, i2) => {
          const di1 = i2 + 1;
          const d2 = di1 * 20;
          grandchild.style.transitionDelay = `${d1 + d2}ms`;
        });
      });

      const images = this.disclosure.querySelectorAll(selectors$n.staggerImage);
      images.forEach((el, index) => {
        el.style.transitionDelay = `${(index + 1) * 80}ms`;
      });
    }

    handleTablets() {
      // first click opens the popup, second click opens the link
      this.trigger.addEventListener(
        'touchstart',
        function (e) {
          const isOpen = this.disclosure.classList.contains(classes$a.isVisible);
          if (!isOpen) {
            e.preventDefault();
            this.showDisclosure();
          }
        }.bind(this),
        {passive: true}
      );
    }

    connectHoverToggle() {
      this.trigger.addEventListener('mouseenter', debounce(this.showDisclosure.bind(this), 100));
      this.link.addEventListener('focus', debounce(this.showDisclosure.bind(this), 100));

      this.trigger.addEventListener('mouseleave', debounce(this.hideDisclosure.bind(this), 100));
      this.trigger.addEventListener(
        'focusout',
        debounce(
          function (e) {
            const inMenu = this.trigger.contains(e.relatedTarget);
            if (!inMenu) {
              this.hideDisclosure();
            }
          }.bind(this)
        ),
        100
      );
      this.disclosure.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideDisclosure();
        }.bind(this)
      );
    }
  }

  const hoverDisclosure = {
    onLoad() {
      sections$c[this.id] = [];
      disclosures = this.container.querySelectorAll(selectors$n.disclosureWrappper);
      disclosures.forEach((el) => {
        sections$c[this.id].push(new HoverDisclosure(el));
      });
    },
    onBlockSelect(evt) {
      sections$c[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$c[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  const selectors$o = {
    count: 'data-cart-count',
  };

  class Totals {
    constructor(el) {
      this.section = el;
      this.counts = this.section.querySelectorAll(`[${selectors$o.count}]`);
      this.cart = null;
      this.listen();
    }

    listen() {
      document.addEventListener(
        'theme:cart:change',
        function (event) {
          this.cart = event.detail.cart;
          this.update();
        }.bind(this)
      );
    }

    update() {
      if (this.cart) {
        this.counts.forEach((count) => {
          count.setAttribute(selectors$o.count, this.cart.item_count);
          count.innerHTML = `${this.cart.item_count}`;
        });
      }
    }
  }
  const headerTotals = {
    onLoad() {
      new Totals(this.container);
    },
  };

  const selectors$p = {
    saleClass: 'sale',
    soldClass: 'sold-out',
    doubleImage: 'double__image',
  };

  function formatPrices(product) {
    // Apprend classes for on sale and sold out
    const on_sale = product.price <= product.compare_at_price_min;
    let classes = on_sale ? selectors$p.saleClass : '';
    classes += product.available ? '' : selectors$p.soldClass;
    // Add 'from' before min price if price varies
    product.price = themeCurrency.formatMoney(product.price, theme.moneyFormat);
    product.price_with_from = product.price;
    if (product.price_varies) {
      let min = themeCurrency.formatMoney(product.price_min, theme.moneyFormat);
      product.price_with_from = `<small>${window.theme.strings.from}</small> ${min}`;
    }

    // add a class if there's more than one media
    let double_class = '';
    if (product.media !== undefined) {
      if (product.media.length > 1) {
        double_class += selectors$p.doubleImage;
      }
    }

    const formatted = {
      ...product,
      classes,
      on_sale,
      double_class,
      sold_out: !product.available,
      sold_out_translation: window.theme.strings.soldOut,
      compare_at_price: themeCurrency.formatMoney(product.compare_at_price, theme.moneyFormat),
      compare_at_price_max: themeCurrency.formatMoney(product.compare_at_price_max, theme.moneyFormat),
      compare_at_price_min: themeCurrency.formatMoney(product.compare_at_price_min, theme.moneyFormat),
      price_max: themeCurrency.formatMoney(product.price_max, theme.moneyFormat),
      price_min: themeCurrency.formatMoney(product.price_min, theme.moneyFormat),
    };
    return formatted;
  }

  const selectors$q = {
    append: '[data-predictive-search-append]',
    input: 'data-predictive-search-input',
    productTemplate: '[product-grid-item-template]',
    productWrapper: '[data-product-wrap]',
    productWrapperOuter: '[data-product-wrap-outer]',
    titleTemplate: '[data-predictive-search-title-template]',
    titleWrapper: '[data-search-title-wrap]',
    dirtyClass: 'dirty',
    loadingClass: 'is-loading',
    searchPopdown: 'search-popdown',
  };

  class SearchPredictive {
    constructor(input) {
      this.input = input;
      this.key = this.input.getAttribute(selectors$q.input);
      const appendSelector = `[id='${this.key}']`;
      this.append = document.querySelector(appendSelector);
      this.productTemplate = document.querySelector(selectors$q.productTemplate).innerHTML;
      this.titleTemplate = document.querySelector(selectors$q.titleTemplate).innerHTML;
      this.titleWrapper = document.querySelector(selectors$q.titleWrapper);
      this.productWrapper = this.append.querySelector(selectors$q.productWrapper);
      this.productWrapperOuter = this.append.querySelector(selectors$q.productWrapperOuter);
      this.popdown = document.getElementById(selectors$q.searchPopdown);
      this.result = null;
      this.accessibility = a11y;
      this.initSearch();
    }

    initSearch() {
      this.input.addEventListener(
        'input',
        debounce(
          function (event) {
            const val = event.target.value;
            if (val && val.length > 1) {
              this.productWrapperOuter.classList.add(selectors$q.loadingClass);
              this.render(val);
            } else {
              this.reset();
              this.append.classList.remove(selectors$q.dirtyClass);
            }
          }.bind(this),
          300
        )
      );
      this.input.addEventListener('clear', this.reset.bind(this));
    }

    render(terms) {
      fetch(`/search/suggest.json?q=${encodeURIComponent(terms)}&resources[type]=product&resources[limit]=8&resources[options][unavailable_products]=last`)
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          this.result = response.resources.results;
          return this.fetchProducts(response.resources.results.products);
        })
        .then((response) => {
          this.injectTitle(terms);

          setTimeout(() => {
            this.reset(false);
            this.productWrapperOuter.classList.remove(selectors$q.loadingClass);
            this.injectProduct(response);
            this.append.classList.add(selectors$q.dirtyClass);

            this.accessibility.trapFocus(this.popdown);
            this.input.focus();
          }, 1000);
        })
        .catch((e) => {
          console.error(e);
        });
    }

    reset(clearTerms = true) {
      this.productWrapper.innerHTML = '';
      this.append.classList.remove(selectors$q.dirtyClass);
      this.input.val = '';
      this.accessibility.removeTrapFocus();

      if (clearTerms) {
        this.titleWrapper.innerHTML = '';
        this.popdown.classList.remove('results-visible');
      }
    }

    injectTitle(terms) {
      let title = window.theme.strings.noResultsFor;
      let count = '';
      if (this.result && this.result.products.length > 0) {
        count = this.result.products.length;
        title = window.theme.strings.resultsFor;
      }
      this.popdown.classList.add('results-visible');
      this.titleWrapper.innerHTML = Sqrl.render(this.titleTemplate, {
        count: count,
        title: title,
        query: terms,
      });
    }

    injectProduct(productHTML) {
      this.productWrapper.innerHTML += productHTML;
    }

    fetchProducts(products) {
      const promises = [];
      products.forEach((product) => {
        // because of a translation bug in the predictive search API
        // we need to fetch the product JSON from the handle
        promises.push(
          fetchProduct(product.handle).then((productJSON) => {
            const formatted = formatPrices(productJSON);
            return this.renderProduct(formatted);
          })
        );
      });

      return Promise.all(promises).then((result) => {
        let str = '';
        result.forEach((render) => {
          str += render;
        });
        return str;
      });
    }

    renderProduct(product) {
      let media = null;
      let mediaHover = null;
      let image = '';
      let secondImage = '';

      if (product.media !== undefined) {
        media = product.media[0];
        mediaHover = product.media[1];
      }

      if (media) {
        image = {
          thumb: themeImages.getSizedImageUrl(media.preview_image.src, '800x800'),
          alt: media.preview_image.src,
        };
      } else {
        image = {
          thumb: window.theme.assets.no_image,
          alt: '',
        };
      }

      if (mediaHover) {
        secondImage = {
          thumb: themeImages.getSizedImageUrl(mediaHover.preview_image.src, '800x800'),
          alt: mediaHover.preview_image.src,
        };
      }
      const stripHtmlRegex = /(<([^>]+)>)/gi;
      const title = product.title.replace(stripHtmlRegex, '');

      const updateValues = {
        ...product,
        title,
        image,
        secondImage,
      };

      return Sqrl.render(this.productTemplate, {product: updateValues});
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const selectors$r = {
    body: 'body',
    popdownTrigger: 'data-popdown-toggle',
    close: '[data-close-popdown]',
    input: '[data-predictive-search-input]',
  };

  const classes$b = {
    isVisible: 'is-visible',
  };

  let sections$d = {};

  class SearchPopdownTriggers {
    constructor(trigger) {
      this.trigger = trigger;
      this.key = this.trigger.getAttribute(selectors$r.popdownTrigger);
      this.search = null;

      const popdownSelector = `[id='${this.key}']`;
      this.document = document;
      this.popdown = document.querySelector(popdownSelector);
      this.input = this.popdown.querySelector(selectors$r.input);
      this.close = this.popdown.querySelector(selectors$r.close);
      this.body = document.querySelector(selectors$r.body);
      this.accessibility = a11y;

      this.initTriggerEvents();

      // Initialized once for every search trigger
      this.initPopdownEvents();
    }

    initTriggerEvents() {
      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.trigger.addEventListener('click', (evt) => {
        evt.preventDefault();

        if (!this.body.classList.contains('is-focused')) {
          this.showPopdown();
        }
      });

      this.trigger.addEventListener('keyup', (evt) => {
        if ((evt.which === window.theme.keyboardKeys.SPACE || evt.which === window.theme.keyboardKeys.ENTER) && this.body.classList.contains('is-focused')) {
          this.showPopdown();
        }
      });
    }

    initPopdownEvents() {
      this.search = new SearchPredictive(this.input);
      this.popdown.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hidePopdown();
        }.bind(this)
      );

      this.close.addEventListener(
        'click',
        function () {
          this.hidePopdown();
        }.bind(this)
      );

      this.document.addEventListener('click', (event) => {
        const clickedElement = event.target;
        const isNotSearchExpandButton = !(clickedElement.matches(`[${selectors$r.popdownTrigger}]`) || clickedElement.closest(`[${selectors$r.popdownTrigger}]`));
        const isNotSearchPopdownChild = !(clickedElement.matches(`#${this.key}`) || clickedElement.closest(`#${this.key}`));

        if (isNotSearchExpandButton && isNotSearchPopdownChild && this.popdown.classList.contains(classes$b.isVisible)) {
          this.hidePopdown();
        }
      });
    }

    hidePopdown() {
      this.popdown.classList.remove(classes$b.isVisible);
      this.input.form.reset();
      this.input.dispatchEvent(new CustomEvent('clear', {bubbles: false}));
      this.accessibility.removeTrapFocus();

      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));

      if (this.body.classList.contains('is-focused')) {
        setTimeout(() => {
          this.trigger.focus();
        }, 200);
      }
    }

    showPopdown() {
      document.dispatchEvent(
        new CustomEvent('theme:drawer:close', {
          bubbles: false,
        })
      );

      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: this.popdown}));

      this.popdown.classList.add(classes$b.isVisible);
      const val = this.input.value;
      this.input.value = '';
      this.input.value = val;

      this.accessibility.trapFocus(this.popdown);
      this.input.focus();
    }
  }

  const searchPopdown = {
    onLoad() {
      sections$d[this.id] = [];
      const triggers = this.container.querySelectorAll(`[${selectors$r.popdownTrigger}]`);
      triggers.forEach((el) => {
        sections$d[this.id].push(new SearchPopdownTriggers(el));
      });
    },
  };

  const selectors$s = {
    slideruleOpen: 'data-sliderule-open',
    slideruleClose: 'data-sliderule-close',
    sliderulePane: 'data-sliderule-pane',
    slideruleWrappper: '[data-sliderule]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    children: `:scope > [data-animates], 
             :scope > * > [data-animates], 
             :scope > * > * >[data-animates],
             :scope > * > .sliderule-grid  > *`,
  };

  const classes$c = {
    isVisible: 'is-visible',
  };

  let sections$e = {};

  class HeaderMobileSliderule {
    constructor(el) {
      this.sliderule = el;
      this.wrapper = el.closest(selectors$s.wrapper);
      this.key = this.sliderule.id;
      const btnSelector = `[${selectors$s.slideruleOpen}='${this.key}']`;
      const exitSelector = `[${selectors$s.slideruleClose}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.exit = document.querySelector(exitSelector);
      this.pane = document.querySelector(`[${selectors$s.sliderulePane}]`);
      this.children = this.sliderule.querySelectorAll(selectors$s.children);

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.clickEvents();
      this.staggerChildAnimations();

      document.addEventListener('theme:sliderule:close', this.closeSliderule.bind(this));
    }

    clickEvents() {
      this.trigger.addEventListener(
        'click',
        function () {
          this.showSliderule();
        }.bind(this)
      );
      this.exit.addEventListener(
        'click',
        function () {
          this.hideSliderule();
        }.bind(this)
      );
    }

    keyboardEvents() {
      this.trigger.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.SPACE) {
            return;
          }
          this.showSliderule();
        }.bind(this)
      );
      this.sliderule.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideSliderule();
          this.buttons[0].focus();
        }.bind(this)
      );
    }

    staggerChildAnimations() {
      this.children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 50 + 10}ms`;
      });
    }

    hideSliderule() {
      this.sliderule.classList.remove(classes$c.isVisible);
      this.children.forEach((el) => {
        el.classList.remove(classes$c.isVisible);
      });
      const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) - 1;
      this.pane.setAttribute(selectors$s.sliderulePane, newPosition);
    }

    showSliderule() {
      this.sliderule.classList.add(classes$c.isVisible);
      this.children.forEach((el) => {
        el.classList.add(classes$c.isVisible);
      });
      const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) + 1;
      this.pane.setAttribute(selectors$s.sliderulePane, newPosition);
    }

    closeSliderule() {
      if (this.pane && this.pane.hasAttribute(selectors$s.sliderulePane) && parseInt(this.pane.getAttribute(selectors$s.sliderulePane)) > 0) {
        this.hideSliderule();
        if (parseInt(this.pane.getAttribute(selectors$s.sliderulePane)) > 0) {
          this.pane.setAttribute(selectors$s.sliderulePane, 0);
        }
      }
    }
  }

  const headerMobileSliderule = {
    onLoad() {
      sections$e[this.id] = [];
      const els = this.container.querySelectorAll(selectors$s.slideruleWrappper);
      els.forEach((el) => {
        sections$e[this.id].push(new HeaderMobileSliderule(el));
      });
    },
  };

  const selectors$t = {
    wrapper: '[data-header-wrapper]',
    style: 'data-header-style',
    widthContentWrapper: '[data-takes-space-wrapper]',
    widthContent: '[data-child-takes-space]',
    desktop: '[data-header-desktop]',
    cloneClass: 'js__header__clone',
    showMobileClass: 'js__show__mobile',
    backfill: '[data-header-backfill]',
    transparent: 'data-header-transparent',
    overrideBorder: 'header-override-border',
    firstSectionHasImage: '.main-content > .shopify-section:first-child [data-overlay-header]',
    deadLink: '.navlink[href="#"]',
  };

  let sections$f = {};

  class Header {
    constructor(el) {
      this.wrapper = el;
      this.style = this.wrapper.dataset.style;
      this.desktop = this.wrapper.querySelector(selectors$t.desktop);
      this.transparent = this.wrapper.getAttribute(selectors$t.transparent) !== 'false';
      this.overlayedImages = document.querySelectorAll(selectors$t.firstSectionHasImage);
      this.deadLinks = document.querySelectorAll(selectors$t.deadLink);
      this.resizeEventWidth = () => this.checkWidth();
      this.resizeEventOverlay = () => this.subtractAnnouncementHeight();

      this.killDeadLinks();
      if (this.style !== 'drawer' && this.desktop) {
        this.minWidth = this.getMinWidth();
        this.listenWidth();
      }
      this.checkForImage();

      window.dispatchEvent(new Event('resize'));
    }

    unload() {
      document.removeEventListener('theme:resize', this.resizeEventWidth);
      document.removeEventListener('theme:resize', this.resizeEventOverlay);
    }

    checkForImage() {
      if (this.overlayedImages.length > 0 && this.transparent) {
        // is transparent and has image, overlay the image
        document.querySelector(selectors$t.backfill).style.display = 'none';
        this.listenOverlay();
      } else {
        this.wrapper.setAttribute(selectors$t.transparent, false);
      }

      if (this.overlayedImages.length > 0 && !this.transparent) {
        // Have image but not transparent, remove border bottom
        this.wrapper.classList.add(selectors$t.overrideBorder);
        this.subtractHeaderHeight();
      }
    }

    listenOverlay() {
      document.addEventListener('theme:resize', this.resizeEventOverlay);
      this.subtractAnnouncementHeight();
    }

    listenWidth() {
      document.addEventListener('theme:resize', this.resizeEventWidth);
      this.checkWidth();
    }

    killDeadLinks() {
      this.deadLinks.forEach((el) => {
        el.onclick = (e) => {
          e.preventDefault();
        };
      });
    }

    subtractAnnouncementHeight() {
      const {windowHeight, announcementHeight, headerHeight} = readHeights();
      this.overlayedImages.forEach((el) => {
        el.style.setProperty('--full-screen', `${windowHeight - announcementHeight}px`);
        el.style.setProperty('--header-padding', `${headerHeight}px`);
        el.classList.add('has-overlay');
      });
    }

    subtractHeaderHeight() {
      const {windowHeight, headerHeight} = readHeights();
      this.overlayedImages.forEach((el) => {
        el.style.setProperty('--full-screen', `${windowHeight - headerHeight}px`);
      });
    }

    checkWidth() {
      if (document.body.clientWidth < this.minWidth) {
        this.wrapper.classList.add(selectors$t.showMobileClass);
      } else {
        this.wrapper.classList.remove(selectors$t.showMobileClass);
      }
    }

    getMinWidth() {
      const comparitor = this.wrapper.cloneNode(true);
      comparitor.classList.add(selectors$t.cloneClass);
      document.body.appendChild(comparitor);
      const widthWrappers = comparitor.querySelectorAll(selectors$t.widthContentWrapper);
      let minWidth = 0;
      let spaced = 0;

      widthWrappers.forEach((context) => {
        const wideElements = context.querySelectorAll(selectors$t.widthContent);
        let thisWidth = 0;
        if (wideElements.length === 3) {
          thisWidth = _sumSplitWidths(wideElements);
        } else {
          thisWidth = _sumWidths(wideElements);
        }
        if (thisWidth > minWidth) {
          minWidth = thisWidth;
          spaced = wideElements.length * 20;
        }
      });

      document.body.removeChild(comparitor);
      return minWidth + spaced;
    }
  }

  function _sumSplitWidths(nodes) {
    let arr = [];
    nodes.forEach((el) => {
      if (el.firstElementChild) {
        arr.push(el.firstElementChild.clientWidth);
      }
    });
    if (arr[0] > arr[2]) {
      arr[2] = arr[0];
    } else {
      arr[0] = arr[2];
    }
    const width = arr.reduce((a, b) => a + b);
    return width;
  }
  function _sumWidths(nodes) {
    let width = 0;
    nodes.forEach((el) => {
      width += el.clientWidth;
    });
    return width;
  }

  const header = {
    onLoad() {
      sections$f = new Header(this.container);
    },
    onUnload() {
      if (typeof sections$f.unload === 'function') {
        sections$f.unload();
      }
    },
  };

  register('header', [header, drawer, popoutSection, headerMobileSliderule, stickyHeader, hoverDisclosure, headerTotals, searchPopdown]);

  register('look', [slider, productGridReviews, quickAddProduct, swatchGridSection]);

  register('product-grid', [productGridReviews, slider, quickAddProduct, swatchGridSection]);

  const selectors$u = {
    productSlideshow: '[data-product-slideshow]',
    productThumbs: '[data-product-thumbs]',
    dataTallLayout: 'data-tall-layout',
    dataType: 'data-type',
    dataMediaId: 'data-media-id',
    dataThumb: 'data-thumb',
    dataThumbIndex: 'data-thumb-index',
    ariaLabel: 'aria-label',
    dataThumbnail: '[data-thumbnail]',
    productSlideThumb: '.js-product-slide-thumb',
    classSelected: 'is-selected',
    classMediaHidden: 'media--hidden',
    sliderEnabled: 'flickity-enabled',
    focusEnabled: 'is-focused',
    mobileThumbsSliderEnable: 'data-mobile-thumbs-slider',
    thumbsSlider: '[data-thumbs-slider]',
  };

  const thumbIcons = {
    model:
      '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-media-model" viewBox="0 0 26 26"><path d="M1 25h24V1H1z"/><path class="icon-media-model-outline" d="M.5 25v.5h25V.5H.5z" fill="none"/><path class="icon-media-model-element" d="M19.13 8.28L14 5.32a2 2 0 0 0-2 0l-5.12 3a2 2 0 0 0-1 1.76V16a2 2 0 0 0 1 1.76l5.12 3a2 2 0 0 0 2 0l5.12-3a2 2 0 0 0 1-1.76v-6a2 2 0 0 0-.99-1.72zm-6.4 11.1l-5.12-3a.53.53 0 0 1-.26-.38v-6a.53.53 0 0 1 .27-.46l5.12-3a.53.53 0 0 1 .53 0l5.12 3-4.72 2.68a1.33 1.33 0 0 0-.67 1.2v6a.53.53 0 0 1-.26 0z" opacity=".6" style="isolation:isolate"/></svg>',
    video:
      '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-media-video" viewBox="0 0 26 26"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 25h24V1H1v24z"/><path class="icon-media-video-outline" d="M.5 25v.5h25V.5H.5V25z"/><path class="icon-media-video-element" fill-rule="evenodd" clip-rule="evenodd" d="M9.718 6.72a1 1 0 0 0-1.518.855v10.736a1 1 0 0 0 1.562.827l8.35-5.677a1 1 0 0 0-.044-1.682l-8.35-5.06z" opacity=".6"/></svg>',
  };

  class InitSlider {
    constructor(section) {
      this.container = section.container;
      this.tallLayout = this.container.getAttribute(selectors$u.dataTallLayout) === 'true';
      this.mobileThumbsSlider = this.container.getAttribute(selectors$u.mobileThumbsSliderEnable) === 'true';
      this.slideshow = this.container.querySelector(selectors$u.productSlideshow);
      this.thumbs = this.container.querySelector(selectors$u.productThumbs);
      this.mobileSliderEnable = this.container.getAttribute(selectors$u.mobileSliderEnable) === 'true';

      this.flkty = null;
      this.flktyThumbs = null;
      this.thumbsSlider = null;

      this.init();
    }

    init() {
      if (this.tallLayout) {
        this.initSliderMobile();

        document.addEventListener('theme:resize', () => {
          this.initSliderMobile();
        });
      } else {
        this.createSlider();
      }
    }

    initSliderMobile() {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const isMobile = windowWidth < theme.variables.mediaQuerySmall;
      if (isMobile) {
        this.createSlider();
      } else {
        this.destroySlider();
      }
    }

    destroySlider() {
      const isSliderInitialized = this.slideshow.classList.contains(selectors$u.sliderEnabled);

      if (isSliderInitialized) {
        this.flkty.destroy();
      }

      if (this.thumbs && !this.mobileThumbsSlider) {
        this.thumbs.innerHTML = '';
      }

      if (this.flktyThumbs !== null) {
        this.flktyThumbs.destroy();
        this.flktyThumbs = null;
      }
    }

    createSlider() {
      if (!this.slideshow) {
        return;
      }

      const instance = this;
      const firstSlide = this.slideshow.querySelectorAll(`[${selectors$u.dataType}]`)[0];

      let flickityOptions = {
        autoPlay: false,
        prevNextButtons: false,
        contain: true,
        pageDots: false,
        adaptiveHeight: true,
        wrapAround: true,
        fade: true,
        on: {
          ready: function () {
            instance.sliderThumbs(this);
          },
        },
      };

      this.flkty = new FlickityFade(this.slideshow, flickityOptions);
      this.flkty.resize();

      if (firstSlide) {
        const firstType = firstSlide.getAttribute(selectors$u.dataType);

        if (firstType === 'model' || firstType === 'video' || firstType === 'external_video') {
          this.flkty.options.draggable = false;
          this.flkty.updateDraggable();
        }
      }

      this.flkty.on('change', function (index) {
        let lastSLideIdx = index;

        if (instance.thumbs) {
          const selectedElem = instance.thumbs.querySelector(`.${selectors$u.classSelected}`);
          const currentSlide = instance.thumbs.querySelector(`.thumb [${selectors$u.dataThumbIndex}="${index}"]`);

          if (selectedElem) {
            lastSLideIdx = Array.from(selectedElem.parentElement.children).indexOf(selectedElem);
            selectedElem.classList.remove(selectors$u.classSelected);
          }

          if (currentSlide) {
            currentSlide.parentElement.classList.add(selectors$u.classSelected);
          }
        }

        const currentMedia = this.cells[lastSLideIdx].element;
        const newMedia = this.selectedElement;

        currentMedia.dispatchEvent(new CustomEvent('mediaHidden'));
        newMedia.classList.remove(selectors$u.classMediaHidden);
      });

      this.flkty.on('settle', function () {
        const currentMedia = this.selectedElement;
        const otherMedia = Array.prototype.filter.call(currentMedia.parentNode.children, function (child) {
          return child !== currentMedia;
        });
        const mediaType = currentMedia.getAttribute(selectors$u.dataType);
        const isFocusEnabled = document.body.classList.contains(selectors$u.focusEnabled);

        if (mediaType === 'model' || mediaType === 'video' || mediaType === 'external_video') {
          // fisrt boolean sets value, second option false to prevent refresh
          instance.flkty.options.draggable = false;
          instance.flkty.updateDraggable();
        } else {
          instance.flkty.options.draggable = true;
          instance.flkty.updateDraggable();
        }

        if (isFocusEnabled) currentMedia.dispatchEvent(new Event('focus'));

        if (otherMedia.length) {
          otherMedia.forEach((element) => {
            element.classList.add(selectors$u.classMediaHidden);
          });
        }

        currentMedia.dispatchEvent(new CustomEvent('mediaVisible'));
      });

      instance.container.addEventListener('click', function (e) {
        const target = e.target;
        if (target.matches(selectors$u.productSlideThumb) || target.closest(selectors$u.productSlideThumb)) {
          e.preventDefault();

          let slideIdx = 0;
          let selector;
          if (target.matches(selectors$u.productSlideThumb)) {
            selector = target;
          } else {
            selector = target.closest(selectors$u.productSlideThumb);
          }

          slideIdx = parseInt(selector.getAttribute(selectors$u.dataThumbIndex));

          instance.flkty.select(slideIdx);

          if (instance.mobileThumbsSlider && instance.flktyThumbs !== null) {
            instance.flktyThumbs.select(slideIdx);
          }
        }
      });
    }

    createThumbSlider() {
      const flickityOptions = {
        autoPlay: false,
        prevNextButtons: false,
        contain: true,
        pageDots: false,
        adaptiveHeight: false,
        wrapAround: false,
      };
      let isMobile = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) < theme.variables.mediaQuerySmall;

      this.thumbsSlider = this.container.querySelector(selectors$u.thumbsSlider);

      const initSlider = () => {
        this.flktyThumbs = new FlickityFade(this.thumbsSlider, flickityOptions);
        this.flktyThumbs.resize();
      };

      if (isMobile) {
        initSlider();
      }

      document.addEventListener('theme:resize', () => {
        isMobile = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) < theme.variables.mediaQuerySmall;

        if (isMobile) {
          initSlider();
        } else if (this.flktyThumbs !== null) {
          this.flktyThumbs.destroy();
          this.flktyThumbs = null;
        }
      });
    }

    sliderThumbs(thisEl) {
      const slides = thisEl.slides;

      if (this.thumbs && slides.length) {
        let slidesHtml = '';
        slides.forEach((element, i) => {
          const slide = element.cells[0].element;
          const type = slide.getAttribute(selectors$u.dataType);
          const mediaId = slide.getAttribute(selectors$u.dataMediaId);
          const thumb = slide.getAttribute(selectors$u.dataThumb);
          let thumbAlt = '';
          const thumbIcon = thumbIcons[type] ? thumbIcons[type] : '';
          let selected = '';

          if (slide.querySelector(`[${selectors$u.ariaLabel}]`)) {
            thumbAlt = slide.querySelector(`[${selectors$u.ariaLabel}]`).getAttribute(selectors$u.ariaLabel);
          }

          if (thumbAlt === '' && slide.hasAttribute(selectors$u.ariaLabel)) {
            thumbAlt = slide.getAttribute(selectors$u.ariaLabel);
          }

          slide.setAttribute('tabindex', '-1');

          if (slide.classList.contains(selectors$u.classSelected)) {
            selected = selectors$u.classSelected;
          }

          slidesHtml += `<div class="thumb ${selected}"><a href="${thumb}" class="thumb--${type} js-product-slide-thumb" data-thumb-index="${i}" data-thumbnail data-media-id="${mediaId}"><img alt="${thumbAlt}" src="${thumb}">${thumbIcon}</a></div>`;
        });

        if (slidesHtml !== '') {
          slidesHtml = `<div class="thumbs-holder" data-thumbs-slider>${slidesHtml}</div>`;
          this.thumbs.innerHTML = slidesHtml;

          if (this.mobileThumbsSlider) {
            this.createThumbSlider();
          }
        }
      }

      const productThumbImages = this.container.querySelectorAll(selectors$u.dataThumbnail);
      if (productThumbImages.length) {
        productThumbImages.forEach((element) => {
          element.addEventListener('click', function (e) {
            e.preventDefault();
          });

          element.addEventListener('keyup', function (e) {
            // On keypress Enter move the focus to the first focusable element in the related slide
            if (e.keyCode === 13) {
              const mediaId = this.getAttribute(selectors$u.dataMediaId);
              const mediaElem = thisEl.element
                .querySelector(`[${selectors$u.dataMediaId}="${mediaId}"]`)
                .querySelectorAll('model-viewer, video, iframe, button, [href], input, [tabindex]:not([tabindex="-1"])')[0];
              if (mediaElem) {
                mediaElem.dispatchEvent(new Event('focus'));
                mediaElem.dispatchEvent(new Event('select'));
              }
            }
          });
        });
      }
    }
  }

  const selectors$v = {
    zoomWrapper: '[data-zoom-wrapper]',
    dataImageSrc: 'data-image-src',
    dataImageWidth: 'data-image-width',
    dataImageHeight: 'data-image-height',
    dataImageZoomEnable: 'data-image-zoom-enable',
    thumbs: '.pswp__thumbs',
    caption: '[data-zoom-caption]',
  };

  const classes$d = {
    variantSoldOut: 'variant--soldout',
    variantUnavailable: 'variant--unavailabe',
    popupThumb: 'pswp__thumb',
    popupClass: 'pswp-zoom-gallery',
    popupClassNoThumbs: 'pswp-zoom-gallery--single',
  };

  class Zoom {
    constructor(section) {
      this.container = section.container;
      this.zoomWrappers = this.container.querySelectorAll(selectors$v.zoomWrapper);
      this.thumbsContainer = document.querySelector(selectors$v.thumbs);
      this.zoomCaptionElem = this.container.querySelector(selectors$v.caption);
      this.zoomEnable = this.container.getAttribute(selectors$v.dataImageZoomEnable) === 'true';

      if (this.zoomEnable) {
        this.init();
      }
    }

    init() {
      const self = this;

      if (this.zoomWrappers.length) {
        this.zoomWrappers.forEach((element, i) => {
          element.addEventListener('click', function (e) {
            e.preventDefault();

            self.createZoom(i);
          });

          element.addEventListener('keyup', function (e) {
            // On keypress Enter move the focus to the first focusable element in the related slide
            if (e.keyCode === 13) {
              e.preventDefault();

              self.createZoom(i);
            }
          });
        });
      }
    }

    createZoom(indexImage) {
      const self = this;
      let items = [];
      let counter = 0;
      let thumbs = '';
      this.zoomWrappers.forEach((elementImage) => {
        const imgSrc = elementImage.getAttribute(selectors$v.dataImageSrc);
        const imgWidth = parseInt(elementImage.getAttribute(selectors$v.dataImageWidth));
        const imgHeight = parseInt(elementImage.getAttribute(selectors$v.dataImageHeight));

        items.push({
          src: imgSrc,
          w: imgWidth,
          h: imgHeight,
          msrc: imgSrc,
        });

        thumbs += `<a href="#" class="${classes$d.popupThumb}" style="background-image: url('${imgSrc}')"></a>`;

        counter += 1;
        if (self.zoomWrappers.length === counter) {
          let popupClass = `${classes$d.popupClass}`;
          if (counter === 1) {
            popupClass = `${classes$d.popupClass} ${classes$d.popupClassNoThumbs}`;
          }
          const options = {
            history: false,
            focus: false,
            index: indexImage,
            mainClass: popupClass,
            showHideOpacity: true,
            howAnimationDuration: 150,
            hideAnimationDuration: 250,
            closeOnScroll: false,
            closeOnVerticalDrag: false,
            captionEl: true,
            closeEl: true,
            closeElClasses: ['caption-close'],
            tapToClose: false,
            clickToCloseNonZoomable: false,
            maxSpreadZoom: 2,
            loop: true,
            spacing: 0,
            allowPanToNext: true,
            pinchToClose: false,
            addCaptionHTMLFn: function (item, captionEl, isFake) {
              self.zoomCaption(item, captionEl, isFake);
            },
            getThumbBoundsFn: function getThumbBoundsFn() {
              const imageLocation = self.zoomWrappers[indexImage];
              const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
              const rect = imageLocation.getBoundingClientRect();
              return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
            },
          };

          new LoadPhotoswipe(items, options);

          if (self.thumbsContainer && thumbs !== '') {
            self.thumbsContainer.innerHTML = thumbs;
          }
        }
      });
    }

    zoomCaption(item, captionEl) {
      let captionHtml = '';
      const targetContainer = captionEl.children[0];
      if (this.zoomCaptionElem) {
        captionHtml = this.zoomCaptionElem.innerHTML;

        if (this.zoomCaptionElem.closest(`.${classes$d.variantSoldOut}`)) {
          targetContainer.classList.add(classes$d.variantSoldOut);
        } else {
          targetContainer.classList.remove(classes$d.variantSoldOut);
        }

        if (this.zoomCaptionElem.closest(`.${classes$d.variantUnavailable}`)) {
          targetContainer.classList.add(classes$d.variantUnavailable);
        } else {
          targetContainer.classList.remove(classes$d.variantUnavailable);
        }
      }

      targetContainer.innerHTML = captionHtml;
      return false;
    }
  }

  const selectors$w = {
    videoPlayer: '[data-video]',
    modelViewer: '[data-model]',
    dataType: 'data-type',
    dataMediaId: 'data-media-id',
    dataVideoLooping: 'data-video-looping',
    dataYoutubeId: 'data-youtube-id',
    productMediaWrapper: '[data-product-single-media-wrapper]',
    productMediaContainer: '[data-product-single-media-group]',
    classMediaHidden: 'media--hidden',
  };
  theme.mediaInstances = {};
  class Video {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.id = section.id;
      this.players = {};
      this.init();
    }

    init() {
      const playerElements = this.container.querySelectorAll(selectors$w.videoPlayer);
      let hasYouTube = false;
      let hasNative = false;
      for (let i = 0; i < playerElements.length; i++) {
        const newPlayerID = playerElements[i].getAttribute('id');
        const newPlayerType = playerElements[i].getAttribute(selectors$w.dataType);
        const newPlayerMediaId = playerElements[i].getAttribute(selectors$w.dataMediaId);
        this.players[newPlayerID] = {};
        this.players[newPlayerID].id = newPlayerID;
        this.players[newPlayerID].type = newPlayerType;
        this.players[newPlayerID].mediaId = newPlayerMediaId;
        this.players[newPlayerID].container = playerElements[i];
        this.players[newPlayerID].element = playerElements[i].querySelector('iframe, video');
        if (!this.players[newPlayerID].element) return;
        if (newPlayerType === 'external_video') {
          const youtubeID = playerElements[i].getAttribute(selectors$w.dataYoutubeId);
          this.players[newPlayerID].externalID = youtubeID;
          hasYouTube = true;
        } else if (newPlayerType === 'video') {
          hasNative = true;
        }
      }
      if (hasNative) {
        if (window.isPlyrLoaded) {
          this.nativeInitCallback();
        } else {
          // Load Plyr
          const videoLoad = {
            name: 'video-ui',
            version: '1.0',
          };
          loadScript(videoLoad).then(() => this.nativeInitCallback());
        }
      }

      if (hasYouTube) {
        if (window.isYoutubeAPILoaded) {
          this.youTubeInitCallback();
        } else {
          // Load Youtube API
          loadScript({url: 'https://www.youtube.com/iframe_api'}).then(() => this.youTubeInitCallback());
        }
      }
    }

    youTubeInitCallback() {
      for (const currentPlayerID in this.players) {
        if (this.players[currentPlayerID].type === 'external_video') {
          const currentPlayer = this.players[currentPlayerID];
          const enableLooping = this.players[currentPlayerID].container.closest(`[${selectors$w.dataVideoLooping}]`).getAttribute(selectors$w.dataVideoLooping) === 'true';
          const defaultYoutubeOptions = {
            playerVars: {
              cc_load_policy: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              autohide: 0,
              controls: 1,
              branding: 0,
              showinfo: 0,
              rel: 0,
              fs: 0,
              wmode: 'opaque',
            },
            events: {
              onStateChange: (e) => {
                if (e.data === 0 && enableLooping) e.target.seekTo(0);
                const currentMediaElem = e.target.getIframe().closest(`[${selectors$w.dataMediaId}]`);
                let currentMediaId = '';
                if (currentMediaElem) {
                  currentMediaId = currentMediaElem.getAttribute(selectors$w.dataMediaId);
                }
                if (e.data === 1) this.pauseOtherMedia(currentMediaId);
              },
            },
          };

          const currentYoutubeOptions = {...defaultYoutubeOptions};
          currentYoutubeOptions.videoId = currentPlayer.externalID;

          YT.ready(() => {
            this.players[currentPlayerID].player = new YT.Player(currentPlayer.element, currentYoutubeOptions);

            window.isYoutubeAPILoaded = true;

            this.players[currentPlayerID].container.addEventListener('mediaHidden', (event) => this.onHidden(event, true));
            this.players[currentPlayerID].container.addEventListener('xrLaunch', (event) => this.onHidden(event, true));
            this.players[currentPlayerID].container.addEventListener('mediaVisible', (event) => this.onVisible(event, true));
          });
        }
      }
    }

    nativeInitCallback() {
      for (const currentPlayerID in this.players) {
        if (this.players[currentPlayerID].type === 'video') {
          const currentPlayer = this.players[currentPlayerID];
          const enableLooping = this.players[currentPlayerID].container.closest(`[${selectors$w.dataVideoLooping}]`).getAttribute(selectors$w.dataVideoLooping) === 'true',
            plyrOptions = {
              loop: {active: enableLooping},
              focusOnPlay: true,
            };
          this.players[currentPlayerID].player = new Shopify.Plyr(currentPlayer.element, plyrOptions);
          currentPlayer.element.addEventListener('play', (event) => {
            const currentMediaElem = event.target.closest(`[${selectors$w.dataMediaId}]`);
            let currentMediaId = '';
            if (currentMediaElem) {
              currentMediaId = currentMediaElem.getAttribute(selectors$w.dataMediaId);
            }
            this.pauseOtherMedia(currentMediaId);
          });

          window.isPlyrLoaded = true;

          this.players[currentPlayerID].container.addEventListener('mediaHidden', (event) => this.onHidden(event, false));
          this.players[currentPlayerID].container.addEventListener('xrLaunch', (event) => this.onHidden(event, false));
          this.players[currentPlayerID].container.addEventListener('mediaVisible', (event) => this.onVisible(event, false));
        }
      }
    }

    onHidden(event, playerYT = false) {
      if (typeof event.target.dataset.playerId !== 'undefined') {
        const newID = event.target.dataset.playerId;
        const newPlayer = this.players[newID];
        if (playerYT === true && newPlayer.player && newPlayer.player.pauseVideo) {
          newPlayer.player.pauseVideo();
        } else if (newPlayer.player && newPlayer.player.pause) {
          newPlayer.player.pause();
        }
      }
    }

    onVisible(event, playerYT = false) {
      if (window.theme.touched) return;
      if (typeof event.target.dataset.playerId !== 'undefined') {
        const newID = event.target.dataset.playerId;
        const newPlayer = this.players[newID];
        if (playerYT === true && newPlayer.player && newPlayer.player.playVideo) {
          newPlayer.player.playVideo();
        } else if (newPlayer.player && newPlayer.player.play) {
          newPlayer.player.play();
        }
      }
    }

    pauseOtherMedia(mediaId) {
      const mediaIdString = `[${selectors$w.dataMediaId}="${mediaId}"]`;
      const currentMedia = document.querySelector(`${selectors$w.productMediaWrapper}${mediaIdString}`);
      const otherMedia = document.querySelectorAll(`${selectors$w.productMediaWrapper}:not(${mediaIdString})`);
      currentMedia.classList.remove(selectors$w.classMediaHidden);
      if (otherMedia.length) {
        otherMedia.forEach((element) => {
          element.dispatchEvent(new CustomEvent('mediaHidden'));
          element.classList.add(selectors$w.classMediaHidden);
        });
      }
    }
  }

  theme.mediaInstances = {};

  const selectors$x = {
    videoPlayer: '[data-video]',
    modelViewer: '[data-model]',
    sliderEnabled: 'flickity-enabled',
    classMediaHidden: 'media--hidden',
  };

  class Media {
    constructor(section) {
      this.section = section;
      this.id = section.id;
      this.container = section.container;
    }

    init() {
      new Video(this.section);

      this.detect3d();
      this.launch3d();

      new Zoom(this.section);
      new InitSlider(this.section);
    }

    detect3d() {
      const modelViewerElements = this.container.querySelectorAll(selectors$x.modelViewer);
      if (modelViewerElements.length) {
        modelViewerElements.forEach((element) => {
          theme.ProductModel.init(element, this.id);
        });
      }
    }

    launch3d() {
      const instance = this;

      document.addEventListener('shopify_xr_launch', function () {
        const currentMedia = instance.container.querySelector(`${instance.selectors.modelViewer}:not(.${selectors$x.classMediaHidden})`);
        currentMedia.dispatchEvent(new CustomEvent('xrLaunch'));
      });
    }
  }

  const selectors$y = {
    product: '[data-product]',
    productForm: '[data-product-form]',
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    formWrapper: '[data-form-wrapper]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productSlideshow: '[data-product-slideshow]',
    productImage: '[data-product-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    unitPrice: '[data-product-unit-price]',
    unitBase: '[data-product-base]',
    unitWrapper: '[data-product-unit]',
    preOrderTag: '_preorder',
    sliderEnabled: 'flickity-enabled',
    productSlide: '.product__slide',
    dataTallLayout: 'data-tall-layout',
    dataEnableHistoryState: 'data-enable-history-state',
    subPrices: '[data-subscription-watch-price]',
    subSelectors: '[data-subscription-selectors]',
    subOffWrap: '[data-price-off]',
    subsToggle: '[data-toggles-group]',
    subsChild: 'data-group-toggle',
    subOffAmount: '[data-price-off-amount]',
    subDescription: '[data-plan-description]',
    dataImageId: 'data-image-id',
    idInput: '[name="id"]',
  };

  const classes$e = {
    hide: 'hide',
    variantSoldOut: 'variant--soldout',
    variantUnavailable: 'variant--unavailabe',
    productPriceSale: 'product__price--sale',
  };

  class ProductAddForm {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.tallLayout = this.container.getAttribute(selectors$y.dataTallLayout) === 'true';
      this.product = this.container.querySelector(selectors$y.product);

      // Stop parsing if we don't have the product
      if (!this.product) {
        return;
      }

      this.productForm = this.container.querySelector(selectors$y.productForm);
      this.enableHistoryState = this.container.getAttribute(selectors$y.dataEnableHistoryState) === 'true';
      this.hasUnitPricing = this.container.querySelector(selectors$y.unitWrapper);
      this.subSelectors = this.container.querySelector(selectors$y.subSelectors);
      this.subPrices = this.container.querySelector(selectors$y.subPrices);

      const counter = new QuantityCounter(this.container);
      counter.init();

      this.init();
    }

    init() {
      let productJSON = null;
      const productElemJSON = this.container.querySelector(selectors$y.productJson);
      if (productElemJSON) {
        productJSON = productElemJSON.innerHTML;
      }
      if (productJSON) {
        this.productJSON = JSON.parse(productJSON);
        this.linkForm();
      } else {
        console.error('Missing product JSON');
      }
    }

    destroy() {
      this.productForm.destroy();
    }

    linkForm() {
      this.productForm = new ProductForm(this.productForm, this.productJSON, {
        onOptionChange: this.onOptionChange.bind(this),
        onPlanChange: this.onPlanChange.bind(this),
      });
      this.pushState(this.productForm.getFormState());
      this.subsToggleListeners();
    }

    onOptionChange(evt) {
      this.pushState(evt.dataset);
      this.updateProductImage(evt);
    }

    onPlanChange(evt) {
      if (this.subPrices) {
        this.pushState(evt.dataset);
      }
    }

    pushState(formState) {
      this.productState = this.setProductState(formState);
      this.updateAddToCartState(formState);
      this.updateProductPrices(formState);
      this.updateSubscriptionText(formState);
      if (this.enableHistoryState) {
        this.updateHistoryState(formState);
      }
    }

    updateAddToCartState(formState) {
      const variant = formState.variant;
      let addText = theme.strings.addToCart;
      const priceWrapper = this.container.querySelectorAll(selectors$y.priceWrapper);
      const addToCart = this.container.querySelectorAll(selectors$y.addToCart);
      const addToCartText = this.container.querySelectorAll(selectors$y.addToCartText);
      const formWrapper = this.container.querySelectorAll(selectors$y.formWrapper);

      if (this.productJSON.tags.includes(selectors$y.preOrderTag)) {
        addText = theme.strings.preOrder;
      }

      if (priceWrapper.length && variant) {
        priceWrapper.forEach((element) => {
          element.classList.remove(classes$e.hide);
        });
      }

      if (addToCart.length) {
        addToCart.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.disabled = false;
            } else {
              element.disabled = true;
            }
          } else {
            element.disabled = true;
          }
        });
      }

      if (addToCartText.length) {
        addToCartText.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.innerHTML = addText;
            } else {
              element.innerHTML = theme.strings.soldOut;
            }
          } else {
            element.innerHTML = theme.strings.unavailable;
          }
        });
      }

      if (formWrapper.length) {
        formWrapper.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.classList.remove(classes$e.variantSoldOut, classes$e.variantUnavailable);
            } else {
              element.classList.add(classes$e.variantSoldOut);
              element.classList.remove(classes$e.variantUnavailable);
            }
            const formSelect = element.querySelector(selectors$y.originalSelectorId);
            if (formSelect) {
              formSelect.value = variant.id;
            }
          } else {
            element.classList.add(classes$e.variantUnavailable);
            element.classList.remove(classes$e.variantSoldOut);
          }
        });
      }
    }

    updateHistoryState(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      const location = window.location.href;
      if (variant && location.includes('/product')) {
        const url = new window.URL(location);
        const params = url.searchParams;
        params.set('variant', variant.id);
        if (plan && plan.detail && plan.detail.id && this.productState.hasPlan) {
          params.set('selling_plan', plan.detail.id);
        } else {
          params.delete('selling_plan');
        }
        url.search = params.toString();
        const urlString = url.toString();
        window.history.replaceState({path: urlString}, '', urlString);
      }
    }

    getBaseUnit(variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
    }

    subsToggleListeners() {
      const toggles = this.container.querySelectorAll(selectors$y.subsToggle);

      toggles.forEach((toggle) => {
        toggle.addEventListener(
          'change',
          function (e) {
            const val = e.target.value.toString();
            const selected = this.container.querySelector(`[${selectors$y.subsChild}="${val}"]`);
            const groups = this.container.querySelectorAll(`[${selectors$y.subsChild}]`);
            if (selected) {
              selected.classList.remove(classes$e.hide);
              const first = selected.querySelector(`[name="selling_plan"]`);
              first.checked = true;
              first.dispatchEvent(new Event('change'));
            }
            groups.forEach((group) => {
              if (group !== selected) {
                group.classList.add(classes$e.hide);
                const plans = group.querySelectorAll(`[name="selling_plan"]`);
                plans.forEach((plan) => {
                  plan.checked = false;
                  plan.dispatchEvent(new Event('change'));
                });
              }
            });
          }.bind(this)
        );
      });
    }

    updateSubscriptionText(formState) {
      const plan = formState.plan;
      const subOffWrap = this.container.querySelector(selectors$y.subOffWrap);
      const subOffAmount = this.container.querySelector(selectors$y.subOffAmount);
      const planDecription = this.container.querySelector(selectors$y.subDescription);

      if (this.productState.planSale) {
        const adjustment = plan.detail.price_adjustments[0];
        const discount = adjustment.value;
        if (adjustment && adjustment.value_type === 'percentage') {
          subOffAmount.innerHTML = `${discount}%`;
        } else {
          subOffAmount.innerHTML = themeCurrency.formatMoney(discount, theme.moneyFormat);
        }
        subOffWrap.classList.remove(classes$e.hide);
      } else {
        subOffWrap.classList.add(classes$e.hide);
      }
      if (plan) {
        planDecription.innerHTML = plan.detail.description;
        planDecription.classList.remove(classes$e.hide);
      } else if (planDecription) {
        planDecription.classList.add(classes$e.hide);
      }
    }

    updateProductPrices(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      const priceWrappers = this.container.querySelectorAll(selectors$y.priceWrapper);

      priceWrappers.forEach((wrap) => {
        const comparePriceEl = wrap.querySelector(selectors$y.comparePrice);
        const productPriceEl = wrap.querySelector(selectors$y.productPrice);
        const comparePriceText = wrap.querySelector(selectors$y.comparePriceText);

        let comparePrice = '';
        let price = '';

        if (this.productState.available) {
          comparePrice = variant.compare_at_price;
          price = variant.price;
        }

        if (this.productState.hasPlan) {
          price = plan.allocation.price;
        }

        if (this.productState.planSale) {
          comparePrice = plan.allocation.compare_at_price;
          price = plan.allocation.price;
        }

        if (comparePriceEl) {
          if (this.productState.onSale || this.productState.planSale) {
            comparePriceEl.classList.remove(classes$e.hide);
            comparePriceText.classList.remove(classes$e.hide);
            productPriceEl.classList.add(classes$e.productPriceSale);
          } else {
            comparePriceEl.classList.add(classes$e.hide);
            comparePriceText.classList.add(classes$e.hide);
            productPriceEl.classList.remove(classes$e.productPriceSale);
          }
          comparePriceEl.innerHTML = themeCurrency.formatMoney(comparePrice, theme.moneyFormat);
        }

        productPriceEl.innerHTML = themeCurrency.formatMoney(price, theme.moneyFormat);
      });

      if (this.hasUnitPricing) {
        this.updateProductUnits(formState);
      }
    }

    updateProductUnits(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      let unitPrice = null;

      if (variant && variant.unit_price) {
        unitPrice = variant.unit_price;
      }
      if (plan && plan.allocation && plan.allocation.unit_price) {
        unitPrice = plan.allocation.unit_price;
      }

      if (unitPrice) {
        const base = this.getBaseUnit(variant);
        const formattedPrice = themeCurrency.formatMoney(unitPrice, theme.moneyFormat);
        this.container.querySelector(selectors$y.unitPrice).innerHTML = formattedPrice;
        this.container.querySelector(selectors$y.unitBase).innerHTML = base;
        showElement(this.container.querySelector(selectors$y.unitWrapper));
      } else {
        hideElement(this.container.querySelector(selectors$y.unitWrapper));
      }
    }

    /**
     * Tracks aspects of the product state that are relevant to UI updates
     * @param {object} evt - variant change event
     * @return {object} productState - represents state of variant + plans
     *  productState.available - current variant and selling plan options result in valid offer
     *  productState.soldOut - variant is sold out
     *  productState.onSale - variant is on sale
     *  productState.showUnitPrice - variant has unit price
     *  productState.requiresPlan - all the product variants requires a selling plan
     *  productState.hasPlan - there is a valid selling plan
     *  productState.planSale - plan has a discount to show next to price
     *  productState.planPerDelivery - plan price does not equal per_delivery_price - a prepaid subscribtion
     */
    setProductState(dataset) {
      const variant = dataset.variant;
      const plan = dataset.plan;

      const productState = {
        available: true,
        soldOut: false,
        onSale: false,
        showUnitPrice: false,
        requiresPlan: false,
        hasPlan: false,
        planPerDelivery: false,
        planSale: false,
      };

      if (!variant || (variant.requires_selling_plan && !plan)) {
        productState.available = false;
      } else {
        if (!variant.available) {
          productState.soldOut = true;
        }

        if (variant.compare_at_price > variant.price) {
          productState.onSale = true;
        }

        if (variant.unit_price) {
          productState.showUnitPrice = true;
        }

        if (this.product && this.product.requires_selling_plan) {
          productState.requiresPlan = true;
        }

        if (plan && this.subPrices) {
          productState.hasPlan = true;
          if (plan.allocation.per_delivery_price !== plan.allocation.price) {
            productState.planPerDelivery = true;
          }
          if (variant.price > plan.allocation.price) {
            productState.planSale = true;
          }
        }
      }
      return productState;
    }

    updateProductImage(evt) {
      const variant = evt.dataset.variant;

      if (variant) {
        // Update variant image, if one is set
        if (variant.featured_media) {
          const newImg = this.container.querySelector(`${selectors$y.productImage}[${selectors$y.dataImageId}="${variant.featured_media.id}"]`);
          const newImageParent = newImg.closest(selectors$y.productSlide);
          // If we have a mobile breakpoint or the tall layout is disabled,
          // just switch the slideshow.
          if (newImageParent) {
            const newImagePos = Array.from(newImageParent.parentElement.children).indexOf(newImageParent);
            const slider = this.container.querySelector(selectors$y.productSlideshow);

            if (slider && slider.classList.contains(selectors$y.sliderEnabled)) {
              FlickityFade.data(slider).select(newImagePos);
            }

            if (!theme.variables.bpSmall && this.tallLayout) {
              // We know its a tall layout, if it's sticky
              // scroll to the images
              // Scroll to/reorder image unless it's the first photo on load
              const targetScroll = newImg.getBoundingClientRect().top + window.scrollY;

              if (newImagePos === 0 && targetScroll > window.pageYOffset) return;

              // Scroll to variant image
              document.dispatchEvent(new CustomEvent('poppy:close'));
              window.scrollTo({
                top: targetScroll,
                left: 0,
                behavior: 'smooth',
              });
            }
          }
        }
      }
    }
  }

  const productFormSection = {
    onLoad() {
      this.section = new ProductAddForm(this);
    },
  };

  const selectors$z = {
    elements: {
      accordion: '[data-accordion]',
      accordionToggle: '[data-accordion-toggle]',
      accordionBody: '[data-accordion-body]',
      accordionExpandValue: 'data-accordion-expand',
      accordionBlockValue: 'data-block-id',
    },
    classes: {
      open: 'is-open',
    },
  };

  const sections$g = {};

  class GlobalAccordions {
    constructor(el) {
      this.container = el.container;
      this.accordion = this.container.querySelector(selectors$z.elements.accordion);
      this.accordionToggles = this.container.querySelectorAll(selectors$z.elements.accordionToggle);
      this.accordionTogglesLength = this.accordionToggles.length;
      this.accordionBody = this.container.querySelector(selectors$z.elements.accordionBody);

      if (this.accordionTogglesLength && this.accordionBody) {
        this.accordionEvents();
      }
    }

    accordionEvents() {
      this.accordionToggles.forEach((element) => {
        element.addEventListener(
          'click',
          throttle((event) => {
            event.preventDefault();
            const targetAccordionBody = element.parentElement.querySelector(selectors$z.elements.accordionBody);
            if (targetAccordionBody) {
              slideToggle(targetAccordionBody);
              element.classList.toggle(selectors$z.classes.open);
            }
          }, 800)
        );
      });

      if (this.accordion.getAttribute(selectors$z.elements.accordionExpandValue) === 'true') {
        this.accordionToggles[0].classList.add(selectors$z.classes.open);

        showElement(this.accordionToggles[0].parentElement.querySelector(selectors$z.elements.accordionBody));
      }
    }

    blockToggle(evt, blockSelect = true) {
      const targetAccordionToggle = this.container.querySelector(`${selectors$z.elements.accordionToggle}[${selectors$z.elements.accordionBlockValue}="${evt.detail.blockId}"]`);
      if (!targetAccordionToggle) return;
      const targetAccordionBody = targetAccordionToggle.parentElement.querySelector(selectors$z.elements.accordionBody);
      if (!targetAccordionBody) return;
      targetAccordionToggle.classList.toggle(selectors$z.classes.open, blockSelect);
      if (blockSelect) {
        slideDown(targetAccordionBody);
      } else {
        slideUp(targetAccordionBody);
      }
    }

    onDeselect() {
      if (this.accordionBody && this.accordionTogglesLength && this.accordionTogglesLength < 2) {
        slideUp(this.accordionBody);
        this.accordionToggles[0].classList.remove(selectors$z.classes.open);
      }
    }

    onSelect() {
      if (this.accordionBody && this.accordionTogglesLength && this.accordionTogglesLength < 2) {
        slideDown(this.accordionBody);
        this.accordionToggles[0].classList.add(selectors$z.classes.open);
      }
    }

    onBlockSelect(evt) {
      this.blockToggle(evt, true);
    }

    onBlockDeselect(evt) {
      this.blockToggle(evt, false);
    }
  }

  const accordions = {
    onLoad() {
      sections$g[this.id] = new GlobalAccordions(this);
    },
    onSelect() {
      sections$g[this.id].onSelect();
    },
    onDeselect() {
      sections$g[this.id].onDeselect();
    },
    onBlockSelect(e) {
      sections$g[this.id].onBlockSelect(e);
    },
    onBlockDeselect(e) {
      sections$g[this.id].onBlockDeselect(e);
    },
  };

  const selectors$A = {
    body: 'body',
    dataRelatedSectionElem: '[data-related-section]',
    dataTab: 'data-tab',
    dataTabIndex: 'data-tab-index',
    blockId: 'data-block-id',
    tabsLi: 'ul.tabs > li',
    tabLink: '.tab-link',
    tabLinkRecent: '.tab-link__recent',
    tabContent: '.tab-content',
    scrollbarHolder: '[data-scrollbar]',
    scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
    scrollbarArrowNext: '[data-scrollbar-arrow-next]',
  };

  const classes$f = {
    classCurrent: 'current',
    classHide: 'hide',
    classAlt: 'alt',
  };

  const sections$h = {};

  class GlobalTabs {
    constructor(section) {
      this.container = section.container;
      this.body = document.querySelector(selectors$A.body);
      this.accessibility = window.accessibility;

      if (this.container) {
        this.scrollbarHolder = this.container.querySelectorAll(selectors$A.scrollbarHolder);

        this.init();

        // Init native scrollbar
        this.initNativeScrollbar();
      }
    }

    init() {
      const ctx = this.container;
      const tabsNavList = ctx.querySelectorAll(selectors$A.tabsLi);
      const firstTabLink = ctx.querySelector(`${selectors$A.tabLink}-0`);
      const firstTabContent = ctx.querySelector(`${selectors$A.tabContent}-0`);

      if (firstTabContent) {
        firstTabContent.classList.add(classes$f.classCurrent);
      }

      if (firstTabLink) {
        firstTabLink.classList.add(classes$f.classCurrent);
      }

      this.checkVisibleTabLinks();
      this.container.addEventListener('tabs:checkRecentTab', () => this.checkRecentTab());
      this.container.addEventListener('tabs:hideRelatedTab', () => this.hideRelatedTab());

      if (tabsNavList.length) {
        tabsNavList.forEach((element) => {
          const tabId = parseInt(element.getAttribute(selectors$A.dataTab));
          const tab = ctx.querySelector(`${selectors$A.tabContent}-${tabId}`);

          element.addEventListener('click', () => {
            this.tabChange(element, tab);
          });

          element.addEventListener('keyup', (event) => {
            if ((event.which === window.theme.keyboardKeys.SPACE || event.which === window.theme.keyboardKeys.ENTER) && this.body.classList.contains('is-focused')) {
              this.tabChange(element, tab);

              if (tab.querySelector('a, input')) {
                this.accessibility.lastFocused = element;

                this.accessibility.a11y.trapFocus(tab, {
                  elementToFocus: tab.querySelector('a:first-child, input:first-child'),
                });
              }
            }
          });
        });
      }
    }

    tabChange(element, tab) {
      this.container.querySelector(`${selectors$A.tabsLi}.${classes$f.classCurrent}`).classList.remove(classes$f.classCurrent);
      this.container.querySelector(`${selectors$A.tabContent}.${classes$f.classCurrent}`).classList.remove(classes$f.classCurrent);

      element.classList.add(classes$f.classCurrent);
      tab.classList.add(classes$f.classCurrent);

      if (element.classList.contains(classes$f.classHide)) {
        tab.classList.add(classes$f.classHide);
      }

      this.checkVisibleTabLinks();

      this.accessibility.a11y.removeTrapFocus();
    }

    initNativeScrollbar() {
      if (this.scrollbarHolder.length) {
        this.scrollbarHolder.forEach((scrollbar) => {
          new NativeScrollbar(scrollbar);
        });
      }
    }

    checkVisibleTabLinks() {
      const tabsNavList = this.container.querySelectorAll(selectors$A.tabsLi);
      const tabsNavListHided = this.container.querySelectorAll(`${selectors$A.tabLink}.${classes$f.classHide}`);
      const difference = tabsNavList.length - tabsNavListHided.length;

      if (difference < 2) {
        this.container.classList.add(classes$f.classAlt);
      } else {
        this.container.classList.remove(classes$f.classAlt);
      }
    }

    checkRecentTab() {
      const tabLink = this.container.querySelector(selectors$A.tabLinkRecent);

      if (tabLink) {
        tabLink.classList.remove(classes$f.classHide);
        const tabLinkIdx = parseInt(tabLink.getAttribute(selectors$A.dataTab));
        const tabContent = this.container.querySelector(`${selectors$A.tabContent}[${selectors$A.dataTabIndex}="${tabLinkIdx}"]`);

        if (tabContent) {
          tabContent.classList.remove(classes$f.classHide);
        }

        this.checkVisibleTabLinks();
      }
    }

    hideRelatedTab() {
      const relatedSection = this.container.querySelector(selectors$A.dataRelatedSectionElem);
      if (!relatedSection) {
        return;
      }

      const parentTabContent = relatedSection.closest(`${selectors$A.tabContent}.${classes$f.classCurrent}`);
      if (!parentTabContent) {
        return;
      }
      const parentTabContentIdx = parseInt(parentTabContent.getAttribute(selectors$A.dataTabIndex));
      const tabsNavList = this.container.querySelectorAll(selectors$A.tabsLi);

      if (tabsNavList.length > parentTabContentIdx) {
        const nextTabsNavLink = tabsNavList[parentTabContentIdx].nextSibling;

        if (nextTabsNavLink) {
          tabsNavList[parentTabContentIdx].classList.add(classes$f.classHide);
          nextTabsNavLink.dispatchEvent(new Event('click'));
        }
      }
    }

    onBlockSelect(evt) {
      const element = this.container.querySelector(`${selectors$A.tabLink}[${selectors$A.blockId}="${evt.detail.blockId}"]`);
      if (element) {
        element.dispatchEvent(new Event('click'));

        element.parentNode.scrollTo({
          top: 0,
          left: element.offsetLeft - element.clientWidth,
          behavior: 'smooth',
        });
      }
    }
  }

  const tabs = {
    onLoad() {
      sections$h[this.id] = new GlobalTabs(this);
    },
    onBlockSelect(e) {
      sections$h[this.id].onBlockSelect(e);
    },
  };

  window.theme.variables = {
    productPageSticky: false,
    bpSmall: false,
    mediaQuerySmall: 750,
  };

  const selectors$B = {
    addToCart: '[data-add-to-cart]',
    priceWrapper: '[data-price-wrapper]',
    slideshow: '[data-product-slideshow]',
    productImage: '[data-product-image]',
    productJson: '[data-product-json]',
    form: '[data-product-form]',
    thumbs: '[data-product-thumbs]',
    dataSectionId: 'data-section-id',
    dataTallLayout: 'data-tall-layout',
    dataStickyEnabled: 'data-sticky-enabled',
    dataCartBar: 'data-cart-bar',
    dataReviews: 'data-reviews',
    dataProductShare: '[data-product-share]',
    productPage: '.product__page',
    formWrapper: '.form__wrapper',
    cartBar: '#cart-bar',
    productSubmitAdd: '.product__submit__add',
    cartBarAdd: 'data-add-to-cart-bar',
    cartBarScroll: 'data-cart-bar-scroll',
    templateProduct: '#template-product',
    siteFooterWrapper: '.site-footer-wrapper',
    shopifyProductReviews: '#shopify-product-reviews',
    toggleTruncateHolder: '[data-truncated-holder]',
    toggleTruncateButton: '[data-truncated-button]',
    toggleTruncateContent: '[data-truncated-content]',
    toggleTruncateContentAttr: 'data-truncated-content',
    headerSticky: '[data-header-sticky="sticky"]',
    upsellButton: '[data-upsell-btn]',
    upsellButtonText: '[data-upsell-btn-text]',
    scrollToElement: '[data-scroll-to]',
    accordionToggle: '[data-accordion-toggle]',
    accordionBody: '[data-accordion-body]',
    headerHeight: '[data-header-height]',
  };

  const classes$g = {
    classExpanded: 'is-expanded',
    classSticky: 'is-sticky',
    classStickyHeader: 'with-sticky-header',
    classVisible: 'is-visible',
    classSiteFooterPush: 'site-footer--push',
    open: 'is-open',
  };

  const sections$i = {};

  /**
   * Product section constructor.
   * @param {string} container - selector for the section container DOM element
   */
  class Product {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.id = this.container.getAttribute(selectors$B.dataSectionId);
      this.tallLayout = this.container.getAttribute(selectors$B.dataTallLayout) === 'true';
      this.stickyEnabled = this.container.getAttribute(selectors$B.dataStickyEnabled) === 'true';
      this.headerSticky = document.querySelector(selectors$B.headerSticky) !== null;
      this.showReviews = this.container.getAttribute(selectors$B.dataReviews) === 'true';
      this.thumbs = this.container.querySelector(selectors$B.thumbs);
      this.shareButton = this.container.querySelector(selectors$B.dataProductShare);
      this.upsellButton = this.container.querySelector(selectors$B.upsellButton);
      this.scrollToButton = this.container.querySelector(selectors$B.scrollToElement);
      this.truncateElementHolder = this.container.querySelector(selectors$B.toggleTruncateHolder);
      this.truncateElement = this.container.querySelector(selectors$B.toggleTruncateContent);
      this.resizeEventTruncate = () => this.truncateText();
      this.resizeEventSticky = () => this.stickyScrollCheck();
      this.resizeEventUpsell = () => this.calcUpsellButtonDemensions();
      this.scrollEvent = () => this.scrollTop();

      if (this.scrollToButton) {
        this.scrollToReviews();
      }

      this.shareToggle();

      if (this.truncateElementHolder && this.truncateElement) {
        setTimeout(this.resizeEventTruncate, 50);
        document.addEventListener('theme:resize', this.resizeEventTruncate);
      }

      // Stop parsing if we don't have the product json script tag when loading
      // section in the Theme Editor
      const productJson = this.container.querySelector(selectors$B.productJson);
      if ((productJson && !productJson.innerHTML) || !productJson) {
        const counter = new QuantityCounter(this.container);
        counter.init();
        return;
      }

      this.form = this.container.querySelector(selectors$B.form);

      this.init();

      if (this.stickyEnabled) {
        this.stickyScroll();
      }

      if (this.container.getAttribute(selectors$B.dataCartBar) === 'true') {
        this.initCartBar();
      }

      const reviewsAppInstalled = typeof window.SPR == 'function';

      if (this.showReviews && reviewsAppInstalled) {
        window.SPR.initDomEls();
        window.SPR.loadBadges();
      }

      if (this.upsellButton) {
        this.upsellButtonDemensions();
      }
    }

    init() {
      theme.mediaInstances[this.id] = new Media(this.section);
      theme.mediaInstances[this.id].init();
    }

    upsellButtonDemensions() {
      this.calcUpsellButtonDemensions();

      document.addEventListener('theme:resize', this.resizeEventUpsell);
    }

    calcUpsellButtonDemensions() {
      const upsellButtonText = this.upsellButton.querySelector(selectors$B.upsellButtonText);
      if (upsellButtonText) {
        this.upsellButton.style.setProperty('--btn-text-width', `${upsellButtonText.clientWidth}px`);
      }
    }

    stickyScroll() {
      this.stickyScrollCheck();

      document.addEventListener('theme:resize', this.resizeEventSticky);
    }

    stickyScrollCheck() {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const isDesktop = windowWidth >= theme.variables.mediaQuerySmall;
      const form = this.container.querySelector(selectors$B.formWrapper);
      const targetFormWrapper = this.container.querySelector(`${selectors$B.productPage} ${selectors$B.formWrapper}`);

      let noReviews = true;
      if (this.showReviews) {
        noReviews = false;
      }

      if (isDesktop) {
        const slideshow = this.container.querySelector(selectors$B.slideshow);
        if (!form || !slideshow) return;
        const productCopyHeight = form.offsetHeight;
        const productImagesHeight = slideshow.offsetHeight;

        // Is the product description and form taller than window space
        // Is is also shorter than the window and images
        if (productCopyHeight < productImagesHeight && productCopyHeight < window.innerHeight && noReviews) {
          theme.variables.productPageSticky = true;

          targetFormWrapper.classList.add(classes$g.classSticky);
          if (this.headerSticky) {
            targetFormWrapper.classList.add(classes$g.classStickyHeader);
          }
        } else {
          theme.variables.productPageSticky = false;
          targetFormWrapper.classList.remove(classes$g.classSticky);
        }
      } else {
        targetFormWrapper.classList.remove(classes$g.classSticky);
      }
    }

    truncateText() {
      const truncateRows = 5;
      const truncateElementCloned = this.truncateElement.cloneNode(true);
      const truncateElementClass = this.truncateElement.getAttribute(selectors$B.toggleTruncateContentAttr);
      const truncateNextElement = this.truncateElement.nextElementSibling;
      if (truncateNextElement) {
        truncateNextElement.remove();
      }

      this.truncateElement.parentElement.append(truncateElementCloned);

      const truncateAppendedElement = this.truncateElement.nextElementSibling;
      truncateAppendedElement.classList.add(truncateElementClass);
      truncateAppendedElement.removeAttribute(selectors$B.toggleTruncateContentAttr);

      showElement(truncateAppendedElement);

      ellipsed.ellipsis(truncateAppendedElement, truncateRows, {
        replaceStr: '',
      });

      hideElement(truncateAppendedElement);

      if (this.truncateElement.innerHTML !== truncateAppendedElement.innerHTML) {
        this.truncateElementHolder.classList.add(classes$g.classExpanded);
      } else {
        truncateAppendedElement.remove();
        this.truncateElementHolder.classList.remove(classes$g.classExpanded);
      }

      this.toggleTruncatedContent(this.truncateElementHolder);
    }

    toggleTruncatedContent(holder) {
      const toggleButton = holder.querySelector(selectors$B.toggleTruncateButton);
      if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
          e.preventDefault();
          holder.classList.remove(classes$g.classExpanded);
        });
      }
    }

    shareToggle() {
      if (this.shareButton) {
        this.shareButton.addEventListener('click', function () {
          if (navigator.share) {
            navigator
              .share({
                title: 'WebShare API Demo',
                url: 'https://codepen.io/ayoisaiah/pen/YbNazJ',
              })
              .then(() => {
                console.log('Thanks for sharing!');
              })
              .catch(console.error);
          } else {
            this.parentElement.classList.toggle(classes$g.classExpanded);
          }
        });
      }
    }

    initCartBar() {
      const cartBar = document.querySelector(selectors$B.cartBar);
      const cartBarBtn = cartBar.querySelector(selectors$B.productSubmitAdd);

      // Submit product form on cart bar button click
      if (cartBarBtn) {
        cartBarBtn.addEventListener('click', (e) => {
          e.preventDefault();

          if (e.target.hasAttribute(selectors$B.cartBarAdd)) {
            this.form.querySelector(selectors$B.addToCart).dispatchEvent(
              new Event('click', {
                bubbles: true,
              })
            );
          } else if (e.target.hasAttribute(selectors$B.cartBarScroll)) {
            this.scrollToTop();
          }
        });

        if (cartBarBtn.hasAttribute(selectors$B.cartBarAdd)) {
          document.addEventListener('product:bar:error', () => this.scrollToTop());
        }
      }

      this.cartBar = cartBar;

      document.addEventListener('theme:scroll', this.scrollEvent);
    }

    scrollToTop() {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const isDesktop = windowWidth >= theme.variables.mediaQuerySmall;
      const scrollTarget = isDesktop ? this.container : this.form;

      window.scrollTo({
        top: scrollTarget.getBoundingClientRect().top + window.scrollY,
        left: 0,
        behavior: 'smooth',
      });
    }

    scrollTop() {
      const scrolled = window.pageYOffset;
      const siteFooter = document.querySelector(selectors$B.siteFooterWrapper);

      if (this.form && this.cartBar) {
        const formOffset = this.form.offsetTop;
        const formHeight = this.form.offsetHeight;
        const checkPosition = scrolled > formOffset + formHeight;

        this.cartBar.classList.toggle(classes$g.classVisible, checkPosition);
        siteFooter.classList.toggle(classes$g.classSiteFooterPush, checkPosition);

        siteFooter.style.marginBottom = siteFooter.classList.contains(classes$g.classSiteFooterPush) ? `${this.cartBar.offsetHeight}px` : '0';
      }
    }

    scrollToReviews() {
      this.scrollToButton.addEventListener('click', (e) => {
        e.preventDefault();

        const element = document.querySelector(this.scrollToButton.getAttribute('href'));

        if (!element) {
          return;
        }

        let headerHeight = 0;

        if (this.headerSticky) {
          headerHeight = document.querySelector(selectors$B.headerHeight).getBoundingClientRect().height;
        }

        const accordionBody = element.querySelector(selectors$B.accordionBody);
        const accordionToggle = element.querySelector(selectors$B.accordionToggle);

        window.scrollTo({
          top: element.getBoundingClientRect().top - headerHeight,
          left: 0,
          behavior: 'smooth',
        });

        slideDown(accordionBody);
        accordionToggle.classList.add(classes$g.open);
      });

      // Adding attributes to Yotpo elements to be missed screen readers
      window.onload = () => {
        if (this.scrollToButton.nextElementSibling.querySelectorAll('*')) {
          this.scrollToButton.nextElementSibling.querySelectorAll('*').forEach((item) => {
            item.setAttribute('tabindex', '-1');
            item.setAttribute('aria-hidden', true);
          });
        }
      };
    }

    onUnload() {
      if (this.truncateElementHolder && this.truncateElement) {
        document.removeEventListener('theme:resize', this.resizeEventTruncate);
      }

      if (this.stickyEnabled) {
        document.removeEventListener('theme:resize', this.resizeEventSticky);
      }

      if (this.upsellButton) {
        document.removeEventListener('theme:resize', this.resizeEventUpsell);
      }

      if (this.container.getAttribute(selectors$B.dataCartBar) === 'true') {
        document.removeEventListener('theme:scroll', this.scrollEvent);
      }
    }
  }

  const productSection = {
    onLoad() {
      sections$i[this.id] = new Product(this);
    },
    onUnload(e) {
      sections$i[this.id].onUnload(e);
    },
  };

  register('product', [productFormSection, productSection, swatchSection, tooltipSection, popoutSection, tabs, accordions, copyClipboard]);

  const selectors$C = {
    dataRelatedSectionElem: '[data-related-section]',
    dataRelatedProduct: '[data-product-grid-item]',
    dataProductId: 'data-product-id',
    dataLimit: 'data-limit',
    recentlyViewed: '#RecentlyViewed',
    recentlyProduct: '#recently-viewed-products .product-item',
  };

  class Related {
    constructor(section) {
      this.section = section;
      this.container = section.container;

      this.init();
      this.recent();
    }

    init() {
      const relatedSection = this.container.querySelector(selectors$C.dataRelatedSectionElem);

      if (!relatedSection) {
        return;
      }

      const self = this;
      const productId = relatedSection.getAttribute(selectors$C.dataProductId);
      const limit = relatedSection.getAttribute(selectors$C.dataLimit);
      const requestUrl = `${window.theme.routes.product_recommendations_url}?section_id=related&limit=${limit}&product_id=${productId}`;

      fetch(requestUrl)
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          const createdElement = document.createElement('div');
          createdElement.innerHTML = data;
          const inner = createdElement.querySelector(selectors$C.dataRelatedSectionElem);

          if (inner.querySelector(selectors$C.dataRelatedProduct)) {
            const innerHtml = inner.innerHTML;
            hideElement(relatedSection);
            relatedSection.innerHTML = innerHtml;
            slideDown(relatedSection);

            relatedSection.querySelectorAll(selectors$C.dataRelatedProduct).forEach((item) => {
              new QuickAddProduct(item);
            });

            makeGridSwatches(self.section);
          } else {
            self.container.dispatchEvent(
              new CustomEvent('tabs:hideRelatedTab', {
                bubbles: true,
              })
            );
          }
        })
        .catch(function () {
          self.container.dispatchEvent(
            new CustomEvent('tabs:hideRelatedTab', {
              bubbles: true,
            })
          );
        });
    }

    recent() {
      const recentlyViewed = this.container.querySelector(selectors$C.recentlyViewed);
      let howManyToshow = 4;

      if (recentlyViewed) {
        howManyToshow = parseInt(recentlyViewed.getAttribute(selectors$C.dataLimit));
        Shopify.Products.recordRecentlyViewed();
      }

      Shopify.Products.showRecentlyViewed({
        howManyToShow: howManyToshow,
        onComplete: () => {
          const recentProductsCount = this.container.querySelectorAll(selectors$C.recentlyProduct).length;

          if (recentProductsCount > 0) {
            fadeIn(recentlyViewed);

            this.container.dispatchEvent(
              new CustomEvent('tabs:checkRecentTab', {
                bubbles: true,
              })
            );

            this.container.querySelectorAll(selectors$C.recentlyProduct).forEach((item) => {
              new QuickAddProduct(item);
            });

            makeGridSwatches(this.section);
          }
        },
      });
    }
  }

  const relatedSection = {
    onLoad() {
      this.section = new Related(this);

      this.container.querySelectorAll(selectors$C.dataRelatedProduct).forEach((item) => {
        new QuickAddProduct(item);
      });
    },
  };

  register('related', [relatedSection, popoutSection, tabs]);

  const selectors$D = {
    scrollElement: '[data-block-scroll]',
    flickityEnabled: 'flickity-enabled',
  };

  const sections$j = {};

  class BlockScroll {
    constructor(el) {
      this.container = el.container;
    }

    onBlockSelect(evt) {
      const scrollElement = this.container.querySelector(selectors$D.scrollElement);
      if (scrollElement && !scrollElement.classList.contains(selectors$D.flickityEnabled)) {
        const currentElement = evt.srcElement;
        if (currentElement) {
          scrollElement.scrollTo({
            top: 0,
            left: currentElement.offsetLeft,
            behavior: 'smooth',
          });
        }
      }
    }
  }

  const blockScroll = {
    onLoad() {
      sections$j[this.id] = new BlockScroll(this);
    },
    onBlockSelect(e) {
      sections$j[this.id].onBlockSelect(e);
    },
  };

  const sections$k = {};

  const selectors$E = {
    logo: '[data-slider-logo]',
    text: '[data-slider-text]',
    slide: '[data-slide]',
    slideData: 'data-slide',
    asNavFor: '#nav-for-',
    slideIndex: 'data-slide-index',
    flickityEnabled: 'flickity-enabled',
  };

  const classes$h = {
    classIsSelected: 'is-selected',
  };

  class LogoList {
    constructor(section) {
      this.container = section.container;
      this.slideshowText = this.container.querySelector(selectors$E.text);
      this.slideshowNav = this.container.querySelector(selectors$E.logo);
      this.logoSlides = this.slideshowNav.querySelectorAll(selectors$E.slide);
      this.textSlides = this.slideshowText.querySelectorAll(selectors$E.slide);
      this.resizeEvent = debounce(() => this.setSlideshowNavState(), 200);
      this.flkty = null;
      this.flktyNav = null;

      this.init();
    }

    init() {
      this.flkty = new Flickity(this.slideshowText, {
        autoPlay: false,
        prevNextButtons: false,
        contain: true,
        pageDots: false,
        wrapAround: false,
        selectedAttraction: 0.3,
        friction: 0.8,
        draggable: false,
      });

      this.logoSlides.forEach((element) => {
        element.addEventListener('click', (e) => {
          const index = parseInt(e.currentTarget.getAttribute(selectors$E.slideIndex));
          const hasSlider = this.slideshowNav.classList.contains(selectors$E.flickityEnabled);

          this.flkty.select(index);
          if (hasSlider) {
            this.flktyNav.select(index);
            if (!this.slideshowNav.classList.contains(classes$h.classIsSelected)) {
              this.flktyNav.playPlayer();
            }
          } else {
            const selectedSlide = this.slideshowNav.querySelector(`.${classes$h.classIsSelected}`);
            if (selectedSlide) {
              selectedSlide.classList.remove(classes$h.classIsSelected);
            }
            e.currentTarget.classList.add(classes$h.classIsSelected);
          }
        });
      });

      let maxHeight = -1;
      if (this.textSlides) {
        this.textSlides.forEach((element) => {
          const elementHeight = parseFloat(getComputedStyle(element, null).height.replace('px', ''));

          if (elementHeight > maxHeight) {
            maxHeight = elementHeight;
          }
        });

        this.textSlides.forEach((element) => {
          const elementHeight = parseFloat(getComputedStyle(element, null).height.replace('px', ''));

          if (elementHeight < maxHeight) {
            const calculateMargin = Math.ceil((maxHeight - elementHeight) / 2);
            element.style.margin = `${calculateMargin}px 0`;
          }
        });
      }

      this.initSlideshowNav();
    }

    onUnload() {
      const sliderInitialized = this.slideshowNav.classList.contains(selectors$E.flickityEnabled);
      if (sliderInitialized) {
        this.flktyNav.destroy();
      }

      this.flkty.destroy();

      window.removeEventListener('resize', this.resizeEvent);
    }

    onBlockSelect(evt) {
      const slide = this.slideshowNav.querySelector(`[${selectors$E.slideData}="${evt.detail.blockId}"]`);
      const slideIndex = parseInt(slide.getAttribute(selectors$E.slideIndex));

      if (this.slideshowNav.classList.contains(selectors$E.flickityEnabled)) {
        this.flktyNav.select(slideIndex);
        this.flktyNav.stopPlayer();
        this.slideshowNav.classList.add(classes$h.classIsSelected);
      } else {
        slide.dispatchEvent(new Event('click'));
      }

      this.flkty.select(slideIndex);
    }

    onBlockDeselect() {
      if (this.slideshowNav.classList.contains(selectors$E.flickityEnabled)) {
        this.flktyNav.playPlayer();
        this.slideshowNav.classList.remove(classes$h.classIsSelected);
      }
    }

    setSlideshowNavState() {
      const slidesCount = this.slideshowNav.querySelectorAll(selectors$E.slide).length;
      const slideWidth = 200;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const slidesWidth = slidesCount * slideWidth;
      const sliderInitialized = this.slideshowNav.classList.contains(selectors$E.flickityEnabled);

      if (slidesWidth > windowWidth) {
        if (!sliderInitialized) {
          const selectedSlide = this.slideshowNav.querySelector(`.${classes$h.classIsSelected}`);
          if (selectedSlide) {
            selectedSlide.classList.remove(classes$h.classIsSelected);
          }

          this.flktyNav = new Flickity(this.slideshowNav, {
            autoPlay: 4000,
            prevNextButtons: false,
            contain: true,
            pageDots: false,
            wrapAround: true,
            watchCSS: true,
            selectedAttraction: 0.05,
            friction: 0.8,
          });

          if (this.flkty) {
            this.flkty.select(0);

            this.flktyNav.on('change', (index) => this.flkty.select(index));
          }
        }
      } else if (sliderInitialized) {
        this.flktyNav.destroy();
        this.logoSlides[0].classList.add(classes$h.classIsSelected);

        if (this.flkty) {
          this.flkty.select(0);
        }
      }
    }

    initSlideshowNav() {
      this.setSlideshowNavState();

      window.addEventListener('resize', this.resizeEvent);
    }
  }

  const LogoListSection = {
    onLoad() {
      sections$k[this.id] = new LogoList(this);
    },
    onUnload(e) {
      sections$k[this.id].onUnload(e);
    },
    onBlockSelect(e) {
      sections$k[this.id].onBlockSelect(e);
    },
    onBlockDeselect(e) {
      sections$k[this.id].onBlockDeselect(e);
    },
  };

  register('logos', [LogoListSection, blockScroll]);

  const selectors$F = {
    videoPlay: '[data-video-play]',
    videoPlayValue: 'data-video-play',
  };

  class VideoPlay {
    constructor(section) {
      this.container = section;
      this.videoPlay = this.container.querySelector(selectors$F.videoPlay);

      if (this.videoPlay) {
        this.videoPlay.addEventListener('click', function (e) {
          if (this.hasAttribute(selectors$F.videoPlayValue) && this.getAttribute(selectors$F.videoPlayValue).trim() !== '') {
            e.preventDefault();

            const items = [
              {
                html: this.getAttribute(selectors$F.videoPlayValue),
              },
            ];

            new LoadPhotoswipe(items);
          }
        });
      }
    }
  }

  const videoPlay = {
    onLoad() {
      new VideoPlay(this.container);
    },
  };

  /**
   * FeaturedVideo Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the FeaturedVideo template.
   *
   * @namespace FeaturedVideo
   */

  register('featured-video', [videoPlay]);

  /**
   * FeaturedBackgroundVideo Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the FeaturedBackgroundVideo template.
   *
   * @namespace FeaturedBackgroundVideo
   */

  register('featured-background-video', [loadVideoYT, loadVideoVimeo]);

  register('slideshow', [slider, parallaxHero]);

  register('image-with-text', [videoPlay, parallaxHero, productGridReviews, quickAddProduct, swatchGridSection]);

  var styles = {};
  styles.basic = [];

  styles.light = [
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '64'}, {hue: '#ff0000'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
    {featureType: 'administrative', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f0f0f0'}, {visibility: 'simplified'}]},
    {featureType: 'landscape.natural.landcover', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'labels', stylers: [{lightness: '100'}]},
    {featureType: 'poi.park', elementType: 'all', stylers: [{visibility: 'on'}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{saturation: '-41'}, {color: '#e8ede7'}]},
    {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: '-100'}]},
    {featureType: 'road', elementType: 'labels', stylers: [{lightness: '25'}, {gamma: '1.06'}, {saturation: '-100'}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{gamma: '10.00'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}, {visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{gamma: '10.00'}, {lightness: '100'}, {weight: '0.4'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'simplified'}, {weight: '0.01'}, {lightness: '39'}]},
    {featureType: 'road.local', elementType: 'labels.text.stroke', stylers: [{weight: '0.50'}, {gamma: '10.00'}, {lightness: '100'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#cfe5ee'}, {visibility: 'on'}]},
  ];

  styles.white_label = [
    {featureType: 'all', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{gamma: '3.86'}, {lightness: '100'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#cccccc'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f2f2f2'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: -100}, {lightness: 45}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#e4e4e4'}, {visibility: 'on'}]},
  ];

  styles.dark_label = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'all', elementType: 'labels.text.fill', stylers: [{saturation: 36}, {color: '#000000'}, {lightness: 40}]},
    {featureType: 'all', elementType: 'labels.text.stroke', stylers: [{visibility: 'on'}, {color: '#000000'}, {lightness: 16}]},
    {featureType: 'all', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 17}, {weight: 1.2}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '-82'}]},
    {featureType: 'administrative', elementType: 'labels.text.stroke', stylers: [{invert_lightness: true}, {weight: '7.15'}]},
    {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 21}]},
    {featureType: 'road', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 17}, {weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 29}, {weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 18}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 16}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 19}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 17}]},
  ];

  function mapStyle(key) {
    return styles[key];
  }

  window.theme.allMaps = window.theme.allMaps || {};
  let allMaps = window.theme.allMaps;

  window.theme.mapAPI = window.theme.mapAPI || null;

  /* global google */

  class Map {
    constructor(section) {
      this.container = section.container;
      this.mapContainer = this.container.querySelector('[data-map-container]');
      this.key = this.container.getAttribute('data-api-key');
      this.styleString = this.container.getAttribute('data-style') || '';
      this.zoomString = this.container.getAttribute('data-zoom') || 14;
      this.address = this.container.getAttribute('data-address');
      this.enableCorrection = this.container.getAttribute('data-latlong-correction');
      this.lat = this.container.getAttribute('data-lat');
      this.long = this.container.getAttribute('data-long');

      if (this.key) {
        this.initMaps();
      }
    }

    initMaps() {
      const apiLoaded = loadAPI(this.key);
      apiLoaded
        .then(() => {
          return this.enableCorrection === 'true' && this.lat !== '' && this.long !== '' ? new google.maps.LatLng(this.lat, this.long) : geocodeAddressPromise(this.address);
        })
        .then((center) => {
          const zoom = parseInt(this.zoomString, 10);
          const styles = mapStyle(this.styleString);
          const mapOptions = {
            zoom,
            styles,
            center,
            draggable: true,
            clickableIcons: false,
            scrollwheel: false,
            zoomControl: false,
            disableDefaultUI: true,
          };
          const map = createMap(this.mapContainer, mapOptions);

          return map;
        })
        .then((map) => {
          this.map = map;
          allMaps[this.id] = map;
        })
        .catch((e) => {
          console.log('Failed to load Google Map');
          console.log(e);
        });
    }

    unload() {
      if (typeof window.google !== 'undefined') {
        google.maps.event.clearListeners(this.map, 'resize');
      }
    }
  }

  const mapSection = {
    onLoad() {
      allMaps[this.id] = new Map(this);
    },
    onUnload() {
      if (typeof allMaps[this.id].unload === 'function') {
        allMaps[this.id].unload();
      }
    },
  };

  register('map', mapSection);

  function loadAPI(key) {
    if (window.theme.mapAPI === null) {
      const urlKey = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      window.theme.mapAPI = loadScript({url: urlKey});
    }
    return window.theme.mapAPI;
  }

  function createMap(container, options) {
    var map = new google.maps.Map(container, options);
    var center = map.getCenter();

    // eslint-disable-next-line no-unused-vars
    var marker = new google.maps.Marker({
      map: map,
      position: center,
    });

    google.maps.event.addDomListener(window, 'resize', function () {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
    return map;
  }

  function geocodeAddressPromise(address) {
    return new Promise((resolve, reject) => {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({address: address}, function (results, status) {
        if (status == 'OK') {
          var latLong = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          resolve(latLong);
        } else {
          reject(status);
        }
      });
    });
  }

  register('search', [quickAddProduct, swatchGridSection]);

  const fadeOut = (el, callback = null) => {
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }

      if (parseFloat(el.style.opacity) === 0 && typeof callback === 'function') {
        callback();
      }
    })();
  };

  const selectors$G = {
    largePromoInner: '[data-large-promo-inner]',
    trackingInner: '[data-tracking-consent-inner]',
    tracking: '[data-tracking-consent]',
    trackingAccept: '[data-confirm-cookies]',
    close: '[data-close-modal]',
    modalUnderlay: '[data-modal-underlay]',
  };

  let sections$l = {};

  class PopupCookie {
    constructor(name, value) {
      this.configuration = {
        expires: null, // session cookie
        path: '/',
        domain: window.location.hostname,
      };
      this.name = name;
      this.value = value;
    }

    write() {
      const hasCookie = document.cookie.indexOf('; ') !== -1 && !document.cookie.split('; ').find((row) => row.startsWith(this.name));
      if (hasCookie || document.cookie.indexOf('; ') === -1) {
        document.cookie = `${this.name}=${this.value}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      }
    }

    read() {
      if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        const returnCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith(this.name))
          .split('=')[1];

        return returnCookie;
      } else return false;
    }

    destroy() {
      if (document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        document.cookie = `${this.name}=null; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      }
    }
  }

  class LargePopup {
    constructor(el) {
      this.popup = el;
      this.modal = this.popup.querySelector(selectors$G.largePromoInner);
      this.close = this.popup.querySelector(selectors$G.close);
      this.underlay = this.popup.querySelector(selectors$G.modalUnderlay);
      this.cookie = new PopupCookie('promo', 'user_has_closed');
      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;
      if (!cookieExists) {
        fadeIn(this.modal);
        this.initClosers();
      }
    }

    initClosers() {
      this.close.addEventListener('click', this.closeModal.bind(this));
      this.underlay.addEventListener('click', this.closeModal.bind(this));
    }

    closeModal(e) {
      e.preventDefault();
      fadeOut(this.modal);
      this.cookie.write();
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeIn(this.modal);
        this.initClosers();
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.modal);
      }
    }
  }

  class Tracking {
    constructor(el) {
      this.popup = el;
      this.modal = document.querySelector(selectors$G.tracking);
      this.close = this.modal.querySelector(selectors$G.close);
      this.acceptButton = this.modal.querySelector(selectors$G.trackingAccept);
      this.enable = this.modal.getAttribute('data-enable') === 'true';
      this.showPopup = false;

      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1',
          },
        ],
        (error) => {
          if (error) {
            throw error;
          }

          const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked();
          const userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();

          this.showPopup = !userCanBeTracked && userTrackingConsent === 'no_interaction' && this.enable;

          if (window.Shopify.designMode) {
            this.showPopup = true;
          }

          this.init();
        }
      );
    }

    init() {
      if (this.showPopup) {
        fadeIn(this.modal);
      }

      this.clickEvents();
    }

    clickEvents() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        window.Shopify.customerPrivacy.setTrackingConsent(false, () => fadeOut(this.modal));
      });

      this.acceptButton.addEventListener('click', (event) => {
        event.preventDefault();

        window.Shopify.customerPrivacy.setTrackingConsent(true, () => fadeOut(this.modal));
      });

      document.addEventListener('trackingConsentAccepted', function () {
        console.log('trackingConsentAccepted event fired');
      });
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target) && this.showPopup) {
        fadeIn(this.modal);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.modal);
      }
    }
  }

  const popupSection = {
    onLoad() {
      sections$l[this.id] = [];

      const newsletters = this.container.querySelectorAll('[data-large-promo]');
      newsletters.forEach((el) => {
        sections$l[this.id].push(new LargePopup(el));
      });

      const tracking = this.container.querySelectorAll(selectors$G.tracking);
      tracking.forEach((el) => {
        sections$l[this.id].push(new Tracking(el));
      });
    },
    onBlockSelect(evt) {
      sections$l[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$l[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  register('popups', popupSection);

  const selectors$H = {
    loginToggle: '#AdminLoginToggle',
    newsletterToggle: '#NewsletterToggle',
    login: '#AdminLogin',
    signup: '#CustomerSignup',
    errors: '.errors',
    contactErrors: '#contact_form .errors',
    loginErrors: '#login_form .errors',
  };

  class Password {
    constructor(section) {
      this.container = section.container;
      this.loginToggle = this.container.querySelector(selectors$H.loginToggle);
      this.newsletterToggle = this.container.querySelector(selectors$H.newsletterToggle);
      this.login = this.container.querySelector(selectors$H.login);
      this.signup = this.container.querySelector(selectors$H.signup);
      this.errors = this.container.querySelector(selectors$H.errors);
      this.contactErrors = this.container.querySelector(selectors$H.contactErrors);
      this.loginErrors = this.container.querySelector(selectors$H.loginErrors);
      this.init();
    }

    init() {
      const login = this.login;
      const signup = this.signup;
      const errors = this.errors;
      const contactErrors = this.contactErrors;
      const loginErrors = this.loginErrors;

      this.loginToggle.addEventListener('click', function (e) {
        e.preventDefault();
        slideDown(login);
        hideElement(signup);
        if (errors) {
          hideElement(errors);
        }
      });

      this.newsletterToggle.addEventListener('click', function (e) {
        e.preventDefault();
        hideElement(login);
        slideDown(signup);
        if (errors) {
          hideElement(errors);
        }
      });

      if (contactErrors) {
        hideElement(login);
        slideDown(signup);
      }

      if (loginErrors) {
        slideDown(login);
        hideElement(signup);
      }
    }
  }

  const passwordSection = {
    onLoad() {
      new Password(this);
    },
  };

  register('password-template', passwordSection);

  register('faq', accordions);

  register('list-collections', [slider, quickAddProduct, swatchGridSection, blockScroll]);

  document.addEventListener('DOMContentLoaded', function () {
    // Load all registered sections on the page.
    load('*');

    // Animate on scroll
    const showAnimations = document.body.getAttribute('data-animations') === 'true';
    if (showAnimations) {
      AOS.init({once: true});
      document.body.classList.add('aos-initialized');
    }

    // When images load, clear the background color
    document.addEventListener('lazyloaded', function (event) {
      const lazyImage = event.target.parentNode;
      if (lazyImage.classList.contains('lazy-image')) {
        lazyImage.style.backgroundImage = 'none';
      }
    });

    if (window.self !== window.top) {
      document.querySelector('html').classList.add('iframe');
    }

    // Safari smoothscroll polyfill
    let hasNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if (!hasNativeSmoothScroll) {
      loadScript({url: window.theme.assets.smoothscroll});
    }
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (window.navigator.cookieEnabled) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

}(themeVendor.BodyScrollLock, themeVendor.themeCurrency, themeVendor.themeImages, themeVendor.themeAddresses, themeVendor.Sqrl, themeVendor.Flickity, themeVendor.Rellax, themeVendor.ellipsis, themeVendor.FlickityFade, themeVendor.AOS));
