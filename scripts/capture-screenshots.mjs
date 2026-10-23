import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = new URL('../documentation-images/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const shot = name => page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)), fullPage: true });
await page.goto('http://127.0.0.1:5173/login');
await shot('01-inicio-sesion');
await page.locator('input').nth(0).fill('superadmin');
await page.locator('input').nth(1).fill('portal2026');
await page.getByRole('button', { name: 'Iniciar sesión' }).click();
await page.waitForURL('http://127.0.0.1:5173/');
await shot('02-dashboard');
for (const [route, name] of [['products','03-productos'],['movements','04-movimientos'],['search','05-consultas'],['reports','06-reportes'],['users','07-usuarios'],['settings','08-configuracion']]) {
  await page.goto(`http://127.0.0.1:5173/${route}`);
  await page.waitForTimeout(250);
  await shot(name);
}
await browser.close();
