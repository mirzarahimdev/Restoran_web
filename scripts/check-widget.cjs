const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const size = await page.evaluate(() => {
    const art = [...document.querySelectorAll('article')].find((a) =>
      a.innerText.includes('Samarqand'),
    )
    if (!art) return null
    const r = art.getBoundingClientRect()
    return { w: Math.round(r.width), h: Math.round(r.height) }
  })
  console.log(size)
  await page.screenshot({ path: 'check-widget-large.png' })
  await browser.close()
})()
