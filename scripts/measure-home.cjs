const { chromium } = require('playwright')
const fs = require('fs')

;(async () => {
  const buf = fs.readFileSync(
    'c:/Users/user 7/Downloads/stitch_fooduz_delivery_platform/stitch_fooduz_delivery_platform/fooduz_bosh_sahifa/screen.png',
  )
  console.log('screen.png', buf.readUInt32BE(16), buf.readUInt32BE(20))

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 983, height: 764 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)

  const metrics = await page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        t: Math.round(r.top),
        l: Math.round(r.left),
      }
    }
    const header = document.querySelector('header')
    const h1 = document.querySelector('h1')
    const searchInput = document.querySelector('main input[placeholder*="Restoran"]')
    const search = searchInput?.parentElement?.parentElement
    const hero = document.querySelector('main section')
    const cats = [...document.querySelectorAll('a[href*="category"]')]
    const articles = [...document.querySelectorAll('article')]
    const promo = [...document.querySelectorAll('section')].find((s) =>
      s.textContent?.includes('Bugun yetkazib'),
    )
    const catSection = [...document.querySelectorAll('section')].find((s) =>
      s.textContent?.includes('Katalog'),
    )
    return {
      header: rect(header),
      headerTop: header ? getComputedStyle(header).top : null,
      h1: {
        ...rect(h1),
        fontSize: h1 && getComputedStyle(h1).fontSize,
        lh: h1 && getComputedStyle(h1).lineHeight,
      },
      search: rect(search),
      hero: rect(hero),
      catSection: rect(catSection),
      cat0: rect(cats[0]),
      catCount: cats.length,
      articles: articles.map((a) => rect(a)),
      promo: rect(promo),
      mainPt: getComputedStyle(document.querySelector('main')).paddingTop,
    }
  })
  console.log('OURS', JSON.stringify(metrics, null, 2))
  await page.screenshot({ path: 'compare-current.png', fullPage: false })
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
