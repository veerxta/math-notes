/*
 * main.js: navigasi dan perilaku halaman Math Notes.
 * Membaca window.MATH_NOTES dari data.js. Dimuat dengan `defer` sebelum KaTeX,
 * sehingga rumus di judul (sidebar, breadcrumb, daftar isi) ikut dirender.
 */
(function () {
  "use strict";

  var DATA = window.MATH_NOTES || { matkul: [], lainnya: [] };
  var KUNCI_TEMA = "mn-tema";
  var KUNCI_PROGRES = "mn-progres";
  var KUNCI_SIDEBAR = "mn-sidebar";
  var html = document.documentElement;
  var LEBAR = window.matchMedia("(min-width: 1024px)");

  var IKON = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    panel: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/></svg>',
    tutup: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    otomatis: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path class="penuh" d="M12 3.5a8.5 8.5 0 0 1 0 17z"/></svg>',
    terang: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
    gelap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.2A8.5 8.5 0 1 1 9.8 4a7.5 7.5 0 0 0 10.2 10.2z"/></svg>',
    atas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>',
    centang: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };

  /* ---------- Lokasi: akar situs dan halaman aktif ---------- */

  // Akar situs relatif terhadap halaman ini, diambil dari src skrip ini:
  // "../../assets/js/main.js" -> "../../", "assets/js/main.js" -> "".
  var srcSkrip = document.currentScript ? document.currentScript.getAttribute("src") : "";
  var AKAR = srcSkrip.replace(/assets\/js\/main\.js(?:[?#].*)?$/, "");

  // Path halaman relatif terhadap akar, mis. "matkul/aljabar-linier/01-ruang-vektor.html".
  var urlAkar = new URL(AKAR || "./", location.href).href;
  var urlIni = location.href.replace(/[?#].*$/, "");
  var PATH = urlIni.indexOf(urlAkar) === 0 ? decodeURIComponent(urlIni.slice(urlAkar.length)) : "";
  if (PATH === "" || PATH.slice(-1) === "/") PATH += "index.html";

  var cocok = PATH.match(/^matkul\/([^/]+)\/([^/]+)$/);
  var MATKUL = cocok ? cariMatkul(cocok[1]) : null;
  var FILE = cocok ? cocok[2] : PATH;
  var INDEKS = MATKUL ? MATKUL.topik.findIndex(function (t) { return t.file === FILE; }) : -1;
  var TOPIK = INDEKS >= 0 ? MATKUL.topik[INDEKS] : null;

  if (cocok && (!MATKUL || (!TOPIK && FILE !== "index.html" && FILE !== "ringkasan.html"))) {
    console.warn("Math Notes: halaman ini belum terdaftar di data.js:", PATH);
  }

  function cariMatkul(slug) {
    return DATA.matkul.find(function (m) { return m.slug === slug; }) || null;
  }

  function urlBeranda() { return AKAR + "index.html"; }
  function urlMatkul(m) { return AKAR + "matkul/" + m.slug + "/index.html"; }
  function urlTopik(m, t) { return AKAR + "matkul/" + m.slug + "/" + t.file; }
  function urlRingkasan(m) { return AKAR + "matkul/" + m.slug + "/ringkasan.html"; }

  // Label bab sebelum topik yang memulai bab baru (field opsional `bab` di data.js).
  function labelBab(t) {
    return t.bab ? h("li", { class: "label-bab" }, t.bab) : null;
  }

  // Nomor topik dari awalan nama file ("01-ruang-vektor.html" -> "01").
  function nomor(t, i) {
    var n = /^(\d+)-/.exec(t.file);
    return n ? n[1] : String(i + 1).padStart(2, "0");
  }

  /* ---------- Pembuat elemen ---------- */

  // h("a", { href: "#" }, ["teks", elemen]); teks selalu masuk sebagai text node.
  function h(tag, atribut, isi) {
    var e = document.createElement(tag);
    Object.keys(atribut || {}).forEach(function (k) {
      var v = atribut[k];
      if (v === null || v === undefined || v === false) return;
      e.setAttribute(k, v === true ? "" : v);
    });
    [].concat(isi === undefined ? [] : isi).forEach(function (anak) {
      if (anak !== null && anak !== undefined && anak !== false) e.append(anak);
    });
    return e;
  }

  function svg(nama) {
    var t = document.createElement("template");
    t.innerHTML = IKON[nama];
    return t.content.firstChild;
  }

  function tandaSelesai(atribut) {
    return h("span", Object.assign({ class: "tanda", title: "Sudah dipelajari" }, atribut), [
      svg("centang"),
      h("span", { class: "sr-only" }, "(sudah dipelajari)"),
    ]);
  }

  function bilah(selesai, total) {
    var persen = total ? Math.round((selesai / total) * 100) : 0;
    return h("span", { class: "bilah", "aria-hidden": "true" }, h("span", { style: "width: " + persen + "%" }));
  }

  /* ---------- Progres "Sudah dipelajari" (localStorage) ---------- */

  var PROGRES = (function () {
    try {
      var v = JSON.parse(localStorage.getItem(KUNCI_PROGRES));
      return v && typeof v === "object" ? v : {};
    } catch (e) {
      return {};
    }
  })();

  function kunci(m, t) { return m.slug + "/" + t.file; }
  function sudah(m, t) { return Boolean(PROGRES[kunci(m, t)]); }
  function jumlahSelesai(m) { return m.topik.filter(function (t) { return sudah(m, t); }).length; }

  function simpanSelesai(m, t, ya) {
    if (ya) PROGRES[kunci(m, t)] = new Date().toISOString().slice(0, 10);
    else delete PROGRES[kunci(m, t)];
    try {
      localStorage.setItem(KUNCI_PROGRES, JSON.stringify(PROGRES));
    } catch (e) {
      /* penyimpanan tidak tersedia: centang hanya berlaku sampai halaman ditutup */
    }
  }

  /* ---------- Tema: Otomatis -> Terang -> Gelap ---------- */

  var URUTAN_TEMA = ["otomatis", "terang", "gelap"];
  var NAMA_TEMA = { otomatis: "Otomatis", terang: "Terang", gelap: "Gelap" };
  var tombolTema = [];

  function temaAktif() {
    var t = html.getAttribute("data-tema");
    return t === "terang" || t === "gelap" ? t : "otomatis";
  }

  function pasangTema(tema) {
    try {
      if (tema === "otomatis") localStorage.removeItem(KUNCI_TEMA);
      else localStorage.setItem(KUNCI_TEMA, tema);
    } catch (e) {
      /* tetap berlaku untuk halaman ini */
    }
    if (tema === "otomatis") html.removeAttribute("data-tema");
    else html.setAttribute("data-tema", tema);
    perbaruiTema();
  }

  // Ikon dan label tombol, lalu warna bilah browser (meta theme-color) disamakan dengan latar.
  function perbaruiTema() {
    var tema = temaAktif();
    var label = "Tema: " + NAMA_TEMA[tema];
    tombolTema.forEach(function (b) {
      b.replaceChildren(svg(tema));
      if (!b.classList.contains("ikon")) b.append(h("span", null, label));
      b.setAttribute("aria-label", label + " (ganti tema)");
      b.title = label;
    });
    var warna = getComputedStyle(document.body).backgroundColor;
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", warna);
    });
  }

  function buatTombolTema(denganTeks) {
    var b = h("button", { type: "button", class: denganTeks ? "tombol-tema" : "tombol-tema ikon" });
    b.addEventListener("click", function () {
      var i = URUTAN_TEMA.indexOf(temaAktif());
      pasangTema(URUTAN_TEMA[(i + 1) % URUTAN_TEMA.length]);
    });
    tombolTema.push(b);
    return b;
  }

  /* ---------- Bar atas, sidebar, laci menu ---------- */

  function buatNavigasi() {
    var utama = document.querySelector("main");
    if (!utama) return;

    var tombolMenu = h("button", {
      type: "button",
      class: "ikon tombol-menu",
      "aria-label": "Buka menu",
      "aria-controls": "sidebar",
      "aria-expanded": "false",
    }, svg("menu"));
    var tombolTutup = h("button", { type: "button", class: "ikon tombol-tutup", "aria-label": "Tutup menu" }, svg("tutup"));
    // Layar lebar: sidebar bisa disembunyikan; tombolTampil muncul di kiri atas saat tersembunyi.
    var tombolSembunyi = h("button", {
      type: "button",
      class: "ikon tombol-sembunyi",
      "aria-label": "Sembunyikan sidebar",
      title: "Sembunyikan sidebar",
      "aria-controls": "sidebar",
    }, svg("panel"));
    var tombolTampil = h("button", {
      type: "button",
      class: "ikon tombol-tampil",
      "aria-label": "Tampilkan sidebar",
      title: "Tampilkan sidebar",
      "aria-controls": "sidebar",
    }, svg("panel"));

    var bar = h("header", { class: "bar-atas" }, [
      tombolMenu,
      h("a", { class: "merek", href: urlBeranda() }, "Math Notes"),
      buatTombolTema(false),
    ]);

    var kaki = h("div", { class: "sidebar-kaki" });
    (DATA.lainnya || []).forEach(function (l) {
      kaki.append(h("a", { href: AKAR + l.file, "aria-current": PATH === l.file ? "page" : null }, l.judul));
    });
    kaki.append(buatTombolTema(true));

    var sidebar = h("aside", { id: "sidebar", class: "sidebar", "aria-label": "Navigasi" }, [
      h("div", { class: "sidebar-kepala" }, [
        h("a", { class: "merek", href: urlBeranda() }, [
          h("span", { class: "merek-logo", "aria-hidden": "true" }, "MN"),
          "Math Notes",
        ]),
        tombolTutup,
        tombolSembunyi,
      ]),
      h("nav", { class: "sidebar-nav", "aria-label": "Navigasi utama" }, [
        h("a", { href: urlBeranda(), "aria-current": PATH === "index.html" ? "page" : null }, "Beranda"),
        h("p", { class: "nav-label" }, "Mata kuliah"),
        h("ul", null, DATA.matkul.map(itemMatkul)),
      ]),
      kaki,
    ]);

    var overlay = h("div", { class: "overlay" });
    utama.before(bar, sidebar, overlay, tombolTampil);
    pasangLaci(sidebar, overlay, tombolMenu, tombolTutup);
    pasangSembunyi(tombolSembunyi, tombolTampil);
  }

  // Kelas sidebar-tutup sudah dipasang skrip di <head> (dari localStorage) agar tata letak tidak melompat.
  function pasangSembunyi(tombolSembunyi, tombolTampil) {
    function atur(tutup) {
      html.classList.toggle("sidebar-tutup", tutup);
      tombolSembunyi.setAttribute("aria-expanded", String(!tutup));
      tombolTampil.setAttribute("aria-expanded", String(!tutup));
      try {
        if (tutup) localStorage.setItem(KUNCI_SIDEBAR, "tutup");
        else localStorage.removeItem(KUNCI_SIDEBAR);
      } catch (e) { /* localStorage tidak tersedia: pilihan hanya berlaku di halaman ini */ }
    }
    atur(html.classList.contains("sidebar-tutup"));
    tombolSembunyi.addEventListener("click", function () { atur(true); tombolTampil.focus(); });
    tombolTampil.addEventListener("click", function () { atur(false); tombolSembunyi.focus(); });
  }

  function itemMatkul(m) {
    var aktif = m === MATKUL;
    var total = m.topik.length;
    var li = h("li", { class: aktif ? "nav-matkul aktif" : "nav-matkul", style: "--aksen: " + m.aksen }, [
      h("a", { href: urlMatkul(m), "aria-current": aktif && FILE === "index.html" ? "page" : null }, [
        h("span", { class: "titik", "aria-hidden": "true" }),
        h("span", { class: "nama" }, m.nama),
        total ? h("span", { class: "hitung", "data-slug": m.slug, title: "Sudah dipelajari" }, jumlahSelesai(m) + "/" + total) : null,
      ]),
    ]);

    // Topik hanya ditampilkan untuk matkul yang sedang dibuka.
    if (aktif && (total || m.ringkasan)) {
      var ol = h("ol", { class: "sidebar-topik" }, [].concat.apply([], m.topik.map(function (t, i) {
        return [labelBab(t), h("li", null, h("a", { href: urlTopik(m, t), "aria-current": t === TOPIK ? "page" : null }, [
          h("span", { class: "no" }, nomor(t, i)),
          h("span", { class: "judul" }, t.judul),
          tandaSelesai({ "data-topik": t.file, hidden: !sudah(m, t) }),
        ]))];
      })));
      if (m.ringkasan) {
        ol.append(h("li", null, h("a", { href: urlRingkasan(m), "aria-current": FILE === "ringkasan.html" ? "page" : null }, [
          h("span", { class: "no" }, "∑"),
          h("span", { class: "judul" }, "Ringkasan"),
        ])));
      }
      li.append(ol);
    }
    return li;
  }

  function pasangLaci(sidebar, overlay, tombolMenu, tombolTutup) {
    function buka() {
      html.classList.add("menu-terbuka");
      tombolMenu.setAttribute("aria-expanded", "true");
      tombolTutup.focus();
    }
    function tutup(kembalikanFokus) {
      if (!html.classList.contains("menu-terbuka")) return;
      html.classList.remove("menu-terbuka");
      tombolMenu.setAttribute("aria-expanded", "false");
      if (kembalikanFokus) tombolMenu.focus();
    }
    tombolMenu.addEventListener("click", buka);
    tombolTutup.addEventListener("click", function () { tutup(true); });
    overlay.addEventListener("click", function () { tutup(true); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") tutup(true);
    });
    sidebar.addEventListener("click", function (e) {
      if (e.target.closest("a")) tutup(false);
    });
    LEBAR.addEventListener("change", function () { tutup(false); });
  }

  /* ---------- Breadcrumb ---------- */

  function isiBreadcrumb() {
    var nav = document.querySelector(".breadcrumb");
    if (!nav) return;

    var langkah = [{ judul: "Beranda", url: urlBeranda() }];
    if (MATKUL) {
      langkah.push({ judul: MATKUL.nama, url: urlMatkul(MATKUL) });
      if (TOPIK) langkah.push({ judul: TOPIK.judul });
      else if (FILE === "ringkasan.html") langkah.push({ judul: "Ringkasan" });
    } else {
      var lain = (DATA.lainnya || []).find(function (l) { return l.file === PATH; });
      if (lain) langkah.push({ judul: lain.judul });
    }

    nav.replaceChildren(h("ol", null, langkah.map(function (l, i) {
      var terakhir = i === langkah.length - 1;
      return h("li", terakhir ? { "aria-current": "page" } : null, terakhir ? l.judul : h("a", { href: l.url }, l.judul));
    })));
  }

  /* ---------- Daftar isi dari h2/h3 di .artikel ---------- */

  function isiDaftarIsi() {
    var nav = document.querySelector(".daftar-isi");
    var artikel = document.querySelector(".artikel");
    if (!nav || !artikel) return;

    var judul = artikel.querySelectorAll("h2, h3");
    if (judul.length < 2) {
      nav.remove();
      return;
    }

    var daftar = h("ol");
    var induk = null;
    judul.forEach(function (j) {
      if (!j.id) j.id = idUnik(j.textContent);
      var li = h("li", null, h("a", { href: "#" + j.id }, j.textContent.trim()));
      if (j.tagName === "H3" && induk) {
        var sub = induk.querySelector("ol") || induk.appendChild(h("ol"));
        sub.append(li);
      } else {
        daftar.append(li);
        induk = li;
      }
    });

    // Terbuka di layar lebar, tertutup di HP agar isi langsung terlihat.
    nav.replaceChildren(h("details", { open: LEBAR.matches }, [h("summary", null, "Daftar isi"), daftar]));
  }

  function idUnik(teks) {
    var dasar = teks.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "bagian";
    var id = dasar;
    for (var n = 2; document.getElementById(id); n++) id = dasar + "-" + n;
    return id;
  }

  /* ---------- Sebelumnya · Sudah dipelajari · Berikutnya ---------- */

  function isiNavTopik() {
    var nav = document.querySelector(".nav-topik");
    if (!nav) return;
    if (!TOPIK) {
      nav.remove();
      return;
    }

    var sebelum = MATKUL.topik[INDEKS - 1];
    var sesudah = MATKUL.topik[INDEKS + 1];

    var kotak = h("input", { type: "checkbox", id: "tandai-selesai" });
    kotak.checked = sudah(MATKUL, TOPIK);
    kotak.addEventListener("change", function () {
      simpanSelesai(MATKUL, TOPIK, kotak.checked);
      perbaruiTandaSidebar();
    });

    nav.replaceChildren(
      sebelum
        ? tautanNav("sebelumnya", "← Sebelumnya", sebelum.judul, urlTopik(MATKUL, sebelum))
        : tautanNav("sebelumnya", "← Kembali ke", "Daftar topik", urlMatkul(MATKUL)),
      h("label", { class: "tandai", for: "tandai-selesai" }, [kotak, h("span", null, "Sudah dipelajari")]),
      sesudah
        ? tautanNav("berikutnya", "Berikutnya →", sesudah.judul, urlTopik(MATKUL, sesudah))
        : tautanNav("berikutnya", "Kembali ke →", "Daftar topik", urlMatkul(MATKUL))
    );
  }

  function tautanNav(kelas, arah, judul, url) {
    return h("a", { class: kelas, href: url }, [h("span", { class: "arah" }, arah), h("span", { class: "judul" }, judul)]);
  }

  function perbaruiTandaSidebar() {
    document.querySelectorAll(".sidebar-topik .tanda[data-topik]").forEach(function (s) {
      var t = MATKUL.topik.find(function (x) { return x.file === s.getAttribute("data-topik"); });
      s.hidden = !(t && sudah(MATKUL, t));
    });
    var hitung = document.querySelector('.hitung[data-slug="' + MATKUL.slug + '"]');
    if (hitung) hitung.textContent = jumlahSelesai(MATKUL) + "/" + MATKUL.topik.length;
  }

  /* ---------- Beranda: kartu matkul + progres ---------- */

  function isiBeranda() {
    var daftar = document.querySelector(".daftar-matkul");
    if (!daftar) return;

    var semua = 0;
    var selesai = 0;
    daftar.replaceChildren.apply(daftar, DATA.matkul.map(function (m) {
      var n = m.topik.length;
      var s = jumlahSelesai(m);
      semua += n;
      selesai += s;
      return h("li", { class: "kartu-matkul", style: "--aksen: " + m.aksen }, h("a", { href: urlMatkul(m) }, [
        h("span", { class: "kartu-nama" }, m.nama),
        h("span", { class: "kartu-info" }, n ? s + " dari " + n + " topik dipelajari" : "Belum ada topik"),
        bilah(s, n),
      ]));
    }));

    var ringkas = document.querySelector(".progres-total");
    if (ringkas) {
      ringkas.textContent = semua
        ? "Progres: " + selesai + " dari " + semua + " topik sudah dipelajari."
        : "Belum ada topik.";
    }
  }

  /* ---------- Halaman matkul: daftar topik dari data.js ---------- */

  function isiHalamanMatkul() {
    var daftar = document.querySelector(".daftar-topik");
    if (!daftar || !MATKUL) return;

    var progres = document.querySelector(".progres-matkul");
    var n = MATKUL.topik.length;
    if (!n && !MATKUL.ringkasan) {
      daftar.replaceWith(h("p", { class: "kosong" }, "Belum ada topik."));
      if (progres) progres.remove();
      return;
    }

    var s = jumlahSelesai(MATKUL);
    if (progres) progres.replaceChildren(s + " dari " + n + " topik sudah dipelajari.", bilah(s, n));

    var item = [];
    MATKUL.topik.forEach(function (t, i) {
      if (t.bab) item.push(labelBab(t));
      item.push(h("li", null, h("a", { href: urlTopik(MATKUL, t) }, [
        h("span", { class: "no" }, nomor(t, i)),
        h("span", { class: "judul" }, t.judul),
        sudah(MATKUL, t) ? tandaSelesai() : null,
      ])));
    });
    if (MATKUL.ringkasan) {
      item.push(h("li", null, h("a", { href: urlRingkasan(MATKUL) }, [
        h("span", { class: "no" }, "∑"),
        h("span", { class: "judul" }, "Ringkasan"),
      ])));
    }
    daftar.replaceChildren.apply(daftar, item);
  }

  /* ---------- Tombol kembali ke atas ---------- */

  function pasangKeAtas() {
    var tombol = h("button", {
      type: "button",
      class: "ikon ke-atas",
      "aria-label": "Kembali ke atas",
      title: "Kembali ke atas",
      hidden: true,
    }, svg("atas"));
    tombol.addEventListener("click", function () {
      window.scrollTo({ top: 0 }); // halus lewat scroll-behavior di CSS, kecuali reduced motion
    });
    document.body.append(tombol);

    function periksa() {
      var sembunyi = window.scrollY < window.innerHeight;
      if (tombol.hidden !== sembunyi) tombol.hidden = sembunyi;
    }
    window.addEventListener("scroll", periksa, { passive: true });
    periksa();
  }

  /* ---------- Cetak: buka semua <details> (bukti, pembahasan) ---------- */

  function pasangCetak() {
    window.addEventListener("beforeprint", function () {
      document.querySelectorAll("details:not([open])").forEach(function (d) {
        d.open = true;
        d.setAttribute("data-dibuka-cetak", "");
      });
    });
    window.addEventListener("afterprint", function () {
      document.querySelectorAll("details[data-dibuka-cetak]").forEach(function (d) {
        d.open = false;
        d.removeAttribute("data-dibuka-cetak");
      });
    });
  }

  /* ---------- Jalankan ---------- */

  if (MATKUL) html.style.setProperty("--aksen", MATKUL.aksen);
  buatNavigasi();
  isiBreadcrumb();
  isiDaftarIsi();
  isiNavTopik();
  isiBeranda();
  isiHalamanMatkul();
  pasangKeAtas();
  pasangCetak();
  perbaruiTema();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", perbaruiTema);
})();
