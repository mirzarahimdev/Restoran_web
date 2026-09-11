const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 983, height: 764 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(3500)
  await page.screenshot({ path: 'compare-current.png', fullPage: false })

  const refPath =
    'C:/Users/user 7/.cursor/projects/c-Users-user-7-Desktop-restaran/assets/c__Users_user_7_AppData_Roaming_Cursor_User_workspaceStorage_ab7ac6efcb370096f46f466769134797_images_image-8fb00a6a-696b-42fe-bbd4-3a9d1ca588e9.png'
  const ref = fs.readFileSync(refPath).toString('base64')
  const cur = fs.readFileSync('compare-current.png').toString('base64')

  await page.setViewportSize({ width: 1966, height: 764 })
  await page.setContent(`<!doctype html><html><body style="margin:0;display:flex;background:#111">
    <div style="width:983px;height:764px;position:relative;overflow:hidden">
      <img src="data:image/png;base64,${ref}" style="width:983px;height:auto;display:block"/>
      <div style="position:absolute;top:6px;left:6px;background:#000a;color:#fff;padding:4px 8px;font:12px sans-serif;border-radius:4px">REFERENCE</div>
    </div>
    <div style="width:983px;height:764px;position:relative;overflow:hidden">
      <img src="data:image/png;base64,${cur}" style="width:983px;height:764px;display:block"/>
      <div style="position:absolute;top:6px;left:6px;background:#000a;color:#fff;padding:4px 8px;font:12px sans-serif;border-radius:4px">CURRENT</div>
    </div>
  </body></html>`)
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'compare-side-by-side.png' })
  await browser.close()
  console.log('ok')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
