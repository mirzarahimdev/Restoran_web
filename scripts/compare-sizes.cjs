const { chromium } = require('playwright')
const fs = require('fs')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 983, height: 764 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: 'compare-current.png', fullPage: false })

  const refPath =
    'C:/Users/user 7/.cursor/projects/c-Users-user-7-Desktop-restaran/assets/c__Users_user_7_AppData_Roaming_Cursor_User_workspaceStorage_ab7ac6efcb370096f46f466769134797_images_image-48e4e5ad-56d2-4413-b146-4d7649619b22.png'
  const refBuf = fs.readFileSync(refPath)
  console.log('ref size', refBuf.readUInt32BE(16), 'x', refBuf.readUInt32BE(20))

  const metrics = await page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top), l: Math.round(r.left) }
    }
    const h1 = document.querySelector('h1')
    const search = document.querySelector('main input')?.closest('div.rounded-full')
    const cats = [...document.querySelectorAll('a[href*="category"]')]
    const articles = [...document.querySelectorAll('article')]
    const header = document.querySelector('header')
    return {
      header: rect(header),
      h1: { ...rect(h1), fs: h1 && getComputedStyle(h1).fontSize },
      search: rect(search),
      cat0: rect(cats[0]),
      articles: articles.map(rect),
      contentMax: document.querySelector('main section') && getComputedStyle(document.querySelector('main section')).maxWidth,
    }
  })
  console.log(JSON.stringify(metrics, null, 2))

  const ref = refBuf.toString('base64')
  const cur = fs.readFileSync('compare-current.png').toString('base64')
  await page.setViewportSize({ width: 1966, height: 764 })
  await page.setContent(`<!doctype html><html><body style="margin:0;display:flex;background:#111">
    <div style="width:983px;height:764px;overflow:hidden;position:relative">
      <img src="data:image/png;base64,${ref}" style="width:983px;height:auto;display:block"/>
      <div style="position:absolute;top:6px;left:6px;background:#000a;color:#fff;padding:4px 8px;font:12px sans-serif">REFERENCE</div>
    </div>
    <div style="width:983px;height:764px;overflow:hidden;position:relative">
      <img src="data:image/png;base64,${cur}" style="width:983px;height:764px"/>
      <div style="position:absolute;top:6px;left:6px;background:#000a;color:#fff;padding:4px 8px;font:12px sans-serif">CURRENT</div>
    </div>
  </body></html>`)
  await page.waitForTimeout(400)
  await page.screenshot({ path: 'compare-side-by-side.png' })
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
