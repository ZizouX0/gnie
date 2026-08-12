import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const D = '/tmp/claude-0/-home-user-gnie/d5eb8c9e-dd87-5f80-8322-1d15dd685709/scratchpad/pdfbuild';
const OUT = '/home/user/gnie/docs/client';
const b64 = (p, m) => `data:${m};base64,${readFileSync(p).toString('base64')}`;
const fonts = readFileSync(`${D}/fonts.css`, 'utf8');
const css = readFileSync(`${D}/client.css`, 'utf8');
const img = {
  LOGO: b64('/home/user/gnie/src/assets/brand/gnie-logo-gold.png', 'image/png'),
  SHOT_HOME: b64(`${D}/deck-home.png`, 'image/png'),
  SHOT_MACHINE: b64(`${D}/deck-machine.png`, 'image/png'),
  SHOT_MOBILE: b64(`${D}/deck-mobile.png`, 'image/png'),
};
const jobs = [
  ['deck.template.html',  `${OUT}/GNIE-Presentation-Projet.pdf`],
  ['infos.template.html', `${OUT}/GNIE-Informations-A-Fournir.pdf`],
  ['valid.template.html', `${OUT}/GNIE-Catalogue-Validation.pdf`],
];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [src, out] of jobs) {
  let html = readFileSync(`${D}/${src}`, 'utf8').replace('/*FONTS*/', fonts).replace('/*CSS*/', css);
  for (const [k, v] of Object.entries(img)) html = html.replaceAll(`{{${k}}}`, v);
  let n = 0;
  html = html.replace(/<span class="num">\d+<\/span>/g, () => `<span class="num">${String(++n).padStart(2,'0')}</span>`);
  const tmp = `${D}/built-${src.replace('.template.html','')}.html`;
  writeFileSync(tmp, html);
  const p = await browser.newPage();
  await p.goto(`file://${tmp}`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  /* Each .page is a fixed A4 box, so content that outgrows it does not push the
     page taller — it silently overlaps the footer, and the PDF still "builds".
     Adding one row to a table is enough to do it. Catch it here rather than in
     the client's inbox. build-manque.mjs carries the same check. */
  const over = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.page'))
      .map((s, i) => {
        const f = s.querySelector('.flow');
        return f && f.scrollHeight > f.clientHeight + 2
          ? `page ${i + 1}: +${f.scrollHeight - f.clientHeight}px`
          : null;
      })
      .filter(Boolean),
  );
  if (over.length) {
    console.error(`OVERFLOW in ${src} — ${over.join(', ')}`);
    process.exitCode = 1;
  }
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true,
                margin: { top:0, right:0, bottom:0, left:0 } });
  await p.close();
  console.log(over.length ? `built (WITH OVERFLOW) ${out}` : `built ${out}`);
}
await browser.close();
