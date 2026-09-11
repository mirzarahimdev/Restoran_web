const { chromium } = require('playwright')
const fs = require('fs')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1966, height: 764 } })
  const ref = fs.readFileSync('compare-reference-scaled.png').toString('base64')
  const cur = fs.readFileSync('compare-current.png').toString('base64')
  await page.setContent(`<!doctype html><html><body style="margin:0;display:flex;background:#222">
    <div style="position:relative;width:983px;height:764px">
      <img src="data:image/png;base64,${ref}" style="width:983px;height:764px;object-fit:none;object-position:top left"/>
      <div style="position:absolute;top:4px;left:4px;background:#000c;color:#fff;font:12px sans-serif;padding:4px 8px;border-radius:4px">REFERENCE (scaled)</div>
    </div>
    <div style="position:relative;width:983px;height:764px">
      <img src="data:image/png;base64,${cur}" style="width:983px;height:764px"/>
      <div style="position:absolute;top:4px;left:4px;background:#000c;color:#fff;font:12px sans-serif;padding:4px 8px;border-radius:4px">CURRENT</div>
    </div>
  </body></html>`)
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'compare-side-by-side.png' })

  // also 50% opacity overlay
  await page.setViewportSize({ width: 983, height: 764 })
  await page.setContent(`<!doctype html><html><body style="margin:0;position:relative;width:983px;height:764px;overflow:hidden">
    <img src="data:image/png;base64,${ref}" style="position:absolute;inset:0;width:983px;height:764px;object-fit:none;object-position:top left"/>
    <img src="data:image/png;base64,${cur}" style="position:absolute;inset:0;width:983px;height:764px;opacity:0.45;mix-blend-mode:difference"/>
  </body></html>`)
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'compare-diff.png' })
  await browser.close()
  console.log('done')
})()
