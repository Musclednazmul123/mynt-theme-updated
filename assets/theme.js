/*
 * @license
 * Broadcast Theme (c) Invisible Themes
 *
 * The contents of this file should not be modified.
 * add any minor changes to assets/custom.js
 *
 */
(function (
  bodyScrollLock,
  themeCurrency,
  themeImages,
  themeAddresses,
  Sqrl,
  Flickity,
  Rellax,
  ellipsed,
  FlickityFade,
  AOS
) {
  "use strict";
  function floatLabels(e) {
    e.querySelectorAll(".form-field").forEach((e) => {
      const t = e.querySelector("label"),
        s = e.querySelector("input, textarea");
      t &&
        s &&
        (s.addEventListener("keyup", (e) => {
          "" !== e.target.value
            ? t.classList.add("label--float")
            : t.classList.remove("label--float");
        }),
        s.value && s.value.length && t.classList.add("label--float"));
    });
  }
  function readHeights() {
    const e = {};
    return (
      (e.windowHeight = window.innerHeight),
      (e.announcementHeight = getHeight('[data-section-type*="announcement"]')),
      (e.footerHeight = getHeight('[data-section-type*="footer"]')),
      (e.menuHeight = getHeight("[data-header-height]")),
      (e.headerHeight = e.menuHeight + e.announcementHeight),
      (e.logoHeight = getFooterLogoWithPadding()),
      e
    );
  }
  function setVarsOnResize() {
    document.addEventListener("theme:resize", resizeVars), setVars();
  }
  function setVars() {
    const {
      windowHeight: e,
      announcementHeight: t,
      headerHeight: s,
      logoHeight: i,
      menuHeight: o,
      footerHeight: r,
    } = readHeights();
    document.documentElement.style.setProperty("--full-screen", `${e}px`),
      document.documentElement.style.setProperty(
        "--three-quarters",
        e * (3 / 4) + "px"
      ),
      document.documentElement.style.setProperty(
        "--two-thirds",
        e * (2 / 3) + "px"
      ),
      document.documentElement.style.setProperty("--one-half", e / 2 + "px"),
      document.documentElement.style.setProperty("--one-third", e / 3 + "px"),
      document.documentElement.style.setProperty("--menu-height", `${o}px`),
      document.documentElement.style.setProperty(
        "--announcement-height",
        `${t}px`
      ),
      document.documentElement.style.setProperty("--header-height", `${s}px`),
      document.documentElement.style.setProperty("--footer-height", `${r}px`),
      document.documentElement.style.setProperty(
        "--content-full",
        e - s - i / 2 + "px"
      ),
      document.documentElement.style.setProperty(
        "--content-min",
        e - s - r + "px"
      );
  }
  function resizeVars() {
    const {
      windowHeight: e,
      announcementHeight: t,
      headerHeight: s,
      logoHeight: i,
      menuHeight: o,
      footerHeight: r,
    } = readHeights();
    document.documentElement.style.setProperty("--menu-height", `${o}px`),
      document.documentElement.style.setProperty(
        "--announcement-height",
        `${t}px`
      ),
      document.documentElement.style.setProperty("--header-height", `${s}px`),
      document.documentElement.style.setProperty("--footer-height", `${r}px`),
      document.documentElement.style.setProperty(
        "--content-full",
        e - s - i / 2 + "px"
      ),
      document.documentElement.style.setProperty(
        "--content-min",
        e - s - r + "px"
      );
  }
  function getHeight(e) {
    const t = document.querySelector(e);
    return t ? t.clientHeight : 0;
  }
  function getFooterLogoWithPadding() {
    const e = getHeight("[data-footer-logo]");
    return e > 0 ? e + 20 : 0;
  }
  function singles(e, t) {
    let s = 64,
      i = 0;
    t.forEach((e) => {
      if (e.offsetHeight > i) {
        const t =
          parseInt(window.getComputedStyle(e).marginTop) +
          parseInt(window.getComputedStyle(e).marginBottom);
        t > s && (s = t), (i = e.offsetHeight);
      }
    });
    const o = e.querySelectorAll("[data-overflow-background]");
    [e, ...o].forEach((e) => {
      e.style.setProperty(
        "min-height",
        `calc(${i + s}px + var(--header-padding)`
      );
    });
  }
  function doubles(e) {
    if (window.innerWidth <= window.theme.sizes.small) {
      return void e.querySelectorAll("[data-overflow-frame]").forEach((e) => {
        const t = e.querySelectorAll("[data-overflow-content]");
        singles(e, t);
      });
    }
    const t = 2 * parseInt(getComputedStyle(e).getPropertyValue("--outer"));
    let s = 0;
    const i = e.querySelectorAll("[data-overflow-frame]");
    e.querySelectorAll("[data-overflow-content]").forEach((e) => {
      e.offsetHeight > s && (s = e.offsetHeight);
    });
    [...i, ...e.querySelectorAll("[data-overflow-background]")].forEach((e) => {
      e.style.setProperty("min-height", `${s + t}px`);
    }),
      e.style.setProperty("min-height", `${s + t + 2}px`);
  }
  function preventOverflow(e) {
    const t = e.querySelectorAll(".js-overflow-container");
    t &&
      t.forEach((e) => {
        const t = e.querySelectorAll(".js-overflow-content");
        singles(e, t),
          document.addEventListener("theme:resize", () => {
            singles(e, t);
          });
      });
    const s = e.querySelectorAll("[data-overflow-wrapper]");
    s &&
      s.forEach((e) => {
        doubles(e),
          document.addEventListener("theme:resize", () => {
            doubles(e);
          });
      });
  }
  function debounce(e, t) {
    let s;
    return function () {
      if (e) {
        const i = () => e.apply(this, arguments);
        clearTimeout(s), (s = setTimeout(i, t));
      }
    };
  }
  function dispatch() {
    document.dispatchEvent(new CustomEvent("theme:resize", { bubbles: !0 }));
  }
  function resizeListener() {
    window.addEventListener(
      "resize",
      debounce(function () {
        dispatch();
      }, 50)
    );
  }
  (window.theme = window.theme || {}),
    (window.theme.sizes = {
      mobile: 480,
      small: 750,
      large: 990,
      widescreen: 1400,
    }),
    (window.theme.keyboardKeys = {
      TAB: 9,
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      LEFTARROW: 37,
      RIGHTARROW: 39,
    }),
    (window.theme.focusable =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  let prev = window.pageYOffset,
    up = null,
    down = null,
    wasUp = null,
    wasDown = null,
    scrollLockTimeout = 0;
  function dispatch$1() {
    const e = window.pageYOffset;
    e > prev
      ? ((down = !0), (up = !1))
      : e < prev
      ? ((down = !1), (up = !0))
      : ((up = null), (down = null)),
      (prev = e),
      document.dispatchEvent(
        new CustomEvent("theme:scroll", {
          detail: { up: up, down: down, position: e },
          bubbles: !1,
        })
      ),
      up &&
        !wasUp &&
        document.dispatchEvent(
          new CustomEvent("theme:scroll:up", {
            detail: { position: e },
            bubbles: !1,
          })
        ),
      down &&
        !wasDown &&
        document.dispatchEvent(
          new CustomEvent("theme:scroll:down", {
            detail: { position: e },
            bubbles: !1,
          })
        ),
      (wasDown = down),
      (wasUp = up);
  }
  function lock(e) {
    bodyScrollLock.disableBodyScroll(e.detail, {
      allowTouchMove: (e) => "TEXTAREA" === e.tagName,
    }),
      document.documentElement.setAttribute("data-scroll-locked", "");
  }
  function unlock() {
    if (
      ((scrollLockTimeout = setTimeout(() => {
        document.body.removeAttribute("data-drawer-closing");
      }, 20)),
      document.body.hasAttribute("data-drawer-closing"))
    )
      return (
        document.body.removeAttribute("data-drawer-closing"),
        void (scrollLockTimeout && clearTimeout(scrollLockTimeout))
      );
    document.body.setAttribute("data-drawer-closing", ""),
      document.documentElement.removeAttribute("data-scroll-locked"),
      bodyScrollLock.clearAllBodyScrollLocks();
  }
  function scrollListener() {
    let e;
    window.addEventListener(
      "scroll",
      function () {
        e && window.cancelAnimationFrame(e),
          (e = window.requestAnimationFrame(function () {
            dispatch$1();
          }));
      },
      { passive: !0 }
    ),
      window.addEventListener("theme:scroll:lock", lock),
      window.addEventListener("theme:scroll:unlock", unlock);
  }
  const wrap = (e, t = "", s) => {
    const i = s || document.createElement("div");
    return (
      i.classList.add(t), e.parentNode.insertBefore(i, e), i.appendChild(e)
    );
  };
  function wrapElements(e) {
    e.querySelectorAll(".rte table").forEach((e) => {
      wrap(e, "rte__table-wrapper");
    });
    e.querySelectorAll(
      '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"], .rte iframe#admin_bar_iframe'
    ).forEach((e) => {
      wrap(e, "rte__video-wrapper");
    });
  }
  function wasTouched() {
    (window.theme.touched = !0),
      document.removeEventListener("touchstart", wasTouched, { passive: !0 }),
      document.querySelector("body").classList.add("supports-touch"),
      document.dispatchEvent(new CustomEvent("theme:touch", { bubbles: !0 }));
  }
  function getScript(e, t, s) {
    let i = document.getElementsByTagName("head")[0],
      o = !1,
      r = document.createElement("script");
    (r.src = e),
      (r.onload = r.onreadystatechange =
        function () {
          o ||
          (this.readyState &&
            "loaded" != this.readyState &&
            "complete" != this.readyState)
            ? s()
            : ((o = !0), t());
        }),
      i.appendChild(r);
  }
  document.addEventListener("touchstart", wasTouched, { passive: !0 });
  const loaders = {};
  function loadScript(e = {}) {
    if ((e.type || (e.type = "json"), e.url))
      return loaders[e.url]
        ? loaders[e.url]
        : getScriptWithPromise(e.url, e.type);
    if (e.json)
      return loaders[e.json]
        ? Promise.resolve(loaders[e.json])
        : window
            .fetch(e.json)
            .then((e) => e.json())
            .then((t) => ((loaders[e.json] = t), t));
    if (e.name) {
      const t = "".concat(e.name, e.version);
      return loaders[t] ? loaders[t] : loadShopifyWithPromise(e);
    }
    return Promise.reject();
  }
  function getScriptWithPromise(e, t) {
    const s = new Promise((s, i) => {
      "text" === t
        ? fetch(e)
            .then((e) => e.text())
            .then((e) => {
              s(e);
            })
            .catch((e) => {
              i(e);
            })
        : getScript(
            e,
            function () {
              s();
            },
            function () {
              i();
            }
          );
    });
    return (loaders[e] = s), s;
  }
  function loadShopifyWithPromise(e) {
    const t = "".concat(e.name, e.version),
      s = new Promise((t, s) => {
        try {
          window.Shopify.loadFeatures([
            {
              name: e.name,
              version: e.version,
              onLoad: (e) => {
                onLoadFromShopify(t, s, e);
              },
            },
          ]);
        } catch (e) {
          s(e);
        }
      });
    return (loaders[t] = s), s;
  }
  function onLoadFromShopify(e, t, s) {
    return s ? t(s) : e();
  }
  (window.isYoutubeAPILoaded = !1), (window.isPlyrLoaded = !1);
  const sections = {},
    selectors = {
      dataEnableSound: "data-enable-sound",
      dataEnableBackground: "data-enable-background",
      dataEnableAutoplay: "data-enable-autoplay",
      dataEnableLoop: "data-enable-loop",
      dataVideoId: "data-video-id",
      dataVideoType: "data-video-type",
      videoIframe: "[data-video-id]",
    },
    classes = { loaded: "loaded" };
  class LoadVideoVimeo {
    constructor(e) {
      (this.container = e),
        (this.player = this.container.querySelector(selectors.videoIframe)),
        this.player &&
          ((this.videoID = this.player.getAttribute(selectors.dataVideoId)),
          (this.videoType = this.player.getAttribute(selectors.dataVideoType)),
          (this.enableBackground =
            "true" ===
            this.player.getAttribute(selectors.dataEnableBackground)),
          (this.disableSound =
            "false" === this.player.getAttribute(selectors.dataEnableSound)),
          (this.enableAutoplay =
            "false" !== this.player.getAttribute(selectors.dataEnableAutoplay)),
          (this.enableLoop =
            "false" !== this.player.getAttribute(selectors.dataEnableLoop)),
          "vimeo" == this.videoType && this.init());
    }
    init() {
      this.loadVimeoPlayer();
    }
    loadVimeoPlayer() {
      const e = "https://vimeo.com/" + this.videoID;
      let t = "";
      const s = this.player,
        i = {
          url: e,
          background: this.enableBackground,
          muted: this.disableSound,
          autoplay: this.enableAutoplay,
          loop: this.enableLoop,
        };
      for (let e in i)
        t += encodeURIComponent(e) + "=" + encodeURIComponent(i[e]) + "&";
      fetch(`https://vimeo.com/api/oembed.json?${t}`)
        .then((e) => e.json())
        .then(function (e) {
          (s.innerHTML = e.html),
            setTimeout(function () {
              s.parentElement.classList.add(classes.loaded);
            }, 1e3);
        })
        .catch(function () {
          console.log("error");
        });
    }
  }
  const loadVideoVimeo = {
      onLoad() {
        sections[this.id] = new LoadVideoVimeo(this.container);
      },
    },
    throttle = (e, t) => {
      let s, i;
      return function o(...r) {
        const n = Date.now();
        (i = clearTimeout(i)),
          !s || n - s >= t
            ? (e.apply(null, r), (s = n))
            : (i = setTimeout(o.bind(null, ...r), t - (n - s)));
      };
    },
    sections$1 = {},
    selectors$1 = {
      dataSectionId: "data-section-id",
      dataEnableSound: "data-enable-sound",
      dataHideOptions: "data-hide-options",
      dataCheckPlayerVisibility: "data-check-player-visibility",
      dataVideoId: "data-video-id",
      dataVideoType: "data-video-type",
      videoIframe: "[data-video-id]",
      videoWrapper: ".video-wrapper",
      youtubeWrapper: "[data-youtube-wrapper]",
    },
    classes$1 = { loaded: "loaded" },
    players = [];
  class LoadVideoYT {
    constructor(e) {
      (this.container = e),
        (this.player = this.container.querySelector(selectors$1.videoIframe)),
        this.player &&
          ((this.videoOptionsVars = {}),
          (this.videoID = this.player.getAttribute(selectors$1.dataVideoId)),
          (this.videoType = this.player.getAttribute(
            selectors$1.dataVideoType
          )),
          "youtube" == this.videoType &&
            ((this.checkPlayerVisibilityFlag =
              "true" ===
              this.player.getAttribute(selectors$1.dataCheckPlayerVisibility)),
            (this.playerID = this.player.querySelector(
              selectors$1.youtubeWrapper
            )
              ? this.player.querySelector(selectors$1.youtubeWrapper).id
              : this.player.id),
            this.player.hasAttribute(selectors$1.dataHideOptions) &&
              (this.videoOptionsVars = {
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
                wmode: "opaque",
              }),
            this.init(),
            this.container.addEventListener("touchstart", function (e) {
              if (
                e.target.matches(selectors$1.videoWrapper) ||
                e.target.closest(selectors$1.videoWrapper)
              ) {
                const t = e.target.querySelector(selectors$1.videoIframe).id;
                players[t].playVideo();
              }
            })));
    }
    init() {
      window.isYoutubeAPILoaded
        ? this.loadYoutubePlayer()
        : loadScript({ url: "https://www.youtube.com/iframe_api" }).then(() =>
            this.loadYoutubePlayer()
          );
    }
    loadYoutubePlayer() {
      const e = {
        ...{
          height: "720",
          width: "1280",
          playerVars: this.videoOptionsVars,
          events: {
            onReady: (e) => {
              const t = e.target.getIframe(),
                s = t.id,
                i =
                  "true" ===
                  document
                    .querySelector(`#${s}`)
                    .getAttribute(selectors$1.dataEnableSound);
              t.setAttribute("tabindex", "-1"),
                i ? e.target.unMute() : e.target.mute(),
                e.target.playVideo(),
                this.checkPlayerVisibilityFlag &&
                  (this.checkPlayerVisibility(s),
                  window.addEventListener(
                    "scroll",
                    throttle(() => {
                      this.checkPlayerVisibility(s);
                    }, 150)
                  ));
            },
            onStateChange: (e) => {
              0 == e.data && e.target.playVideo(),
                1 == e.data &&
                  e.target
                    .getIframe()
                    .parentElement.classList.add(classes$1.loaded);
            },
          },
        },
      };
      (e.videoId = this.videoID),
        this.videoID.length &&
          YT.ready(() => {
            players[this.playerID] = new YT.Player(this.playerID, e);
          }),
        (window.isYoutubeAPILoaded = !0);
    }
    checkPlayerVisibility(e) {
      let t;
      if ("string" == typeof e) t = e;
      else {
        if (null == e.data) return;
        t = e.data.id;
      }
      const s = document.getElementById(t + "-container");
      if (!s) return;
      const i = players[t],
        o = s.getBoundingClientRect();
      let r =
        visibilityHelper.isElementPartiallyVisible(s) ||
        visibilityHelper.isElementTotallyVisible(s);
      o.top < 0 && s.clientHeight + o.top >= 0 && (r = !0),
        r && i && "function" == typeof i.playVideo
          ? i.playVideo()
          : !r && i && "function" == typeof i.pauseVideo && i.pauseVideo();
    }
    onUnload() {
      const e =
        "youtube-" + this.container.getAttribute(selectors$1.dataSectionId);
      players[e] && players[e].destroy();
    }
  }
  const loadVideoYT = {
      onLoad() {
        sections$1[this.id] = new LoadVideoYT(this.container);
      },
      onUnload(e) {
        sections$1[this.id].onUnload(e);
      },
    },
    selectors$2 = {
      popupContainer: ".pswp",
      popupCloseBtn: ".pswp__custom-close",
      popupIframe: "iframe",
      popupCustomIframe: ".pswp__custom-iframe",
      popupThumbs: ".pswp__thumbs",
      dataOptionClasses: "data-pswp-option-classes",
      dataVideoType: "data-video-type",
    },
    classes$2 = {
      classCurrent: "is-current",
      classCustomLoader: "pswp--custom-loader",
      classCustomOpen: "pswp--custom-opening",
      classLoader: "pswp__loader",
    },
    loaderHTML = `<div class="${classes$2.classLoader}"><div class="loader pswp__loader-line"><div class="loader-indeterminate"></div></div></div>`;
  class LoadPhotoswipe {
    constructor(e, t = "") {
      (this.items = e),
        (this.pswpElement = document.querySelectorAll(
          selectors$2.popupContainer
        )[0]),
        (this.popup = null),
        (this.popupThumbs = null),
        (this.popupThumbsContainer = this.pswpElement.querySelector(
          selectors$2.popupThumbs
        )),
        (this.closeBtn = this.pswpElement.querySelector(
          selectors$2.popupCloseBtn
        ));
      (this.options = "" !== t ? t : { history: !1, focus: !1, mainClass: "" }),
        this.init();
    }
    init() {
      this.pswpElement.classList.add(classes$2.classCustomOpen),
        this.initLoader(),
        loadScript({ url: window.theme.assets.photoswipe })
          .then(() => this.loadPopup())
          .catch((e) => console.error(e));
    }
    initLoader() {
      if (
        this.pswpElement.classList.contains(classes$2.classCustomLoader) &&
        "" !== this.options &&
        this.options.mainClass
      ) {
        this.pswpElement.setAttribute(
          selectors$2.dataOptionClasses,
          this.options.mainClass
        );
        let e = document.createElement("div");
        (e.innerHTML = loaderHTML),
          (e = e.firstChild),
          this.pswpElement.appendChild(e);
      } else this.pswpElement.setAttribute(selectors$2.dataOptionClasses, "");
    }
    loadPopup() {
      const e = window.themePhotoswipe.PhotoSwipe.default,
        t = window.themePhotoswipe.PhotoSwipeUI.default;
      this.pswpElement.classList.contains(classes$2.classCustomLoader) &&
        this.pswpElement.classList.remove(classes$2.classCustomLoader),
        this.pswpElement.classList.remove(classes$2.classCustomOpen),
        (this.popup = new e(this.pswpElement, t, this.items, this.options)),
        this.popup.init(),
        this.initVideo(),
        this.thumbsActions(),
        this.popup.listen("close", () => this.onClose()),
        this.closeBtn &&
          this.closeBtn.addEventListener("click", () => this.popup.close());
    }
    initVideo() {
      const e = this.pswpElement.querySelector(selectors$2.popupCustomIframe);
      if (e) {
        const t = e.getAttribute(selectors$2.dataVideoType);
        "youtube" == t
          ? new LoadVideoYT(e.parentElement)
          : "vimeo" == t && new LoadVideoVimeo(e.parentElement);
      }
    }
    thumbsActions() {
      this.popupThumbsContainer &&
        this.popupThumbsContainer.firstChild &&
        (this.popupThumbsContainer.addEventListener("wheel", (e) =>
          this.stopDisabledScroll(e)
        ),
        this.popupThumbsContainer.addEventListener("mousewheel", (e) =>
          this.stopDisabledScroll(e)
        ),
        this.popupThumbsContainer.addEventListener("DOMMouseScroll", (e) =>
          this.stopDisabledScroll(e)
        ),
        (this.popupThumbs = this.pswpElement.querySelectorAll(
          `${selectors$2.popupThumbs} > *`
        )),
        this.popupThumbs.forEach((e, t) => {
          e.addEventListener("click", (s) => {
            s.preventDefault(),
              e.parentElement
                .querySelector(`.${classes$2.classCurrent}`)
                .classList.remove(classes$2.classCurrent),
              e.classList.add(classes$2.classCurrent),
              this.popup.goTo(t);
          });
        }),
        this.popup.listen("imageLoadComplete", () => this.setCurrentThumb()),
        this.popup.listen("beforeChange", () => this.setCurrentThumb()));
    }
    stopDisabledScroll(e) {
      e.stopPropagation();
    }
    onClose() {
      const e = this.pswpElement.querySelector(selectors$2.popupIframe);
      if (
        (e && (e.setAttribute("src", ""), e.parentNode.removeChild(e)),
        this.popupThumbsContainer && this.popupThumbsContainer.firstChild)
      )
        for (; this.popupThumbsContainer.firstChild; )
          this.popupThumbsContainer.removeChild(
            this.popupThumbsContainer.firstChild
          );
      this.pswpElement.setAttribute(selectors$2.dataOptionClasses, "");
      const t = this.pswpElement.querySelector(`.${classes$2.classLoader}`);
      t && this.pswpElement.removeChild(t);
    }
    setCurrentThumb() {
      const e = this.pswpElement.querySelector(
        `${selectors$2.popupThumbs} > .${classes$2.classCurrent}`
      );
      if ((e && e.classList.remove(classes$2.classCurrent), !this.popupThumbs))
        return;
      const t = this.popupThumbs[this.popup.getCurrentIndex()];
      t.classList.add(classes$2.classCurrent), this.scrollThumbs(t);
    }
    scrollThumbs(e) {
      const t =
          this.popupThumbsContainer.scrollLeft +
          this.popupThumbsContainer.offsetWidth,
        s = e.offsetLeft;
      if (t <= s + e.offsetWidth || t > s) {
        const t = parseInt(window.getComputedStyle(e).marginLeft);
        this.popupThumbsContainer.scrollTo({
          top: 0,
          left: s - t,
          behavior: "smooth",
        });
      }
    }
  }
  function ariaToggle(e) {
    const t = e.querySelectorAll("[data-aria-toggle]");
    t.length &&
      t.forEach((e) => {
        e.addEventListener("click", function (e) {
          e.preventDefault();
          const t = e.currentTarget;
          t.setAttribute(
            "aria-expanded",
            "false" == t.getAttribute("aria-expanded") ? "true" : "false"
          );
          const s = t.getAttribute("aria-controls");
          document.querySelector(`#${s}`).classList.toggle("expanding"),
            setTimeout(function () {
              document.querySelector(`#${s}`).classList.toggle("expanded");
            }, 40);
        });
      });
  }
  function videoPopups(e) {
    const t = e.querySelectorAll("[data-video-popup]");
    t.length &&
      t.forEach((e) => {
        e.addEventListener("click", function (t) {
          const s = e.getAttribute("data-video-popup");
          if ("" !== s.trim()) {
            t.preventDefault();
            new LoadPhotoswipe([{ html: s }]);
          }
        });
      });
  }
  function lazyImageBackgrounds() {
    document.addEventListener("lazyloaded", function (e) {
      const t = e.target.parentNode;
      t.classList.contains("lazy-image") && (t.style.backgroundImage = "none");
    });
  }
  resizeListener(),
    scrollListener(),
    lazyImageBackgrounds(),
    window.addEventListener("load", () => {
      setVarsOnResize(),
        floatLabels(document),
        preventOverflow(document),
        videoPopups(document),
        ariaToggle(document),
        wrapElements(document);
    }),
    document.addEventListener("shopify:section:load", (e) => {
      const t = e.target;
      floatLabels(t),
        preventOverflow(t),
        videoPopups(t),
        wrapElements(t),
        ariaToggle(document);
    }),
    (function () {
      function e(e) {
        var t = window.innerWidth || document.documentElement.clientWidth,
          s = window.innerHeight || document.documentElement.clientHeight,
          i = e.getBoundingClientRect();
        return i.top >= 0 && i.bottom <= s && i.left >= 0 && i.right <= t;
      }
      function t(e) {
        var t = window.innerWidth || document.documentElement.clientWidth,
          s = window.innerHeight || document.documentElement.clientHeight,
          i = e.getBoundingClientRect(),
          o = (i.left >= 0 && i.left <= t) || (i.right >= 0 && i.right <= t),
          r = (i.top >= 0 && i.top <= s) || (i.bottom >= 0 && i.bottom <= s);
        return o && r;
      }
      window.visibilityHelper = {
        isElementTotallyVisible: e,
        isElementPartiallyVisible: t,
        inViewportPartially: function (e, s) {
          function i() {
            var i = t(e);
            i != o && ((o = i), "function" == typeof s && s(i, e));
          }
          var o = t(e);
          window.addEventListener("load", i),
            window.addEventListener("resize", i),
            window.addEventListener("scroll", i);
        },
        inViewportTotally: function (t, s) {
          function i() {
            var i = e(t);
            i != o && ((o = i), "function" == typeof s && s(i, t));
          }
          var o = e(t);
          window.addEventListener("load", i),
            window.addEventListener("resize", i),
            window.addEventListener("scroll", i);
        },
      };
    })();
  const showElement = (e, t = !1, s = "block") => {
    e && (t ? e.style.removeProperty("display") : (e.style.display = s));
  };
  Shopify.Products = (function () {
    const e = {
      howManyToShow: 4,
      howManyToStoreInMemory: 10,
      wrapperId: "recently-viewed-products",
      templateId: "recently-viewed-product-template",
      onComplete: null,
    };
    let t = [],
      s = null,
      i = null,
      o = null;
    const r = {
        configuration: {
          expires: 90,
          path: "/",
          domain: window.location.hostname,
        },
        name: "shopify_recently_viewed",
        write: function (e) {
          const t = e.join(" ");
          document.cookie = `${this.name}=${t}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
        },
        read: function () {
          let e = [],
            t = null;
          const s = document.querySelector("#template-product");
          if (s) {
            const i = s.getAttribute("data-product-handle");
            if (
              (-1 !== document.cookie.indexOf("; ") &&
                document.cookie
                  .split("; ")
                  .find((e) => e.startsWith(this.name)) &&
                (t = document.cookie
                  .split("; ")
                  .find((e) => e.startsWith(this.name))
                  .split("=")[1]),
              null !== t && (e = t.split(" ")),
              -1 != e.indexOf(i))
            ) {
              const t = e.indexOf(i);
              e.splice(t, 1);
            }
          }
          return e;
        },
        destroy: function () {
          document.cookie = `${this.name}=null; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
        },
        remove: function (e) {
          const t = this.read(),
            s = t.indexOf(e);
          -1 !== s && (t.splice(s, 1), this.write(t));
        },
      },
      n = (a) => {
        t.length && a < e.howManyToShow
          ? fetch("/products/" + t[0] + ".js")
              .then((e) => e.json())
              .then((e) => {
                (e.priceFormatted = themeCurrency.formatMoney(
                  e.price,
                  theme.moneyFormat
                )),
                  (e.compareFormatted = themeCurrency.formatMoney(
                    e.compare_at_price,
                    theme.moneyFormat
                  )),
                  (e.topImage = e.media[0]
                    ? themeImages.getSizedImageUrl(
                        e.media[0].preview_image.src,
                        "900x900"
                      )
                    : ""),
                  (e.bottomImage = e.media[1]
                    ? themeImages.getSizedImageUrl(
                        e.media[1].preview_image.src,
                        "900x900"
                      )
                    : "");
                let o = "",
                  r = "",
                  l = "is-hidden hidden",
                  c = "",
                  d = "is-hidden hidden";
                e.media.length > 1
                  ? (o = "double__image")
                  : (r = "is-hidden hidden"),
                  e.compare_at_price > e.price && ((c = "sale"), (l = "")),
                  e.price_varies && (d = "");
                const h = e.title.replace(/(<([^>]+)>)/gi, "");
                let u = i.innerHTML;
                (u = u.replace(/\|\|itemUrl\|\|/g, e.url)),
                  (u = u.replace(/\|\|itemDoubleImageClass\|\|/g, o)),
                  (u = u.replace(/\|\|itemTopImage\|\|/g, e.topImage)),
                  (u = u.replace(/\|\|itemBottomImage\|\|/g, e.bottomImage)),
                  (u = u.replace(/\|\|itemBottomImageClass\|\|/g, r)),
                  (u = u.replace(/\|\|itemSaleClass\|\|/g, l)),
                  (u = u.replace(/\|\|itemPriceClass\|\|/g, c)),
                  (u = u.replace(/\|\|itemFromClass\|\|/g, d)),
                  (u = u.replace(/\|\|itemTitle\|\|/g, h)),
                  (u = u.replace(
                    /\|\|itemComparedPrice\|\|/g,
                    e.compareFormatted
                  )),
                  (u = u.replace(/\|\|itemPrice\|\|/g, e.priceFormatted)),
                  (u = u.replace(/\|\|itemHandle\|\|/g, e.handle)),
                  (u =
                    "Title" === e.options[0].name &&
                    1 === e.options.length &&
                    "Default Title" === e.options[0].values[0]
                      ? u.replace(
                          /\|\|itemHasOnlyDefault\|\|/g,
                          "data-quick-add-button"
                        )
                      : u.replace(/\|\|itemHasOnlyDefault\|\|/g, ""));
                const p = e.options.filter((e) => {
                  for (let t = 0; t < theme.swatchLabels.length; t++) {
                    const s = theme.swatchLabels[t].trim();
                    if (Object.values(e).includes(s)) return e;
                  }
                });
                (u = u.replace(
                  /\|\|itemSwatchesHidden\|\|/g,
                  p.length > 0 ? "" : "hide"
                )),
                  (u = u.replace(
                    /\|\|itemColorLabel\|\|/g,
                    p.length > 0 ? p[0].name : ""
                  )),
                  (s.innerHTML += u),
                  t.shift(),
                  a++,
                  n(a);
              })
              .catch(() => {
                r.remove(t[0]), t.shift(), n(a);
              })
          : (() => {
              showElement(s, !0);
              const t = r.read().length;
              if (
                Shopify.recentlyViewed &&
                o &&
                t &&
                t < o &&
                s.children.length
              ) {
                let e = [],
                  t = [],
                  i = 0;
                for (const s in Shopify.recentlyViewed) {
                  i += 1;
                  const o = Shopify.recentlyViewed[s].split(" "),
                    n = parseInt(s.split("_")[1]);
                  (e = [...e, ...o]),
                    (r.read().length === n ||
                      (i === Object.keys(Shopify.recentlyViewed).length &&
                        !t.length)) &&
                      (t = [...t, ...o]);
                }
                for (let i = 0; i < s.children.length; i++) {
                  const o = s.children[i];
                  e.length && o.classList.remove(...e),
                    t.length && o.classList.add(...t);
                }
              }
              if (e.onComplete)
                try {
                  e.onComplete();
                } catch (e) {
                  console.log("error");
                }
            })();
      };
    return {
      showRecentlyViewed: function (a) {
        const l = a || {};
        Object.assign(e, l),
          (t = r.read()),
          (i = document.querySelector(`#${e.templateId}`)),
          (s = document.querySelector(`#${e.wrapperId}`)),
          (o = e.howManyToShow),
          (e.howManyToShow = Math.min(t.length, e.howManyToShow)),
          e.howManyToShow && i && s && n(0);
      },
      getConfig: function () {
        return e;
      },
      clearList: function () {
        r.destroy();
      },
      recordRecentlyViewed: function (t) {
        const s = t || {};
        Object.assign(e, s);
        let i = r.read();
        if (-1 !== window.location.pathname.indexOf("/products/")) {
          const t = window.location.pathname.match(
              /\/products\/([a-z0-9\-]+)/
            )[1],
            s = i.indexOf(t);
          -1 === s
            ? (i.unshift(t), (i = i.splice(0, e.howManyToStoreInMemory)))
            : (i.splice(s, 1), i.unshift(t)),
            r.write(i);
        }
      },
      hasProducts: r.read().length > 0,
    };
  })();
  const getUrlString = (e, t = [], s = !1) => {
      const i = Object.keys(e)
        .map((i) => {
          let o = e[i];
          if (
            "[object Object]" === Object.prototype.toString.call(o) ||
            Array.isArray(o)
          )
            return (
              Array.isArray(e) ? t.push("") : t.push(i),
              getUrlString(o, t, Array.isArray(o))
            );
          {
            let e = i;
            if (t.length > 0) {
              e = (s ? t : [...t, i]).reduce(
                (e, t) => ("" === e ? t : `${e}[${t}]`),
                ""
              );
            }
            return s ? `${e}[]=${o}` : `${e}=${o}`;
          }
        })
        .join("&");
      return t.pop(), i;
    },
    hideElement = (e) => {
      e && (e.style.display = "none");
    },
    fadeIn = (e, t, s = null) => {
      (e.style.opacity = 0),
        (e.style.display = t || "block"),
        (function t() {
          let i = parseFloat(e.style.opacity);
          (i += 0.1) > 1 || ((e.style.opacity = i), requestAnimationFrame(t)),
            1 === i && "function" == typeof s && s();
        })();
    };
  function forceFocus(e, t) {
    t = t || {};
    var s = e.tabIndex;
    (e.tabIndex = -1),
      (e.dataset.tabIndex = s),
      e.focus(),
      void 0 !== t.className && e.classList.add(t.className),
      e.addEventListener("blur", function i(o) {
        o.target.removeEventListener(o.type, i),
          (e.tabIndex = s),
          delete e.dataset.tabIndex,
          void 0 !== t.className && e.classList.remove(t.className);
      });
  }
  function focusHash(e) {
    e = e || {};
    var t = window.location.hash,
      s = document.getElementById(t.slice(1));
    if (s && e.ignore && s.matches(e.ignore)) return !1;
    t && s && forceFocus(s, e);
  }
  function bindInPageLinks(e) {
    return (
      (e = e || {}),
      Array.prototype.slice
        .call(document.querySelectorAll('a[href^="#"]'))
        .filter(function (t) {
          if ("#" === t.hash || "" === t.hash) return !1;
          if (e.ignore && t.matches(e.ignore)) return !1;
          if (((s = t.hash.substr(1)), null === document.getElementById(s)))
            return !1;
          var s,
            i = document.querySelector(t.hash);
          return (
            !!i &&
            (t.addEventListener("click", function () {
              forceFocus(i, e);
            }),
            !0)
          );
        })
    );
  }
  function focusable(e) {
    return Array.prototype.slice
      .call(
        e.querySelectorAll(
          "[tabindex],[draggable],a[href],area,button:enabled,input:not([type=hidden]):enabled,object,select:enabled,textarea:enabled"
        )
      )
      .filter(function (e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
      });
  }
  void 0 === Shopify.Cart && (Shopify.Cart = {}),
    (Shopify.Cart.ShippingCalculator = (function () {
      const _config = {
          submitButton: theme.strings.shippingCalcSubmitButton,
          submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
          templateId: "shipping-calculator-response-template",
          wrapperId: "wrapper-response",
          customerIsLoggedIn: !1,
        },
        _render = function (e) {
          const t = document.querySelector(`#${_config.templateId}`),
            s = document.querySelector(`#${_config.wrapperId}`);
          if (t && s) {
            s.innerHTML = "";
            let i = "",
              o = "",
              r = "error center",
              n = t.innerHTML;
            const a = /[^[\]]+(?=])/g;
            if (e.rates && e.rates.length) {
              let t = a.exec(n)[0];
              e.rates.forEach((e) => {
                let s = t;
                (s = s.replace(/\|\|rateName\|\|/, e.name)),
                  (s = s.replace(
                    /\|\|ratePrice\|\|/,
                    Shopify.Cart.ShippingCalculator.formatRate(e.price)
                  )),
                  (i += s);
              });
            }
            if (e.success) {
              r = "success center";
              const s = document.createElement("div");
              s.innerHTML = t.innerHTML;
              const i = s.querySelector("[data-template-no-shipping]");
              e.rates.length < 1 &&
                i &&
                (o = i.getAttribute("data-template-no-shipping"));
            } else o = e.errorFeedback;
            (n = n.replace(a, "").replace("[]", "")),
              (n = n.replace(/\|\|ratesList\|\|/g, i)),
              (n = n.replace(/\|\|successClass\|\|/g, r)),
              (n = n.replace(/\|\|ratesText\|\|/g, o)),
              (s.innerHTML += n);
          }
        },
        _enableButtons = function () {
          const e = document.querySelector(".get-rates");
          e.removeAttribute("disabled"),
            e.classList.remove("disabled"),
            (e.value = _config.submitButton);
        },
        _disableButtons = function () {
          const e = document.querySelector(".get-rates");
          e.setAttribute("disabled", "disabled"),
            e.classList.add("disabled"),
            (e.value = _config.submitButtonDisabled);
        },
        _getCartShippingRatesForDestination = function (e) {
          const t = encodeURI(getUrlString({ shipping_address: e })),
            s = `${window.theme.routes.cart}/shipping_rates.json?${t}`,
            i = new XMLHttpRequest();
          i.open("GET", s, !0),
            (i.onload = function () {
              if (this.status >= 200 && this.status < 400) {
                const t = JSON.parse(this.response).shipping_rates;
                _onCartShippingRatesUpdate(t, e);
              } else _onError(this);
            }),
            (i.onerror = function () {
              _onError(this);
            }),
            i.send();
        },
        _fullMessagesFromErrors = function (e) {
          const t = [];
          for (const s in e) for (const i of e[s]) t.push(s + " " + i);
          return t;
        },
        _onError = function (XMLHttpRequest) {
          hideElement(document.querySelector("#estimated-shipping"));
          const shippingChild = document.querySelector(
            "#estimated-shipping em"
          );
          if (shippingChild)
            for (; shippingChild.firstChild; )
              shippingChild.removeChild(shippingChild.firstChild);
          _enableButtons();
          let feedback = "";
          const data = eval("(" + XMLHttpRequest.responseText + ")");
          (feedback = data.message
            ? data.message + "(" + data.status + "): " + data.description
            : "Error : " + _fullMessagesFromErrors(data).join("; ")),
            "Error : country is not supported." === feedback &&
              (feedback = "We do not ship to this destination."),
            _render({ rates: [], errorFeedback: feedback, success: !1 }),
            showElement(document.querySelector(`#${_config.wrapperId}`));
        },
        _onCartShippingRatesUpdate = function (e, t) {
          _enableButtons();
          let s = "";
          t.zip && (s += t.zip + ", "),
            t.province && (s += t.province + ", "),
            (s += t.country);
          const i = document.querySelector("#estimated-shipping em");
          e.length &&
            i &&
            ("0.00" == e[0].price
              ? (i.textContent = "FREE")
              : (i.textContent = themeCurrency.formatMoney(
                  e[0].price,
                  theme.moneyFormat
                ))),
            _render({ rates: e, address: s, success: !0 });
          const o = document.querySelectorAll(
            `#${_config.wrapperId}, #estimated-shipping`
          );
          o.length &&
            o.forEach((e) => {
              fadeIn(e);
            });
        },
        _init = function () {
          const e = document.querySelector(".get-rates"),
            t = document.querySelector("#address_container"),
            s = document.querySelector("#address_country"),
            i = document.querySelector("#address_province"),
            o = document.querySelector("html");
          let r = "en";
          if (
            (o.hasAttribute("lang") &&
              "" !== o.getAttribute("lang") &&
              (r = o.getAttribute("lang")),
            t &&
              themeAddresses.AddressForm(t, r, { shippingCountriesOnly: !0 }),
            s &&
              s.hasAttribute("data-default") &&
              i &&
              i.hasAttribute("data-default") &&
              s.addEventListener("change", function () {
                s.removeAttribute("data-default"),
                  i.removeAttribute("data-default");
              }),
            e &&
              (e.addEventListener("click", function (e) {
                _disableButtons();
                const t = document.querySelector(`#${_config.wrapperId}`);
                for (; t.firstChild; ) t.removeChild(t.firstChild);
                hideElement(t);
                const o = {};
                let r = s.value,
                  n = i.value;
                const a = s.getAttribute("data-default-fullname");
                "" === r && a && "" !== a && (r = a);
                const l = i.getAttribute("data-default-fullname");
                "" === n && l && "" !== l && (n = l),
                  (o.zip = document.querySelector("#address_zip").value || ""),
                  (o.country = r || ""),
                  (o.province = n || ""),
                  _getCartShippingRatesForDestination(o);
              }),
              _config.customerIsLoggedIn &&
                e.classList.contains("get-rates--trigger")))
          ) {
            const t = document.querySelector("#address_zip");
            t && t.value && e.dispatchEvent(new Event("click"));
          }
        };
      return {
        show: function (e) {
          (e = e || {}),
            Object.assign(_config, e),
            document.addEventListener("DOMContentLoaded", function () {
              _init();
            });
        },
        getConfig: function () {
          return _config;
        },
        formatRate: function (e) {
          return themeCurrency.formatMoney(e, theme.moneyFormat);
        },
      };
    })());
  var trapFocusHandlers = {};
  function trapFocus(e, t) {
    t = t || {};
    var s = focusable(e),
      i = t.elementToFocus || e,
      o = s[0],
      r = s[s.length - 1];
    removeTrapFocus(),
      (trapFocusHandlers.focusin = function (t) {
        e === t.target || e.contains(t.target) || o.focus(),
          (t.target !== e && t.target !== r && t.target !== o) ||
            document.addEventListener("keydown", trapFocusHandlers.keydown);
      }),
      (trapFocusHandlers.focusout = function () {
        document.removeEventListener("keydown", trapFocusHandlers.keydown);
      }),
      (trapFocusHandlers.keydown = function (t) {
        9 === t.keyCode &&
          (t.target !== r || t.shiftKey || (t.preventDefault(), o.focus()),
          (t.target !== e && t.target !== o) ||
            !t.shiftKey ||
            (t.preventDefault(), r.focus()));
      }),
      document.addEventListener("focusout", trapFocusHandlers.focusout),
      document.addEventListener("focusin", trapFocusHandlers.focusin),
      forceFocus(i, t);
  }
  function removeTrapFocus() {
    document.removeEventListener("focusin", trapFocusHandlers.focusin),
      document.removeEventListener("focusout", trapFocusHandlers.focusout),
      document.removeEventListener("keydown", trapFocusHandlers.keydown);
  }
  function accessibleLinks(e, t) {
    if ("string" != typeof e) throw new TypeError(e + " is not a String.");
    if (0 !== (e = document.querySelectorAll(e)).length) {
      (t = t || {}).messages = t.messages || {};
      var s = {
          newWindow: t.messages.newWindow || "Opens in a new window.",
          external: t.messages.external || "Opens external website.",
          newWindowExternal:
            t.messages.newWindowExternal ||
            "Opens external website in a new window.",
        },
        i = t.prefix || "a11y",
        o = {
          newWindow: i + "-new-window-message",
          external: i + "-external-message",
          newWindowExternal: i + "-new-window-external-message",
        };
      e.forEach(function (e) {
        var t = e.getAttribute("target"),
          s = e.getAttribute("rel"),
          i = (function (e) {
            return e.hostname !== window.location.hostname;
          })(e),
          r = "_blank" === t,
          n = null === s || -1 === s.indexOf("noopener");
        if (r && n) {
          var a = null === s ? "noopener" : s + " noopener";
          e.setAttribute("rel", a);
        }
        i && r
          ? e.setAttribute("aria-describedby", o.newWindowExternal)
          : i
          ? e.setAttribute("aria-describedby", o.external)
          : r && e.setAttribute("aria-describedby", o.newWindow);
      }),
        (function (e) {
          var t = document.createElement("ul"),
            s = Object.keys(e).reduce(function (t, s) {
              return t + "<li id=" + o[s] + ">" + e[s] + "</li>";
            }, "");
          t.setAttribute("hidden", !0),
            (t.innerHTML = s),
            document.body.appendChild(t);
        })(s);
    }
  }
  var a11y = Object.freeze({
    __proto__: null,
    forceFocus: forceFocus,
    focusHash: focusHash,
    bindInPageLinks: bindInPageLinks,
    focusable: focusable,
    trapFocus: trapFocus,
    removeTrapFocus: removeTrapFocus,
    accessibleLinks: accessibleLinks,
  });
  const slideDown = (e, t = 500, s = !0) => {
      let i = window.getComputedStyle(e).display;
      if (s && "none" !== i) return;
      e.style.removeProperty("display"),
        "none" === i && (i = "block"),
        (e.style.display = i);
      let o = e.offsetHeight;
      (e.style.overflow = "hidden"),
        (e.style.height = 0),
        (e.style.paddingTop = 0),
        (e.style.paddingBottom = 0),
        (e.style.marginTop = 0),
        (e.style.marginBottom = 0),
        e.offsetHeight,
        (e.style.boxSizing = "border-box"),
        (e.style.transitionProperty = "height, margin, padding"),
        (e.style.transitionDuration = t + "ms"),
        (e.style.height = o + "px"),
        e.style.removeProperty("padding-top"),
        e.style.removeProperty("padding-bottom"),
        e.style.removeProperty("margin-top"),
        e.style.removeProperty("margin-bottom"),
        window.setTimeout(() => {
          e.style.removeProperty("height"),
            e.style.removeProperty("overflow"),
            e.style.removeProperty("transition-duration"),
            e.style.removeProperty("transition-property");
        }, t);
    },
    slideUp = (e, t = 500) => {
      (e.style.transitionProperty = "height, margin, padding"),
        (e.style.transitionDuration = t + "ms"),
        (e.style.boxSizing = "border-box"),
        (e.style.height = e.offsetHeight + "px"),
        e.offsetHeight,
        (e.style.overflow = "hidden"),
        (e.style.height = 0),
        (e.style.paddingTop = 0),
        (e.style.paddingBottom = 0),
        (e.style.marginTop = 0),
        (e.style.marginBottom = 0),
        window.setTimeout(() => {
          (e.style.display = "none"),
            e.style.removeProperty("height"),
            e.style.removeProperty("padding-top"),
            e.style.removeProperty("padding-bottom"),
            e.style.removeProperty("margin-top"),
            e.style.removeProperty("margin-bottom"),
            e.style.removeProperty("overflow"),
            e.style.removeProperty("transition-duration"),
            e.style.removeProperty("transition-property");
        }, t);
    },
    slideToggle = (e, t = 500) =>
      "none" === window.getComputedStyle(e).display
        ? slideDown(e, t)
        : slideUp(e, t),
    getSiblings = (e) =>
      Array.prototype.filter.call(e.parentNode.children, function (t) {
        return t !== e;
      });
  function FetchError(e) {
    (this.status = e.status || null),
      (this.headers = e.headers || null),
      (this.json = e.json || null),
      (this.body = e.body || null);
  }
  FetchError.prototype = Error.prototype;
  const selectors$3 = {
    quantityHolder: "[data-quantity-holder]",
    quantityField: "[data-quantity-field]",
    quantityButton: "[data-quantity-button]",
    quantityMinusButton: "[data-quantity-minus]",
    quantityPlusButton: "[data-quantity-plus]",
    quantityReadOnly: "read-only",
    isDisabled: "is-disabled",
  };
  class QuantityCounter {
    constructor(e, t = !1) {
      (this.holder = e), (this.quantityUpdateCart = t);
    }
    init() {
      (this.settings = selectors$3),
        (this.quantity = this.holder.querySelector(
          this.settings.quantityHolder
        )),
        (this.field = this.quantity.querySelector(this.settings.quantityField)),
        (this.buttons = this.quantity.querySelectorAll(
          this.settings.quantityButton
        )),
        (this.increaseButton = this.quantity.querySelector(
          this.settings.quantityPlusButton
        )),
        (this.quantityValue = Number(this.field.value || 0)),
        (this.cartItemID = this.field.getAttribute("data-id")),
        (this.maxValue =
          Number(this.field.getAttribute("max")) > 0
            ? Number(this.field.getAttribute("max"))
            : null),
        (this.minValue =
          Number(this.field.getAttribute("min")) > 0
            ? Number(this.field.getAttribute("min"))
            : 0),
        (this.disableIncrease = this.disableIncrease.bind(this)),
        (this.emptyField = !1),
        (this.updateQuantity = this.updateQuantity.bind(this)),
        (this.decrease = this.decrease.bind(this)),
        (this.increase = this.increase.bind(this)),
        this.disableIncrease(),
        this.quantity.classList.contains(this.settings.quantityReadOnly) ||
          (this.changeValueOnClick(), this.changeValueOnInput());
    }
    changeValueOnClick() {
      const e = this;
      this.buttons.forEach((t) => {
        t.addEventListener("click", (t) => {
          t.preventDefault();
          const s = t.target,
            i =
              s.matches(e.settings.quantityMinusButton) ||
              s.closest(e.settings.quantityMinusButton),
            o =
              s.matches(e.settings.quantityPlusButton) ||
              s.closest(e.settings.quantityPlusButton);
          i && e.decrease(), o && e.increase(), e.updateQuantity();
        });
      });
    }
    changeValueOnInput() {
      const e = this;
      this.field.addEventListener(
        "input",
        function () {
          (e.quantityValue = this.value),
            "" === this.value && (e.emptyField = !0),
            e.updateQuantity();
        },
        this
      );
    }
    updateQuantity() {
      this.maxValue < this.quantityValue &&
        null !== this.maxValue &&
        (this.quantityValue = this.maxValue),
        this.minValue > this.quantityValue &&
          (this.quantityValue = this.minValue),
        (this.field.value = this.quantityValue),
        this.disableIncrease(),
        document.dispatchEvent(new CustomEvent("popout:updateValue")),
        this.quantityUpdateCart && this.updateCart();
    }
    decrease() {
      this.quantityValue > this.minValue
        ? this.quantityValue--
        : (this.quantityValue = 0);
    }
    increase() {
      this.quantityValue++;
    }
    disableIncrease() {
      this.increaseButton.classList.toggle(
        this.settings.isDisabled,
        this.quantityValue >= this.maxValue && null !== this.maxValue
      );
    }
    updateCart() {
      const e = new CustomEvent("update-cart", {
        bubbles: !0,
        detail: {
          id: this.cartItemID,
          quantity: this.quantityValue,
          valueIsEmpty: this.emptyField,
        },
      });
      this.holder.dispatchEvent(e);
    }
  }
  const settings = {
    cartDrawerEnabled: window.theme.cartDrawerEnabled,
    times: { timeoutAddProduct: 1e3, closeDropdownAfter: 5e3 },
    classes: {
      hidden: "is-hidden",
      added: "is-added",
      htmlClasses: "has-open-cart-dropdown",
      open: "is-open",
      active: "is-active",
      visible: "is-visible",
      loading: "is-loading",
      disabled: "is-disabled",
      success: "is-success",
      error: "has-error",
      headerStuck: "js__header__stuck",
      drawerVisible: "drawer--visible",
    },
    attributes: {
      transparent: "data-header-transparent",
      upsellButton: "data-upsell-btn",
    },
    elements: {
      html: "html",
      cartDropdown: "#cart-dropdown",
      cartDropdownBody: "[data-cart-dropdown-body]",
      emptyMessage: "[data-empty-message]",
      buttonHolder: "[data-foot-holder]",
      itemsHolder: "[data-items-holder]",
      item: "[data-item]",
      cartToggleElement: "[data-cart-toggle]",
      cartItemRemove: "[data-item-remove]",
      cartCount: "[data-cart-count]",
      cartCountValue: "data-cart-count",
      clickedElementForExpanding: "[data-expand-button]",
      cartWidget: "[data-cart-widget]",
      cartTotal: "[data-cart-total]",
      cartMessage: "[data-cart-message]",
      cartMessageValue: "data-cart-message",
      buttonAddToCart: "[data-add-to-cart]",
      formErrorsContainer: "[data-cart-errors-container]",
      cartErrors: "[data-cart-errors]",
      cartCloseError: "[data-cart-error-close]",
      formCloseError: "[data-close-error]",
      quickAddHolder: "[data-quick-add-holder]",
      cartProgress: "[data-cart-progress]",
      cartOriginalTotal: "[data-cart-original-total]",
      cartOriginaTotalPrice: "[data-cart-original-total-price]",
      cartDiscountsHolder: "[data-cart-discounts-holder]",
      headerWrapper: "[data-header-wrapper]",
      burgerButton: "[data-drawer-toggle]",
      upsellHolder: "[data-upsell-holder]",
      errorMessage: "[data-error-message]",
      navDrawer: "[data-drawer]",
    },
    formatMoney: theme.moneyFormat,
    cartTotalDiscountsTemplate: "[data-cart-total-discount]",
  };
  class CartDrawer {
    constructor() {
      "/password" !== window.location.pathname && this.init();
    }
    init() {
      (this.settings = settings),
        (this.document = document),
        (this.html = this.document.querySelector(this.settings.elements.html)),
        (this.cartDropdown = this.document.querySelector(
          this.settings.elements.cartDropdown
        )),
        (this.cartDropdownBody = this.document.querySelector(
          this.settings.elements.cartDropdownBody
        )),
        (this.emptyMessage = this.document.querySelector(
          this.settings.elements.emptyMessage
        )),
        (this.buttonHolder = this.document.querySelector(
          this.settings.elements.buttonHolder
        )),
        (this.itemsHolder = this.document.querySelector(
          this.settings.elements.itemsHolder
        )),
        (this.items = this.document.querySelectorAll(
          this.settings.elements.item
        )),
        (this.counterHolders = this.document.querySelectorAll(
          this.settings.elements.cartCount
        )),
        (this.cartTotal = this.document.querySelector(
          this.settings.elements.cartTotal
        )),
        (this.cartMessage = this.document.querySelector(
          this.settings.elements.cartMessage
        )),
        (this.cartOriginalTotal = this.document.querySelector(
          this.settings.elements.cartOriginalTotal
        )),
        (this.cartOriginaTotalPrice = this.document.querySelector(
          this.settings.elements.cartOriginaTotalPrice
        )),
        (this.cartDiscountHolder = this.document.querySelector(
          this.settings.elements.cartDiscountsHolder
        )),
        (this.clickedElementForExpanding = this.document.querySelectorAll(
          this.settings.elements.clickedElementForExpanding
        )),
        (this.cartTotalDiscountTemplate = this.document.querySelector(
          this.settings.cartTotalDiscountsTemplate
        ).innerHTML),
        (this.cartErrorHolder = this.document.querySelector(
          this.settings.elements.cartErrors
        )),
        (this.cartCloseErrorMessage = this.document.querySelector(
          this.settings.elements.cartCloseError
        )),
        (this.headerWrapper = this.document.querySelector(
          this.settings.elements.headerWrapper
        )),
        (this.headerIsTransparent =
          "false" !==
          this.headerWrapper.getAttribute(
            this.settings.attributes.transparent
          )),
        (this.accessibility = a11y),
        (this.navDrawer = this.document.querySelector(
          this.settings.elements.navDrawer
        )),
        (this.form = null),
        (this.build = this.build.bind(this)),
        (this.addToCart = this.addToCart.bind(this)),
        (this.updateCart = this.updateCart.bind(this)),
        (this.openCartDropdown = this.openCartDropdown.bind(this)),
        (this.closeCartDropdown = this.closeCartDropdown.bind(this)),
        (this.toggleCartDropdown = this.toggleCartDropdown.bind(this)),
        (this.hasItemsInCart = this.hasItemsInCart.bind(this)),
        (this.toggleClassesOnContainers =
          this.toggleClassesOnContainers.bind(this)),
        (this.cartDropdownIsBuilded = this.items.length > 0),
        (this.totalItems = this.cartDropdownIsBuilded),
        (this.cartDropdownIsOpen = !1),
        (this.cartDiscounts = 0),
        (this.cartDrawerEnabled = this.settings.cartDrawerEnabled),
        (this.cartLimitErrorIsHidden = !0),
        this.html.style.setProperty(
          "--scrollbar-width",
          window.innerWidth - this.html.clientWidth + "px"
        ),
        this.eventToggleCart(),
        this.expandEvents(),
        this.cartEvents(),
        this.cartEventAdd(),
        this.initQuantity(),
        this.customEventAddProduct(),
        this.estimateShippingCalculator(),
        this.cartMessage &&
          ((this.cartFreeLimitShipping =
            100 * Number(this.cartMessage.getAttribute("data-limit"))),
          (this.subtotal = 0),
          (this.progress = this.document.querySelector(
            this.settings.elements.cartProgress
          )),
          (this.circumference = 28 * Math.PI),
          this.setProgress(this.progress.getAttribute("data-percent")));
    }
    initQuantity() {
      (this.items = this.document.querySelectorAll(
        this.settings.elements.item
      )),
        this.items.forEach((e) => {
          new QuantityCounter(e, !0).init(), this.customEventsHandle(e);
        });
    }
    expandEvents() {
      const e = this;
      this.clickedElementForExpanding.forEach((t) => {
        t.addEventListener("click", function (s) {
          s.preventDefault(),
            t.classList.toggle(e.settings.classes.active),
            slideToggle(e.document.querySelector(t.getAttribute("href")), 400);
          const i = getSiblings(
            t.closest(e.settings.elements.cartWidget)
          ).filter((t) =>
            t.hasAttribute(
              e.settings.elements.cartWidget.replace("[", "").replace("]", "")
            )
          )[0];
          if (i) {
            const t = i.querySelector(
              e.settings.elements.clickedElementForExpanding
            );
            t.classList.remove(e.settings.classes.active),
              slideUp(t.nextElementSibling, 400);
          }
        });
      });
    }
    customEventsHandle(e) {
      e.addEventListener(
        "update-cart",
        debounce((t) => {
          this.updateCart(
            { id: t.detail.id, quantity: t.detail.quantity },
            e,
            t.detail.valueIsEmpty
          );
        }, 500)
      );
    }
    customEventAddProduct() {
      this.html.addEventListener(
        "cart:add-to-cart",
        debounce((e) => {
          this.addToCart(JSON.stringify(e.detail.data), e.detail);
        }, 500)
      );
    }
    cartEvents() {
      const e = this;
      this.document
        .querySelectorAll(e.settings.elements.cartItemRemove)
        .forEach((t) => {
          t.addEventListener("click", function (t) {
            t.preventDefault(),
              e.updateCart({ id: this.getAttribute("data-id"), quantity: 0 });
          });
        }),
        this.cartCloseErrorMessage &&
          this.cartCloseErrorMessage.addEventListener("click", (e) => {
            e.preventDefault(), slideUp(this.cartErrorHolder, 400);
          });
    }
    cartEventAdd() {
      this.document.addEventListener("click", (e) => {
        const t = e.target;
        if (
          t.matches(this.settings.elements.buttonAddToCart) ||
          (t.closest(this.settings.elements.buttonAddToCart) && t)
        ) {
          e.preventDefault();
          let s = t.matches(this.settings.elements.buttonAddToCart)
            ? t
            : t.closest(this.settings.elements.buttonAddToCart);
          if (
            (s.hasAttribute(this.settings.attributes.upsellButton)
              ? s.classList.add(this.settings.classes.loading)
              : (s = null),
            t.hasAttribute("disabled") || t.parentNode.hasAttribute("disabled"))
          )
            return;
          this.form = t.closest("form");
          const i = new FormData(this.form);
          if (this.form.querySelector('[type="file"]')) return;
          const o = new URLSearchParams(i).toString();
          this.addToCart(o, null, s),
            this.html.dispatchEvent(
              new CustomEvent("cart:add-item", {
                bubbles: !0,
                detail: { selector: t },
              })
            );
        }
      });
    }
    estimateShippingCalculator() {
      Shopify.Cart.ShippingCalculator.show({
        submitButton: theme.strings.shippingCalcSubmitButton,
        submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
        customerIsLoggedIn: theme.customerLoggedIn,
        moneyFormat: theme.moneyWithCurrencyFormat,
      });
    }
    getCart() {
      fetch("/cart.js")
        .then(this.handleErrors)
        .then((e) => e.json())
        .then(
          (e) => (
            this.updateCounter(e.item_count),
            (this.newTotalItems = e.items.length),
            this.buildTotalPrice(e),
            this.freeShippingMessageHandle(e.total_price),
            this.cartMessage &&
              ((this.subtotal = e.total_price), this.updateProgress()),
            fetch("/cart?view=items")
          )
        )
        .then((e) => e.text())
        .then((e) => {
          this.build(e);
        })
        .catch((e) => console.log(e));
    }
    addToCart(e, t = null, s = null) {
      null === this.form &&
        null !== t &&
        t.label &&
        (this.form = t.label.parentNode.querySelector("form")),
        fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: e,
        })
          .then((e) => e.json())
          .then((e) => {
            s && s.setAttribute("disabled", "disabled"),
              e.status
                ? null !== t
                  ? this.addToCartError(e, t.element, s)
                  : this.addToCartError(e, null, s)
                : this.cartDrawerEnabled
                ? (null !== t &&
                    t.label &&
                    (t.label.classList.remove(
                      this.settings.classes.hidden,
                      this.settings.classes.loading
                    ),
                    t.label.classList.add(this.settings.classes.added)),
                  this.getCart(),
                  setTimeout(() => {
                    null !== s &&
                      (s.classList.remove(this.settings.classes.loading),
                      s.removeAttribute("disabled"),
                      s.classList.add(this.settings.classes.success)),
                      this.openCartDropdown(),
                      (this.cartDropdownIsOpen = !0);
                  }, this.settings.times.timeoutAddProduct))
                : (window.location = theme.routes.cart);
          })
          .catch((e) => console.log(e));
    }
    updateCart(e = {}, t = null, s = !1) {
      let i = null,
        o = null,
        r = null,
        n = e.quantity;
      null !== t &&
        t
          .closest(this.settings.elements.item)
          .classList.add(this.settings.classes.loading),
        this.items.forEach((e) => {
          e.classList.add(this.settings.classes.disabled),
            e.querySelector("input").blur();
        }),
        fetch("/cart.js")
          .then(this.handleErrors)
          .then((e) => e.json())
          .then((t) => {
            const s = t.items.findIndex((t) => t.key === e.id);
            (o = t.item_count), (r = t.items[s].title);
            const i = { line: `${s + 1}`, quantity: n };
            return fetch("/cart/change.js", {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(i),
            });
          })
          .then(this.handleErrors)
          .then((e) => e.json())
          .then((e) => {
            (i = e.item_count),
              s && (n = 1),
              0 !== n &&
                ((this.cartLimitErrorIsHidden = i !== o),
                this.toggleLimitError(r)),
              this.updateCounter(i),
              this.buildTotalPrice(e),
              this.freeShippingMessageHandle(e.total_price),
              (this.cartDiscounts = e.total_discount),
              this.cartMessage &&
                ((this.subtotal = e.total_price), this.updateProgress()),
              this.getCart();
          })
          .catch((e) => console.log(e));
    }
    toggleLimitError(e) {
      (this.cartErrorHolder.querySelector(
        this.settings.elements.errorMessage
      ).innerText = e),
        this.cartLimitErrorIsHidden
          ? slideUp(this.cartErrorHolder, 400)
          : slideDown(this.cartErrorHolder, 400);
    }
    handleErrors(e) {
      return e.ok
        ? e
        : e.json().then(function (t) {
            throw new FetchError({
              status: e.statusText,
              headers: e.headers,
              json: t,
            });
          });
    }
    addToCartError(e, t, s) {
      this.cartDrawerEnabled && this.closeCartDropdown();
      let i = this.document.querySelector(
        this.settings.elements.formErrorsContainer
      );
      null !== s &&
        ((i = s
          .closest(this.settings.elements.upsellHolder)
          .querySelector(this.settings.elements.formErrorsContainer)),
        s.classList.remove(this.settings.classes.loading),
        s.removeAttribute("disabled")),
        i &&
          ((i.innerHTML = `<div class="errors">${e.message}: ${e.description}<span class="errors__close" data-close-error><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-close-thin" viewBox="0 0 27 27"><g stroke="#979797" fill="none" fill-rule="evenodd" stroke-linecap="square"><path d="M.5.5l26 26M26.5.5l-26 26"></path></g></svg></span></div>`),
          i.classList.add(this.settings.classes.visible),
          document.dispatchEvent(
            new CustomEvent("product:bar:error", { bubbles: !1 })
          )),
        t &&
          this.html.dispatchEvent(
            new CustomEvent("cart:add-to-error", {
              bubbles: !0,
              detail: {
                message: e.message,
                description: e.description,
                holder: t,
              },
            })
          ),
        this.document.addEventListener("click", (e) => {
          const t = e.target;
          (t.matches(this.settings.elements.formCloseError) ||
            t.closest(this.settings.elements.formCloseError)) &&
            (e.preventDefault(),
            i.classList.remove(this.settings.classes.visible));
        });
    }
    openCartDropdown() {
      document.dispatchEvent(
        new CustomEvent("theme:drawer:close", { bubbles: !1 })
      ),
        document.dispatchEvent(
          new CustomEvent("theme:scroll:lock", {
            bubbles: !0,
            detail: this.cartDropdown,
          })
        ),
        document.dispatchEvent(
          new CustomEvent("theme:scroll:lock", {
            bubbles: !0,
            detail: this.cartDropdownBody,
          })
        ),
        this.html.classList.add(this.settings.classes.htmlClasses),
        this.cartDropdown.classList.add(this.settings.classes.open),
        this.accessibility.removeTrapFocus(),
        this.accessibility.trapFocus(this.cartDropdown, {
          elementToFocus: this.cartDropdown.querySelector(
            "a:first-child, input:first-child"
          ),
        }),
        (this.headerIsTransparent =
          "false" !==
          this.headerWrapper.getAttribute(
            this.settings.attributes.transparent
          )),
        this.headerWrapper.setAttribute(
          this.settings.attributes.transparent,
          !1
        ),
        this.cartDropdownIsBuilded || this.getCart();
    }
    closeCartDropdown() {
      if (
        (this.document.dispatchEvent(
          new CustomEvent("theme:cart-close", { bubbles: !0 })
        ),
        this.accessibility.removeTrapFocus(),
        slideUp(this.cartErrorHolder, 400),
        this.html.classList.contains("is-focused"))
      ) {
        const e = this.document.querySelector(
          `${this.settings.elements.cartToggleElement}[data-focus-element]`
        );
        setTimeout(() => {
          e.focus();
        }, 200);
      }
      const e = this.document.querySelector(
        `[${this.settings.attributes.upsellButton}].${this.settings.classes.success}`
      );
      e &&
        setTimeout(() => {
          e.classList.remove(this.settings.classes.success);
        }, 2e3),
        this.headerWrapper.setAttribute(
          this.settings.attributes.transparent,
          this.headerIsTransparent
        ),
        this.html.classList.remove(this.settings.classes.htmlClasses),
        this.cartDropdown.classList.remove(this.settings.classes.open),
        document.dispatchEvent(
          new CustomEvent("theme:scroll:unlock", { bubbles: !0 })
        );
    }
    toggleCartDropdown() {
      (this.cartDropdownIsOpen = !this.cartDropdownIsOpen),
        this.cartDropdownIsOpen
          ? this.openCartDropdown()
          : this.closeCartDropdown();
    }
    eventToggleCart() {
      this.document.addEventListener("click", (e) => {
        const t = e.target,
          s = !(
            t.matches(this.settings.elements.cartToggleElement) ||
            t.closest(this.settings.elements.cartToggleElement)
          ),
          i = !(
            t.matches(this.settings.elements.cartDropdown) ||
            t.closest(this.settings.elements.cartDropdown)
          ),
          o =
            t.matches(this.settings.elements.burgerButton) ||
            t.closest(this.settings.elements.burgerButton);
        t.matches(this.settings.elements.cartToggleElement) ||
        t.closest(this.settings.elements.cartToggleElement)
          ? (e.preventDefault(), this.toggleCartDropdown())
          : this.cartDropdownIsOpen &&
            s &&
            i &&
            ((this.cartDropdownIsOpen = !1),
            o &&
              !this.headerWrapper.classList.contains(
                this.settings.classes.headerStuck
              ) &&
              (this.headerIsTransparent = !1),
            this.closeCartDropdown());
      });
    }
    toggleClassesOnContainers() {
      const e = this;
      this.emptyMessage.classList.toggle(
        e.settings.classes.hidden,
        e.hasItemsInCart()
      ),
        this.buttonHolder.classList.toggle(
          e.settings.classes.hidden,
          !e.hasItemsInCart()
        ),
        this.itemsHolder.classList.toggle(
          e.settings.classes.hidden,
          !e.hasItemsInCart()
        );
    }
    build(e) {
      this.totalItems !== this.newTotalItems &&
        ((this.totalItems = this.newTotalItems),
        this.toggleClassesOnContainers()),
        (this.itemsHolder.innerHTML = e),
        this.cartEvents(),
        this.initQuantity();
    }
    updateCounter(e) {
      this.counterHolders.length &&
        this.counterHolders.forEach((t) => {
          (t.innerHTML = e),
            t.setAttribute(settings.elements.cartCountValue, e);
        });
    }
    hasItemsInCart() {
      return this.totalItems > 0;
    }
    buildTotalPrice(e) {
      if (
        (e.original_total_price > e.total_price &&
        e.cart_level_discount_applications.length > 0
          ? (this.cartOriginalTotal.classList.remove(
              this.settings.classes.hidden
            ),
            (this.cartOriginaTotalPrice.innerHTML = themeCurrency.formatMoney(
              e.original_total_price,
              this.settings.formatMoney
            )))
          : this.cartOriginalTotal.classList.add(this.settings.classes.hidden),
        (this.cartTotal.innerHTML = themeCurrency.formatMoney(
          e.total_price,
          this.settings.formatMoney
        )),
        e.cart_level_discount_applications.length > 0)
      ) {
        const t = this.buildCartTotalDiscounts(
          e.cart_level_discount_applications
        );
        this.cartDiscountHolder.classList.remove(this.settings.classes.hidden),
          (this.cartDiscountHolder.innerHTML = t);
      } else
        this.cartDiscountHolder.classList.add(this.settings.classes.hidden);
    }
    buildCartTotalDiscounts(e) {
      let t = "";
      return (
        e.forEach((e) => {
          t += Sqrl.render(this.cartTotalDiscountTemplate, {
            discountTitle: e.title,
            discountTotalAllocatedAmount: themeCurrency.formatMoney(
              e.total_allocated_amount,
              this.settings.formatMoney
            ),
          });
        }),
        t
      );
    }
    freeShippingMessageHandle(e) {
      if (this.cartMessage) {
        let t = this.settings.classes.hidden;
        this.cartMessage.hasAttribute(
          this.settings.elements.cartMessageValue
        ) &&
          "true" ===
            this.cartMessage.getAttribute(
              this.settings.elements.cartMessageValue
            ) &&
          0 !== e &&
          (t = this.settings.classes.success),
          this.cartMessage.classList.toggle(
            t,
            e >= this.cartFreeLimitShipping || 0 === e
          );
      }
    }
    setProgress(e) {
      const t = this.circumference - ((e / 100) * this.circumference) / 2;
      this.progress.style.strokeDashoffset = t;
    }
    updateProgress() {
      const e = (this.subtotal / this.cartFreeLimitShipping) * 100;
      this.setProgress(e > 100 ? 100 : e);
    }
  }
  window.cart = new CartDrawer();
  const settings$1 = {
    elements: {
      html: "html",
      body: "body",
      inPageLink: "[data-skip-content]",
      linkesWithOnlyHash: 'a[href="#"]',
      triggerFocusElement: "[data-focus-element]",
      cartDropdown: "#cart-dropdown",
      search: "#search-popdown",
      accordionContent: ".accordion-content",
      tabs: ".tabs",
      accordionDataToggle: "data-accordion-toggle",
    },
    classes: {
      focus: "is-focused",
      open: "is-open",
      accordionToggle: "accordion-toggle",
      tabLink: "tab-link",
    },
    keysCodes: { escapeCode: 27, tabCode: 9, enterCode: 13, spaceCode: 32 },
  };
  class Accessibility {
    constructor() {
      this.init();
    }
    init() {
      (this.settings = settings$1),
        (this.window = window),
        (this.document = document),
        (this.a11y = a11y),
        (this.cart = this.window.cart),
        (this.inPageLink = this.document.querySelector(
          this.settings.elements.inPageLink
        )),
        (this.linkesWithOnlyHash = this.document.querySelectorAll(
          this.settings.elements.linkesWithOnlyHash
        )),
        (this.html = this.document.querySelector(this.settings.elements.html)),
        (this.body = this.document.querySelector(this.settings.elements.body)),
        (this.cartDropdown = this.document.querySelector(
          this.settings.elements.cartDropdown
        )),
        (this.lastFocused = null),
        (this.isFocused = !1),
        this.a11y.focusHash(),
        this.a11y.bindInPageLinks(),
        this.clickEvents(),
        this.focusEvents(),
        this.focusEventsOff(),
        this.closeExpandedElements();
    }
    clickEvents() {
      this.inPageLink &&
        this.inPageLink.addEventListener("click", (e) => {
          e.preventDefault();
        }),
        this.linkesWithOnlyHash &&
          this.linkesWithOnlyHash.forEach((e) => {
            e.addEventListener("click", (e) => {
              e.preventDefault();
            });
          });
    }
    focusEvents() {
      this.document.addEventListener("keyup", (e) => {
        e.keyCode === this.settings.keysCodes.tabCode &&
          (this.body.classList.add(this.settings.classes.focus),
          (this.isFocused = !0));
      }),
        this.document.addEventListener("keyup", (e) => {
          if (!this.isFocused) return;
          const t = e.target,
            s =
              e.keyCode === this.settings.keysCodes.enterCode ||
              e.keyCode === this.settings.keysCodes.spaceCode,
            i =
              t.matches(this.settings.elements.triggerFocusElement) ||
              t.closest(this.settings.elements.triggerFocusElement),
            o =
              t.classList.contains(this.settings.classes.accordionToggle) ||
              t.parentNode.classList.contains(
                this.settings.classes.accordionToggle
              ) ||
              t.hasAttribute(this.settings.elements.accordionDataToggle) ||
              t.parentNode.hasAttribute(
                this.settings.elements.accordionDataToggle
              ),
            r =
              t.classList.contains(this.settings.classes.tabLink) ||
              t.parentNode.classList.contains(this.settings.classes.tabLink),
            n =
              t.hasAttribute("data-popdown-toggle") ||
              (t.closest(this.settings.elements.triggerFocusElement) &&
                t
                  .closest(this.settings.elements.triggerFocusElement)
                  .hasAttribute("data-popdown-toggle"));
          if (s && i) {
            null === this.lastFocused && (this.lastFocused = t);
            let e = this.document.querySelector(
              this.settings.elements.cartDropdown
            );
            if (
              (n &&
                (e = this.document.querySelector(
                  this.settings.elements.search
                )),
              o && ((e = t.nextElementSibling), t.click()),
              r)
            ) {
              const s = `.tab-content-${t.getAttribute("data-tab")}`;
              (e = this.document.querySelector(s)), t.click();
            }
            e.querySelector("a, input") &&
              this.a11y.trapFocus(e, {
                elementToFocus: e.querySelector(
                  "a:first-child, input:first-child"
                ),
              });
          }
        }),
        this.html.addEventListener("cart:add-item", (e) => {
          this.lastFocused = e.detail.selector;
        });
    }
    focusEventsOff() {
      this.document.addEventListener("mousedown", () => {
        this.body.classList.remove(this.settings.classes.focus),
          (this.isFocused = !1);
      });
    }
    closeExpandedElements() {
      document.addEventListener("keyup", (e) => {
        if (e.keyCode !== this.settings.keysCodes.escapeCode) return;
        this.a11y.removeTrapFocus(),
          this.html.classList.contains(
            this.cart.settings.classes.htmlClasses
          ) &&
            (this.cart.toggleCartDropdown(),
            this.html.classList.remove(this.cart.settings.classes.htmlClasses),
            this.cartDropdown.classList.remove(
              this.cart.settings.classes.open
            ));
        const t = document.querySelectorAll(
          this.settings.elements.accordionContent
        );
        if (t.length)
          for (let e = 0; e < t.length; e++) {
            if ("block" !== t[e].style.display) continue;
            t[e].previousElementSibling.classList.remove(
              this.settings.classes.open
            ),
              slideUp(t[e]);
          }
        null !== this.lastFocused &&
          setTimeout(() => {
            this.lastFocused.focus(), (this.lastFocused = null);
          }, 600);
      });
    }
  }
  (window.accessibility = new Accessibility()),
    (theme.ProductModel = (function () {
      let e = {},
        t = {},
        s = {};
      const i = "[data-product-single-media-wrapper]",
        o = "[data-product-slideshow]",
        r = "[data-shopify-xr]",
        n = "data-media-id",
        a = "data-model-id",
        l = "data-shopify-model3d-id",
        c = "model-viewer",
        d = "#ModelJson-",
        h = "media--hidden";
      function u(t) {
        if (t) console.warn(t);
        else if (window.ShopifyXR) {
          for (const t in e)
            if (e.hasOwnProperty(t)) {
              const s = e[t];
              if (s.loaded) continue;
              const i = document.querySelector(`${d}${t}`);
              i &&
                (window.ShopifyXR.addModels(JSON.parse(i.innerHTML)),
                (s.loaded = !0));
            }
          window.ShopifyXR.setupXRElements();
        } else
          document.addEventListener("shopify_xr_initialized", function () {
            u();
          });
      }
      function p(e) {
        if (e) console.warn(e);
        else
          for (const e in t)
            if (t.hasOwnProperty(e)) {
              const s = t[e];
              s.modelViewerUi ||
                (s.modelViewerUi = new Shopify.ModelViewerUI(s.$element)),
                m(s);
            }
      }
      function m(e) {
        const t = s[e.sectionId];
        e.$container.addEventListener("mediaVisible", function () {
          t.$element.setAttribute(l, e.modelId),
            g(e.mediaId),
            window.theme.touched || e.modelViewerUi.play();
        }),
          e.$container.addEventListener("mediaHidden", function () {
            t.$element.setAttribute(l, t.defaultId), e.modelViewerUi.pause();
          }),
          e.$container.addEventListener("xrLaunch", function () {
            e.modelViewerUi.pause();
          }),
          e.$element.addEventListener(
            "shopify_model_viewer_ui_toggle_play",
            function () {
              g(e.mediaId);
            }
          );
      }
      function g(e) {
        const t = `[${n}="${e}"]`,
          s = document.querySelector(`${i}${t}`),
          o = document.querySelectorAll(`${i}:not(${t})`);
        s.classList.remove(h),
          o.length &&
            o.forEach((e) => {
              e.dispatchEvent(new CustomEvent("mediaHidden")),
                e.classList.add(h);
            });
      }
      return {
        init: function (i, l) {
          e[l] = { loaded: !1 };
          const d = i.getAttribute(n),
            h = i.querySelector(c),
            m = h.getAttribute(a),
            g = i.closest(o).parentElement.querySelector(r);
          (s[l] = { $element: g, defaultId: m }),
            (t[d] = {
              modelId: m,
              mediaId: d,
              sectionId: l,
              $container: i,
              $element: h,
            }),
            window.Shopify.loadFeatures([
              { name: "shopify-xr", version: "1.0", onLoad: u },
              { name: "model-viewer-ui", version: "1.0", onLoad: p },
            ]);
        },
        removeSectionModels: function (s) {
          for (const e in t)
            if (t.hasOwnProperty(e)) {
              t[e].sectionId === s && delete t[e];
            }
          delete e[s], delete theme.mediaInstances[s];
        },
      };
    })());
  const selectors$4 = {
    templateAddresses: ".template-addresses",
    addressNewForm: "#AddressNewForm",
    btnNew: ".address-new-toggle",
    btnEdit: ".address-edit-toggle",
    btnDelete: ".address-delete",
    classHide: "hide",
    dataFormId: "data-form-id",
    dataConfirmMessage: "data-confirm-message",
    defaultConfirmMessage: "Are you sure you wish to delete this address?",
    editAddress: "#EditAddress",
    addressCountryNew: "AddressCountryNew",
    addressProvinceNew: "AddressProvinceNew",
    addressProvinceContainerNew: "AddressProvinceContainerNew",
    addressCountryOption: ".address-country-option",
    addressCountry: "AddressCountry",
    addressProvince: "AddressProvince",
    addressProvinceContainer: "AddressProvinceContainer",
  };
  class Addresses {
    constructor(e) {
      (this.section = e),
        (this.addressNewForm = this.section.querySelector(
          selectors$4.addressNewForm
        )),
        this.init();
    }
    init() {
      if (this.addressNewForm) {
        const e = this.section,
          t = this.addressNewForm;
        this.customerAddresses();
        const s = e.querySelectorAll(selectors$4.btnNew);
        s.length &&
          s.forEach((e) => {
            e.addEventListener("click", function () {
              t.classList.toggle(selectors$4.classHide);
            });
          });
        const i = e.querySelectorAll(selectors$4.btnEdit);
        i.length &&
          i.forEach((t) => {
            t.addEventListener("click", function () {
              const t = this.getAttribute(selectors$4.dataFormId);
              e.querySelector(
                `${selectors$4.editAddress}_${t}`
              ).classList.toggle(selectors$4.classHide);
            });
          });
        const o = e.querySelectorAll(selectors$4.btnDelete);
        o.length &&
          o.forEach((e) => {
            e.addEventListener("click", function () {
              const e = this.getAttribute(selectors$4.dataFormId),
                t = this.getAttribute(selectors$4.dataConfirmMessage);
              confirm(t || selectors$4.defaultConfirmMessage) &&
                Shopify.postLink("/account/addresses/" + e, {
                  parameters: { _method: "delete" },
                });
            });
          });
      }
    }
    customerAddresses() {
      Shopify.CountryProvinceSelector &&
        new Shopify.CountryProvinceSelector(
          selectors$4.addressCountryNew,
          selectors$4.addressProvinceNew,
          { hideElement: selectors$4.addressProvinceContainerNew }
        );
      this.section
        .querySelectorAll(selectors$4.addressCountryOption)
        .forEach((e) => {
          const t = e.getAttribute(selectors$4.dataFormId),
            s = `${selectors$4.addressCountry}_${t}`,
            i = `${selectors$4.addressProvince}_${t}`,
            o = `${selectors$4.addressProvinceContainer}_${t}`;
          new Shopify.CountryProvinceSelector(s, i, { hideElement: o });
        });
    }
  }
  const template = document.querySelector(selectors$4.templateAddresses);
  template && new Addresses(template);
  const selectors$5 = {
    accountTemplateLogged: ".customer-logged-in",
    account: ".account",
    accountSidebarMobile: ".account-sidebar--mobile",
  };
  class Account {
    constructor(e) {
      (this.section = e), this.init();
    }
    init() {
      this.section.querySelector(selectors$5.account) &&
        this.accountMobileSidebar();
    }
    accountMobileSidebar() {
      this.section
        .querySelector(selectors$5.accountSidebarMobile)
        .addEventListener("click", function () {
          const e = this.nextElementSibling;
          e && "UL" === e.tagName && e.classList.toggle("visible");
        });
    }
  }
  const template$1 = document.querySelector(selectors$5.accountTemplateLogged);
  template$1 && new Account(template$1);
  const selectors$6 = {
    form: "[data-account-form]",
    showReset: "[data-show-reset]",
    hideReset: "[data-hide-reset]",
    recover: "[data-recover-password]",
    login: "[data-login-form]",
    recoverHash: "#recover",
    hideClass: "is-hidden",
  };
  class Login {
    constructor(e) {
      (this.form = e),
        (this.showButton = e.querySelector(selectors$6.showReset)),
        (this.hideButton = e.querySelector(selectors$6.hideReset)),
        (this.recover = e.querySelector(selectors$6.recover)),
        (this.login = e.querySelector(selectors$6.login)),
        this.init();
    }
    init() {
      window.location.hash == selectors$6.recoverHash
        ? this.showRecoverPasswordForm()
        : this.hideRecoverPasswordForm(),
        this.showButton.addEventListener(
          "click",
          function (e) {
            e.preventDefault(), this.showRecoverPasswordForm();
          }.bind(this),
          !1
        ),
        this.hideButton.addEventListener(
          "click",
          function (e) {
            e.preventDefault(), this.hideRecoverPasswordForm();
          }.bind(this),
          !1
        );
    }
    showRecoverPasswordForm() {
      return (
        this.login.classList.add(selectors$6.hideClass),
        this.recover.classList.remove(selectors$6.hideClass),
        (window.location.hash = selectors$6.recoverHash),
        !1
      );
    }
    hideRecoverPasswordForm() {
      return (
        this.recover.classList.add(selectors$6.hideClass),
        this.login.classList.remove(selectors$6.hideClass),
        (window.location.hash = ""),
        !1
      );
    }
  }
  const loginForm = document.querySelector(selectors$6.form);
  loginForm && new Login(loginForm),
    (window.Shopify = window.Shopify || {}),
    (window.Shopify.theme = window.Shopify.theme || {}),
    (window.Shopify.theme.sections = window.Shopify.theme.sections || {}),
    (window.Shopify.theme.sections.registered =
      window.Shopify.theme.sections.registered || {}),
    (window.Shopify.theme.sections.instances =
      window.Shopify.theme.sections.instances || []);
  const registered = window.Shopify.theme.sections.registered,
    instances = window.Shopify.theme.sections.instances,
    selectors$7 = { id: "data-section-id", type: "data-section-type" };
  class Registration {
    constructor(e = null, t = []) {
      (this.type = e),
        (this.components = validateComponentsArray(t)),
        (this.callStack = {
          onLoad: [],
          onUnload: [],
          onSelect: [],
          onDeselect: [],
          onBlockSelect: [],
          onBlockDeselect: [],
          onReorder: [],
        }),
        t.forEach((e) => {
          for (const [t, s] of Object.entries(e)) {
            const e = this.callStack[t];
            Array.isArray(e) && "function" == typeof s
              ? e.push(s)
              : (console.warn(
                  `Unregisted function: '${t}' in component: '${this.type}'`
                ),
                console.warn(s));
          }
        });
    }
    getStack() {
      return this.callStack;
    }
  }
  class Section {
    constructor(e, t) {
      (this.container = validateContainerElement(e)),
        (this.id = e.getAttribute(selectors$7.id)),
        (this.type = t.type),
        (this.callStack = t.getStack());
      try {
        this.onLoad();
      } catch (e) {
        console.warn(`Error in section: ${this.id}`),
          console.warn(this),
          console.warn(e);
      }
    }
    callFunctions(e, t = null) {
      this.callStack[e].forEach((e) => {
        const s = { id: this.id, type: this.type, container: this.container };
        t ? e.call(s, t) : e.call(s);
      });
    }
    onLoad() {
      this.callFunctions("onLoad");
    }
    onUnload() {
      this.callFunctions("onUnload");
    }
    onSelect(e) {
      this.callFunctions("onSelect", e);
    }
    onDeselect(e) {
      this.callFunctions("onDeselect", e);
    }
    onBlockSelect(e) {
      this.callFunctions("onBlockSelect", e);
    }
    onBlockDeselect(e) {
      this.callFunctions("onBlockDeselect", e);
    }
    onReorder(e) {
      this.callFunctions("onReorder", e);
    }
  }
  function validateContainerElement(e) {
    if (!(e instanceof Element))
      throw new TypeError(
        "Theme Sections: Attempted to load section. The section container provided is not a DOM element."
      );
    if (null === e.getAttribute(selectors$7.id))
      throw new Error(
        "Theme Sections: The section container provided does not have an id assigned to the " +
          selectors$7.id +
          " attribute."
      );
    return e;
  }
  function validateComponentsArray(e) {
    if ((void 0 !== e && "object" != typeof e) || null === e)
      throw new TypeError(
        "Theme Sections: The components object provided is not a valid"
      );
    return e;
  }
  function register(e, t) {
    if ("string" != typeof e)
      throw new TypeError(
        "Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered"
      );
    if (void 0 !== registered[e])
      throw new Error(
        'Theme Sections: A section of type "' +
          e +
          '" has already been registered. You cannot register the same section type twice'
      );
    Array.isArray(t) || (t = [t]);
    const s = new Registration(e, t);
    return (registered[e] = s), registered;
  }
  function load(e, t) {
    (e = normalizeType(e)),
      void 0 === t &&
        (t = document.querySelectorAll("[" + selectors$7.type + "]")),
      (t = normalizeContainers(t)),
      e.forEach(function (e) {
        const s = registered[e];
        void 0 !== s &&
          (t = t.filter(function (t) {
            return (
              !isInstance(t) &&
              null !== t.getAttribute(selectors$7.type) &&
              (t.getAttribute(selectors$7.type) !== e ||
                (instances.push(new Section(t, s)), !1))
            );
          }));
      });
  }
  function unload(e) {
    getInstances(e).forEach(function (e) {
      var t = instances
        .map(function (e) {
          return e.id;
        })
        .indexOf(e.id);
      instances.splice(t, 1), e.onUnload();
    });
  }
  function getInstances(e) {
    var t = [];
    if (NodeList.prototype.isPrototypeOf(e) || Array.isArray(e)) var s = e[0];
    if (e instanceof Element || s instanceof Element)
      normalizeContainers(e).forEach(function (e) {
        t = t.concat(
          instances.filter(function (t) {
            return t.container === e;
          })
        );
      });
    else if ("string" == typeof e || "string" == typeof s) {
      normalizeType(e).forEach(function (e) {
        t = t.concat(
          instances.filter(function (t) {
            return t.type === e;
          })
        );
      });
    }
    return t;
  }
  function getInstanceById(e) {
    for (var t, s = 0; s < instances.length; s++)
      if (instances[s].id === e) {
        t = instances[s];
        break;
      }
    return t;
  }
  function isInstance(e) {
    return getInstances(e).length > 0;
  }
  function normalizeType(e) {
    return (
      "*" === e
        ? (e = Object.keys(registered))
        : "string" == typeof e
        ? (e = [e])
        : e.constructor === Section
        ? (e = [e.prototype.type])
        : Array.isArray(e) &&
          e[0].constructor === Section &&
          (e = e.map(function (e) {
            return e.type;
          })),
      (e = e.map(function (e) {
        return e.toLowerCase();
      }))
    );
  }
  function normalizeContainers(e) {
    return (
      NodeList.prototype.isPrototypeOf(e) && e.length > 0
        ? (e = Array.prototype.slice.call(e))
        : (NodeList.prototype.isPrototypeOf(e) && 0 === e.length) || null === e
        ? (e = [])
        : !Array.isArray(e) && e instanceof Element && (e = [e]),
      e
    );
  }
  window.Shopify.designMode &&
    (document.addEventListener("shopify:section:load", function (e) {
      var t = e.detail.sectionId,
        s = e.target.querySelector("[" + selectors$7.id + '="' + t + '"]');
      null !== s && load(s.getAttribute(selectors$7.type), s);
    }),
    document.addEventListener("shopify:section:reorder", function (e) {
      var t = e.detail.sectionId,
        s = e.target.querySelector("[" + selectors$7.id + '="' + t + '"]');
      "object" == typeof getInstances(s)[0] && unload(s),
        null !== s && load(s.getAttribute(selectors$7.type), s);
    }),
    document.addEventListener("shopify:section:unload", function (e) {
      var t = e.detail.sectionId,
        s = e.target.querySelector("[" + selectors$7.id + '="' + t + '"]');
      "object" == typeof getInstances(s)[0] && unload(s);
    }),
    document.addEventListener("shopify:section:select", function (e) {
      var t = getInstanceById(e.detail.sectionId);
      "object" == typeof t && t.onSelect(e);
    }),
    document.addEventListener("shopify:section:deselect", function (e) {
      var t = getInstanceById(e.detail.sectionId);
      "object" == typeof t && t.onDeselect(e);
    }),
    document.addEventListener("shopify:block:select", function (e) {
      var t = getInstanceById(e.detail.sectionId);
      "object" == typeof t && t.onBlockSelect(e);
    }),
    document.addEventListener("shopify:block:deselect", function (e) {
      var t = getInstanceById(e.detail.sectionId);
      "object" == typeof t && t.onBlockDeselect(e);
    }));
  const selectors$8 = {
      slider: "[data-slider]",
      slide: "[data-slide]",
      slideValue: "data-slide",
      prevArrow: "[data-prev-arrow]",
      nextArrow: "[data-next-arrow]",
      slideshowSlideImg: ".slide-image-img",
      heroContent: ".hero__content",
      heroContentWrapper: ".hero__content__wrapper",
      dataSliderAnimate: "data-slider-animate",
      dataAspectRatio: "data-aspectratio",
      dataDots: "data-dots",
      dataAutoplay: "data-autoplay",
      dataAutoplaySpeed: "data-speed",
      dataColor: "data-color",
      dataInfinite: "data-infinite",
      dataSetHeight: "data-set-height",
      dataWatchCss: "data-watch-css",
      dataAdaptiveHeight: "data-adaptive-height",
      dataCellAlign: "data-cell-align",
      dataButtons: "data-buttons",
      dataDraggable: "data-draggable",
      dataPercentPosition: "data-percent-position",
      dataSlideIndex: "data-slide-index",
      dataSlidesLargeDesktop: "data-slides-large-desktop",
      dataSlidesDesktop: "data-slides-desktop",
      dataSlidesTabletDesktop: "data-slides-tablet",
      dataSlidesMobileDesktop: "data-slides-mobile",
      dataSliderStartIndex: "data-slider-start-index",
      dataGroupCells: "data-group-cells",
    },
    classes$3 = {
      classIsSelected: "is-selected",
      textDark: "text-dark",
      textLight: "text-light",
      transparentWrapper: "transparent__wrapper",
      heroContentTransparent: "hero__content--transparent",
      classSliderInitialized: "js-slider--initialized",
      classSliderArrowsHidden: "flickity-button-hide",
      classAosAnimate: "aos-animate",
      classAosAnimated: "aos-animated",
    },
    sections$2 = {};
  class Slider {
    constructor(e) {
      (this.container = e),
        (this.slideshow = this.container.querySelector(selectors$8.slider)),
        this.slideshow &&
          ((this.slideshowSlides = this.slideshow.querySelectorAll(
            selectors$8.slide
          )),
          (this.sliderPrev = this.container.querySelector(
            selectors$8.prevArrow
          )),
          (this.sliderNext = this.container.querySelector(
            selectors$8.nextArrow
          )),
          (this.currentSlideColor = this.slideshowSlides[0].getAttribute(
            selectors$8.dataColor
          )),
          (this.showDots =
            "true" === this.slideshow.getAttribute(selectors$8.dataDots)),
          (this.autoPlay =
            "true" === this.slideshow.getAttribute(selectors$8.dataAutoplay)),
          (this.autoPlaySpeed = this.slideshow.getAttribute(
            selectors$8.dataAutoplaySpeed
          )),
          (this.infinite =
            "false" !== this.slideshow.getAttribute(selectors$8.dataInfinite)),
          (this.setMinHeightFlag =
            "true" === this.slideshow.getAttribute(selectors$8.dataSetHeight)),
          (this.watchCss =
            "true" === this.slideshow.getAttribute(selectors$8.dataWatchCss)),
          (this.adaptiveHeight =
            "false" !==
            this.slideshow.getAttribute(selectors$8.dataAdaptiveHeight)),
          (this.buttons =
            "false" !== this.slideshow.getAttribute(selectors$8.dataButtons)),
          (this.cellAlignLeft =
            "left" === this.slideshow.getAttribute(selectors$8.dataCellAlign)),
          (this.cellAlignRight =
            "right" === this.slideshow.getAttribute(selectors$8.dataCellAlign)),
          (this.draggable =
            "false" !== this.slideshow.getAttribute(selectors$8.dataDraggable)),
          (this.percentPosition =
            "false" !==
            this.slideshow.getAttribute(selectors$8.dataPercentPosition)),
          (this.multipleSlides = this.slideshow.hasAttribute(
            selectors$8.dataSlidesLargeDesktop
          )),
          (this.sliderStartIndex = this.slideshow.hasAttribute(
            selectors$8.dataSliderStartIndex
          )),
          (this.groupCells =
            "true" === this.slideshow.getAttribute(selectors$8.dataGroupCells)),
          (this.sliderAnimate =
            "true" ===
            this.slideshow.getAttribute(selectors$8.dataSliderAnimate)),
          (this.resizeEvent = debounce(() => this.resizeEvents(), 100)),
          (this.flkty = null),
          this.init());
    }
    init() {
      this.setMinHeight(),
        (this.flkty = new Flickity(this.slideshow, {
          initialIndex: this.sliderStartIndex
            ? parseInt(
                this.slideshow.getAttribute(selectors$8.dataSliderStartIndex)
              )
            : 0,
          autoPlay:
            !(!this.autoPlay || !this.autoPlaySpeed) &&
            parseInt(this.autoPlaySpeed),
          prevNextButtons: this.buttons,
          contain: !0,
          pageDots: this.showDots,
          adaptiveHeight: this.adaptiveHeight,
          wrapAround: this.infinite,
          percentPosition: this.percentPosition,
          watchCSS: this.watchCss,
          cellAlign: this.cellAlignLeft
            ? "left"
            : this.cellAlignRight
            ? "right"
            : "center",
          groupCells: this.groupCells,
          draggable: !!this.draggable && ">1",
          on: {
            ready: () => {
              if (this.sliderAnimate && !this.autoPlay) {
                this.slideshow
                  .querySelector(`.${classes$3.classIsSelected}`)
                  .classList.add(classes$3.classAosAnimated);
              }
              this.slideActions(),
                this.slideshow.classList.contains(classes$3.classIsSelected) &&
                  this.slideshow.classList.remove(classes$3.classIsSelected),
                this.showArrows();
            },
          },
        })),
        this.sliderPrev &&
          this.sliderPrev.addEventListener("click", (e) => {
            e.preventDefault(), this.flkty.previous(!0);
          }),
        this.sliderNext &&
          this.sliderNext.addEventListener("click", (e) => {
            e.preventDefault(), this.flkty.next(!0);
          }),
        this.flkty.on("change", () => this.slideActions()),
        this.sliderAnimate &&
          this.flkty.on("settle", () => this.sliderSettle()),
        (this.setMinHeightFlag || this.multipleSlides) &&
          window.addEventListener("resize", this.resizeEvent);
    }
    sliderSettle() {
      const e = this.slideshow.querySelectorAll(
        `.${classes$3.classIsSelected}:not(.${classes$3.classAosAnimated}) .${classes$3.classAosAnimated}`
      );
      e.length &&
        e.forEach((e) => {
          e.classList.add(classes$3.classAosAnimate),
            e
              .closest(`.${classes$3.classIsSelected}`)
              .classList.add(classes$3.classAosAnimated);
        });
    }
    resizeEvents() {
      this.setMinHeight(),
        this.multipleSlides &&
          (this.showArrows(),
          this.flkty.resize(),
          this.slideshow.classList.contains(classes$3.classSliderInitialized) ||
            this.flkty.select(0));
    }
    slideActions() {
      const e = this.slideshow.querySelector(`.${classes$3.classIsSelected}`);
      (this.currentSlideColor = e.getAttribute(selectors$8.dataColor)),
        this.currentSlideColor &&
          (this.slideshow.classList.remove(
            classes$3.textLight,
            classes$3.textDark
          ),
          this.slideshow.classList.add(this.currentSlideColor)),
        this.container.classList.remove(classes$3.transparentWrapper);
      const t = e.querySelector(selectors$8.heroContentWrapper);
      if (
        (t &&
          t.classList.contains(classes$3.heroContentTransparent) &&
          this.container.classList.add(classes$3.transparentWrapper),
        this.setMinHeight(),
        this.sliderAnimate)
      ) {
        const e = this.slideshow.querySelectorAll(
          `.${classes$3.classIsSelected}:not(.${classes$3.classAosAnimated}) .${classes$3.classAosAnimate}`
        );
        e.length &&
          e.forEach((e) => {
            e.classList.remove(classes$3.classAosAnimate),
              e.classList.add(classes$3.classAosAnimated);
          });
      }
    }
    setMinHeight() {
      this.setMinHeightFlag &&
        this.slideshowSlides.forEach((e) => {
          const t = e.querySelector(selectors$8.slideshowSlideImg);
          let s = "";
          t &&
            t.hasAttribute(selectors$8.dataAspectRatio) &&
            (s = t.getAttribute(selectors$8.dataAspectRatio));
          let i = 0,
            o = 0;
          const r = e.querySelector(selectors$8.heroContent);
          if (r) {
            (o =
              parseInt(window.getComputedStyle(r).marginTop) +
              parseInt(window.getComputedStyle(r).marginBottom)),
              (i = r.offsetHeight + o);
          }
          const n = parseInt(getComputedStyle(e, null).width.replace("px", ""));
          let a = parseInt(n / s) || 0;
          const l = e.classList.contains(classes$3.classIsSelected);
          i > a && (a = i);
          const c = `calc(${a}px + var(--header-padding)`;
          e.style.setProperty("min-height", c);
          const d = e.querySelector(selectors$8.heroContentWrapper);
          d && d.style.setProperty("min-height", c),
            l &&
              this.slideshow.parentElement.style.setProperty("min-height", c);
        });
    }
    showArrows() {
      if (!this.multipleSlides) return;
      const e = parseInt(
          this.slideshow.getAttribute(selectors$8.dataSlidesLargeDesktop)
        ),
        t =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth,
        s = this.slideshow.hasAttribute(selectors$8.dataSlidesDesktop)
          ? parseInt(this.slideshow.getAttribute(selectors$8.dataSlidesDesktop))
          : 3,
        i = this.slideshow.hasAttribute(selectors$8.dataSlidesTabletDesktop)
          ? parseInt(
              this.slideshow.getAttribute(selectors$8.dataSlidesTabletDesktop)
            )
          : 2,
        o = this.slideshow.hasAttribute(selectors$8.dataSlidesMobileDesktop)
          ? parseInt(
              this.slideshow.getAttribute(selectors$8.dataSlidesMobileDesktop)
            )
          : 1,
        r = t > 1339 && this.slideshowSlides.length > e,
        n = t <= 1339 && t > 1023 && this.slideshowSlides.length > s,
        a = t <= 1023 && t > 750 && this.slideshowSlides.length > i,
        l = t <= 750 && this.slideshowSlides.length > o,
        c = Boolean(r || n || a || l);
      this.slideshow.classList.toggle(classes$3.classSliderArrowsHidden, !c),
        this.slideshow.classList.toggle(classes$3.classSliderInitialized, c);
    }
    onUnload() {
      (this.setMinHeightFlag || this.multipleSlides) &&
        window.removeEventListener("resize", this.resizeEvent),
        this.slideshow && this.flkty.destroy();
    }
    onBlockSelect(e) {
      if (!this.slideshow) return;
      const t = this.slideshow.querySelector(
        `[${selectors$8.slideValue}="${e.detail.blockId}"]`
      );
      if (!t) return;
      let s = parseInt(t.getAttribute(selectors$8.dataSlideIndex));
      this.multipleSlides &&
        !this.slideshow.classList.contains(classes$3.classSliderInitialized) &&
        (s = 0),
        this.slideshow.classList.add(classes$3.classIsSelected),
        this.flkty.select(s),
        this.flkty.stopPlayer();
    }
    onBlockDeselect() {
      this.slideshow &&
        (this.slideshow.classList.remove(classes$3.classIsSelected),
        this.autoPlay && this.flkty.playPlayer());
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
    },
    selectors$9 = { copyClipboard: "[data-copy-clipboard]" },
    sections$3 = {};
  class CopyClipboard {
    constructor(e) {
      (this.container = e.container),
        (this.copyButton = this.container.querySelector(
          selectors$9.copyClipboard
        )),
        this.copyButton && this.init();
    }
    init() {
      this.copyButton.addEventListener("click", function (e) {
        e.preventDefault();
        const t = this.getAttribute("href");
        let s = document.createElement("input");
        (s.type = "text"), this.appendChild(s);
        const i = this.querySelector("input");
        (i.value = t),
          i.select(),
          i.setSelectionRange(0, 99999),
          document.execCommand("copy"),
          this.removeChild(i);
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
        this.container
          .querySelectorAll("[data-parallax-wrapper]")
          .forEach((e) => {
            const t = e.querySelector("[data-parallax-img]");
            sections$4[this.id].push(
              new Rellax(t, { center: !0, round: !0, frame: e })
            );
          }),
          window.addEventListener("load", () => {
            sections$4[this.id].forEach((e) => {
              "function" == typeof e.refresh && e.refresh();
            });
          });
      },
      onUnload: function () {
        sections$4[this.id].forEach((e) => {
          "function" == typeof e.destroy && e.destroy();
        });
      },
    },
    selectors$a = {
      sidebar: ".sidebar",
      widgetCategories: ".widget--categories",
      widgetLinksEl: ".widget__links",
      widgetLinks: ".widget__links .has-sub-nav > a",
      widgetLinksSub: ".widget__links .submenu > li > a",
      listEl: "li",
      linkEl: "a",
      articleSingle: ".article--single",
      sidebarContents: ".sidebar__contents",
      hasSubNav: ".has-sub-nav",
    },
    classes$4 = {
      classOpen: "open",
      classActive: "active",
      classSubmenu: "submenu",
    },
    sections$5 = {};
  class Article {
    constructor(e) {
      (this.container = e.container),
        (this.sidebar = this.container.querySelector(selectors$a.sidebar)),
        (this.widgetCategories = this.container.querySelector(
          selectors$a.widgetCategories
        )),
        (this.resizeEvent = () => this.categories()),
        (this.flkty = null),
        this.init();
    }
    init() {
      this.sidebar && this.sidebarNav();
    }
    sidebarNav() {
      this.navStates(),
        this.container.addEventListener("click", function (e) {
          const t = e.target.tagName.toLowerCase() === selectors$a.linkEl,
            s = e.target.closest(
              `${selectors$a.listEl}${selectors$a.hasSubNav}`
            ),
            i = e.target.closest(selectors$a.widgetLinksEl),
            o = t && s && i,
            r = e.target.nextElementSibling;
          !(
            (window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth) < 750
          ) &&
            o &&
            r &&
            (r.parentElement.classList.toggle(classes$4.classActive),
            r.classList.toggle(classes$4.classOpen),
            r.setAttribute(
              "aria-expanded",
              r.classList.contains(classes$4.classOpen)
            ),
            slideToggle(r),
            e.preventDefault());
        }),
        this.widgetCategories &&
          (this.categories(),
          document.addEventListener("theme:resize", this.resizeEvent));
    }
    navStates() {
      const e = this.container.querySelectorAll(
        `${selectors$a.widgetLinks}, ${selectors$a.widgetLinksSub}`
      );
      e.length &&
        e.forEach((e) => {
          if (e.getAttribute("href") === window.location.pathname) {
            const t = e.closest(selectors$a.hasSubNav);
            if ((e.closest("li").classList.add(classes$4.classActive), !t))
              return;
            t.classList.add(classes$4.classActive);
            const s = t.querySelector(`.${classes$4.classSubmenu}`);
            s &&
              (s.classList.toggle(classes$4.classOpen),
              s.setAttribute(
                "aria-expanded",
                s.classList.contains(classes$4.classOpen)
              ),
              showElement(s));
          }
        });
    }
    categories() {
      const e =
          (window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth) < 750,
        t = document.querySelector(selectors$a.widgetCategories);
      e
        ? document.querySelector(selectors$a.articleSingle).prepend(t)
        : document.querySelector(selectors$a.sidebarContents).prepend(t);
    }
    onUnload() {
      this.widgetCategories &&
        document.removeEventListener("theme:resize", this.resizeEvent);
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
  register("article", [articleSection, slider, copyClipboard, parallaxHero]);
  const selectors$b = { slider: "[data-slider]" },
    sections$6 = {};
  class Blog {
    constructor(e) {
      (this.container = e.container),
        (this.slideshows = this.container.querySelectorAll(selectors$b.slider)),
        this.slideshows.length > 1 && this.init();
    }
    init() {
      const [, ...e] = this.slideshows;
      e.forEach((e) => {
        e.parentElement && new Slider(e.parentElement);
      });
    }
  }
  const blogSection = {
    onLoad() {
      sections$6[this.id] = new Blog(this);
    },
  };
  register("blog-template", [blogSection, slider]),
    register("hero", parallaxHero);
  const selectors$c = {
      popoutWrapper: "[data-popout]",
      popoutList: "[data-popout-list]",
      popoutToggle: "[data-popout-toggle]",
      popoutInput: "[data-popout-input]",
      popoutOptions: "[data-popout-option]",
      popoutPrevent: "data-popout-prevent",
      popoutQuantity: "data-quantity-field",
      dataValue: "data-value",
      ariaExpanded: "aria-expanded",
      ariaCurrent: "aria-current",
      productGridImage: "[data-product-image]",
      productGrid: "[data-product-grid-item]",
    },
    classes$5 = {
      listVisible: "popout-list--visible",
      currentSuffix: "--current",
      classPopoutAlternative: "popout-container--alt",
      visible: "is-visible",
    };
  let sections$7 = {};
  class Popout {
    constructor(e) {
      (this.container = e),
        (this.popoutList = this.container.querySelector(
          selectors$c.popoutList
        )),
        (this.popoutToggle = this.container.querySelector(
          selectors$c.popoutToggle
        )),
        (this.popoutInput = this.container.querySelector(
          selectors$c.popoutInput
        )),
        (this.popoutOptions = this.container.querySelectorAll(
          selectors$c.popoutOptions
        )),
        (this.popoutPrevent =
          "true" === this.container.getAttribute(selectors$c.popoutPrevent)),
        (this.popupToggleFocusoutEvent = (e) => this.popupToggleFocusout(e)),
        (this.popupListFocusoutEvent = (e) => this.popupListFocusout(e)),
        (this.popupToggleClickEvent = (e) => this.popupToggleClick(e)),
        (this.containerKeyupEvent = (e) => this.containerKeyup(e)),
        (this.popupOptionsClickEvent = (e) => this.popupOptionsClick(e)),
        (this._connectOptionsDispatchEvent = (e) =>
          this._connectOptionsDispatch(e)),
        this._connectOptions(),
        this._connectToggle(),
        this._onFocusOut(),
        this.popoutInput &&
          this.popoutInput.hasAttribute(selectors$c.popoutQuantity) &&
          document.addEventListener(
            "popout:updateValue",
            this.updatePopout.bind(this)
          );
    }
    unload() {
      this.popoutOptions.length &&
        this.popoutOptions.forEach((e) => {
          e.removeEventListener("clickDetails", this.popupOptionsClickEvent),
            e.removeEventListener("click", this._connectOptionsDispatchEvent);
        }),
        this.popoutToggle.removeEventListener(
          "click",
          this.popupToggleClickEvent
        ),
        this.popoutToggle.removeEventListener(
          "focusout",
          this.popupToggleFocusoutEvent
        ),
        this.popoutList.removeEventListener(
          "focusout",
          this.popupListFocusoutEvent
        ),
        this.container.removeEventListener("keyup", this.containerKeyupEvent);
    }
    popupToggleClick(e) {
      const t =
        "true" === e.currentTarget.getAttribute(selectors$c.ariaExpanded);
      if (this.popoutList.closest(selectors$c.productGrid)) {
        const e = this.popoutList
          .closest(selectors$c.productGrid)
          .querySelector(selectors$c.productGridImage);
        e && e.classList.toggle(classes$5.visible, !t);
      }
      e.currentTarget.setAttribute(selectors$c.ariaExpanded, !t),
        this.popoutList.classList.toggle(classes$5.listVisible);
    }
    popupToggleFocusout(e) {
      this.container.contains(e.relatedTarget) || this._hideList();
    }
    popupListFocusout(e) {
      const t = e.currentTarget.contains(e.relatedTarget);
      this.popoutList.classList.contains(classes$5.listVisible) &&
        !t &&
        this._hideList();
    }
    popupOptionsClick(e) {
      if (
        "#" ===
        e.target.closest(selectors$c.popoutOptions).attributes.href.value
      ) {
        e.preventDefault();
        let t = "";
        if (
          (e.currentTarget.getAttribute(selectors$c.dataValue) &&
            (t = e.currentTarget.getAttribute(selectors$c.dataValue)),
          (this.popoutInput.value = t),
          this.popoutPrevent)
        ) {
          this.popoutInput.dispatchEvent(new Event("change")),
            !e.detail.preventTrigger &&
              this.popoutInput.hasAttribute(selectors$c.popoutQuantity) &&
              this.popoutInput.dispatchEvent(new Event("input"));
          const s = this.popoutList.querySelector(
            `[class*="${classes$5.currentSuffix}"]`
          );
          let i = classes$5.currentSuffix;
          if (s && s.classList.length)
            for (const e of s.classList)
              if (e.includes(classes$5.currentSuffix)) {
                i = e;
                break;
              }
          const o = this.popoutList.querySelector(`.${i}`);
          o &&
            (o.classList.remove(`${i}`),
            e.currentTarget.parentElement.classList.add(`${i}`));
          const r = this.popoutList.querySelector(
            `[${selectors$c.ariaCurrent}]`
          );
          r &&
            r.hasAttribute(`${selectors$c.ariaCurrent}`) &&
            (r.removeAttribute(`${selectors$c.ariaCurrent}`),
            e.currentTarget.setAttribute(`${selectors$c.ariaCurrent}`, "true")),
            "" !== t && (this.popoutToggle.textContent = t),
            this.popupToggleFocusout(e),
            this.popupListFocusout(e);
        } else this._submitForm(t);
      }
    }
    updatePopout() {
      const e = this.popoutList.querySelector(
        `[${selectors$c.dataValue}="${this.popoutInput.value}"]`
      );
      e
        ? (e.dispatchEvent(
            new CustomEvent("clickDetails", {
              cancelable: !0,
              bubbles: !0,
              detail: { preventTrigger: !0 },
            })
          ),
          e.parentElement.nextSibling ||
            this.container.classList.add(classes$5.classPopoutAlternative))
        : this.container.classList.add(classes$5.classPopoutAlternative);
    }
    containerKeyup(e) {
      e.which === window.theme.keyboardKeys.ESCAPE &&
        (this._hideList(), this.popoutToggle.focus());
    }
    bodyClick(e) {
      const t = this.container.contains(e.target);
      this.popoutList.classList.contains(classes$5.listVisible) &&
        !t &&
        this._hideList();
    }
    _connectToggle() {
      this.popoutToggle.addEventListener("click", this.popupToggleClickEvent);
    }
    _connectOptions() {
      this.popoutOptions.length &&
        this.popoutOptions.forEach((e) => {
          e.addEventListener("clickDetails", this.popupOptionsClickEvent),
            e.addEventListener("click", this._connectOptionsDispatchEvent);
        });
    }
    _connectOptionsDispatch(e) {
      const t = new CustomEvent("clickDetails", {
        cancelable: !0,
        bubbles: !0,
        detail: { preventTrigger: !1 },
      });
      e.target.dispatchEvent(t) || e.preventDefault();
    }
    _onFocusOut() {
      this.popoutToggle.addEventListener(
        "focusout",
        this.popupToggleFocusoutEvent
      ),
        this.popoutList.addEventListener(
          "focusout",
          this.popupListFocusoutEvent
        ),
        this.container.addEventListener("keyup", this.containerKeyupEvent),
        document.body.addEventListener("click", this.bodyClick.bind(this));
    }
    _submitForm() {
      const e = this.container.closest("form");
      e && e.submit();
    }
    _hideList() {
      this.popoutList.classList.remove(classes$5.listVisible),
        this.popoutToggle.setAttribute(selectors$c.ariaExpanded, !1);
    }
  }
  const popoutSection = {
      onLoad() {
        sections$7[this.id] = [];
        this.container
          .querySelectorAll(selectors$c.popoutWrapper)
          .forEach((e) => {
            sections$7[this.id].push(new Popout(e));
          });
      },
      onUnload() {
        sections$7[this.id].forEach((e) => {
          "function" == typeof e.unload && e.unload();
        });
      },
    },
    footerSection = {
      onLoad() {
        var e = document.querySelector("[data-powered-link] a");
        e && e.relList.add("noopener");
      },
    };
  register("footer", [popoutSection, footerSection, parallaxHero]);
  const selectors$d = { reviews: "data-reviews" };
  class ProductGridReviews {
    constructor(e) {
      (this.container = e.container),
        (this.showReviews =
          "false" !== this.container.getAttribute(selectors$d.reviews)),
        (this.reviewsAppInstalled = "function" == typeof window.SPR),
        this.init();
    }
    init() {
      this.showReviews && "undefined" != typeof yotpo
        ? yotpo.initialized
          ? yotpo.refreshWidgets()
          : yotpo.initWidgets()
        : this.showReviews &&
          this.reviewsAppInstalled &&
          (window.SPR.initDomEls(), window.SPR.loadBadges());
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
  function getVariantFromSerializedArray(e, t) {
    return (
      _validateProductStructure(e),
      getVariantFromOptionArray(e, _createOptionArrayFromOptionCollection(e, t))
    );
  }
  function getVariantFromOptionArray(e, t) {
    return (
      _validateProductStructure(e),
      _validateOptionsArray(t),
      e.variants.filter(function (e) {
        return t.every(function (t, s) {
          return e.options[s] === t;
        });
      })[0] || null
    );
  }
  function _createOptionArrayFromOptionCollection(e, t) {
    _validateProductStructure(e), _validateSerializedArray(t);
    var s = [];
    return (
      t.forEach(function (t) {
        for (var i = 0; i < e.options.length; i++) {
          if (
            (e.options[i].name || e.options[i]).toLowerCase() ===
            t.name.toLowerCase()
          ) {
            s[i] = t.value;
            break;
          }
        }
      }),
      s
    );
  }
  function _validateProductStructure(e) {
    if ("object" != typeof e) throw new TypeError(e + " is not an object.");
    if (0 === Object.keys(e).length && e.constructor === Object)
      throw new Error(e + " is empty.");
  }
  function _validateSerializedArray(e) {
    if (!Array.isArray(e)) throw new TypeError(e + " is not an array.");
    if (0 === e.length) throw new Error(e + " is empty.");
    if (!e[0].hasOwnProperty("name"))
      throw new Error(e[0] + "does not contain name key.");
    if ("string" != typeof e[0].name)
      throw new TypeError(
        "Invalid value type passed for name of option " +
          e[0].name +
          ". Value should be string."
      );
  }
  function _validateOptionsArray(e) {
    if (Array.isArray(e) && "object" == typeof e[0])
      throw new Error(e + "is not a valid array of options.");
  }
  (Listeners.prototype.add = function (e, t, s) {
    this.entries.push({ element: e, event: t, fn: s }),
      e.addEventListener(t, s);
  }),
    (Listeners.prototype.removeAll = function () {
      this.entries = this.entries.filter(function (e) {
        return e.element.removeEventListener(e.event, e.fn), !1;
      });
    });
  var selectors$e = {
    idInput: '[name="id"]',
    planInput: '[name="selling_plan"]',
    optionInput: '[name^="options"]',
    quantityInput: '[name="quantity"]',
    propertyInput: '[name^="properties"]',
  };
  function getUrlWithVariant(e, t) {
    return /variant=/.test(e)
      ? e.replace(/(variant=)[^&]+/, "$1" + t)
      : /\?/.test(e)
      ? e.concat("&variant=").concat(t)
      : e.concat("?variant=").concat(t);
  }
  class ProductForm {
    constructor(e, t, s) {
      (this.element = e),
        (this.form =
          "FORM" == this.element.tagName
            ? this.element
            : this.element.querySelector("form")),
        (this.product = this._validateProductObject(t)),
        (this.variantElement = this.element.querySelector(selectors$e.idInput)),
        (s = s || {}),
        (this._listeners = new Listeners()),
        this._listeners.add(
          this.element,
          "submit",
          this._onSubmit.bind(this, s)
        ),
        (this.optionInputs = this._initInputs(
          selectors$e.optionInput,
          s.onOptionChange
        )),
        (this.planInputs = this._initInputs(
          selectors$e.planInput,
          s.onPlanChange
        )),
        (this.quantityInputs = this._initInputs(
          selectors$e.quantityInput,
          s.onQuantityChange
        )),
        (this.propertyInputs = this._initInputs(
          selectors$e.propertyInput,
          s.onPropertyChange
        ));
    }
    destroy() {
      this._listeners.removeAll();
    }
    options() {
      return this._serializeInputValues(this.optionInputs, function (e) {
        return (e.name = /(?:^(options\[))(.*?)(?:\])/.exec(e.name)[2]), e;
      });
    }
    variant() {
      const e = this.options();
      return e.length
        ? getVariantFromSerializedArray(this.product, e)
        : this.product.variants[0];
    }
    plan(e) {
      let t = { allocation: null, group: null, detail: null };
      const s = new FormData(this.form).get("selling_plan");
      return (
        s &&
          e &&
          (t.allocation = e.selling_plan_allocations.find(function (e) {
            return e.selling_plan_id.toString() === s.toString();
          })),
        t.allocation &&
          (t.group = this.product.selling_plan_groups.find(function (e) {
            return (
              e.id.toString() === t.allocation.selling_plan_group_id.toString()
            );
          })),
        t.group &&
          (t.detail = t.group.selling_plans.find(function (e) {
            return e.id.toString() === s.toString();
          })),
        t && t.allocation && t.detail && t.allocation ? t : null
      );
    }
    properties() {
      return this._serializeInputValues(this.propertyInputs, function (e) {
        return (e.name = /(?:^(properties\[))(.*?)(?:\])/.exec(e.name)[2]), e;
      });
    }
    quantity() {
      return this.quantityInputs[0]
        ? Number.parseInt(this.quantityInputs[0].value, 10)
        : 1;
    }
    getFormState() {
      const e = this.variant();
      return {
        options: this.options(),
        variant: e,
        properties: this.properties(),
        quantity: this.quantity(),
        plan: this.plan(e),
      };
    }
    _setIdInputValue(e) {
      e && e.id
        ? (this.variantElement.value = e.id.toString())
        : (this.variantElement.value = ""),
        this.variantElement.dispatchEvent(new Event("change"));
    }
    _onSubmit(e, t) {
      (t.dataset = this.getFormState()), e.onFormSubmit && e.onFormSubmit(t);
    }
    _onOptionChange(e) {
      this._setIdInputValue(e.dataset.variant);
    }
    _onFormEvent(e) {
      return void 0 === e
        ? Function.prototype.bind()
        : function (t) {
            (t.dataset = this.getFormState()),
              this._setIdInputValue(t.dataset.variant),
              e(t);
          }.bind(this);
    }
    _initInputs(e, t) {
      return Array.prototype.slice.call(this.element.querySelectorAll(e)).map(
        function (e) {
          return this._listeners.add(e, "change", this._onFormEvent(t)), e;
        }.bind(this)
      );
    }
    _serializeInputValues(e, t) {
      return e.reduce(function (e, s) {
        return (
          (s.checked || ("radio" !== s.type && "checkbox" !== s.type)) &&
            e.push(t({ name: s.name, value: s.value })),
          e
        );
      }, []);
    }
    _validateProductObject(e) {
      if ("object" != typeof e) throw new TypeError(e + " is not an object.");
      if (void 0 === e.variants[0].options)
        throw new TypeError(
          "Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route"
        );
      return e;
    }
  }
  function fetchProduct(e) {
    let t = window.theme.routes.root_url || "";
    "/" !== t[t.length - 1] && (t = `${t}/`);
    const s = `${t}products/${e}.js`;
    return window
      .fetch(s)
      .then((e) => e.json())
      .catch((e) => {
        console.error(e);
      });
  }
  function t(e) {
    var t = e.getBoundingClientRect(),
      s = t.left,
      i = t.right,
      o = t.top,
      r = t.bottom,
      n = window.pageYOffset;
    return {
      height: r - o,
      width: i - s,
      top: { y: n + o, x: s + (i - s) / 2 },
      bottom: { y: n + r, x: s + (i - s) / 2 },
      left: { y: o + (r - o) / 2, x: s },
      right: { y: o + (r - o) / 2, x: i },
      topLeft: { y: n + o, x: s },
      bottomLeft: { y: n + r, x: s },
      topRight: { y: n + o, x: i },
      bottomRight: { y: n + r, x: i },
    };
  }
  function e(e, s, i) {
    var o = t(s)[i],
      r = t(e),
      n = window.pageYOffset,
      a = {
        top: n,
        bottom: n + window.innerHeight,
        left: 0,
        right: window.innerWidth,
      },
      l = {
        top: { x: r.width / 2, y: r.height },
        bottom: { x: r.width / 2, y: 0 },
        left: { x: r.width, y: r.height / 2 },
        right: { x: 0, y: r.height / 2 },
        topLeft: { x: r.width, y: r.height },
        topRight: { x: 0, y: r.height },
        bottomLeft: { x: r.width, y: 0 },
        bottomRight: { x: 0, y: 0 },
      },
      c = o.x - l[i].x,
      d = o.y - l[i].y;
    c < a.left
      ? (c = a.left)
      : c + r.width > a.right && (c = a.right - r.width),
      d < a.top
        ? (d = a.top)
        : d + r.height > a.bottom && (d = a.bottom - r.height),
      (e.style.transform =
        "translateX(" +
        Math.round(c) +
        "px) translateY(" +
        Math.round(d) +
        "px)");
  }
  function i(e) {
    e.length > 0 && e.shift().apply(this, e);
  }
  function n(e, t) {
    e(), i(t);
  }
  function o(e, t) {
    return function () {
      var s = [].slice.call(arguments),
        i = s[0];
      if ("number" == typeof i) return o(e, i);
      "number" == typeof t
        ? setTimeout(function () {
            n(e, s);
          }, t)
        : n(e, s);
    };
  }
  function s() {
    var e = [].slice.call(arguments);
    return o(function () {
      i(e.slice(0));
    });
  }
  var r = function (e) {
    var t = e.popover;
    void 0 === t && (t = null);
    var s = e.position;
    void 0 === s && (s = "bottom");
    var i = e.transitionSpeed;
    void 0 === i && (i = 0);
    var o = e.onChange;
    void 0 === o && (o = null),
      (this.target = e.target),
      (this.popover = this.createPopover(t)),
      (this.position = s),
      (this.transitionSpeed = i),
      (this.onChange = o),
      (this.state = { pinned: !1, busy: !1, requestClose: !1 }),
      (this.pin = this.pin.bind(this)),
      (this.unpin = this.unpin.bind(this)),
      (this.block = this.block.bind(this)),
      (this.unblock = this.unblock.bind(this)),
      (this.isExternalClick = this.isExternalClick.bind(this)),
      (this.handleKeyup = this.handleKeyup.bind(this)),
      (this.focusNode = null);
  };
  (r.prototype.setState = function (e, t) {
    (this.state = Object.assign(this.state, e)), t && o(t, 0)();
  }),
    (r.prototype.block = function () {
      this.setState({ busy: !0 });
    }),
    (r.prototype.unblock = function () {
      var e = this;
      this.setState({ busy: !1 }, function () {
        e.state.requestClose && e.unpin();
      });
    }),
    (r.prototype.toggle = function () {
      this.state.pinned ? this.unpin() : this.pin();
    }),
    (r.prototype.pin = function () {
      var t = this;
      if (!this.state.busy && !this.state.pinned) {
        this.setState({ busy: !0 }), (this.focusNode = document.activeElement);
        var i = o(function () {
            return document.body.appendChild(t.popover);
          }),
          r = o(function () {
            return (
              (i = t.target),
              (o = t.position),
              (s = t.popover).classList.add("is-tacked"),
              e(s, i, o),
              {
                update: function () {
                  e(s, i, o);
                },
                destroy: function () {
                  (s.style.transform = ""), s.classList.remove("is-tacked");
                },
              }
            );
            var s, i, o;
          }),
          n = o(function () {
            t.popover.classList.add("is-visible"),
              t.popover.setAttribute("tabindex", "0"),
              t.popover.setAttribute("aria-hidden", "false");
          }),
          a = o(function () {
            return t.popover.focus();
          }),
          l = o(function () {
            return t.setState({ busy: !1, pinned: !0 });
          });
        s(i, r, n(0), a(0), l)(),
          this.popover.addEventListener("mouseenter", this.block),
          this.popover.addEventListener("mouseleave", this.unblock),
          window.addEventListener("click", this.isExternalClick),
          window.addEventListener("touchstart", this.isExternalClick),
          window.addEventListener("keyup", this.handleKeyup),
          window.addEventListener("resize", this.unpin),
          this.onChange && this.onChange({ pinned: !0 });
      }
    }),
    (r.prototype.unpin = function (e) {
      var t = this;
      this.setState({ requestClose: !0 }),
        (e || (!this.state.busy && this.state.pinned)) &&
          o(function () {
            t.setState({ busy: !0 }),
              t.popover.removeEventListener("mouseenter", t.block),
              t.popover.removeEventListener("mouseleave", t.unblock),
              window.removeEventListener("click", t.isExternalClick),
              window.removeEventListener("touchstart", t.isExternalClick),
              window.removeEventListener("keyup", t.handleKeyup),
              window.removeEventListener("resize", t.unpin);
            var e = o(function () {
                return t.popover.classList.add("is-hiding");
              }),
              i = o(function () {
                return document.body.removeChild(t.popover);
              }),
              r = o(function () {
                return t.focusNode.focus();
              }),
              n = o(function () {
                t.popover.classList.remove("is-hiding"),
                  t.popover.classList.remove("is-visible"),
                  t.setState({ busy: !1, pinned: !1, requestClose: !1 });
              });
            s(e, i(t.transitionSpeed), r, n)(),
              t.onChange && t.onChange({ pinned: !1 });
          }, 0)();
    }),
    (r.prototype.handleKeyup = function (e) {
      27 === e.keyCode && this.unpin();
    }),
    (r.prototype.isExternalClick = function (e) {
      e.target === this.popover ||
        this.popover.contains(e.target) ||
        e.target === this.target ||
        this.target.contains(e.target) ||
        this.unpin();
    }),
    (r.prototype.createPopover = function (e) {
      var t = document.createElement("div");
      return (
        (t.className = "poppy"),
        (t.role = "dialog"),
        t.setAttribute("aria-label", "Share Dialog"),
        t.setAttribute("aria-hidden", "true"),
        "string" == typeof e ? (t.innerHTML = e) : t.appendChild(e),
        t
      );
    });
  const selectors$f = { tooltip: "data-tooltip" },
    classes$6 = { tooltipDefault: "poppy__tooltip" };
  let sections$8 = {};
  class Tooltip {
    constructor(e, t = {}) {
      (this.tooltip = e),
        this.tooltip.hasAttribute(selectors$f.tooltip) &&
          ((this.label = this.tooltip.getAttribute(selectors$f.tooltip)),
          (this.pop = null),
          (this.class = t.class || classes$6.tooltipDefault),
          (this.transitionSpeed = t.transitionSpeed || 200),
          (this.tooltipPosition = t.position || "bottom"),
          (this.mouseEnterEvent = null),
          (this.removePinEvent = () => this.removePin()),
          this.init());
    }
    init() {
      (this.pop = new r({
        target: this.tooltip,
        popover: `\n      <div class="${this.class}__wrapper">\n      <div class="${this.class}">\n      ${this.label}\n      </div>\n      </div>\n      `,
        position: this.tooltipPosition,
        transitionSpeed: this.transitionSpeed,
      })),
        (this.mouseEnterEvent = debounce(this.pop.pin, 200)),
        this.tooltip.addEventListener("mouseenter", this.mouseEnterEvent),
        this.tooltip.addEventListener("mouseleave", this.removePinEvent),
        document.addEventListener("poppy:close", this.removePinEvent),
        document.addEventListener("theme:scroll", this.removePinEvent);
    }
    removePin() {
      this.pop && this.pop.state.pinned && this.pop.unpin();
    }
    unload() {
      this.pop &&
        (this.tooltip.removeEventListener("mouseenter", this.mouseEnterEvent),
        this.tooltip.removeEventListener("mouseleave", this.removePinEvent),
        document.removeEventListener("poppy:close", this.removePinEvent),
        document.removeEventListener("theme:scroll", this.removePinEvent));
    }
  }
  const tooltipSection = {
      onLoad() {
        sections$8[this.id] = [];
        this.container
          .querySelectorAll(`[${selectors$f.tooltip}]`)
          .forEach((e) => {
            sections$8[this.id].push(new Tooltip(e));
          });
      },
      onUnload: function () {
        sections$8[this.id].forEach((e) => {
          "function" == typeof e.unload && e.unload();
        });
      },
    },
    selectors$g = {
      elements: {
        scrollbar: "data-scrollbar-slider",
        scrollbarArrowPrev: "[data-scrollbar-arrow-prev]",
        scrollbarArrowNext: "[data-scrollbar-arrow-next]",
      },
      classes: { hide: "is-hidden" },
      times: { delay: 200 },
    };
  class NativeScrollbar {
    constructor(e) {
      (this.scrollbar = e),
        (this.arrowNext = this.scrollbar.parentNode.querySelector(
          selectors$g.elements.scrollbarArrowNext
        )),
        (this.arrowPrev = this.scrollbar.parentNode.querySelector(
          selectors$g.elements.scrollbarArrowPrev
        )),
        this.init(),
        this.resize(),
        this.scrollbar.hasAttribute(selectors$g.elements.scrollbar) &&
          this.scrollToVisibleElement();
    }
    init() {
      this.arrowNext &&
        this.arrowPrev &&
        (this.toggleNextArrow(), this.events());
    }
    resize() {
      document.addEventListener("theme:resize", () => {
        this.toggleNextArrow();
      });
    }
    events() {
      this.arrowNext.addEventListener("click", (e) => {
        e.preventDefault(), this.goToNext();
      }),
        this.arrowPrev.addEventListener("click", (e) => {
          e.preventDefault(), this.goToPrev();
        }),
        this.scrollbar.addEventListener("scroll", () => {
          this.togglePrevArrow(), this.toggleNextArrow();
        });
    }
    goToNext() {
      const e =
        this.scrollbar.getBoundingClientRect().width / 2 +
        this.scrollbar.scrollLeft;
      this.move(e),
        this.arrowPrev.classList.remove(selectors$g.classes.hide),
        this.toggleNextArrow();
    }
    goToPrev() {
      const e =
        this.scrollbar.scrollLeft -
        this.scrollbar.getBoundingClientRect().width / 2;
      this.move(e),
        this.arrowNext.classList.remove(selectors$g.classes.hide),
        this.togglePrevArrow();
    }
    toggleNextArrow() {
      setTimeout(() => {
        this.arrowNext.classList.toggle(
          selectors$g.classes.hide,
          Math.round(
            this.scrollbar.scrollLeft +
              this.scrollbar.getBoundingClientRect().width +
              1
          ) >= this.scrollbar.scrollWidth
        );
      }, selectors$g.times.delay);
    }
    togglePrevArrow() {
      setTimeout(() => {
        this.arrowPrev.classList.toggle(
          selectors$g.classes.hide,
          this.scrollbar.scrollLeft <= 0
        );
      }, selectors$g.times.delay);
    }
    scrollToVisibleElement() {
      [].forEach.call(this.scrollbar.children, (e) => {
        e.addEventListener("click", (t) => {
          t.preventDefault(), this.move(e.offsetLeft - e.clientWidth);
        });
      });
    }
    move(e) {
      this.scrollbar.scrollTo({ top: 0, left: e, behavior: "smooth" });
    }
  }
  const defaults = { color: "ash" },
    selectors$h = {
      formGridSwatch: "[data-grid-swatch-form]",
      swatch: "data-swatch",
      outerGrid: "[data-product-grid-item]",
      slide: "[data-grid-slide]",
      image: "data-swatch-image",
      variant: "data-swatch-variant",
      button: "[data-swatch-button]",
      link: "[data-grid-link]",
      wrapper: "[data-grid-swatches]",
      template: "[data-swatch-template]",
      handle: "data-swatch-handle",
      label: "data-swatch-label",
      tooltip: "data-tooltip",
      swatchCount: "data-swatch-count",
      scrollbar: "data-scrollbar",
    },
    classes$7 = { visible: "is-visible", stopEvents: "no-events" };
  class ColorMatch {
    constructor(e = {}) {
      (this.settings = { ...defaults, ...e }), (this.match = this.init());
    }
    getColor() {
      return this.match;
    }
    init() {
      return loadScript({ json: window.theme.assets.swatches })
        .then((e) => this.matchColors(e, this.settings.color))
        .catch((e) => {
          console.log("failed to load swatch colors script"), console.log(e);
        });
    }
    matchColors(e, t) {
      let s = "#E5E5E5",
        i = null;
      const o = window.theme.assets.base || "/",
        r = t.toLowerCase().replace(/\s/g, ""),
        n = e.colors;
      if (n) {
        let e = null;
        if (
          n.filter((t, s) => {
            if (
              Object.keys(t).toString().toLowerCase().replace(/\s/g, "") === r
            )
              return (e = s), t;
          }).length &&
          null !== e
        ) {
          const t = Object.values(n[e])[0];
          (s = t),
            (t.includes(".jpg") ||
              t.includes(".jpeg") ||
              t.includes(".png") ||
              t.includes(".svg")) &&
              ((i = `${o}${t}`), (s = "#888888"));
        }
      }
      return { color: this.settings.color, path: i, hex: s };
    }
  }
  class Swatch {
    constructor(e) {
      (this.element = e),
        (this.colorString = e.getAttribute(selectors$h.swatch)),
        (this.image = e.getAttribute(selectors$h.image)),
        (this.variant = e.getAttribute(selectors$h.variant));
      new ColorMatch({ color: this.colorString }).getColor().then((e) => {
        (this.colorMatch = e), this.init();
      });
    }
    init() {
      this.setStyles(), this.variant && this.handleEvents();
    }
    setStyles() {
      this.colorMatch.hex &&
        this.element.style.setProperty("--swatch", `${this.colorMatch.hex}`),
        this.colorMatch.path &&
          (this.element.style.setProperty(
            "background-image",
            `url(${this.colorMatch.path})`
          ),
          this.element.style.setProperty("background-size", "cover"),
          this.element.style.setProperty(
            "background-position",
            "center center"
          ));
    }
    handleEvents() {
      (this.outer = this.element.closest(selectors$h.outerGrid)),
        this.outer &&
          ((this.slide = this.outer.querySelector(selectors$h.slide)),
          (this.linkElement = this.outer.querySelector(selectors$h.link)),
          (this.linkElementAll = this.outer.querySelectorAll(selectors$h.link)),
          (this.linkDestination = getUrlWithVariant(
            this.linkElement.getAttribute("href"),
            this.variant
          )),
          (this.button = this.element.closest(selectors$h.button)),
          this.button.closest(selectors$h.formGridSwatch) &&
            this.button.addEventListener(
              "mouseenter",
              function () {
                this.changeImage();
              }.bind(this)
            ),
          this.button.closest(selectors$h.formGridSwatch) ||
            this.button.addEventListener(
              "click",
              function () {
                this.changeImage();
              }.bind(this)
            ));
    }
    changeImage() {
      if (
        (this.linkElementAll.forEach((e) => {
          e.setAttribute("href", this.linkDestination);
        }),
        this.slide.setAttribute("src", this.linkDestination),
        this.image)
      ) {
        let e = 180 * Math.ceil(this.slide.offsetWidth / 180),
          t = themeImages.getSizedImageUrl(this.image, `${e}x`);
        window
          .fetch(t)
          .then((e) => e.blob())
          .then((e) => {
            var t = URL.createObjectURL(e);
            this.slide.style.setProperty("background-color", "#fff"),
              this.slide.style.setProperty("background-image", `url("${t}")`);
          })
          .catch((e) => {
            console.log(`Error: ${e}`);
          });
      }
    }
  }
  class GridSwatch {
    constructor(e, t) {
      (this.counterSwatches = e.parentNode.previousElementSibling),
        (this.template = document.querySelector(
          selectors$h.template
        ).innerHTML),
        (this.wrap = e),
        (this.container = t),
        (this.handle = e.getAttribute(selectors$h.handle));
      const s = e.getAttribute(selectors$h.label).trim().toLowerCase();
      fetchProduct(this.handle).then((e) => {
        (this.product = e),
          (this.colorOption = e.options.find(function (e) {
            return e.name.toLowerCase() === s || null;
          })),
          this.colorOption &&
            ((this.swatches = this.colorOption.values), this.init());
      });
    }
    init() {
      (this.wrap.innerHTML = ""),
        (this.count = 0),
        this.swatches.forEach((e) => {
          let t = this.product.variants.find((t) => t.options.includes(e));
          if (t) {
            this.count++;
            const s = t.featured_media
              ? t.featured_media.preview_image.src
              : "";
            this.wrap.innerHTML += Sqrl.render(this.template, {
              color: e,
              uniq: `${this.product.id}-${t.id}`,
              variant: t.id,
              available: t.available,
              image: s,
            });
          }
        }),
        (this.swatchElements = this.wrap.querySelectorAll(
          `[${selectors$h.swatch}]`
        )),
        this.counterSwatches.hasAttribute(selectors$h.swatchCount) &&
          ((this.counterSwatches.innerText = `${this.count} ${
            this.count > 1 ? theme.strings.otherColor : theme.strings.oneColor
          }`),
          this.counterSwatches.addEventListener("mouseenter", () => {
            this.wrap
              .closest(selectors$h.link)
              .classList.add(classes$7.stopEvents),
              this.counterSwatches.nextElementSibling.classList.add(
                classes$7.visible
              );
          }),
          this.counterSwatches
            .closest(selectors$h.outerGrid)
            .addEventListener("mouseleave", () => {
              this.wrap
                .closest(selectors$h.link)
                .classList.remove(classes$7.stopEvents),
                this.counterSwatches.nextElementSibling.classList.remove(
                  classes$7.visible
                );
            })),
        this.wrap.hasAttribute(selectors$h.scrollbar) &&
          new NativeScrollbar(this.wrap),
        this.swatchElements.forEach((e) => {
          new Swatch(e);
          const t = e.closest(`[${selectors$h.tooltip}]`);
          t && new Tooltip(t);
        });
    }
  }
  const makeGridSwatches = (e) => {
      e.container.querySelectorAll(selectors$h.wrapper).forEach((e) => {
        new GridSwatch(e, void 0);
      });
    },
    swatchSection = {
      onLoad() {
        this.swatches = [];
        this.container
          .querySelectorAll(`[${selectors$h.swatch}]`)
          .forEach((e) => {
            this.swatches.push(new Swatch(e));
          });
      },
    },
    swatchGridSection = {
      onLoad() {
        makeGridSwatches(this);
      },
    },
    selectors$i = {
      elements: {
        html: "html",
        body: "body",
        productGrid: "data-product-grid-item",
        formQuickAdd: "[data-form-quick-add]",
        quickAddLabel: "data-quick-add-label",
        quickCollectionHande: "data-collection-handle",
        selectOption: "[data-select-option]:not([data-quick-add-button])",
        holderFormQuickAdd: "[data-quick-add-holder]",
        goToNextElement: "data-go-to-next",
        quickAddElement: "data-quick-add-button",
        productJson: "[data-product-json]",
        productOptionsJson: "[data-product-options-json]",
        quickAddFormHolder: "[data-quick-add-form-holder]",
        featuredImageHolder: "[data-grid-slide]",
        productImagesHolder: "[data-product-image]",
        productInformationHolder: "[data-product-information]",
        scrollbarHolder: "[data-scrollbar]",
        scrollbarArrowPrev: "[data-scrollbar-arrow-prev]",
        scrollbarArrowNext: "[data-scrollbar-arrow-next]",
        radioOption: "[data-radio-option]",
        popoutWrapper: "[data-popout]",
        popupList: "[data-popout-list]",
        popupoutOption: "[data-popout-option]",
        popupoutOptionValue: "data-value",
        popupoutToggle: "[data-popout-toggle]",
        selectPosition: "data-select-position",
        swatch: "data-swatch",
        backButton: "[data-back-button]",
        messageError: "[data-message-error]",
        idInput: '[name="id"]',
        buttonQuickAddMobile: "[data-button-quick-add-mobile]",
        ariaExpanded: "aria-expanded",
        input: "input",
      },
      classes: {
        active: "is-active",
        select: "is-selected",
        disable: "is-disable",
        hide: "is-hidden",
        added: "is-added",
        loading: "is-loading",
        visible: "is-visible",
        error: "has-error",
        focus: "is-focused",
        popupoutVisible: "popout-list--visible",
      },
      times: {
        debounce: 500,
        delay: 400,
        delaySmall: 200,
        delayMedium: 2e3,
        delayLarge: 5e3,
      },
      imageSize: "800x800",
    },
    instances$1 = [];
  class QuickAddProduct {
    constructor(e) {
      (this.cart = window.cart),
        (this.a11y = a11y),
        (this.themeAccessibility = window.accessibility),
        (this.document = document),
        (this.html = this.document.querySelector(selectors$i.elements.html)),
        (this.body = this.document.querySelector(selectors$i.elements.body)),
        (this.productGrid = e),
        (this.holder = this.productGrid.querySelector(
          selectors$i.elements.holderFormQuickAdd
        )),
        (this.quickAddLabel = this.productGrid.querySelector(
          `[${selectors$i.elements.quickAddLabel}]`
        )),
        (this.quickAddFormHolder = this.productGrid.querySelector(
          selectors$i.elements.quickAddFormHolder
        )),
        (this.featuredImageHolder = this.productGrid.querySelector(
          selectors$i.elements.featuredImageHolder
        )),
        (this.productInformationHolder = this.productGrid.querySelector(
          selectors$i.elements.productInformationHolder
        )),
        (this.buttonQuickAddMobile = this.productGrid.querySelector(
          selectors$i.elements.buttonQuickAddMobile
        )),
        (this.productJSON = null),
        (this.productOptionsJSON = null),
        (this.productForm = null),
        (this.selectedOptions = []),
        (this.filteredOptions = []),
        (this.enableMobileMode = !1),
        (this.accessibilityStopEvent = !1),
        (this.quickAddFormIsLoaded = !1),
        theme.enableQuickAdd &&
          (this.accessibility(), this.show(), this.hide(), this.errorHandle());
    }
    initNativeScrollbar() {
      this.scrollbarHolder.length &&
        this.scrollbarHolder.forEach((e) => {
          new NativeScrollbar(e);
        });
    }
    getForm() {
      if (this.quickAddFormIsLoaded) return;
      this.quickAddFormIsLoaded = !0;
      const e = "/" === theme.routes.root ? "" : theme.routes.root;
      fetch(
        e +
          "/products/" +
          this.quickAddLabel.getAttribute(selectors$i.elements.quickAddLabel) +
          "?view=ajax_quickview"
      )
        .then((e) => e.text())
        .then((e) => {
          (this.quickAddFormHolder.innerHTML = e.replaceAll(
            "||collection-index||",
            this.quickAddLabel.getAttribute(
              selectors$i.elements.quickCollectionHande
            )
          )),
            this.loadForm();
        })
        .catch((e) => {
          console.warn(e);
        });
    }
    loadForm() {
      (this.form = this.quickAddFormHolder.querySelector(
        selectors$i.elements.formQuickAdd
      )),
        (this.selectOption = this.quickAddFormHolder.querySelectorAll(
          selectors$i.elements.selectOption
        )),
        (this.productElemJSON = this.quickAddFormHolder.querySelector(
          selectors$i.elements.productJson
        )),
        (this.productOptionsElemJSON = this.quickAddFormHolder.querySelector(
          selectors$i.elements.productOptionsJson
        )),
        (this.scrollbarHolder = this.quickAddFormHolder.querySelectorAll(
          selectors$i.elements.scrollbarHolder
        )),
        (this.popoutWrapper = this.quickAddFormHolder.querySelectorAll(
          selectors$i.elements.popoutWrapper
        )),
        (this.swatches = this.quickAddFormHolder.querySelectorAll(
          `[${selectors$i.elements.swatch}]`
        )),
        (this.backButtons = this.quickAddFormHolder.querySelectorAll(
          selectors$i.elements.backButton
        )),
        this.swatches.length &&
          (this.swatches.forEach((e) => {
            new Swatch(e);
          }),
          this.changeVariantImageOnHover()),
        this.popoutWrapper.length &&
          this.popoutWrapper.forEach((e) => {
            new Popout(e);
          }),
        this.initNativeScrollbar(),
        this.initGoToBack();
      const e = this.productElemJSON && "" !== this.productElemJSON.innerHTML,
        t =
          this.productOptionsElemJSON &&
          "" !== this.productOptionsElemJSON.innerHTML;
      e && t
        ? ((this.productJSON = JSON.parse(this.productElemJSON.innerHTML)),
          (this.productOptionsJSON = JSON.parse(
            this.productOptionsElemJSON.innerHTML
          )),
          this.initForm())
        : console.error(
            "Missing product JSON or product options with values JSON"
          );
    }
    initForm() {
      this.filterFirstOptionValues(),
        (this.productForm = new ProductForm(this.form, this.productJSON, {
          onOptionChange: this.onOptionChange.bind(this),
        })),
        this.enableMobileMode
          ? (this.addFirstVariantIsDefault(
              this.buttonQuickAddMobile.hasAttribute(
                selectors$i.elements.quickAddElement
              )
            ),
            this.buttonQuickAddMobile.classList.add(selectors$i.classes.hide),
            this.buttonQuickAddMobile.classList.remove(
              selectors$i.classes.loading
            ),
            this.quickAddLabel.classList.add(selectors$i.classes.hide),
            this.toggleClasses())
          : this.quickAddLabel.classList.remove(
              selectors$i.classes.disable,
              selectors$i.classes.hide
            );
    }
    onOptionChange(e) {
      const t = e.target,
        s = t.closest(selectors$i.elements.selectOption),
        i = Number(s.getAttribute(selectors$i.elements.selectPosition)),
        o = e.dataset.variant
          ? e.dataset.variant.options[i - 1]
          : e.dataset.options[i - 1],
        r = this.body.classList.contains(selectors$i.classes.focus);
      this.changeVariantImage(e.dataset.variant),
        (r && this.accessibilityStopEvent) ||
          (this.selectedOptions.push(e.target.value),
          s.classList.add(selectors$i.classes.select),
          this.filterAvailableOptions(o, i),
          t.hasAttribute(selectors$i.elements.goToNextElement) &&
            (s.classList.remove(selectors$i.classes.active),
            s.nextElementSibling.classList.add(selectors$i.classes.active)),
          t.hasAttribute(selectors$i.elements.quickAddElement) &&
            e.dataset.variant.available &&
            (theme.cartDrawerEnabled &&
              (this.quickAddLabel.classList.remove(selectors$i.classes.hide),
              this.quickAddLabel.classList.add(selectors$i.classes.loading)),
            this.html.dispatchEvent(
              new CustomEvent("cart:add-to-cart", {
                bubbles: !0,
                detail: {
                  element: this.holder,
                  label: this.quickAddLabel,
                  data: { id: e.dataset.variant.id, quantity: 1 },
                },
              })
            ),
            setTimeout(() => {
              (this.selectedOptions = []), this.resetInputsOfInstance();
            }, selectors$i.times.delayMedium),
            s.classList.remove(selectors$i.classes.active)),
          r &&
            t.hasAttribute(selectors$i.elements.goToNextElement) &&
            this.accessibilityTrapFocus(s.nextElementSibling),
          (this.accessibilityStopEvent = !1));
    }
    initGoToBack() {
      this.backButtons.length &&
        this.backButtons.forEach((e) => {
          e.addEventListener("click", (t) => {
            t.preventDefault();
            const s = this.body.classList.contains(selectors$i.classes.focus);
            this.selectedOptions.pop();
            const i = e.closest(selectors$i.elements.selectOption);
            let o = i.previousElementSibling.matches(
              selectors$i.elements.selectOption
            )
              ? i.previousElementSibling
              : this.quickAddLabel;
            if (
              (o === this.quickAddLabel &&
                s &&
                (this.themeAccessibility.lastFocused = this.quickAddLabel),
              o === this.quickAddLabel &&
                this.enableMobileMode &&
                (o = this.buttonQuickAddMobile),
              o !== this.quickAddLabel)
            ) {
              s && this.accessibilityTrapFocus(o);
              const e = i.querySelectorAll(selectors$i.elements.input),
                t = i.querySelectorAll(selectors$i.elements.popupoutOption),
                r = o.querySelectorAll(selectors$i.elements.input),
                n = o.querySelectorAll(selectors$i.elements.popupoutOption);
              e &&
                e.forEach((e) => {
                  e.checked = !1;
                }),
                t &&
                  t.forEach((e) => {
                    e.classList.remove(selectors$i.classes.visible);
                  }),
                r &&
                  r.forEach((e) => {
                    e.checked = !1;
                  }),
                n &&
                  n.forEach((e) => {
                    e.classList.remove(selectors$i.classes.visible);
                  });
            }
            o !== this.buttonQuickAddMobile &&
              (s && this.accessibilityTrapFocus(o),
              o.classList.add(
                selectors$i.classes.active,
                selectors$i.classes.select
              )),
              o === this.buttonQuickAddMobile &&
                this.holder.classList.remove(selectors$i.classes.visible),
              o.classList.remove(selectors$i.classes.hide),
              i.classList.remove(
                selectors$i.classes.active,
                selectors$i.classes.select
              ),
              s && o.focus();
          });
        });
    }
    toggleClasses() {
      if (
        (this.holder.classList.add(selectors$i.classes.visible),
        this.selectOption &&
          this.selectOption.length &&
          "" !== this.quickAddFormHolder.innerHTML)
      ) {
        this.quickAddLabel.classList.add(selectors$i.classes.hide);
        0 ===
          Array.from(this.selectOption).filter((e) =>
            e.classList.contains(selectors$i.classes.active)
          ).length &&
          (this.selectOption[0].classList.add(selectors$i.classes.active),
          this.body.classList.contains(selectors$i.classes.focus) &&
            this.accessibilityStopEvent &&
            setTimeout(() => {
              this.accessibilityTrapFocus(this.selectOption[0]);
            }, selectors$i.times.delaySmall));
      }
    }
    addFirstVariantIsDefault(e) {
      const t = this.productJSON.variants[0];
      e &&
        t.available &&
        this.html.dispatchEvent(
          new CustomEvent("cart:add-to-cart", {
            bubbles: !0,
            detail: {
              element: this.holder,
              label: this.quickAddLabel,
              data: { id: t.id, quantity: 1 },
            },
          })
        );
    }
    show() {
      this.buttonQuickAddMobile &&
        this.buttonQuickAddMobile.addEventListener("click", () => {
          (this.enableMobileMode = !0),
            this.buttonQuickAddMobile.classList.add(
              selectors$i.classes.loading
            ),
            "" !== this.quickAddFormHolder.innerHTML ||
            this.quickAddFormIsLoaded
              ? (this.toggleClasses(),
                this.buttonQuickAddMobile.classList.remove(
                  selectors$i.classes.loading
                ),
                this.buttonQuickAddMobile.classList.add(
                  selectors$i.classes.hide
                ),
                this.holder.classList.add(selectors$i.classes.visible))
              : this.getForm(),
            null !== this.productJSON &&
              this.addFirstVariantIsDefault(
                this.buttonQuickAddMobile.hasAttribute(
                  selectors$i.elements.quickAddElement
                )
              );
        }),
        this.productGrid &&
          this.productGrid.addEventListener("mouseenter", () => {
            (this.enableMobileMode = !1),
              this.hideOtherHolders(),
              this.quickAddFormHolder &&
                "" === this.quickAddFormHolder.innerHTML &&
                !this.quickAddFormIsLoaded &&
                this.getForm();
          }),
        this.quickAddLabel &&
          (this.quickAddLabel.addEventListener("focusin", () => {
            (this.enableMobileMode = !1),
              "" !== this.quickAddFormHolder.innerHTML ||
                this.quickAddFormIsLoaded ||
                this.getForm();
          }),
          this.quickAddLabel.addEventListener("click", () => {
            this.enableMobileMode = !1;
            this.quickAddLabel.classList.contains(selectors$i.classes.added) ||
              this.quickAddLabel.classList.contains(
                selectors$i.classes.disable
              ) ||
              null === this.productJSON ||
              ((this.selectedOptions = []),
              this.addFirstVariantIsDefault(
                this.quickAddLabel.hasAttribute(
                  selectors$i.elements.quickAddElement
                )
              ),
              "" !== this.quickAddFormHolder.innerHTML && this.toggleClasses());
          })),
        this.productInformationHolder.addEventListener("mouseenter", () => {
          this.featuredImageHolder
            .closest(selectors$i.elements.productImagesHolder)
            .classList.remove(selectors$i.classes.visible);
        });
    }
    hide() {
      (this.quickAddLabel || this.buttonQuickAddMobile) &&
        (theme.cartDrawerEnabled
          ? this.document.addEventListener("theme:cart-close", () => {
              setTimeout(() => {
                this.resetButtonsOfInstance();
              }, selectors$i.times.delayLarge);
            })
          : setTimeout(() => {
              this.resetButtonsOfInstance();
            }, selectors$i.times.delayLarge));
    }
    accessibility() {
      this.productGrid.addEventListener("keyup", (e) => {
        if (
          (e.keyCode === window.theme.keyboardKeys.TAB &&
            (this.accessibilityStopEvent = !0),
          e.keyCode === window.theme.keyboardKeys.ENTER)
        ) {
          this.accessibilityStopEvent = !1;
          (e.target.hasAttribute(selectors$i.elements.popupoutOptionValue)
            ? e.target.closest(selectors$i.elements.popupList)
                .nextElementSibling
            : e.target
          ).dispatchEvent(new Event("change"));
        }
      });
    }
    accessibilityTrapFocus(e) {
      this.a11y.removeTrapFocus(),
        this.a11y.trapFocus(e, {
          elementToFocus: e.querySelector(selectors$i.elements.backButton),
        });
    }
    filterAvailableOptions(e, t, s = !0) {
      const i = this.productJSON.variants.filter((s) => {
        if (!(s.options.length > 1))
          return s[`option${t}`] === e && s.available;
        {
          let i = [];
          if (
            (this.selectedOptions.forEach((o, r) => {
              i.push(
                s[`option${t}`] === e && s.options[r] === o && s.available
              );
            }),
            !i.includes(!1) && i.length > 0)
          )
            return s;
        }
      });
      this.productOptionsJSON.forEach((e) => {
        if (e.position !== t) {
          const t = {};
          (t.name = e.name),
            (t.position = e.position),
            (t.values = []),
            e.values.forEach((s) => {
              i.filter((t) => t[`option${e.position}`] === s).length &&
                t.values.push(s);
            }),
            (this.filteredOptions = [...this.filteredOptions, t]);
        }
      }),
        s && (this.disableUnavailableValues(), (this.filteredOptions = []));
    }
    filterFirstOptionValues() {
      this.productOptionsJSON[0].values.forEach((e) => {
        if (
          0 ===
          this.productJSON.variants.filter(
            (t) => t.option1 === e && t.available
          ).length
        ) {
          const t = this.selectOption[0].querySelector(`input[value="${e}"]`),
            s = this.selectOption[0].querySelector(
              `[${selectors$i.elements.popupoutOptionValue}="${e}"]`
            );
          t && ((t.checked = !1), (t.disabled = !0)),
            s &&
              (s.classList.add(selectors$i.classes.disable),
              s.setAttribute("tabindex", -1));
        }
      });
    }
    disableUnavailableValues() {
      this.selectOption &&
        this.selectOption.forEach((e) => {
          const t = e.querySelectorAll(selectors$i.elements.input),
            s = e.querySelectorAll(selectors$i.elements.popupoutOption);
          t.forEach((t) => {
            e.classList.contains(selectors$i.classes.select) ||
              ((t.checked = !1), (t.disabled = !0)),
              this.filteredOptions.forEach((e) => {
                e.values.includes(t.value) && (t.disabled = !1);
              });
          }),
            s.forEach((t) => {
              e.classList.contains(selectors$i.classes.select) ||
                (t.setAttribute("tabindex", -1),
                t.classList.add(selectors$i.classes.disable)),
                this.filteredOptions.forEach((e) => {
                  e.values.includes(
                    t.getAttribute(
                      `${selectors$i.elements.popupoutOptionValue}`
                    )
                  ) &&
                    (t.classList.remove(selectors$i.classes.disable),
                    t.setAttribute("tabindex", 1));
                });
            });
        });
    }
    changeVariantImageOnHover() {
      this.swatches.forEach((e) => {
        e.addEventListener("mouseover", () => {
          for (let t = 0; t < this.productJSON.variants.length; t++) {
            const s = this.productJSON.variants[t];
            if (
              void 0 !== s.featured_media &&
              s.options[this.selectedOptions.length] ===
                e.getAttribute(selectors$i.elements.swatch)
            ) {
              this.changeVariantImage(s);
              break;
            }
          }
        });
      });
    }
    changeVariantImage(e) {
      if (e && e.featured_media && void 0 !== e.featured_media) {
        const t = themeImages.getSizedImageUrl(
          e.featured_media.preview_image.src,
          selectors$i.imageSize
        );
        this.featuredImageHolder.style.setProperty(
          "background-image",
          `url(${t})`
        ),
          this.featuredImageHolder
            .closest(selectors$i.elements.productImagesHolder)
            .classList.add(selectors$i.classes.visible);
      }
    }
    resetOptions(e) {
      e.querySelectorAll(selectors$i.elements.input).forEach((e) => {
        (e.checked = !1), (e.disabled = !1);
      }),
        e.querySelectorAll(selectors$i.elements.popupoutOption).forEach((e) => {
          e.classList.remove(selectors$i.classes.disable),
            e.setAttribute("tabindex", 1);
        });
    }
    hideOtherHolders() {
      const e = this.document.querySelectorAll(
        selectors$i.elements.holderFormQuickAdd
      );
      e &&
        e.forEach((e) => {
          if (e !== this.holder) {
            e.classList.remove(selectors$i.classes.visible);
            const t = e.querySelector(selectors$i.elements.popupoutToggle);
            t &&
              (t.setAttribute(selectors$i.elements.ariaExpanded, !1),
              t.nextElementSibling.classList.remove(
                selectors$i.classes.popupoutVisible
              )),
              this.popoutWrapper &&
                e
                  .closest(`[${selectors$i.elements.productGrid}]`)
                  .querySelector(selectors$i.elements.productImagesHolder)
                  .classList.remove(selectors$i.classes.visible);
          }
        });
    }
    resetInputsOfInstance() {
      this.selectOption &&
        (this.quickAddLabel.classList.remove(selectors$i.classes.hide),
        this.initNativeScrollbar(),
        this.selectOption.forEach((e) => {
          e.classList.remove(
            selectors$i.classes.active,
            selectors$i.classes.select
          );
          const t = e.querySelector(selectors$i.elements.popupoutToggle);
          t &&
            ((t.innerText = theme.strings.selectValue),
            t.setAttribute(selectors$i.elements.ariaExpanded, !1)),
            this.resetOptions(e);
        }),
        this.filterFirstOptionValues(),
        (this.filteredOptions = []));
    }
    resetButtonsOfInstance() {
      this.quickAddLabel.classList.remove(
        selectors$i.classes.select,
        selectors$i.classes.added,
        selectors$i.classes.visible
      ),
        this.buttonQuickAddMobile.classList.remove(selectors$i.classes.hide);
    }
    errorHandle() {
      this.html.addEventListener("cart:add-to-error", (e) => {
        const t = e.detail.holder,
          s = t.querySelector(selectors$i.elements.messageError);
        t
          .querySelector(`[${selectors$i.elements.quickAddLabel}]`)
          .classList.remove(
            selectors$i.classes.visible,
            selectors$i.classes.added,
            selectors$i.classes.loading
          ),
          t.classList.add(selectors$i.classes.error),
          (s.innerText = e.detail.description),
          setTimeout(() => {
            t.classList.remove(selectors$i.classes.error),
              t.classList.add(selectors$i.classes.visible),
              t.previousElementSibling.classList.remove(
                selectors$i.classes.hide
              );
          }, selectors$i.times.delayLarge);
      });
    }
  }
  const quickAddProduct = {
    onLoad() {
      this.container
        .querySelectorAll(`[${selectors$i.elements.productGrid}]`)
        .forEach((e) => {
          instances$1.push(new QuickAddProduct(e));
        });
    },
  };
  var selectors$j = {
    sort: "[data-sort-enabled]",
    sortLinks: "[data-sort-link]",
    sortValue: "data-value",
    collectionNavGrouped: ".collection-nav--grouped",
    collectionSidebarHeading: ".collection__sidebar__heading",
    linkAdd: ".link--add",
    linkRemove: ".link--remove",
  };
  class Collection {
    constructor(e) {
      (this.container = e.container),
        (this.sort = this.container.querySelector(selectors$j.sort)),
        (this.sortLinks = this.container.querySelectorAll(
          selectors$j.sortLinks
        )),
        this.init();
    }
    init() {
      this.sort && this.initClick(), this.removeUnusableFilters();
    }
    onClick(e) {
      const t = e.currentTarget.getAttribute(selectors$j.sortValue),
        s = new window.URL(window.location.href),
        i = s.searchParams;
      i.set("sort_by", t),
        (s.search = i.toString()),
        window.location.replace(s.toString());
    }
    initClick() {
      this.sortLinks.forEach((e) => {
        e.addEventListener(
          "click",
          function (e) {
            this.onClick(e);
          }.bind(this)
        );
      });
    }
    removeUnusableFilters() {
      const e = this.container.querySelectorAll(
        selectors$j.collectionNavGrouped
      );
      e.length > 0 &&
        e.forEach((e) => {
          const t = e.querySelector(selectors$j.linkAdd),
            s = e.querySelector(selectors$j.linkRemove);
          t ||
            s ||
            (hideElement(e),
            hideElement(
              e.parentElement.querySelector(
                selectors$j.collectionSidebarHeading
              )
            ));
        });
    }
  }
  const collectionSection = {
    onLoad() {
      this.collection = new Collection(this);
    },
  };
  register("collection", [
    parallaxHero,
    productGridReviews,
    quickAddProduct,
    collectionSection,
    popoutSection,
    swatchGridSection,
  ]);
  const selectors$k = {
      frame: "[data-ticker-frame]",
      scale: "[data-ticker-scale]",
      text: "[data-ticker-text]",
      clone: "data-clone",
      animationClass: "ticker--animated",
      unloadedClass: "ticker--unloaded",
      comparitorClass: "ticker__comparitor",
    },
    sections$9 = {};
  class Ticker {
    constructor(e) {
      (this.frame = e),
        (this.scale = this.frame.querySelector(selectors$k.scale)),
        (this.text = this.frame.querySelector(selectors$k.text)),
        (this.comparitor = this.text.cloneNode(!0)),
        this.comparitor.classList.add(selectors$k.comparitorClass),
        this.frame.appendChild(this.comparitor),
        this.scale.classList.remove(selectors$k.unloadedClass),
        (this.resizeEvent = () => this.checkWidth()),
        this.listen();
    }
    unload() {
      document.removeEventListener("theme:resize", this.resizeEvent);
    }
    listen() {
      document.addEventListener("theme:resize", this.resizeEvent),
        this.checkWidth();
    }
    checkWidth() {
      if (this.frame.clientWidth < this.comparitor.clientWidth)
        this.text.classList.add(selectors$k.animationClass),
          1 === this.scale.childElementCount &&
            ((this.clone = this.text.cloneNode(!0)),
            this.clone.setAttribute(selectors$k.clone, ""),
            this.scale.appendChild(this.clone));
      else {
        let e = this.scale.querySelector(`[${selectors$k.clone}]`);
        e && this.scale.removeChild(e),
          this.text.classList.remove(selectors$k.animationClass);
      }
    }
  }
  const ticker = {
    onLoad() {
      sections$9[this.id] = [];
      this.container.querySelectorAll(selectors$k.frame).forEach((e) => {
        sections$9[this.id].push(new Ticker(e));
      });
    },
    onUnload() {
      sections$9[this.id].forEach((e) => {
        "function" == typeof e.unload && e.unload();
      });
    },
  };
  register("announcement", ticker);
  const selectors$l = {
      body: "body",
      drawerWrappper: "[data-drawer]",
      drawerInner: "[data-drawer-inner]",
      underlay: "[data-drawer-underlay]",
      stagger: "[data-stagger-animation]",
      wrapper: "[data-header-transparent]",
      transparent: "data-header-transparent",
      drawerToggle: "data-drawer-toggle",
      focusable:
        'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
    },
    classes$8 = {
      isVisible: "drawer--visible",
      isFocused: "is-focused",
      headerStuck: "js__header__stuck",
    };
  let sections$a = {};
  class Drawer {
    constructor(e) {
      (this.drawer = e),
        (this.drawerWrapper = this.drawer.closest(selectors$l.drawerWrappper)),
        (this.drawerInner = this.drawer.querySelector(selectors$l.drawerInner)),
        (this.underlay = this.drawer.querySelector(selectors$l.underlay)),
        (this.wrapper = this.drawer.closest(selectors$l.wrapper)),
        (this.primaryState = this.wrapper.getAttribute(
          selectors$l.transparent
        )),
        (this.key = this.drawer.dataset.drawer);
      const t = `[${selectors$l.drawerToggle}='${this.key}']`;
      (this.buttons = document.querySelectorAll(t)),
        (this.staggers = this.drawer.querySelectorAll(selectors$l.stagger)),
        (this.body = document.querySelector(selectors$l.body)),
        (this.initWatchFocus = (e) => this.watchFocus(e)),
        this.connectToggle(),
        this.connectDrawer(),
        this.closers(),
        this.staggerChildAnimations();
    }
    connectToggle() {
      this.buttons.forEach((e) => {
        e.addEventListener("click", () => {
          this.drawer.dispatchEvent(
            new CustomEvent("theme:drawer:toggle", { bubbles: !1 })
          );
        });
      });
    }
    connectDrawer() {
      this.drawer.addEventListener("theme:drawer:toggle", () => {
        this.drawer.classList.contains(classes$8.isVisible)
          ? this.drawer.dispatchEvent(
              new CustomEvent("theme:drawer:close", { bubbles: !0 })
            )
          : this.drawer.dispatchEvent(
              new CustomEvent("theme:drawer:open", { bubbles: !0 })
            );
      }),
        document.addEventListener(
          "theme:drawer:close",
          this.hideDrawer.bind(this)
        ),
        document.addEventListener(
          "theme:drawer:open",
          this.showDrawer.bind(this)
        );
    }
    staggerChildAnimations() {
      this.staggers.forEach((e) => {
        e.querySelectorAll(":scope > * > [data-animates]").forEach((e, t) => {
          e.style.transitionDelay = 50 * t + 10 + "ms";
        });
      });
    }
    watchFocus(e) {
      !this.wrapper.contains(e.target) &&
        this.body.classList.contains(classes$8.isFocused) &&
        this.hideDrawer();
    }
    closers() {
      this.wrapper.addEventListener(
        "keyup",
        function (e) {
          e.which === window.theme.keyboardKeys.ESCAPE &&
            (this.hideDrawer(), this.buttons[0].focus());
        }.bind(this)
      ),
        this.underlay.addEventListener("click", () => {
          this.hideDrawer();
        });
    }
    showDrawer() {
      document.dispatchEvent(
        new CustomEvent("theme:drawer:close", { bubbles: !1 })
      ),
        this.buttons.forEach((e) => {
          e.setAttribute("aria-expanded", !0),
            e.classList.add(classes$8.isVisible);
        }),
        this.drawer.classList.add(classes$8.isVisible),
        this.drawer.querySelector(selectors$l.focusable).focus(),
        this.wrapper.setAttribute(selectors$l.transparent, !this.primaryState),
        document.addEventListener("focusin", this.initWatchFocus),
        document.dispatchEvent(
          new CustomEvent("theme:scroll:lock", {
            bubbles: !0,
            detail: this.drawerInner,
          })
        );
    }
    hideDrawer() {
      this.buttons.forEach((e) => {
        e.setAttribute("aria-expanded", !0),
          e.classList.remove(classes$8.isVisible);
      }),
        this.drawer.classList.remove(classes$8.isVisible),
        document.removeEventListener("focusin", this.initWatchFocus),
        this.wrapper.classList.contains(classes$8.headerStuck)
          ? this.wrapper.setAttribute(
              selectors$l.transparent,
              !this.primaryState
            )
          : this.wrapper.setAttribute(
              selectors$l.transparent,
              this.primaryState
            ),
        document.dispatchEvent(
          new CustomEvent("theme:scroll:unlock", { bubbles: !0 })
        ),
        document.dispatchEvent(
          new CustomEvent("theme:sliderule:close", { bubbles: !1 })
        );
    }
  }
  const drawer = {
      onLoad() {
        sections$a[this.id] = [];
        this.container
          .querySelectorAll(selectors$l.drawerWrappper)
          .forEach((e) => {
            sections$a[this.id].push(new Drawer(e));
          });
      },
    },
    selectors$m = {
      announcement: "[data-announcement-wrapper]",
      transparent: "data-header-transparent",
      header: "[data-header-wrapper] header",
      headerIsNotFixed: '[data-header-sticky="static"]',
    },
    classes$9 = {
      stuck: "js__header__stuck",
      stuckAnimated: "js__header__stuck--animated",
      triggerAnimation: "js__header__stuck--trigger-animation",
      stuckBackdrop: "js__header__stuck__backdrop",
      headerIsNotVisible: "is-not-visible",
    };
  let sections$b = {};
  class Sticky {
    constructor(e) {
      (this.wrapper = e),
        (this.type = this.wrapper.dataset.headerSticky),
        (this.transparent = this.wrapper.dataset.headerTransparent),
        (this.sticks = "sticky" === this.type),
        (this.static = "static" === this.type),
        (this.win = window),
        (this.animated = "directional" === this.type),
        (this.currentlyStuck = !1),
        (this.cls = this.wrapper.classList);
      const t = document.querySelector(selectors$m.announcement),
        s = t ? t.clientHeight : 0;
      (this.headerHeight = document.querySelector(
        selectors$m.header
      ).clientHeight),
        (this.blur = this.headerHeight + s),
        (this.stickDown = this.headerHeight + s),
        (this.stickUp = s),
        (this.scrollEventStatic = () => this.checkIsVisible()),
        (this.scrollEventListen = (e) => this.listenScroll(e)),
        (this.scrollEventUpListen = () => this.scrollUpDirectional()),
        (this.scrollEventDownListen = () => this.scrollDownDirectional()),
        "false" !== this.wrapper.getAttribute(selectors$m.transparent) &&
          (this.blur = s),
        this.sticks && ((this.stickDown = s), this.scrollDownInit()),
        this.static &&
          document.addEventListener("theme:scroll", this.scrollEventStatic),
        this.listen();
    }
    unload() {
      (this.sticks || this.animated) &&
        document.removeEventListener("theme:scroll", this.scrollEventListen),
        this.animated &&
          (document.removeEventListener(
            "theme:scroll:up",
            this.scrollEventUpListen
          ),
          document.removeEventListener(
            "theme:scroll:down",
            this.scrollEventDownListen
          )),
        this.static &&
          document.removeEventListener("theme:scroll", this.scrollEventStatic);
    }
    listen() {
      (this.sticks || this.animated) &&
        document.addEventListener("theme:scroll", this.scrollEventListen),
        this.animated &&
          (document.addEventListener(
            "theme:scroll:up",
            this.scrollEventUpListen
          ),
          document.addEventListener(
            "theme:scroll:down",
            this.scrollEventDownListen
          ));
    }
    listenScroll(e) {
      e.detail.down
        ? (!this.currentlyStuck &&
            e.detail.position > this.stickDown &&
            this.stickSimple(),
          !this.currentlyBlurred &&
            e.detail.position > this.blur &&
            this.addBlur())
        : (e.detail.position <= this.stickUp && this.unstickSimple(),
          e.detail.position <= this.blur && this.removeBlur());
    }
    stickSimple() {
      this.animated && this.cls.add(classes$9.stuckAnimated),
        this.cls.add(classes$9.stuck),
        this.wrapper.setAttribute(selectors$m.transparent, !1),
        (this.currentlyStuck = !0);
    }
    unstickSimple() {
      document.documentElement.hasAttribute("data-scroll-locked") ||
        (this.cls.remove(classes$9.stuck),
        this.wrapper.setAttribute(selectors$m.transparent, this.transparent),
        this.animated && this.cls.remove(classes$9.stuckAnimated),
        (this.currentlyStuck = !1));
    }
    scrollDownInit() {
      window.scrollY > this.stickDown && this.stickSimple(),
        window.scrollY > this.blur && this.addBlur();
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
      window.scrollY <= this.stickDown
        ? this.unstickDirectional()
        : this.stickDirectional();
    }
    addBlur() {
      this.cls.add(classes$9.stuckBackdrop), (this.currentlyBlurred = !0);
    }
    removeBlur() {
      this.cls.remove(classes$9.stuckBackdrop), (this.currentlyBlurred = !1);
    }
    checkIsVisible() {
      const e = document.querySelector(selectors$m.headerIsNotFixed),
        t = this.win.pageYOffset;
      e &&
        e.classList.toggle(
          classes$9.headerIsNotVisible,
          t >= this.headerHeight
        );
    }
  }
  const stickyHeader = {
      onLoad() {
        sections$b = new Sticky(this.container);
      },
      onUnload: function () {
        "function" == typeof sections$b.unload && sections$b.unload();
      },
    },
    selectors$n = {
      disclosureToggle: "data-hover-disclosure-toggle",
      disclosureWrappper: "[data-hover-disclosure]",
      link: "[data-top-link]",
      meganavVisible: "meganav--visible",
      wrapper: "[data-header-wrapper]",
      stagger: "[data-stagger]",
      staggerPair: "[data-stagger-first]",
      staggerAfter: "[data-stagger-second]",
      staggerImage: "[data-grid-item], [data-header-image]",
      focusable:
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    },
    classes$a = { isVisible: "is-visible" };
  let sections$c = {},
    disclosures = {};
  class HoverDisclosure {
    constructor(e) {
      (this.disclosure = e),
        (this.wrapper = e.closest(selectors$n.wrapper)),
        (this.key = this.disclosure.id);
      const t = `[${selectors$n.disclosureToggle}='${this.key}']`;
      (this.trigger = document.querySelector(t)),
        (this.link = this.trigger.querySelector(selectors$n.link)),
        (this.grandparent = this.trigger.classList.contains("grandparent")),
        this.trigger.setAttribute("aria-haspopup", !0),
        this.trigger.setAttribute("aria-expanded", !1),
        this.trigger.setAttribute("aria-controls", this.key),
        this.connectHoverToggle(),
        this.handleTablets(),
        this.staggerChildAnimations();
    }
    onBlockSelect(e) {
      this.disclosure.contains(e.target) && this.showDisclosure();
    }
    onBlockDeselect(e) {
      this.disclosure.contains(e.target) && this.hideDisclosure();
    }
    showDisclosure() {
      this.grandparent
        ? this.wrapper.classList.add(selectors$n.meganavVisible)
        : this.wrapper.classList.remove(selectors$n.meganavVisible),
        this.trigger.setAttribute("aria-expanded", !0),
        this.trigger.classList.add(classes$a.isVisible),
        this.disclosure.classList.add(classes$a.isVisible);
    }
    hideDisclosure() {
      this.disclosure.classList.remove(classes$a.isVisible),
        this.trigger.classList.remove(classes$a.isVisible),
        this.trigger.setAttribute("aria-expanded", !1),
        this.wrapper.classList.remove(selectors$n.meganavVisible);
    }
    staggerChildAnimations() {
      this.disclosure.querySelectorAll(selectors$n.stagger).forEach((e, t) => {
        e.style.transitionDelay = 50 * t + 10 + "ms";
      });
      this.disclosure
        .querySelectorAll(selectors$n.staggerPair)
        .forEach((e, t) => {
          const s = 150 * t;
          (e.style.transitionDelay = `${s}ms`),
            e.parentElement
              .querySelectorAll(selectors$n.staggerAfter)
              .forEach((e, t) => {
                const i = 20 * (t + 1);
                e.style.transitionDelay = `${s + i}ms`;
              });
        });
      this.disclosure
        .querySelectorAll(selectors$n.staggerImage)
        .forEach((e, t) => {
          e.style.transitionDelay = 80 * (t + 1) + "ms";
        });
    }
    handleTablets() {
      this.trigger.addEventListener(
        "touchstart",
        function (e) {
          this.disclosure.classList.contains(classes$a.isVisible) ||
            (e.preventDefault(), this.showDisclosure());
        }.bind(this),
        { passive: !0 }
      );
    }
    connectHoverToggle() {
      this.trigger.addEventListener(
        "mouseenter",
        debounce(this.showDisclosure.bind(this), 100)
      ),
        this.link.addEventListener(
          "focus",
          debounce(this.showDisclosure.bind(this), 100)
        ),
        this.trigger.addEventListener(
          "mouseleave",
          debounce(this.hideDisclosure.bind(this), 100)
        ),
        this.trigger.addEventListener(
          "focusout",
          debounce(
            function (e) {
              this.trigger.contains(e.relatedTarget) || this.hideDisclosure();
            }.bind(this)
          ),
          100
        ),
        this.disclosure.addEventListener(
          "keyup",
          function (e) {
            e.which === window.theme.keyboardKeys.ESCAPE &&
              this.hideDisclosure();
          }.bind(this)
        );
    }
  }
  const hoverDisclosure = {
      onLoad() {
        (sections$c[this.id] = []),
          (disclosures = this.container.querySelectorAll(
            selectors$n.disclosureWrappper
          )),
          disclosures.forEach((e) => {
            sections$c[this.id].push(new HoverDisclosure(e));
          });
      },
      onBlockSelect(e) {
        sections$c[this.id].forEach((t) => {
          "function" == typeof t.onBlockSelect && t.onBlockSelect(e);
        });
      },
      onBlockDeselect(e) {
        sections$c[this.id].forEach((t) => {
          "function" == typeof t.onBlockDeselect && t.onBlockDeselect(e);
        });
      },
    },
    selectors$o = { count: "data-cart-count" };
  class Totals {
    constructor(e) {
      (this.section = e),
        (this.counts = this.section.querySelectorAll(`[${selectors$o.count}]`)),
        (this.cart = null),
        this.listen();
    }
    listen() {
      document.addEventListener(
        "theme:cart:change",
        function (e) {
          (this.cart = e.detail.cart), this.update();
        }.bind(this)
      );
    }
    update() {
      this.cart &&
        this.counts.forEach((e) => {
          e.setAttribute(selectors$o.count, this.cart.item_count),
            (e.innerHTML = `${this.cart.item_count}`);
        });
    }
  }
  const headerTotals = {
      onLoad() {
        new Totals(this.container);
      },
    },
    selectors$p = {
      saleClass: "sale",
      soldClass: "sold-out",
      doubleImage: "double__image",
    };
  function formatPrices(e) {
    const t = e.price <= e.compare_at_price_min;
    let s = t ? selectors$p.saleClass : "";
    if (
      ((s += e.available ? "" : selectors$p.soldClass),
      (e.price = themeCurrency.formatMoney(e.price, theme.moneyFormat)),
      (e.price_with_from = e.price),
      e.price_varies)
    ) {
      let t = themeCurrency.formatMoney(e.price_min, theme.moneyFormat);
      e.price_with_from = `<small>${window.theme.strings.from}</small> ${t}`;
    }
    let i = "";
    void 0 !== e.media && e.media.length > 1 && (i += selectors$p.doubleImage);
    return {
      ...e,
      classes: s,
      on_sale: t,
      double_class: i,
      sold_out: !e.available,
      sold_out_translation: window.theme.strings.soldOut,
      compare_at_price: themeCurrency.formatMoney(
        e.compare_at_price,
        theme.moneyFormat
      ),
      compare_at_price_max: themeCurrency.formatMoney(
        e.compare_at_price_max,
        theme.moneyFormat
      ),
      compare_at_price_min: themeCurrency.formatMoney(
        e.compare_at_price_min,
        theme.moneyFormat
      ),
      price_max: themeCurrency.formatMoney(e.price_max, theme.moneyFormat),
      price_min: themeCurrency.formatMoney(e.price_min, theme.moneyFormat),
    };
  }
  const selectors$q = {
    append: "[data-predictive-search-append]",
    input: "data-predictive-search-input",
    productTemplate: "[product-grid-item-template]",
    productWrapper: "[data-product-wrap]",
    productWrapperOuter: "[data-product-wrap-outer]",
    titleTemplate: "[data-predictive-search-title-template]",
    titleWrapper: "[data-search-title-wrap]",
    dirtyClass: "dirty",
    loadingClass: "is-loading",
    searchPopdown: "search-popdown",
  };
  class SearchPredictive {
    constructor(e) {
      (this.input = e), (this.key = this.input.getAttribute(selectors$q.input));
      const t = `[id='${this.key}']`;
      (this.append = document.querySelector(t)),
        (this.productTemplate = document.querySelector(
          selectors$q.productTemplate
        ).innerHTML),
        (this.titleTemplate = document.querySelector(
          selectors$q.titleTemplate
        ).innerHTML),
        (this.titleWrapper = document.querySelector(selectors$q.titleWrapper)),
        (this.productWrapper = this.append.querySelector(
          selectors$q.productWrapper
        )),
        (this.productWrapperOuter = this.append.querySelector(
          selectors$q.productWrapperOuter
        )),
        (this.popdown = document.getElementById(selectors$q.searchPopdown)),
        (this.result = null),
        (this.accessibility = a11y),
        this.initSearch();
    }
    initSearch() {
      this.input.addEventListener(
        "input",
        debounce(
          function (e) {
            const t = e.target.value;
            t && t.length > 1
              ? (this.productWrapperOuter.classList.add(
                  selectors$q.loadingClass
                ),
                this.render(t))
              : (this.reset(),
                this.append.classList.remove(selectors$q.dirtyClass));
          }.bind(this),
          300
        )
      ),
        this.input.addEventListener("clear", this.reset.bind(this));
    }
    render(e) {
      fetch(
        `/search/suggest.json?q=${encodeURIComponent(
          e
        )}&resources[type]=product&resources[limit]=8&resources[options][unavailable_products]=last`
      )
        .then(this.handleErrors)
        .then((e) => e.json())
        .then(
          (e) => (
            console.log(e),
            (this.result = e.resources.results),
            this.fetchProducts(e.resources.results.products)
          )
        )
        .then((t) => {
          this.injectTitle(e),
            setTimeout(() => {
              this.reset(!1),
                this.productWrapperOuter.classList.remove(
                  selectors$q.loadingClass
                ),
                this.injectProduct(t),
                this.append.classList.add(selectors$q.dirtyClass),
                this.accessibility.trapFocus(this.popdown),
                this.input.focus();
            }, 1e3);
        })
        .catch((e) => {
          console.error(e);
        });
    }
    reset(e = !0) {
      (this.productWrapper.innerHTML = ""),
        this.append.classList.remove(selectors$q.dirtyClass),
        (this.input.val = ""),
        this.accessibility.removeTrapFocus(),
        e &&
          ((this.titleWrapper.innerHTML = ""),
          this.popdown.classList.remove("results-visible"));
    }
    injectTitle(e) {
      let t = window.theme.strings.noResultsFor,
        s = "";
      this.result &&
        this.result.products.length > 0 &&
        ((s = this.result.products.length),
        (t = window.theme.strings.resultsFor)),
        this.popdown.classList.add("results-visible"),
        (this.titleWrapper.innerHTML = Sqrl.render(this.titleTemplate, {
          count: s,
          title: t,
          query: e,
        }));
    }
    injectProduct(e) {
      this.productWrapper.innerHTML += e;
    }
    fetchProducts(e) {
      const t = [];
      return (
        e.forEach((e) => {
          t.push(
            fetchProduct(e.handle).then((e) => {
              const t = formatPrices(e);
              return this.renderProduct(t);
            })
          );
        }),
        Promise.all(t).then((e) => {
          let t = "";
          return (
            e.forEach((e) => {
              t += e;
            }),
            t
          );
        })
      );
    }
    renderProduct(e) {
      let t = null,
        s = null,
        i = "",
        o = "";
      void 0 !== e.media && ((t = e.media[0]), (s = e.media[1])),
        (i = t
          ? {
              thumb: themeImages.getSizedImageUrl(
                t.preview_image.src,
                "800x800"
              ),
              alt: t.preview_image.src,
            }
          : { thumb: window.theme.assets.no_image, alt: "" }),
        s &&
          (o = {
            thumb: themeImages.getSizedImageUrl(s.preview_image.src, "800x800"),
            alt: s.preview_image.src,
          });
      const r = e.title.replace(/(<([^>]+)>)/gi, ""),
        n = { ...e, title: r, image: i, secondImage: o };
      return Sqrl.render(this.productTemplate, { product: n });
    }
    handleErrors(e) {
      return e.ok
        ? e
        : e.json().then(function (t) {
            throw new FetchError({
              status: e.statusText,
              headers: e.headers,
              json: t,
            });
          });
    }
  }
  const selectors$r = {
      body: "body",
      popdownTrigger: "data-popdown-toggle",
      close: "[data-close-popdown]",
      input: "[data-predictive-search-input]",
    },
    classes$b = { isVisible: "is-visible" };
  let sections$d = {};
  class SearchPopdownTriggers {
    constructor(e) {
      (this.trigger = e),
        (this.key = this.trigger.getAttribute(selectors$r.popdownTrigger)),
        (this.search = null);
      const t = `[id='${this.key}']`;
      (this.document = document),
        (this.popdown = document.querySelector(t)),
        (this.input = this.popdown.querySelector(selectors$r.input)),
        (this.close = this.popdown.querySelector(selectors$r.close)),
        (this.body = document.querySelector(selectors$r.body)),
        (this.accessibility = a11y),
        this.initTriggerEvents(),
        this.initPopdownEvents();
    }
    initTriggerEvents() {
      this.trigger.setAttribute("aria-haspopup", !0),
        this.trigger.setAttribute("aria-expanded", !1),
        this.trigger.setAttribute("aria-controls", this.key),
        this.trigger.addEventListener("click", (e) => {
          e.preventDefault(),
            this.body.classList.contains("is-focused") || this.showPopdown();
        }),
        this.trigger.addEventListener("keyup", (e) => {
          (e.which !== window.theme.keyboardKeys.SPACE &&
            e.which !== window.theme.keyboardKeys.ENTER) ||
            !this.body.classList.contains("is-focused") ||
            this.showPopdown();
        });
    }
    initPopdownEvents() {
      (this.search = new SearchPredictive(this.input)),
        this.popdown.addEventListener(
          "keyup",
          function (e) {
            e.which === window.theme.keyboardKeys.ESCAPE && this.hidePopdown();
          }.bind(this)
        ),
        this.close.addEventListener(
          "click",
          function () {
            this.hidePopdown();
          }.bind(this)
        ),
        this.document.addEventListener("click", (e) => {
          const t = e.target,
            s = !(
              t.matches(`[${selectors$r.popdownTrigger}]`) ||
              t.closest(`[${selectors$r.popdownTrigger}]`)
            ),
            i = !(t.matches(`#${this.key}`) || t.closest(`#${this.key}`));
          s &&
            i &&
            this.popdown.classList.contains(classes$b.isVisible) &&
            this.hidePopdown();
        });
    }
    hidePopdown() {
      this.popdown.classList.remove(classes$b.isVisible),
        this.input.form.reset(),
        this.input.dispatchEvent(new CustomEvent("clear", { bubbles: !1 })),
        this.accessibility.removeTrapFocus(),
        document.dispatchEvent(
          new CustomEvent("theme:scroll:unlock", { bubbles: !0 })
        ),
        this.body.classList.contains("is-focused") &&
          setTimeout(() => {
            this.trigger.focus();
          }, 200);
    }
    showPopdown() {
      document.dispatchEvent(
        new CustomEvent("theme:drawer:close", { bubbles: !1 })
      ),
        document.dispatchEvent(
          new CustomEvent("theme:scroll:lock", {
            bubbles: !0,
            detail: this.popdown,
          })
        ),
        this.popdown.classList.add(classes$b.isVisible);
      const e = this.input.value;
      (this.input.value = ""),
        (this.input.value = e),
        this.accessibility.trapFocus(this.popdown),
        this.input.focus();
    }
  }
  const searchPopdown = {
      onLoad() {
        sections$d[this.id] = [];
        this.container
          .querySelectorAll(`[${selectors$r.popdownTrigger}]`)
          .forEach((e) => {
            sections$d[this.id].push(new SearchPopdownTriggers(e));
          });
      },
    },
    selectors$s = {
      slideruleOpen: "data-sliderule-open",
      slideruleClose: "data-sliderule-close",
      sliderulePane: "data-sliderule-pane",
      slideruleWrappper: "[data-sliderule]",
      focusable:
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      children:
        ":scope > [data-animates], \n             :scope > * > [data-animates], \n             :scope > * > * >[data-animates],\n             :scope > * > .sliderule-grid  > *",
    },
    classes$c = { isVisible: "is-visible" };
  let sections$e = {};
  class HeaderMobileSliderule {
    constructor(e) {
      (this.sliderule = e),
        (this.wrapper = e.closest(selectors$s.wrapper)),
        (this.key = this.sliderule.id);
      const t = `[${selectors$s.slideruleOpen}='${this.key}']`,
        s = `[${selectors$s.slideruleClose}='${this.key}']`;
      (this.trigger = document.querySelector(t)),
        (this.exit = document.querySelector(s)),
        (this.pane = document.querySelector(`[${selectors$s.sliderulePane}]`)),
        (this.children = this.sliderule.querySelectorAll(selectors$s.children)),
        this.trigger.setAttribute("aria-haspopup", !0),
        this.trigger.setAttribute("aria-expanded", !1),
        this.trigger.setAttribute("aria-controls", this.key),
        this.clickEvents(),
        this.staggerChildAnimations(),
        document.addEventListener(
          "theme:sliderule:close",
          this.closeSliderule.bind(this)
        );
    }
    clickEvents() {
      this.trigger.addEventListener(
        "click",
        function () {
          this.showSliderule();
        }.bind(this)
      ),
        this.exit.addEventListener(
          "click",
          function () {
            this.hideSliderule();
          }.bind(this)
        );
    }
    keyboardEvents() {
      this.trigger.addEventListener(
        "keyup",
        function (e) {
          e.which === window.theme.keyboardKeys.SPACE && this.showSliderule();
        }.bind(this)
      ),
        this.sliderule.addEventListener(
          "keyup",
          function (e) {
            e.which === window.theme.keyboardKeys.ESCAPE &&
              (this.hideSliderule(), this.buttons[0].focus());
          }.bind(this)
        );
    }
    staggerChildAnimations() {
      this.children.forEach((e, t) => {
        e.style.transitionDelay = 50 * t + 10 + "ms";
      });
    }
    hideSliderule() {
      this.sliderule.classList.remove(classes$c.isVisible),
        this.children.forEach((e) => {
          e.classList.remove(classes$c.isVisible);
        });
      const e = parseInt(this.pane.dataset.sliderulePane, 10) - 1;
      this.pane.setAttribute(selectors$s.sliderulePane, e);
    }
    showSliderule() {
      this.sliderule.classList.add(classes$c.isVisible),
        this.children.forEach((e) => {
          e.classList.add(classes$c.isVisible);
        });
      const e = parseInt(this.pane.dataset.sliderulePane, 10) + 1;
      this.pane.setAttribute(selectors$s.sliderulePane, e);
    }
    closeSliderule() {
      this.pane &&
        this.pane.hasAttribute(selectors$s.sliderulePane) &&
        parseInt(this.pane.getAttribute(selectors$s.sliderulePane)) > 0 &&
        (this.hideSliderule(),
        parseInt(this.pane.getAttribute(selectors$s.sliderulePane)) > 0 &&
          this.pane.setAttribute(selectors$s.sliderulePane, 0));
    }
  }
  const headerMobileSliderule = {
      onLoad() {
        sections$e[this.id] = [];
        this.container
          .querySelectorAll(selectors$s.slideruleWrappper)
          .forEach((e) => {
            sections$e[this.id].push(new HeaderMobileSliderule(e));
          });
      },
    },
    selectors$t = {
      wrapper: "[data-header-wrapper]",
      style: "data-header-style",
      widthContentWrapper: "[data-takes-space-wrapper]",
      widthContent: "[data-child-takes-space]",
      desktop: "[data-header-desktop]",
      cloneClass: "js__header__clone",
      showMobileClass: "js__show__mobile",
      backfill: "[data-header-backfill]",
      transparent: "data-header-transparent",
      overrideBorder: "header-override-border",
      firstSectionHasImage:
        ".main-content > .shopify-section:first-child [data-overlay-header]",
      deadLink: '.navlink[href="#"]',
    };
  let sections$f = {};
  class Header {
    constructor(e) {
      (this.wrapper = e),
        (this.style = this.wrapper.dataset.style),
        (this.desktop = this.wrapper.querySelector(selectors$t.desktop)),
        (this.transparent =
          "false" !== this.wrapper.getAttribute(selectors$t.transparent)),
        (this.overlayedImages = document.querySelectorAll(
          selectors$t.firstSectionHasImage
        )),
        (this.deadLinks = document.querySelectorAll(selectors$t.deadLink)),
        (this.resizeEventWidth = () => this.checkWidth()),
        (this.resizeEventOverlay = () => this.subtractAnnouncementHeight()),
        this.killDeadLinks(),
        "drawer" !== this.style &&
          this.desktop &&
          ((this.minWidth = this.getMinWidth()), this.listenWidth()),
        this.checkForImage(),
        window.dispatchEvent(new Event("resize"));
    }
    unload() {
      document.removeEventListener("theme:resize", this.resizeEventWidth),
        document.removeEventListener("theme:resize", this.resizeEventOverlay);
    }
    checkForImage() {
      this.overlayedImages.length > 0 && this.transparent
        ? ((document.querySelector(selectors$t.backfill).style.display =
            "none"),
          this.listenOverlay())
        : this.wrapper.setAttribute(selectors$t.transparent, !1),
        this.overlayedImages.length > 0 &&
          !this.transparent &&
          (this.wrapper.classList.add(selectors$t.overrideBorder),
          this.subtractHeaderHeight());
    }
    listenOverlay() {
      document.addEventListener("theme:resize", this.resizeEventOverlay),
        this.subtractAnnouncementHeight();
    }
    listenWidth() {
      document.addEventListener("theme:resize", this.resizeEventWidth),
        this.checkWidth();
    }
    killDeadLinks() {
      this.deadLinks.forEach((e) => {
        e.onclick = (e) => {
          e.preventDefault();
        };
      });
    }
    subtractAnnouncementHeight() {
      const {
        windowHeight: e,
        announcementHeight: t,
        headerHeight: s,
      } = readHeights();
      this.overlayedImages.forEach((i) => {
        i.style.setProperty("--full-screen", e - t + "px"),
          i.style.setProperty("--header-padding", `${s}px`),
          i.classList.add("has-overlay");
      });
    }
    subtractHeaderHeight() {
      const { windowHeight: e, headerHeight: t } = readHeights();
      this.overlayedImages.forEach((s) => {
        s.style.setProperty("--full-screen", e - t + "px");
      });
    }
    checkWidth() {
      document.body.clientWidth < this.minWidth
        ? this.wrapper.classList.add(selectors$t.showMobileClass)
        : this.wrapper.classList.remove(selectors$t.showMobileClass);
    }
    getMinWidth() {
      const e = this.wrapper.cloneNode(!0);
      e.classList.add(selectors$t.cloneClass), document.body.appendChild(e);
      const t = e.querySelectorAll(selectors$t.widthContentWrapper);
      let s = 0,
        i = 0;
      return (
        t.forEach((e) => {
          const t = e.querySelectorAll(selectors$t.widthContent);
          let o = 0;
          (o = 3 === t.length ? _sumSplitWidths(t) : _sumWidths(t)),
            o > s && ((s = o), (i = 20 * t.length));
        }),
        document.body.removeChild(e),
        s + i
      );
    }
  }
  function _sumSplitWidths(e) {
    let t = [];
    e.forEach((e) => {
      e.firstElementChild && t.push(e.firstElementChild.clientWidth);
    }),
      t[0] > t[2] ? (t[2] = t[0]) : (t[0] = t[2]);
    return t.reduce((e, t) => e + t);
  }
  function _sumWidths(e) {
    let t = 0;
    return (
      e.forEach((e) => {
        t += e.clientWidth;
      }),
      t
    );
  }
  const header = {
    onLoad() {
      sections$f = new Header(this.container);
    },
    onUnload() {
      "function" == typeof sections$f.unload && sections$f.unload();
    },
  };
  register("header", [
    header,
    drawer,
    popoutSection,
    headerMobileSliderule,
    stickyHeader,
    hoverDisclosure,
    headerTotals,
    searchPopdown,
  ]),
    register("look", [
      slider,
      productGridReviews,
      quickAddProduct,
      swatchGridSection,
    ]),
    register("product-grid", [
      productGridReviews,
      slider,
      quickAddProduct,
      swatchGridSection,
    ]);
  const selectors$u = {
      productSlideshow: "[data-product-slideshow]",
      productThumbs: "[data-product-thumbs]",
      dataTallLayout: "data-tall-layout",
      dataType: "data-type",
      dataMediaId: "data-media-id",
      dataThumb: "data-thumb",
      dataThumbIndex: "data-thumb-index",
      ariaLabel: "aria-label",
      dataThumbnail: "[data-thumbnail]",
      productSlideThumb: ".js-product-slide-thumb",
      classSelected: "is-selected",
      classMediaHidden: "media--hidden",
      sliderEnabled: "flickity-enabled",
      focusEnabled: "is-focused",
      mobileThumbsSliderEnable: "data-mobile-thumbs-slider",
      thumbsSlider: "[data-thumbs-slider]",
    },
    thumbIcons = {
      model:
        '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-media-model" viewBox="0 0 26 26"><path d="M1 25h24V1H1z"/><path class="icon-media-model-outline" d="M.5 25v.5h25V.5H.5z" fill="none"/><path class="icon-media-model-element" d="M19.13 8.28L14 5.32a2 2 0 0 0-2 0l-5.12 3a2 2 0 0 0-1 1.76V16a2 2 0 0 0 1 1.76l5.12 3a2 2 0 0 0 2 0l5.12-3a2 2 0 0 0 1-1.76v-6a2 2 0 0 0-.99-1.72zm-6.4 11.1l-5.12-3a.53.53 0 0 1-.26-.38v-6a.53.53 0 0 1 .27-.46l5.12-3a.53.53 0 0 1 .53 0l5.12 3-4.72 2.68a1.33 1.33 0 0 0-.67 1.2v6a.53.53 0 0 1-.26 0z" opacity=".6" style="isolation:isolate"/></svg>',
      video:
        '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-media-video" viewBox="0 0 26 26"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 25h24V1H1v24z"/><path class="icon-media-video-outline" d="M.5 25v.5h25V.5H.5V25z"/><path class="icon-media-video-element" fill-rule="evenodd" clip-rule="evenodd" d="M9.718 6.72a1 1 0 0 0-1.518.855v10.736a1 1 0 0 0 1.562.827l8.35-5.677a1 1 0 0 0-.044-1.682l-8.35-5.06z" opacity=".6"/></svg>',
    };
  class InitSlider {
    constructor(e) {
      (this.container = e.container),
        (this.tallLayout =
          "true" === this.container.getAttribute(selectors$u.dataTallLayout)),
        (this.mobileThumbsSlider =
          "true" ===
          this.container.getAttribute(selectors$u.mobileThumbsSliderEnable)),
        (this.slideshow = this.container.querySelector(
          selectors$u.productSlideshow
        )),
        (this.thumbs = this.container.querySelector(selectors$u.productThumbs)),
        (this.mobileSliderEnable =
          "true" ===
          this.container.getAttribute(selectors$u.mobileSliderEnable)),
        (this.flkty = null),
        (this.flktyThumbs = null),
        (this.thumbsSlider = null),
        this.init();
    }
    init() {
      this.tallLayout
        ? (this.initSliderMobile(),
          document.addEventListener("theme:resize", () => {
            this.initSliderMobile();
          }))
        : this.createSlider();
    }
    initSliderMobile() {
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) < theme.variables.mediaQuerySmall
        ? this.createSlider()
        : this.destroySlider();
    }
    destroySlider() {
      this.slideshow.classList.contains(selectors$u.sliderEnabled) &&
        this.flkty.destroy(),
        this.thumbs && !this.mobileThumbsSlider && (this.thumbs.innerHTML = ""),
        null !== this.flktyThumbs &&
          (this.flktyThumbs.destroy(), (this.flktyThumbs = null));
    }
    createSlider() {
      if (!this.slideshow) return;
      const e = this,
        t = this.slideshow.querySelectorAll(`[${selectors$u.dataType}]`)[0];
      let s = {
        autoPlay: !1,
        prevNextButtons: !1,
        contain: !0,
        pageDots: !1,
        adaptiveHeight: !0,
        wrapAround: !0,
        fade: !0,
        on: {
          ready: function () {
            e.sliderThumbs(this);
          },
        },
      };
      if (
        ((this.flkty = new FlickityFade(this.slideshow, s)),
        this.flkty.resize(),
        t)
      ) {
        const e = t.getAttribute(selectors$u.dataType);
        ("model" !== e && "video" !== e && "external_video" !== e) ||
          ((this.flkty.options.draggable = !1), this.flkty.updateDraggable());
      }
      this.flkty.on("change", function (t) {
        let s = t;
        if (e.thumbs) {
          const i = e.thumbs.querySelector(`.${selectors$u.classSelected}`),
            o = e.thumbs.querySelector(
              `.thumb [${selectors$u.dataThumbIndex}="${t}"]`
            );
          i &&
            ((s = Array.from(i.parentElement.children).indexOf(i)),
            i.classList.remove(selectors$u.classSelected)),
            o && o.parentElement.classList.add(selectors$u.classSelected);
        }
        const i = this.cells[s].element,
          o = this.selectedElement;
        i.dispatchEvent(new CustomEvent("mediaHidden")),
          o.classList.remove(selectors$u.classMediaHidden);
      }),
        this.flkty.on("settle", function () {
          const t = this.selectedElement,
            s = Array.prototype.filter.call(
              t.parentNode.children,
              function (e) {
                return e !== t;
              }
            ),
            i = t.getAttribute(selectors$u.dataType),
            o = document.body.classList.contains(selectors$u.focusEnabled);
          "model" === i || "video" === i || "external_video" === i
            ? ((e.flkty.options.draggable = !1), e.flkty.updateDraggable())
            : ((e.flkty.options.draggable = !0), e.flkty.updateDraggable()),
            o && t.dispatchEvent(new Event("focus")),
            s.length &&
              s.forEach((e) => {
                e.classList.add(selectors$u.classMediaHidden);
              }),
            t.dispatchEvent(new CustomEvent("mediaVisible"));
        }),
        e.container.addEventListener("click", function (t) {
          const s = t.target;
          if (
            s.matches(selectors$u.productSlideThumb) ||
            s.closest(selectors$u.productSlideThumb)
          ) {
            t.preventDefault();
            let i,
              o = 0;
            (i = s.matches(selectors$u.productSlideThumb)
              ? s
              : s.closest(selectors$u.productSlideThumb)),
              (o = parseInt(i.getAttribute(selectors$u.dataThumbIndex))),
              e.flkty.select(o),
              e.mobileThumbsSlider &&
                null !== e.flktyThumbs &&
                e.flktyThumbs.select(o);
          }
        });
    }
    createThumbSlider() {
      const e = {
        autoPlay: !1,
        prevNextButtons: !1,
        contain: !0,
        pageDots: !1,
        adaptiveHeight: !1,
        wrapAround: !1,
      };
      let t =
        (window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth) < theme.variables.mediaQuerySmall;
      this.thumbsSlider = this.container.querySelector(
        selectors$u.thumbsSlider
      );
      const s = () => {
        (this.flktyThumbs = new FlickityFade(this.thumbsSlider, e)),
          this.flktyThumbs.resize();
      };
      t && s(),
        document.addEventListener("theme:resize", () => {
          (t =
            (window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth) < theme.variables.mediaQuerySmall),
            t
              ? s()
              : null !== this.flktyThumbs &&
                (this.flktyThumbs.destroy(), (this.flktyThumbs = null));
        });
    }
    sliderThumbs(e) {
      const t = e.slides;
      if (this.thumbs && t.length) {
        let e = "";
        t.forEach((t, s) => {
          const i = t.cells[0].element,
            o = i.getAttribute(selectors$u.dataType),
            r = i.getAttribute(selectors$u.dataMediaId),
            n = i.getAttribute(selectors$u.dataThumb);
          let a = "";
          const l = thumbIcons[o] ? thumbIcons[o] : "";
          let c = "";
          i.querySelector(`[${selectors$u.ariaLabel}]`) &&
            (a = i
              .querySelector(`[${selectors$u.ariaLabel}]`)
              .getAttribute(selectors$u.ariaLabel)),
            "" === a &&
              i.hasAttribute(selectors$u.ariaLabel) &&
              (a = i.getAttribute(selectors$u.ariaLabel)),
            i.setAttribute("tabindex", "-1"),
            i.classList.contains(selectors$u.classSelected) &&
              (c = selectors$u.classSelected),
            (e += `<div class="thumb ${c}"><a href="${n}" class="thumb--${o} js-product-slide-thumb" data-thumb-index="${s}" data-thumbnail data-media-id="${r}"><img alt="${a}" src="${n}">${l}</a></div>`);
        }),
          "" !== e &&
            ((e = `<div class="thumbs-holder" data-thumbs-slider>${e}</div>`),
            (this.thumbs.innerHTML = e),
            this.mobileThumbsSlider && this.createThumbSlider());
      }
      const s = this.container.querySelectorAll(selectors$u.dataThumbnail);
      s.length &&
        s.forEach((t) => {
          t.addEventListener("click", function (e) {
            e.preventDefault();
          }),
            t.addEventListener("keyup", function (t) {
              if (13 === t.keyCode) {
                const t = this.getAttribute(selectors$u.dataMediaId),
                  s = e.element
                    .querySelector(`[${selectors$u.dataMediaId}="${t}"]`)
                    .querySelectorAll(
                      'model-viewer, video, iframe, button, [href], input, [tabindex]:not([tabindex="-1"])'
                    )[0];
                s &&
                  (s.dispatchEvent(new Event("focus")),
                  s.dispatchEvent(new Event("select")));
              }
            });
        });
    }
  }
  const selectors$v = {
      zoomWrapper: "[data-zoom-wrapper]",
      dataImageSrc: "data-image-src",
      dataImageWidth: "data-image-width",
      dataImageHeight: "data-image-height",
      dataImageZoomEnable: "data-image-zoom-enable",
      thumbs: ".pswp__thumbs",
      caption: "[data-zoom-caption]",
    },
    classes$d = {
      variantSoldOut: "variant--soldout",
      variantUnavailable: "variant--unavailabe",
      popupThumb: "pswp__thumb",
      popupClass: "pswp-zoom-gallery",
      popupClassNoThumbs: "pswp-zoom-gallery--single",
    };
  class Zoom {
    constructor(e) {
      (this.container = e.container),
        (this.zoomWrappers = this.container.querySelectorAll(
          selectors$v.zoomWrapper
        )),
        (this.thumbsContainer = document.querySelector(selectors$v.thumbs)),
        (this.zoomCaptionElem = this.container.querySelector(
          selectors$v.caption
        )),
        (this.zoomEnable =
          "true" ===
          this.container.getAttribute(selectors$v.dataImageZoomEnable)),
        this.zoomEnable && this.init();
    }
    init() {
      const e = this;
      this.zoomWrappers.length &&
        this.zoomWrappers.forEach((t, s) => {
          t.addEventListener("click", function (t) {
            t.preventDefault(), e.createZoom(s);
          }),
            t.addEventListener("keyup", function (t) {
              13 === t.keyCode && (t.preventDefault(), e.createZoom(s));
            });
        });
    }
    createZoom(e) {
      const t = this;
      let s = [],
        i = 0,
        o = "";
      this.zoomWrappers.forEach((r) => {
        const n = r.getAttribute(selectors$v.dataImageSrc),
          a = parseInt(r.getAttribute(selectors$v.dataImageWidth)),
          l = parseInt(r.getAttribute(selectors$v.dataImageHeight));
        if (
          (s.push({ src: n, w: a, h: l, msrc: n }),
          (o += `<a href="#" class="${classes$d.popupThumb}" style="background-image: url('${n}')"></a>`),
          (i += 1),
          t.zoomWrappers.length === i)
        ) {
          let r = `${classes$d.popupClass}`;
          1 === i &&
            (r = `${classes$d.popupClass} ${classes$d.popupClassNoThumbs}`);
          new LoadPhotoswipe(s, {
            history: !1,
            focus: !1,
            index: e,
            mainClass: r,
            showHideOpacity: !0,
            howAnimationDuration: 150,
            hideAnimationDuration: 250,
            closeOnScroll: !1,
            closeOnVerticalDrag: !1,
            captionEl: !0,
            closeEl: !0,
            closeElClasses: ["caption-close"],
            tapToClose: !1,
            clickToCloseNonZoomable: !1,
            maxSpreadZoom: 2,
            loop: !0,
            spacing: 0,
            allowPanToNext: !0,
            pinchToClose: !1,
            addCaptionHTMLFn: function (e, s, i) {
              t.zoomCaption(e, s, i);
            },
            getThumbBoundsFn: function () {
              const s = t.zoomWrappers[e],
                i = window.pageYOffset || document.documentElement.scrollTop,
                o = s.getBoundingClientRect();
              return { x: o.left, y: o.top + i, w: o.width };
            },
          }),
            t.thumbsContainer && "" !== o && (t.thumbsContainer.innerHTML = o);
        }
      });
    }
    zoomCaption(e, t) {
      let s = "";
      const i = t.children[0];
      return (
        this.zoomCaptionElem &&
          ((s = this.zoomCaptionElem.innerHTML),
          this.zoomCaptionElem.closest(`.${classes$d.variantSoldOut}`)
            ? i.classList.add(classes$d.variantSoldOut)
            : i.classList.remove(classes$d.variantSoldOut),
          this.zoomCaptionElem.closest(`.${classes$d.variantUnavailable}`)
            ? i.classList.add(classes$d.variantUnavailable)
            : i.classList.remove(classes$d.variantUnavailable)),
        (i.innerHTML = s),
        !1
      );
    }
  }
  const selectors$w = {
    videoPlayer: "[data-video]",
    modelViewer: "[data-model]",
    dataType: "data-type",
    dataMediaId: "data-media-id",
    dataVideoLooping: "data-video-looping",
    dataYoutubeId: "data-youtube-id",
    productMediaWrapper: "[data-product-single-media-wrapper]",
    productMediaContainer: "[data-product-single-media-group]",
    classMediaHidden: "media--hidden",
  };
  theme.mediaInstances = {};
  class Video {
    constructor(e) {
      (this.section = e),
        (this.container = e.container),
        (this.id = e.id),
        (this.players = {}),
        this.init();
    }
    init() {
      const e = this.container.querySelectorAll(selectors$w.videoPlayer);
      let t = !1,
        s = !1;
      for (let i = 0; i < e.length; i++) {
        const o = e[i].getAttribute("id"),
          r = e[i].getAttribute(selectors$w.dataType),
          n = e[i].getAttribute(selectors$w.dataMediaId);
        if (
          ((this.players[o] = {}),
          (this.players[o].id = o),
          (this.players[o].type = r),
          (this.players[o].mediaId = n),
          (this.players[o].container = e[i]),
          (this.players[o].element = e[i].querySelector("iframe, video")),
          !this.players[o].element)
        )
          return;
        if ("external_video" === r) {
          const s = e[i].getAttribute(selectors$w.dataYoutubeId);
          (this.players[o].externalID = s), (t = !0);
        } else "video" === r && (s = !0);
      }
      if (s)
        if (window.isPlyrLoaded) this.nativeInitCallback();
        else {
          loadScript({ name: "video-ui", version: "1.0" }).then(() =>
            this.nativeInitCallback()
          );
        }
      t &&
        (window.isYoutubeAPILoaded
          ? this.youTubeInitCallback()
          : loadScript({ url: "https://www.youtube.com/iframe_api" }).then(() =>
              this.youTubeInitCallback()
            ));
    }
    youTubeInitCallback() {
      for (const e in this.players)
        if ("external_video" === this.players[e].type) {
          const t = this.players[e],
            s =
              "true" ===
              this.players[e].container
                .closest(`[${selectors$w.dataVideoLooping}]`)
                .getAttribute(selectors$w.dataVideoLooping),
            i = {
              ...{
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
                  wmode: "opaque",
                },
                events: {
                  onStateChange: (e) => {
                    0 === e.data && s && e.target.seekTo(0);
                    const t = e.target
                      .getIframe()
                      .closest(`[${selectors$w.dataMediaId}]`);
                    let i = "";
                    t && (i = t.getAttribute(selectors$w.dataMediaId)),
                      1 === e.data && this.pauseOtherMedia(i);
                  },
                },
              },
            };
          (i.videoId = t.externalID),
            YT.ready(() => {
              (this.players[e].player = new YT.Player(t.element, i)),
                (window.isYoutubeAPILoaded = !0),
                this.players[e].container.addEventListener("mediaHidden", (e) =>
                  this.onHidden(e, !0)
                ),
                this.players[e].container.addEventListener("xrLaunch", (e) =>
                  this.onHidden(e, !0)
                ),
                this.players[e].container.addEventListener(
                  "mediaVisible",
                  (e) => this.onVisible(e, !0)
                );
            });
        }
    }
    nativeInitCallback() {
      for (const e in this.players)
        if ("video" === this.players[e].type) {
          const t = this.players[e],
            s = {
              loop: {
                active:
                  "true" ===
                  this.players[e].container
                    .closest(`[${selectors$w.dataVideoLooping}]`)
                    .getAttribute(selectors$w.dataVideoLooping),
              },
              focusOnPlay: !0,
            };
          (this.players[e].player = new Shopify.Plyr(t.element, s)),
            t.element.addEventListener("play", (e) => {
              const t = e.target.closest(`[${selectors$w.dataMediaId}]`);
              let s = "";
              t && (s = t.getAttribute(selectors$w.dataMediaId)),
                this.pauseOtherMedia(s);
            }),
            (window.isPlyrLoaded = !0),
            this.players[e].container.addEventListener("mediaHidden", (e) =>
              this.onHidden(e, !1)
            ),
            this.players[e].container.addEventListener("xrLaunch", (e) =>
              this.onHidden(e, !1)
            ),
            this.players[e].container.addEventListener("mediaVisible", (e) =>
              this.onVisible(e, !1)
            );
        }
    }
    onHidden(e, t = !1) {
      if (void 0 !== e.target.dataset.playerId) {
        const s = e.target.dataset.playerId,
          i = this.players[s];
        !0 === t && i.player && i.player.pauseVideo
          ? i.player.pauseVideo()
          : i.player && i.player.pause && i.player.pause();
      }
    }
    onVisible(e, t = !1) {
      if (!window.theme.touched && void 0 !== e.target.dataset.playerId) {
        const s = e.target.dataset.playerId,
          i = this.players[s];
        !0 === t && i.player && i.player.playVideo
          ? i.player.playVideo()
          : i.player && i.player.play && i.player.play();
      }
    }
    pauseOtherMedia(e) {
      const t = `[${selectors$w.dataMediaId}="${e}"]`,
        s = document.querySelector(`${selectors$w.productMediaWrapper}${t}`),
        i = document.querySelectorAll(
          `${selectors$w.productMediaWrapper}:not(${t})`
        );
      s.classList.remove(selectors$w.classMediaHidden),
        i.length &&
          i.forEach((e) => {
            e.dispatchEvent(new CustomEvent("mediaHidden")),
              e.classList.add(selectors$w.classMediaHidden);
          });
    }
  }
  theme.mediaInstances = {};
  const selectors$x = {
    videoPlayer: "[data-video]",
    modelViewer: "[data-model]",
    sliderEnabled: "flickity-enabled",
    classMediaHidden: "media--hidden",
  };
  class Media {
    constructor(e) {
      (this.section = e), (this.id = e.id), (this.container = e.container);
    }
    init() {
      new Video(this.section),
        this.detect3d(),
        this.launch3d(),
        new Zoom(this.section),
        new InitSlider(this.section);
    }
    detect3d() {
      const e = this.container.querySelectorAll(selectors$x.modelViewer);
      e.length &&
        e.forEach((e) => {
          theme.ProductModel.init(e, this.id);
        });
    }
    launch3d() {
      const e = this;
      document.addEventListener("shopify_xr_launch", function () {
        e.container
          .querySelector(
            `${e.selectors.modelViewer}:not(.${selectors$x.classMediaHidden})`
          )
          .dispatchEvent(new CustomEvent("xrLaunch"));
      });
    }
  }
  const selectors$y = {
      product: "[data-product]",
      productForm: "[data-product-form]",
      addToCart: "[data-add-to-cart]",
      addToCartText: "[data-add-to-cart-text]",
      comparePrice: "[data-compare-price]",
      comparePriceText: "[data-compare-text]",
      formWrapper: "[data-form-wrapper]",
      originalSelectorId: "[data-product-select]",
      priceWrapper: "[data-price-wrapper]",
      productSlideshow: "[data-product-slideshow]",
      productImage: "[data-product-image]",
      productJson: "[data-product-json]",
      productPrice: "[data-product-price]",
      unitPrice: "[data-product-unit-price]",
      unitBase: "[data-product-base]",
      unitWrapper: "[data-product-unit]",
      preOrderTag: "_preorder",
      sliderEnabled: "flickity-enabled",
      productSlide: ".product__slide",
      dataTallLayout: "data-tall-layout",
      dataEnableHistoryState: "data-enable-history-state",
      subPrices: "[data-subscription-watch-price]",
      subSelectors: "[data-subscription-selectors]",
      subOffWrap: "[data-price-off]",
      subsToggle: "[data-toggles-group]",
      subsChild: "data-group-toggle",
      subOffAmount: "[data-price-off-amount]",
      subDescription: "[data-plan-description]",
      dataImageId: "data-image-id",
      idInput: '[name="id"]',
    },
    classes$e = {
      hide: "hide",
      variantSoldOut: "variant--soldout",
      variantUnavailable: "variant--unavailabe",
      productPriceSale: "product__price--sale",
    };
  class ProductAddForm {
    constructor(e) {
      if (
        ((this.section = e),
        (this.container = e.container),
        (this.tallLayout =
          "true" === this.container.getAttribute(selectors$y.dataTallLayout)),
        (this.product = this.container.querySelector(selectors$y.product)),
        !this.product)
      )
        return;
      (this.productForm = this.container.querySelector(
        selectors$y.productForm
      )),
        (this.enableHistoryState =
          "true" ===
          this.container.getAttribute(selectors$y.dataEnableHistoryState)),
        (this.hasUnitPricing = this.container.querySelector(
          selectors$y.unitWrapper
        )),
        (this.subSelectors = this.container.querySelector(
          selectors$y.subSelectors
        )),
        (this.subPrices = this.container.querySelector(selectors$y.subPrices));
      new QuantityCounter(this.container).init(), this.init();
    }
    init() {
      let e = null;
      const t = this.container.querySelector(selectors$y.productJson);
      t && (e = t.innerHTML),
        e
          ? ((this.productJSON = JSON.parse(e)), this.linkForm())
          : console.error("Missing product JSON");
    }
    destroy() {
      this.productForm.destroy();
    }
    linkForm() {
      (this.productForm = new ProductForm(this.productForm, this.productJSON, {
        onOptionChange: this.onOptionChange.bind(this),
        onPlanChange: this.onPlanChange.bind(this),
      })),
        this.pushState(this.productForm.getFormState()),
        this.subsToggleListeners();
    }
    onOptionChange(e) {
      this.pushState(e.dataset), this.updateProductImage(e);
    }
    onPlanChange(e) {
      this.subPrices && this.pushState(e.dataset);
    }
    pushState(e) {
      (this.productState = this.setProductState(e)),
        this.updateAddToCartState(e),
        this.updateProductPrices(e),
        this.updateSubscriptionText(e),
        this.enableHistoryState && this.updateHistoryState(e);
    }
    updateAddToCartState(e) {
      const t = e.variant;
      let s = theme.strings.addToCart;
      const i = this.container.querySelectorAll(selectors$y.priceWrapper),
        o = this.container.querySelectorAll(selectors$y.addToCart),
        r = this.container.querySelectorAll(selectors$y.addToCartText),
        n = this.container.querySelectorAll(selectors$y.formWrapper);
      this.productJSON.tags.includes(selectors$y.preOrderTag) &&
        (s = theme.strings.preOrder),
        i.length &&
          t &&
          i.forEach((e) => {
            e.classList.remove(classes$e.hide);
          }),
        o.length &&
          o.forEach((e) => {
            t && t.available ? (e.disabled = !1) : (e.disabled = !0);
          }),
        r.length &&
          r.forEach((e) => {
            t
              ? t.available
                ? (e.innerHTML = s)
                : (e.innerHTML = theme.strings.soldOut)
              : (e.innerHTML = theme.strings.unavailable);
          }),
        n.length &&
          n.forEach((e) => {
            if (t) {
              t.available
                ? e.classList.remove(
                    classes$e.variantSoldOut,
                    classes$e.variantUnavailable
                  )
                : (e.classList.add(classes$e.variantSoldOut),
                  e.classList.remove(classes$e.variantUnavailable));
              const s = e.querySelector(selectors$y.originalSelectorId);
              s && (s.value = t.id);
            } else
              e.classList.add(classes$e.variantUnavailable),
                e.classList.remove(classes$e.variantSoldOut);
          });
    }
    updateHistoryState(e) {
      const t = e.variant,
        s = e.plan,
        i = window.location.href;
      if (t && i.includes("/product")) {
        const e = new window.URL(i),
          o = e.searchParams;
        o.set("variant", t.id),
          s && s.detail && s.detail.id && this.productState.hasPlan
            ? o.set("selling_plan", s.detail.id)
            : o.delete("selling_plan"),
          (e.search = o.toString());
        const r = e.toString();
        window.history.replaceState({ path: r }, "", r);
      }
    }
    getBaseUnit(e) {
      return 1 === e.unit_price_measurement.reference_value
        ? e.unit_price_measurement.reference_unit
        : e.unit_price_measurement.reference_value +
            e.unit_price_measurement.reference_unit;
    }
    subsToggleListeners() {
      this.container.querySelectorAll(selectors$y.subsToggle).forEach((e) => {
        e.addEventListener(
          "change",
          function (e) {
            const t = e.target.value.toString(),
              s = this.container.querySelector(
                `[${selectors$y.subsChild}="${t}"]`
              ),
              i = this.container.querySelectorAll(`[${selectors$y.subsChild}]`);
            if (s) {
              s.classList.remove(classes$e.hide);
              const e = s.querySelector('[name="selling_plan"]');
              (e.checked = !0), e.dispatchEvent(new Event("change"));
            }
            i.forEach((e) => {
              if (e !== s) {
                e.classList.add(classes$e.hide);
                e.querySelectorAll('[name="selling_plan"]').forEach((e) => {
                  (e.checked = !1), e.dispatchEvent(new Event("change"));
                });
              }
            });
          }.bind(this)
        );
      });
    }
    updateSubscriptionText(e) {
      const t = e.plan,
        s = this.container.querySelector(selectors$y.subOffWrap),
        i = this.container.querySelector(selectors$y.subOffAmount),
        o = this.container.querySelector(selectors$y.subDescription);
      if (this.productState.planSale) {
        const e = t.detail.price_adjustments[0],
          o = e.value;
        e && "percentage" === e.value_type
          ? (i.innerHTML = `${o}%`)
          : (i.innerHTML = themeCurrency.formatMoney(o, theme.moneyFormat)),
          s.classList.remove(classes$e.hide);
      } else s.classList.add(classes$e.hide);
      t
        ? ((o.innerHTML = t.detail.description),
          o.classList.remove(classes$e.hide))
        : o && o.classList.add(classes$e.hide);
    }
    updateProductPrices(e) {
      const t = e.variant,
        s = e.plan;
      this.container.querySelectorAll(selectors$y.priceWrapper).forEach((e) => {
        const i = e.querySelector(selectors$y.comparePrice),
          o = e.querySelector(selectors$y.productPrice),
          r = e.querySelector(selectors$y.comparePriceText);
        let n = "",
          a = "";
        this.productState.available &&
          ((n = t.compare_at_price), (a = t.price)),
          this.productState.hasPlan && (a = s.allocation.price),
          this.productState.planSale &&
            ((n = s.allocation.compare_at_price), (a = s.allocation.price)),
          i &&
            (this.productState.onSale || this.productState.planSale
              ? (i.classList.remove(classes$e.hide),
                r.classList.remove(classes$e.hide),
                o.classList.add(classes$e.productPriceSale))
              : (i.classList.add(classes$e.hide),
                r.classList.add(classes$e.hide),
                o.classList.remove(classes$e.productPriceSale)),
            (i.innerHTML = themeCurrency.formatMoney(n, theme.moneyFormat))),
          (o.innerHTML = themeCurrency.formatMoney(a, theme.moneyFormat));
      }),
        this.hasUnitPricing && this.updateProductUnits(e);
    }
    updateProductUnits(e) {
      const t = e.variant,
        s = e.plan;
      let i = null;
      if (
        (t && t.unit_price && (i = t.unit_price),
        s &&
          s.allocation &&
          s.allocation.unit_price &&
          (i = s.allocation.unit_price),
        i)
      ) {
        const e = this.getBaseUnit(t),
          s = themeCurrency.formatMoney(i, theme.moneyFormat);
        (this.container.querySelector(selectors$y.unitPrice).innerHTML = s),
          (this.container.querySelector(selectors$y.unitBase).innerHTML = e),
          showElement(this.container.querySelector(selectors$y.unitWrapper));
      } else hideElement(this.container.querySelector(selectors$y.unitWrapper));
    }
    setProductState(e) {
      const t = e.variant,
        s = e.plan,
        i = {
          available: !0,
          soldOut: !1,
          onSale: !1,
          showUnitPrice: !1,
          requiresPlan: !1,
          hasPlan: !1,
          planPerDelivery: !1,
          planSale: !1,
        };
      return (
        !t || (t.requires_selling_plan && !s)
          ? (i.available = !1)
          : (t.available || (i.soldOut = !0),
            t.compare_at_price > t.price && (i.onSale = !0),
            t.unit_price && (i.showUnitPrice = !0),
            this.product &&
              this.product.requires_selling_plan &&
              (i.requiresPlan = !0),
            s &&
              this.subPrices &&
              ((i.hasPlan = !0),
              s.allocation.per_delivery_price !== s.allocation.price &&
                (i.planPerDelivery = !0),
              t.price > s.allocation.price && (i.planSale = !0))),
        i
      );
    }
    updateProductImage(e) {
      const t = e.dataset.variant;
      if (t && t.featured_media) {
        const e = this.container.querySelector(
            `${selectors$y.productImage}[${selectors$y.dataImageId}="${t.featured_media.id}"]`
          ),
          s = e.closest(selectors$y.productSlide);
        if (s) {
          const t = Array.from(s.parentElement.children).indexOf(s),
            i = this.container.querySelector(selectors$y.productSlideshow);
          if (
            (i &&
              i.classList.contains(selectors$y.sliderEnabled) &&
              FlickityFade.data(i).select(t),
            !theme.variables.bpSmall && this.tallLayout)
          ) {
            const s = e.getBoundingClientRect().top + window.scrollY;
            if (0 === t && s > window.pageYOffset) return;
            document.dispatchEvent(new CustomEvent("poppy:close")),
              window.scrollTo({ top: s, left: 0, behavior: "smooth" });
          }
        }
      }
    }
  }
  const productFormSection = {
      onLoad() {
        this.section = new ProductAddForm(this);
      },
    },
    selectors$z = {
      elements: {
        accordion: "[data-accordion]",
        accordionToggle: "[data-accordion-toggle]",
        accordionBody: "[data-accordion-body]",
        accordionExpandValue: "data-accordion-expand",
        accordionBlockValue: "data-block-id",
      },
      classes: { open: "is-open" },
    },
    sections$g = {};
  class GlobalAccordions {
    constructor(e) {
      (this.container = e.container),
        (this.accordion = this.container.querySelector(
          selectors$z.elements.accordion
        )),
        (this.accordionToggles = this.container.querySelectorAll(
          selectors$z.elements.accordionToggle
        )),
        (this.accordionTogglesLength = this.accordionToggles.length),
        (this.accordionBody = this.container.querySelector(
          selectors$z.elements.accordionBody
        )),
        this.accordionTogglesLength &&
          this.accordionBody &&
          this.accordionEvents();
    }
    accordionEvents() {
      this.accordionToggles.forEach((e) => {
        e.addEventListener(
          "click",
          throttle((t) => {
            t.preventDefault();
            const s = e.parentElement.querySelector(
              selectors$z.elements.accordionBody
            );
            s && (slideToggle(s), e.classList.toggle(selectors$z.classes.open));
          }, 800)
        );
      }),
        "true" ===
          this.accordion.getAttribute(
            selectors$z.elements.accordionExpandValue
          ) &&
          (this.accordionToggles[0].classList.add(selectors$z.classes.open),
          showElement(
            this.accordionToggles[0].parentElement.querySelector(
              selectors$z.elements.accordionBody
            )
          ));
    }
    blockToggle(e, t = !0) {
      const s = this.container.querySelector(
        `${selectors$z.elements.accordionToggle}[${selectors$z.elements.accordionBlockValue}="${e.detail.blockId}"]`
      );
      if (!s) return;
      const i = s.parentElement.querySelector(
        selectors$z.elements.accordionBody
      );
      i &&
        (s.classList.toggle(selectors$z.classes.open, t),
        t ? slideDown(i) : slideUp(i));
    }
    onDeselect() {
      this.accordionBody &&
        this.accordionTogglesLength &&
        this.accordionTogglesLength < 2 &&
        (slideUp(this.accordionBody),
        this.accordionToggles[0].classList.remove(selectors$z.classes.open));
    }
    onSelect() {
      this.accordionBody &&
        this.accordionTogglesLength &&
        this.accordionTogglesLength < 2 &&
        (slideDown(this.accordionBody),
        this.accordionToggles[0].classList.add(selectors$z.classes.open));
    }
    onBlockSelect(e) {
      this.blockToggle(e, !0);
    }
    onBlockDeselect(e) {
      this.blockToggle(e, !1);
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
    },
    selectors$A = {
      body: "body",
      dataRelatedSectionElem: "[data-related-section]",
      dataTab: "data-tab",
      dataTabIndex: "data-tab-index",
      blockId: "data-block-id",
      tabsLi: "ul.tabs > li",
      tabLink: ".tab-link",
      tabLinkRecent: ".tab-link__recent",
      tabContent: ".tab-content",
      scrollbarHolder: "[data-scrollbar]",
      scrollbarArrowPrev: "[data-scrollbar-arrow-prev]",
      scrollbarArrowNext: "[data-scrollbar-arrow-next]",
    },
    classes$f = { classCurrent: "current", classHide: "hide", classAlt: "alt" },
    sections$h = {};
  class GlobalTabs {
    constructor(e) {
      (this.container = e.container),
        (this.body = document.querySelector(selectors$A.body)),
        (this.accessibility = window.accessibility),
        this.container &&
          ((this.scrollbarHolder = this.container.querySelectorAll(
            selectors$A.scrollbarHolder
          )),
          this.init(),
          this.initNativeScrollbar());
    }
    init() {
      const e = this.container,
        t = e.querySelectorAll(selectors$A.tabsLi),
        s = e.querySelector(`${selectors$A.tabLink}-0`),
        i = e.querySelector(`${selectors$A.tabContent}-0`);
      i && i.classList.add(classes$f.classCurrent),
        s && s.classList.add(classes$f.classCurrent),
        this.checkVisibleTabLinks(),
        this.container.addEventListener("tabs:checkRecentTab", () =>
          this.checkRecentTab()
        ),
        this.container.addEventListener("tabs:hideRelatedTab", () =>
          this.hideRelatedTab()
        ),
        t.length &&
          t.forEach((t) => {
            const s = parseInt(t.getAttribute(selectors$A.dataTab)),
              i = e.querySelector(`${selectors$A.tabContent}-${s}`);
            t.addEventListener("click", () => {
              this.tabChange(t, i);
            }),
              t.addEventListener("keyup", (e) => {
                (e.which !== window.theme.keyboardKeys.SPACE &&
                  e.which !== window.theme.keyboardKeys.ENTER) ||
                  !this.body.classList.contains("is-focused") ||
                  (this.tabChange(t, i),
                  i.querySelector("a, input") &&
                    ((this.accessibility.lastFocused = t),
                    this.accessibility.a11y.trapFocus(i, {
                      elementToFocus: i.querySelector(
                        "a:first-child, input:first-child"
                      ),
                    })));
              });
          });
    }
    tabChange(e, t) {
      this.container
        .querySelector(`${selectors$A.tabsLi}.${classes$f.classCurrent}`)
        .classList.remove(classes$f.classCurrent),
        this.container
          .querySelector(`${selectors$A.tabContent}.${classes$f.classCurrent}`)
          .classList.remove(classes$f.classCurrent),
        e.classList.add(classes$f.classCurrent),
        t.classList.add(classes$f.classCurrent),
        e.classList.contains(classes$f.classHide) &&
          t.classList.add(classes$f.classHide),
        this.checkVisibleTabLinks(),
        this.accessibility.a11y.removeTrapFocus();
    }
    initNativeScrollbar() {
      this.scrollbarHolder.length &&
        this.scrollbarHolder.forEach((e) => {
          new NativeScrollbar(e);
        });
    }
    checkVisibleTabLinks() {
      const e = this.container.querySelectorAll(selectors$A.tabsLi),
        t = this.container.querySelectorAll(
          `${selectors$A.tabLink}.${classes$f.classHide}`
        );
      e.length - t.length < 2
        ? this.container.classList.add(classes$f.classAlt)
        : this.container.classList.remove(classes$f.classAlt);
    }
    checkRecentTab() {
      const e = this.container.querySelector(selectors$A.tabLinkRecent);
      if (e) {
        e.classList.remove(classes$f.classHide);
        const t = parseInt(e.getAttribute(selectors$A.dataTab)),
          s = this.container.querySelector(
            `${selectors$A.tabContent}[${selectors$A.dataTabIndex}="${t}"]`
          );
        s && s.classList.remove(classes$f.classHide),
          this.checkVisibleTabLinks();
      }
    }
    hideRelatedTab() {
      const e = this.container.querySelector(
        selectors$A.dataRelatedSectionElem
      );
      if (!e) return;
      const t = e.closest(
        `${selectors$A.tabContent}.${classes$f.classCurrent}`
      );
      if (!t) return;
      const s = parseInt(t.getAttribute(selectors$A.dataTabIndex)),
        i = this.container.querySelectorAll(selectors$A.tabsLi);
      if (i.length > s) {
        const e = i[s].nextSibling;
        e &&
          (i[s].classList.add(classes$f.classHide),
          e.dispatchEvent(new Event("click")));
      }
    }
    onBlockSelect(e) {
      const t = this.container.querySelector(
        `${selectors$A.tabLink}[${selectors$A.blockId}="${e.detail.blockId}"]`
      );
      t &&
        (t.dispatchEvent(new Event("click")),
        t.parentNode.scrollTo({
          top: 0,
          left: t.offsetLeft - t.clientWidth,
          behavior: "smooth",
        }));
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
    productPageSticky: !1,
    bpSmall: !1,
    mediaQuerySmall: 750,
  };
  const selectors$B = {
      addToCart: "[data-add-to-cart]",
      priceWrapper: "[data-price-wrapper]",
      slideshow: "[data-product-slideshow]",
      productImage: "[data-product-image]",
      productJson: "[data-product-json]",
      form: "[data-product-form]",
      thumbs: "[data-product-thumbs]",
      dataSectionId: "data-section-id",
      dataTallLayout: "data-tall-layout",
      dataStickyEnabled: "data-sticky-enabled",
      dataCartBar: "data-cart-bar",
      dataReviews: "data-reviews",
      dataProductShare: "[data-product-share]",
      productPage: ".product__page",
      formWrapper: ".form__wrapper",
      cartBar: "#cart-bar",
      productSubmitAdd: ".product__submit__add",
      cartBarAdd: "data-add-to-cart-bar",
      cartBarScroll: "data-cart-bar-scroll",
      templateProduct: "#template-product",
      siteFooterWrapper: ".site-footer-wrapper",
      shopifyProductReviews: "#shopify-product-reviews",
      toggleTruncateHolder: "[data-truncated-holder]",
      toggleTruncateButton: "[data-truncated-button]",
      toggleTruncateContent: "[data-truncated-content]",
      toggleTruncateContentAttr: "data-truncated-content",
      headerSticky: '[data-header-sticky="sticky"]',
      upsellButton: "[data-upsell-btn]",
      upsellButtonText: "[data-upsell-btn-text]",
      scrollToElement: "[data-scroll-to]",
      accordionToggle: "[data-accordion-toggle]",
      accordionBody: "[data-accordion-body]",
      headerHeight: "[data-header-height]",
    },
    classes$g = {
      classExpanded: "is-expanded",
      classSticky: "is-sticky",
      classStickyHeader: "with-sticky-header",
      classVisible: "is-visible",
      classSiteFooterPush: "site-footer--push",
      open: "is-open",
    },
    sections$i = {};
  class Product {
    constructor(e) {
      (this.section = e),
        (this.container = e.container),
        (this.id = this.container.getAttribute(selectors$B.dataSectionId)),
        (this.tallLayout =
          "true" === this.container.getAttribute(selectors$B.dataTallLayout)),
        (this.stickyEnabled =
          "true" ===
          this.container.getAttribute(selectors$B.dataStickyEnabled)),
        (this.headerSticky =
          null !== document.querySelector(selectors$B.headerSticky)),
        (this.showReviews =
          "true" === this.container.getAttribute(selectors$B.dataReviews)),
        (this.thumbs = this.container.querySelector(selectors$B.thumbs)),
        (this.shareButton = this.container.querySelector(
          selectors$B.dataProductShare
        )),
        (this.upsellButton = this.container.querySelector(
          selectors$B.upsellButton
        )),
        (this.scrollToButton = this.container.querySelector(
          selectors$B.scrollToElement
        )),
        (this.truncateElementHolder = this.container.querySelector(
          selectors$B.toggleTruncateHolder
        )),
        (this.truncateElement = this.container.querySelector(
          selectors$B.toggleTruncateContent
        )),
        (this.resizeEventTruncate = () => this.truncateText()),
        (this.resizeEventSticky = () => this.stickyScrollCheck()),
        (this.resizeEventUpsell = () => this.calcUpsellButtonDemensions()),
        (this.scrollEvent = () => this.scrollTop()),
        this.scrollToButton && this.scrollToReviews(),
        this.shareToggle(),
        this.truncateElementHolder &&
          this.truncateElement &&
          (setTimeout(this.resizeEventTruncate, 50),
          document.addEventListener("theme:resize", this.resizeEventTruncate));
      const t = this.container.querySelector(selectors$B.productJson);
      if ((t && !t.innerHTML) || !t) {
        return void new QuantityCounter(this.container).init();
      }
      (this.form = this.container.querySelector(selectors$B.form)),
        this.init(),
        this.stickyEnabled && this.stickyScroll(),
        "true" === this.container.getAttribute(selectors$B.dataCartBar) &&
          this.initCartBar();
      const s = "function" == typeof window.SPR;
      this.showReviews &&
        s &&
        (window.SPR.initDomEls(), window.SPR.loadBadges()),
        this.upsellButton && this.upsellButtonDemensions();
    }
    init() {
      (theme.mediaInstances[this.id] = new Media(this.section)),
        theme.mediaInstances[this.id].init();
    }
    upsellButtonDemensions() {
      this.calcUpsellButtonDemensions(),
        document.addEventListener("theme:resize", this.resizeEventUpsell);
    }
    calcUpsellButtonDemensions() {
      const e = this.upsellButton.querySelector(selectors$B.upsellButtonText);
      e &&
        this.upsellButton.style.setProperty(
          "--btn-text-width",
          `${e.clientWidth}px`
        );
    }
    stickyScroll() {
      this.stickyScrollCheck(),
        document.addEventListener("theme:resize", this.resizeEventSticky);
    }
    stickyScrollCheck() {
      const e =
          (window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth) >= theme.variables.mediaQuerySmall,
        t = this.container.querySelector(selectors$B.formWrapper),
        s = this.container.querySelector(
          `${selectors$B.productPage} ${selectors$B.formWrapper}`
        );
      let i = !0;
      if ((this.showReviews && (i = !1), e)) {
        const e = this.container.querySelector(selectors$B.slideshow);
        if (!t || !e) return;
        const o = t.offsetHeight;
        o < e.offsetHeight && o < window.innerHeight && i
          ? ((theme.variables.productPageSticky = !0),
            s.classList.add(classes$g.classSticky),
            this.headerSticky && s.classList.add(classes$g.classStickyHeader))
          : ((theme.variables.productPageSticky = !1),
            s.classList.remove(classes$g.classSticky));
      } else s.classList.remove(classes$g.classSticky);
    }
    truncateText() {
      const e = this.truncateElement.cloneNode(!0),
        t = this.truncateElement.getAttribute(
          selectors$B.toggleTruncateContentAttr
        ),
        s = this.truncateElement.nextElementSibling;
      s && s.remove(), this.truncateElement.parentElement.append(e);
      const i = this.truncateElement.nextElementSibling;
      i.classList.add(t),
        i.removeAttribute(selectors$B.toggleTruncateContentAttr),
        showElement(i),
        ellipsed.ellipsis(i, 5, { replaceStr: "" }),
        hideElement(i),
        this.truncateElement.innerHTML !== i.innerHTML
          ? this.truncateElementHolder.classList.add(classes$g.classExpanded)
          : (i.remove(),
            this.truncateElementHolder.classList.remove(
              classes$g.classExpanded
            )),
        this.toggleTruncatedContent(this.truncateElementHolder);
    }
    toggleTruncatedContent(e) {
      const t = e.querySelector(selectors$B.toggleTruncateButton);
      t &&
        t.addEventListener("click", (t) => {
          t.preventDefault(), e.classList.remove(classes$g.classExpanded);
        });
    }
    shareToggle() {
      this.shareButton &&
        this.shareButton.addEventListener("click", function () {
          navigator.share
            ? navigator
                .share({
                  title: "WebShare API Demo",
                  url: "https://codepen.io/ayoisaiah/pen/YbNazJ",
                })
                .then(() => {
                  console.log("Thanks for sharing!");
                })
                .catch(console.error)
            : this.parentElement.classList.toggle(classes$g.classExpanded);
        });
    }
    initCartBar() {
      const e = document.querySelector(selectors$B.cartBar),
        t = e.querySelector(selectors$B.productSubmitAdd);
      t &&
        (t.addEventListener("click", (e) => {
          e.preventDefault(),
            e.target.hasAttribute(selectors$B.cartBarAdd)
              ? this.form
                  .querySelector(selectors$B.addToCart)
                  .dispatchEvent(new Event("click", { bubbles: !0 }))
              : e.target.hasAttribute(selectors$B.cartBarScroll) &&
                this.scrollToTop();
        }),
        t.hasAttribute(selectors$B.cartBarAdd) &&
          document.addEventListener("product:bar:error", () =>
            this.scrollToTop()
          )),
        (this.cartBar = e),
        document.addEventListener("theme:scroll", this.scrollEvent);
    }
    scrollToTop() {
      const e =
        (window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth) >= theme.variables.mediaQuerySmall
          ? this.container
          : this.form;
      window.scrollTo({
        top: e.getBoundingClientRect().top + window.scrollY,
        left: 0,
        behavior: "smooth",
      });
    }
    scrollTop() {
      const e = window.pageYOffset,
        t = document.querySelector(selectors$B.siteFooterWrapper);
      if (this.form && this.cartBar) {
        const s = e > this.form.offsetTop + this.form.offsetHeight;
        this.cartBar.classList.toggle(classes$g.classVisible, s),
          t.classList.toggle(classes$g.classSiteFooterPush, s),
          (t.style.marginBottom = t.classList.contains(
            classes$g.classSiteFooterPush
          )
            ? `${this.cartBar.offsetHeight}px`
            : "0");
      }
    }
    scrollToReviews() {
      this.scrollToButton.addEventListener("click", (e) => {
        e.preventDefault();
        const t = document.querySelector(
          this.scrollToButton.getAttribute("href")
        );
        if (!t) return;
        let s = 0;
        this.headerSticky &&
          (s = document
            .querySelector(selectors$B.headerHeight)
            .getBoundingClientRect().height);
        const i = t.querySelector(selectors$B.accordionBody),
          o = t.querySelector(selectors$B.accordionToggle);
        window.scrollTo({
          top: t.getBoundingClientRect().top - s,
          left: 0,
          behavior: "smooth",
        }),
          slideDown(i),
          o.classList.add(classes$g.open);
      }),
        (window.onload = () => {
          this.scrollToButton.nextElementSibling.querySelectorAll("*") &&
            this.scrollToButton.nextElementSibling
              .querySelectorAll("*")
              .forEach((e) => {
                e.setAttribute("tabindex", "-1"),
                  e.setAttribute("aria-hidden", !0);
              });
        });
    }
    onUnload() {
      this.truncateElementHolder &&
        this.truncateElement &&
        document.removeEventListener("theme:resize", this.resizeEventTruncate),
        this.stickyEnabled &&
          document.removeEventListener("theme:resize", this.resizeEventSticky),
        this.upsellButton &&
          document.removeEventListener("theme:resize", this.resizeEventUpsell),
        "true" === this.container.getAttribute(selectors$B.dataCartBar) &&
          document.removeEventListener("theme:scroll", this.scrollEvent);
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
  register("product", [
    productFormSection,
    productSection,
    swatchSection,
    tooltipSection,
    popoutSection,
    tabs,
    accordions,
    copyClipboard,
  ]);
  const selectors$C = {
    dataRelatedSectionElem: "[data-related-section]",
    dataRelatedProduct: "[data-product-grid-item]",
    dataProductId: "data-product-id",
    dataLimit: "data-limit",
    recentlyViewed: "#RecentlyViewed",
    recentlyProduct: "#recently-viewed-products .product-item",
  };
  class Related {
    constructor(e) {
      (this.section = e),
        (this.container = e.container),
        this.init(),
        this.recent();
    }
    init() {
      const e = this.container.querySelector(
        selectors$C.dataRelatedSectionElem
      );
      if (!e) return;
      const t = this,
        s = e.getAttribute(selectors$C.dataProductId),
        i = e.getAttribute(selectors$C.dataLimit),
        o = `${window.theme.routes.product_recommendations_url}?section_id=related&limit=${i}&product_id=${s}`;
      fetch(o)
        .then(function (e) {
          return e.text();
        })
        .then(function (s) {
          const i = document.createElement("div");
          i.innerHTML = s;
          const o = i.querySelector(selectors$C.dataRelatedSectionElem);
          if (o.querySelector(selectors$C.dataRelatedProduct)) {
            const s = o.innerHTML;
            hideElement(e),
              (e.innerHTML = s),
              slideDown(e),
              e
                .querySelectorAll(selectors$C.dataRelatedProduct)
                .forEach((e) => {
                  new QuickAddProduct(e);
                }),
              makeGridSwatches(t.section);
          } else t.container.dispatchEvent(new CustomEvent("tabs:hideRelatedTab", { bubbles: !0 }));
        })
        .catch(function () {
          t.container.dispatchEvent(
            new CustomEvent("tabs:hideRelatedTab", { bubbles: !0 })
          );
        });
    }
    recent() {
      const e = this.container.querySelector(selectors$C.recentlyViewed);
      let t = 4;
      e &&
        ((t = parseInt(e.getAttribute(selectors$C.dataLimit))),
        Shopify.Products.recordRecentlyViewed()),
        Shopify.Products.showRecentlyViewed({
          howManyToShow: t,
          onComplete: () => {
            this.container.querySelectorAll(selectors$C.recentlyProduct)
              .length > 0 &&
              (fadeIn(e),
              this.container.dispatchEvent(
                new CustomEvent("tabs:checkRecentTab", { bubbles: !0 })
              ),
              this.container
                .querySelectorAll(selectors$C.recentlyProduct)
                .forEach((e) => {
                  new QuickAddProduct(e);
                }),
              makeGridSwatches(this.section));
          },
        });
    }
  }
  const relatedSection = {
    onLoad() {
      (this.section = new Related(this)),
        this.container
          .querySelectorAll(selectors$C.dataRelatedProduct)
          .forEach((e) => {
            new QuickAddProduct(e);
          });
    },
  };
  register("related", [relatedSection, popoutSection, tabs]);
  const selectors$D = {
      scrollElement: "[data-block-scroll]",
      flickityEnabled: "flickity-enabled",
    },
    sections$j = {};
  class BlockScroll {
    constructor(e) {
      this.container = e.container;
    }
    onBlockSelect(e) {
      const t = this.container.querySelector(selectors$D.scrollElement);
      if (t && !t.classList.contains(selectors$D.flickityEnabled)) {
        const s = e.srcElement;
        s && t.scrollTo({ top: 0, left: s.offsetLeft, behavior: "smooth" });
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
    },
    sections$k = {},
    selectors$E = {
      logo: "[data-slider-logo]",
      text: "[data-slider-text]",
      slide: "[data-slide]",
      slideData: "data-slide",
      asNavFor: "#nav-for-",
      slideIndex: "data-slide-index",
      flickityEnabled: "flickity-enabled",
    },
    classes$h = { classIsSelected: "is-selected" };
  class LogoList {
    constructor(e) {
      (this.container = e.container),
        (this.slideshowText = this.container.querySelector(selectors$E.text)),
        (this.slideshowNav = this.container.querySelector(selectors$E.logo)),
        (this.logoSlides = this.slideshowNav.querySelectorAll(
          selectors$E.slide
        )),
        (this.textSlides = this.slideshowText.querySelectorAll(
          selectors$E.slide
        )),
        (this.resizeEvent = debounce(() => this.setSlideshowNavState(), 200)),
        (this.flkty = null),
        (this.flktyNav = null),
        this.init();
    }
    init() {
      (this.flkty = new Flickity(this.slideshowText, {
        autoPlay: !1,
        prevNextButtons: !1,
        contain: !0,
        pageDots: !1,
        wrapAround: !1,
        selectedAttraction: 0.3,
        friction: 0.8,
        draggable: !1,
      })),
        this.logoSlides.forEach((e) => {
          e.addEventListener("click", (e) => {
            const t = parseInt(
                e.currentTarget.getAttribute(selectors$E.slideIndex)
              ),
              s = this.slideshowNav.classList.contains(
                selectors$E.flickityEnabled
              );
            if ((this.flkty.select(t), s))
              this.flktyNav.select(t),
                this.slideshowNav.classList.contains(
                  classes$h.classIsSelected
                ) || this.flktyNav.playPlayer();
            else {
              const t = this.slideshowNav.querySelector(
                `.${classes$h.classIsSelected}`
              );
              t && t.classList.remove(classes$h.classIsSelected),
                e.currentTarget.classList.add(classes$h.classIsSelected);
            }
          });
        });
      let e = -1;
      this.textSlides &&
        (this.textSlides.forEach((t) => {
          const s = parseFloat(
            getComputedStyle(t, null).height.replace("px", "")
          );
          s > e && (e = s);
        }),
        this.textSlides.forEach((t) => {
          const s = parseFloat(
            getComputedStyle(t, null).height.replace("px", "")
          );
          if (s < e) {
            const i = Math.ceil((e - s) / 2);
            t.style.margin = `${i}px 0`;
          }
        })),
        this.initSlideshowNav();
    }
    onUnload() {
      this.slideshowNav.classList.contains(selectors$E.flickityEnabled) &&
        this.flktyNav.destroy(),
        this.flkty.destroy(),
        window.removeEventListener("resize", this.resizeEvent);
    }
    onBlockSelect(e) {
      const t = this.slideshowNav.querySelector(
          `[${selectors$E.slideData}="${e.detail.blockId}"]`
        ),
        s = parseInt(t.getAttribute(selectors$E.slideIndex));
      this.slideshowNav.classList.contains(selectors$E.flickityEnabled)
        ? (this.flktyNav.select(s),
          this.flktyNav.stopPlayer(),
          this.slideshowNav.classList.add(classes$h.classIsSelected))
        : t.dispatchEvent(new Event("click")),
        this.flkty.select(s);
    }
    onBlockDeselect() {
      this.slideshowNav.classList.contains(selectors$E.flickityEnabled) &&
        (this.flktyNav.playPlayer(),
        this.slideshowNav.classList.remove(classes$h.classIsSelected));
    }
    setSlideshowNavState() {
      const e = this.slideshowNav.querySelectorAll(selectors$E.slide).length,
        t =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth,
        s = 200 * e,
        i = this.slideshowNav.classList.contains(selectors$E.flickityEnabled);
      if (s > t) {
        if (!i) {
          const e = this.slideshowNav.querySelector(
            `.${classes$h.classIsSelected}`
          );
          e && e.classList.remove(classes$h.classIsSelected),
            (this.flktyNav = new Flickity(this.slideshowNav, {
              autoPlay: 4e3,
              prevNextButtons: !1,
              contain: !0,
              pageDots: !1,
              wrapAround: !0,
              watchCSS: !0,
              selectedAttraction: 0.05,
              friction: 0.8,
            })),
            this.flkty &&
              (this.flkty.select(0),
              this.flktyNav.on("change", (e) => this.flkty.select(e)));
        }
      } else
        i &&
          (this.flktyNav.destroy(),
          this.logoSlides[0].classList.add(classes$h.classIsSelected),
          this.flkty && this.flkty.select(0));
    }
    initSlideshowNav() {
      this.setSlideshowNavState(),
        window.addEventListener("resize", this.resizeEvent);
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
  register("logos", [LogoListSection, blockScroll]);
  const selectors$F = {
    videoPlay: "[data-video-play]",
    videoPlayValue: "data-video-play",
  };
  class VideoPlay {
    constructor(e) {
      (this.container = e),
        (this.videoPlay = this.container.querySelector(selectors$F.videoPlay)),
        this.videoPlay &&
          this.videoPlay.addEventListener("click", function (e) {
            if (
              this.hasAttribute(selectors$F.videoPlayValue) &&
              "" !== this.getAttribute(selectors$F.videoPlayValue).trim()
            ) {
              e.preventDefault();
              const t = [
                { html: this.getAttribute(selectors$F.videoPlayValue) },
              ];
              new LoadPhotoswipe(t);
            }
          });
    }
  }
  const videoPlay = {
    onLoad() {
      new VideoPlay(this.container);
    },
  };
  register("featured-video", [videoPlay]),
    register("featured-background-video", [loadVideoYT, loadVideoVimeo]),
    register("slideshow", [slider, parallaxHero]),
    register("image-with-text", [
      videoPlay,
      parallaxHero,
      productGridReviews,
      quickAddProduct,
      swatchGridSection,
    ]);
  var styles = {};
  function mapStyle(e) {
    return styles[e];
  }
  (styles.basic = []),
    (styles.light = [
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [
          { visibility: "simplified" },
          { lightness: "64" },
          { hue: "#ff0000" },
        ],
      },
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{ color: "#bdbdbd" }],
      },
      {
        featureType: "administrative",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ color: "#f0f0f0" }, { visibility: "simplified" }],
      },
      {
        featureType: "landscape.natural.landcover",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "landscape.natural.terrain",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ lightness: "100" }],
      },
      {
        featureType: "poi.park",
        elementType: "all",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ saturation: "-41" }, { color: "#e8ede7" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [{ saturation: "-100" }],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          { lightness: "25" },
          { gamma: "1.06" },
          { saturation: "-100" },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ gamma: "10.00" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ weight: "0.01" }, { visibility: "simplified" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.stroke",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [{ weight: "0.8" }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [{ gamma: "10.00" }, { lightness: "100" }, { weight: "0.4" }],
      },
      {
        featureType: "road.local",
        elementType: "labels",
        stylers: [
          { visibility: "simplified" },
          { weight: "0.01" },
          { lightness: "39" },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.stroke",
        stylers: [{ weight: "0.50" }, { gamma: "10.00" }, { lightness: "100" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#cfe5ee" }, { visibility: "on" }],
      },
    ]),
    (styles.white_label = [
      {
        featureType: "all",
        elementType: "all",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [{ gamma: "3.86" }, { lightness: "100" }],
      },
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{ color: "#cccccc" }],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ color: "#f2f2f2" }],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [{ saturation: -100 }, { lightness: 45 }],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ weight: "0.8" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ weight: "0.8" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ weight: "0.8" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.stroke",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [{ weight: "0" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.local",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#e4e4e4" }, { visibility: "on" }],
      },
    ]),
    (styles.dark_label = [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ saturation: 36 }, { color: "#000000" }, { lightness: 40 }],
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
          { visibility: "on" },
          { color: "#000000" },
          { lightness: 16 },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }, { lightness: 20 }],
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#000000" }, { lightness: 17 }, { weight: 1.2 }],
      },
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [{ visibility: "simplified" }, { lightness: "-82" }],
      },
      {
        featureType: "administrative",
        elementType: "labels.text.stroke",
        stylers: [{ invert_lightness: !0 }, { weight: "7.15" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 20 }],
      },
      {
        featureType: "landscape",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 21 }],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }, { lightness: 17 }, { weight: "0.8" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#000000" }, { lightness: 29 }, { weight: "0.01" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 18 }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 16 }],
      },
      {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [{ weight: "0.01" }],
      },
      {
        featureType: "road.local",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 19 }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#000000" }, { lightness: 17 }],
      },
    ]),
    (window.theme.allMaps = window.theme.allMaps || {});
  let allMaps = window.theme.allMaps;
  window.theme.mapAPI = window.theme.mapAPI || null;
  class Map {
    constructor(e) {
      (this.container = e.container),
        (this.mapContainer = this.container.querySelector(
          "[data-map-container]"
        )),
        (this.key = this.container.getAttribute("data-api-key")),
        (this.styleString = this.container.getAttribute("data-style") || ""),
        (this.zoomString = this.container.getAttribute("data-zoom") || 14),
        (this.address = this.container.getAttribute("data-address")),
        (this.enableCorrection = this.container.getAttribute(
          "data-latlong-correction"
        )),
        (this.lat = this.container.getAttribute("data-lat")),
        (this.long = this.container.getAttribute("data-long")),
        this.key && this.initMaps();
    }
    initMaps() {
      loadAPI(this.key)
        .then(() =>
          "true" === this.enableCorrection &&
          "" !== this.lat &&
          "" !== this.long
            ? new google.maps.LatLng(this.lat, this.long)
            : geocodeAddressPromise(this.address)
        )
        .then((e) => {
          const t = {
            zoom: parseInt(this.zoomString, 10),
            styles: mapStyle(this.styleString),
            center: e,
            draggable: !0,
            clickableIcons: !1,
            scrollwheel: !1,
            zoomControl: !1,
            disableDefaultUI: !0,
          };
          return createMap(this.mapContainer, t);
        })
        .then((e) => {
          (this.map = e), (allMaps[this.id] = e);
        })
        .catch((e) => {
          console.log("Failed to load Google Map"), console.log(e);
        });
    }
    unload() {
      void 0 !== window.google &&
        google.maps.event.clearListeners(this.map, "resize");
    }
  }
  const mapSection = {
    onLoad() {
      allMaps[this.id] = new Map(this);
    },
    onUnload() {
      "function" == typeof allMaps[this.id].unload && allMaps[this.id].unload();
    },
  };
  function loadAPI(e) {
    if (null === window.theme.mapAPI) {
      const t = `https://maps.googleapis.com/maps/api/js?key=${e}`;
      window.theme.mapAPI = loadScript({ url: t });
    }
    return window.theme.mapAPI;
  }
  function createMap(e, t) {
    var s = new google.maps.Map(e, t),
      i = s.getCenter();
    new google.maps.Marker({ map: s, position: i });
    return (
      google.maps.event.addDomListener(window, "resize", function () {
        google.maps.event.trigger(s, "resize"), s.setCenter(i);
      }),
      s
    );
  }
  function geocodeAddressPromise(e) {
    return new Promise((t, s) => {
      new google.maps.Geocoder().geocode({ address: e }, function (e, i) {
        if ("OK" == i) {
          var o = {
            lat: e[0].geometry.location.lat(),
            lng: e[0].geometry.location.lng(),
          };
          t(o);
        } else s(i);
      });
    });
  }
  register("map", mapSection),
    register("search", [quickAddProduct, swatchGridSection]);
  const fadeOut = (e, t = null) => {
      (e.style.opacity = 1),
        (function s() {
          (e.style.opacity -= 0.1) < 0
            ? (e.style.display = "none")
            : requestAnimationFrame(s),
            0 === parseFloat(e.style.opacity) && "function" == typeof t && t();
        })();
    },
    selectors$G = {
      largePromoInner: "[data-large-promo-inner]",
      trackingInner: "[data-tracking-consent-inner]",
      tracking: "[data-tracking-consent]",
      trackingAccept: "[data-confirm-cookies]",
      close: "[data-close-modal]",
      modalUnderlay: "[data-modal-underlay]",
    };
  let sections$l = {};
  class PopupCookie {
    constructor(e, t) {
      (this.configuration = {
        expires: null,
        path: "/",
        domain: window.location.hostname,
      }),
        (this.name = e),
        (this.value = t);
    }
    write() {
      ((-1 !== document.cookie.indexOf("; ") &&
        !document.cookie.split("; ").find((e) => e.startsWith(this.name))) ||
        -1 === document.cookie.indexOf("; ")) &&
        (document.cookie = `${this.name}=${this.value}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`);
    }
    read() {
      if (
        -1 !== document.cookie.indexOf("; ") &&
        document.cookie.split("; ").find((e) => e.startsWith(this.name))
      ) {
        return document.cookie
          .split("; ")
          .find((e) => e.startsWith(this.name))
          .split("=")[1];
      }
      return !1;
    }
    destroy() {
      document.cookie.split("; ").find((e) => e.startsWith(this.name)) &&
        (document.cookie = `${this.name}=null; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`);
    }
  }
  class LargePopup {
    constructor(e) {
      (this.popup = e),
        (this.modal = this.popup.querySelector(selectors$G.largePromoInner)),
        (this.close = this.popup.querySelector(selectors$G.close)),
        (this.underlay = this.popup.querySelector(selectors$G.modalUnderlay)),
        (this.cookie = new PopupCookie("promo", "user_has_closed")),
        this.init();
    }
    init() {
      !1 !== this.cookie.read() || (fadeIn(this.modal), this.initClosers());
    }
    initClosers() {
      this.close.addEventListener("click", this.closeModal.bind(this)),
        this.underlay.addEventListener("click", this.closeModal.bind(this));
    }
    closeModal(e) {
      e.preventDefault(), fadeOut(this.modal), this.cookie.write();
    }
    onBlockSelect(e) {
      this.popup.contains(e.target) && (fadeIn(this.modal), this.initClosers());
    }
    onBlockDeselect(e) {
      this.popup.contains(e.target) && fadeOut(this.modal);
    }
  }
  class Tracking {
    constructor(e) {
      (this.popup = e),
        (this.modal = document.querySelector(selectors$G.tracking)),
        (this.close = this.modal.querySelector(selectors$G.close)),
        (this.acceptButton = this.modal.querySelector(
          selectors$G.trackingAccept
        )),
        (this.enable = "true" === this.modal.getAttribute("data-enable")),
        (this.showPopup = !1),
        window.Shopify.loadFeatures(
          [{ name: "consent-tracking-api", version: "0.1" }],
          (e) => {
            if (e) throw e;
            const t = window.Shopify.customerPrivacy.userCanBeTracked(),
              s = window.Shopify.customerPrivacy.getTrackingConsent();
            (this.showPopup = !t && "no_interaction" === s && this.enable),
              window.Shopify.designMode && (this.showPopup = !0),
              this.init();
          }
        );
    }
    init() {
      this.showPopup && fadeIn(this.modal), this.clickEvents();
    }
    clickEvents() {
      this.close.addEventListener("click", (e) => {
        e.preventDefault(),
          window.Shopify.customerPrivacy.setTrackingConsent(!1, () =>
            fadeOut(this.modal)
          );
      }),
        this.acceptButton.addEventListener("click", (e) => {
          e.preventDefault(),
            window.Shopify.customerPrivacy.setTrackingConsent(!0, () =>
              fadeOut(this.modal)
            );
        }),
        document.addEventListener("trackingConsentAccepted", function () {
          console.log("trackingConsentAccepted event fired");
        });
    }
    onBlockSelect(e) {
      this.popup.contains(e.target) && this.showPopup && fadeIn(this.modal);
    }
    onBlockDeselect(e) {
      this.popup.contains(e.target) && fadeOut(this.modal);
    }
  }
  const popupSection = {
    onLoad() {
      sections$l[this.id] = [];
      this.container.querySelectorAll("[data-large-promo]").forEach((e) => {
        sections$l[this.id].push(new LargePopup(e));
      });
      this.container.querySelectorAll(selectors$G.tracking).forEach((e) => {
        sections$l[this.id].push(new Tracking(e));
      });
    },
    onBlockSelect(e) {
      sections$l[this.id].forEach((t) => {
        "function" == typeof t.onBlockSelect && t.onBlockSelect(e);
      });
    },
    onBlockDeselect(e) {
      sections$l[this.id].forEach((t) => {
        "function" == typeof t.onBlockDeselect && t.onBlockDeselect(e);
      });
    },
  };
  register("popups", popupSection);
  const selectors$H = {
    loginToggle: "#AdminLoginToggle",
    newsletterToggle: "#NewsletterToggle",
    login: "#AdminLogin",
    signup: "#CustomerSignup",
    errors: ".errors",
    contactErrors: "#contact_form .errors",
    loginErrors: "#login_form .errors",
  };
  class Password {
    constructor(e) {
      (this.container = e.container),
        (this.loginToggle = this.container.querySelector(
          selectors$H.loginToggle
        )),
        (this.newsletterToggle = this.container.querySelector(
          selectors$H.newsletterToggle
        )),
        (this.login = this.container.querySelector(selectors$H.login)),
        (this.signup = this.container.querySelector(selectors$H.signup)),
        (this.errors = this.container.querySelector(selectors$H.errors)),
        (this.contactErrors = this.container.querySelector(
          selectors$H.contactErrors
        )),
        (this.loginErrors = this.container.querySelector(
          selectors$H.loginErrors
        )),
        this.init();
    }
    init() {
      const e = this.login,
        t = this.signup,
        s = this.errors,
        i = this.contactErrors,
        o = this.loginErrors;
      this.loginToggle.addEventListener("click", function (i) {
        i.preventDefault(), slideDown(e), hideElement(t), s && hideElement(s);
      }),
        this.newsletterToggle.addEventListener("click", function (i) {
          i.preventDefault(), hideElement(e), slideDown(t), s && hideElement(s);
        }),
        i && (hideElement(e), slideDown(t)),
        o && (slideDown(e), hideElement(t));
    }
  }
  const passwordSection = {
    onLoad() {
      new Password(this);
    },
  };
  register("password-template", passwordSection),
    register("faq", accordions),
    register("list-collections", [
      slider,
      quickAddProduct,
      swatchGridSection,
      blockScroll,
    ]),
    document.addEventListener("DOMContentLoaded", function () {
      load("*");
      "true" === document.body.getAttribute("data-animations") &&
        (AOS.init({ once: !0 }),
        document.body.classList.add("aos-initialized")),
        document.addEventListener("lazyloaded", function (e) {
          const t = e.target.parentNode;
          t.classList.contains("lazy-image") &&
            (t.style.backgroundImage = "none");
        }),
        window.self !== window.top &&
          document.querySelector("html").classList.add("iframe"),
        "scrollBehavior" in document.documentElement.style ||
          loadScript({ url: window.theme.assets.smoothscroll });
    }),
    window.navigator.cookieEnabled &&
      (document.documentElement.className =
        document.documentElement.className.replace(
          "supports-no-cookies",
          "supports-cookies"
        ));
})(
  themeVendor.BodyScrollLock,
  themeVendor.themeCurrency,
  themeVendor.themeImages,
  themeVendor.themeAddresses,
  themeVendor.Sqrl,
  themeVendor.Flickity,
  themeVendor.Rellax,
  themeVendor.ellipsis,
  themeVendor.FlickityFade,
  themeVendor.AOS
);
//# sourceMappingURL=theme.js.map
