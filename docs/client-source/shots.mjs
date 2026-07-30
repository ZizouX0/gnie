import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const D = '/tmp/claude-0/-home-user-gnie/d5eb8c9e-dd87-5f80-8322-1d15dd685709/scratchpad/pdfbuild';
const O = '/home/user/gnie/docs/client/mockups';
const jobs = [
  ['built-home.html',        1440, 1000, 2, `${O}/maquette-accueil.png`,        true],
  ['built-home.html',        1440, 900,  2, `${O}/maquette-accueil-hero.png`,   false],
  ['built-machine.html',     1440, 1000, 2, `${O}/maquette-machine.png`,        true],
  ['built-machine.html',     1440, 900,  2, `${O}/maquette-machine-hero.png`,   false],
  ['built-machine-mob.html',  390, 844,  3, `${O}/maquette-mobile.png`,         true],
];
for (const [file, w, h, dsf, out, full] of jobs) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dsf });
  await p.goto(`file://${D}/${file}`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out, fullPage: full });
  await p.close();
  console.log('shot', out);
}
await b.close();
