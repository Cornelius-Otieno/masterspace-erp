import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  constructor(private readonly config: ConfigService) {}

  async renderDocument(path: string, token: string): Promise<Buffer> {
    const appUrl = this.config.get<string>('PDF_APP_URL') ?? 'http://127.0.0.1';
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
      await page.evaluate((accessToken) => {
        window.localStorage.setItem('ms_erp_token', accessToken);
      }, token);
      await page.goto(`${appUrl}${path}`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('.print-area', { timeout: 15000 });
      await page.addStyleTag({
        content: `
          @page { size: A4; margin: 0; }
          .print-area {
            box-sizing: border-box !important;
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            padding: 16mm !important;
          }
        `,
      });
      await page.emulateMediaType('print');

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}