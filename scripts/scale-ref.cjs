const { chromium } = require('playwright')
const fs = require('fs')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 983, height: 764 } })
  const png = fs
    .readFileSync(
      'c:/Users/user 7/Downloads/stitch_fooduz_delivery_platform/stitch_fooduz_delivery_platform/fooduz_bosh_sahifa/screen.png',
    )
    .toString('base64')
  await page.setContent(
    `<!doctype html><html><body style="margin:0;overflow:hidden;background:#f9f9ff"><img src="data:image/png;base64,${png}" style="width:983px;height:auto;display:block"/></body></html>`,
  )
  await page.waitForTimeout(800)
  await page.screenshot({ path: 'compare-reference-scaled.png', fullPage: false })
  await browser.close()
  console.log('saved')
})()
