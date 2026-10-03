import { mkdir, writeFile } from 'node:fs/promises'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'
import { launch } from 'chrome-launcher'

const base = process.env.AUDIT_URL || 'http://127.0.0.1:4173'
const output = 'reports/lighthouse'
await mkdir(output, { recursive: true })
const browser = await launch({ chromeFlags: ['--headless', '--no-first-run'], chromePath: process.env.CHROME_PATH })
const summary = { date: new Date().toISOString(), node: process.version, platform: process.platform, base, note: 'Auditoria da implementação atual da Home e do detalhe REST disponível.', results: [] }
try {
  for (const path of ['/', '/nfts/nft-1']) {
    for (const profile of ['mobile', 'desktop']) {
      const runs = []
      for (let run = 1; run <= 3; run++) {
        const result = await lighthouse(`${base}${path}`, { port: browser.port, output: ['html', 'json'], logLevel: 'error' }, {
          extends: 'lighthouse:default',
          settings: { onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], ...(profile === 'desktop' ? { ...desktopConfig.settings, screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false } } : {}) },
        })
        if (!result) throw new Error('Lighthouse não retornou resultado')
        if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message)
        const name = `${path === '/' ? 'home' : 'detail'}-${profile}-${run}`
        await writeFile(`${output}/${name}.html`, result.report[0])
        await writeFile(`${output}/${name}.json`, result.report[1])
        console.log(`Concluído: ${name}`)
        runs.push({ version: result.lhr.lighthouseVersion, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, (category.score || 0) * 100])), LCP: result.lhr.audits['largest-contentful-paint'].numericValue, CLS: result.lhr.audits['cumulative-layout-shift'].numericValue, TBT: result.lhr.audits['total-blocking-time'].numericValue, environment: result.lhr.environment })
      }
      const median = (values) => [...values].sort((a, b) => a - b)[1]
      summary.results.push({ path, profile, runs, median: { ...Object.fromEntries(Object.keys(runs[0].scores).map((key) => [key, median(runs.map((run) => run.scores[key]))])), LCP: median(runs.map((run) => run.LCP)), CLS: median(runs.map((run) => run.CLS)), TBT: median(runs.map((run) => run.TBT)) } })
    }
  }
  await writeFile(`${output}/summary.json`, JSON.stringify(summary, null, 2))
  console.log(`Relatórios gravados em ${output}`)
} finally { await browser.kill() }
