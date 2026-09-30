'use strict';

const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const pdf = await page.pdf({ format: 'A4' });
    if (!pdf.length) throw new Error('Chrome returned an empty PDF');

    console.log(`PDF runtime OK: ${await browser.version()}, ${pdf.length} bytes`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('PDF runtime check failed:', error);
  process.exitCode = 1;
});