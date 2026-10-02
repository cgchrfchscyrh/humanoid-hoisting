import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
for(const [route,file] of [['paper','hoist.pdf'],['supplementary','hoist-supplementary.pdf']]) {
 const page=await browser.newPage();await page.goto((process.env.TEST_URL || 'http://127.0.0.1:4332').replace(/\/$/, '')+'/'+route+'/',{waitUntil:'networkidle'});
 await page.locator('img').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode()));});
 await page.pdf({path:'public/papers/'+file,format:'A4',printBackground:true,tagged:true,outline:true,preferCSSPageSize:true});
 await page.close();console.log('Created tagged reading edition:',file);
}
await browser.close();
