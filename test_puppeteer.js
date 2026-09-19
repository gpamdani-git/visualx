import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  await page.goto('http://localhost:3001');
  
  // Wait for load
  await new Promise(r => setTimeout(r, 2000));
  
  const beforeLeft = await page.evaluate(() => {
    const el = document.querySelector('aside:first-of-type');
    return el ? { id: el.id, w: el.offsetWidth, classes: el.className } : null;
  });
  const beforeRight = await page.evaluate(() => {
    const el = document.getElementById('framer-right-inspector');
    return el ? { id: el.id, w: el.offsetWidth, classes: el.className } : null;
  });
  
  console.log('BEFORE DBLCLICK:');
  console.log('Left:', beforeLeft);
  console.log('Right:', beforeRight);
  
  // Double click canvas
  await page.mouse.click(700, 450, { clickCount: 2 });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const afterLeft = await page.evaluate(() => {
    const el = document.querySelector('aside:first-of-type');
    return el ? { id: el.id, w: el.offsetWidth, classes: el.className } : null;
  });
  const afterRight = await page.evaluate(() => {
    const el = document.getElementById('framer-right-inspector');
    return el ? { id: el.id, w: el.offsetWidth, classes: el.className } : null;
  });
  
  console.log('AFTER DBLCLICK:');
  console.log('Left:', afterLeft);
  console.log('Right:', afterRight);
  
  await browser.close();
})();
