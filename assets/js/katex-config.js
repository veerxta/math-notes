/*
 * katex-config.js: merender semua rumus di halaman dengan KaTeX auto-render.
 * Delimiter: $...$ (inline) dan $$...$$ (display).
 * Di dalam rumus, tulis < sebagai \lt dan > sebagai \gt agar tidak terbaca sebagai tag HTML.
 * Teks di dalam <pre>, <code>, dan <script> tidak dirender.
 */
(function () {
  "use strict";
  if (typeof window.renderMathInElement !== "function") return;

  // Makro bersama untuk semua matkul.
  var MAKRO = {
    "\\R": "\\mathbb{R}",
    "\\N": "\\mathbb{N}",
    "\\Z": "\\mathbb{Z}",
    "\\Q": "\\mathbb{Q}",
    "\\C": "\\mathbb{C}",
    "\\abs": "\\left\\lvert #1 \\right\\rvert",
    "\\norm": "\\left\\lVert #1 \\right\\rVert",
    "\\set": "\\left\\{ #1 \\right\\}",
    "\\inner": "\\left\\langle #1, #2 \\right\\rangle",
  };

  window.renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    macros: MAKRO,
    throwOnError: false, // rumus yang salah tampil merah dan tidak menghentikan halaman
  });

  // Tanda baca di sekitar rumus inline (", dan", "($x$)") jangan sampai terpisah ke baris lain.
  // Hanya rumus pendek yang digabung (nowrap); rumus panjang tetap boleh dipatah agar
  // halaman di HP tidak bergeser ke samping.
  var PENUTUP = /^[.,;:!?)\]]+/;
  var PEMBUKA = /[(\[]$/;
  document.querySelectorAll(".katex").forEach(function (rumus) {
    var unit = rumus.parentElement; // span pembungkus yang dibuat auto-render
    if (unit.classList.contains("katex-display")) return;
    var tampil = rumus.querySelector(".katex-html"); // simbol yang terlihat, tanpa kode TeX
    if (!tampil || tampil.textContent.length > 16) return;

    var sesudah = unit.nextSibling;
    var sebelum = unit.previousSibling;
    var tutup = sesudah && sesudah.nodeType === Node.TEXT_NODE ? PENUTUP.exec(sesudah.data) : null;
    var buka = sebelum && sebelum.nodeType === Node.TEXT_NODE ? PEMBUKA.exec(sebelum.data) : null;
    if (!tutup && !buka) return;

    if (buka) {
      sebelum.data = sebelum.data.slice(0, -1);
      unit.prepend(buka[0]);
    }
    if (tutup) {
      sesudah.data = sesudah.data.slice(tutup[0].length);
      unit.append(tutup[0]);
    }
    unit.style.whiteSpace = "nowrap";
  });
})();
