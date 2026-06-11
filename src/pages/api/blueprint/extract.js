// Generator stage 1: extract structured data from the uploads.
// POST { ciFile?: {name,type,dataBase64}, prodFile?: {name,type,dataBase64} }
//  -> { ok, ciProvided, ci: {pattern,naturalEU,jobEU,traitNarrative}, productionSummary }
//
// CI PDFs go to Sonnet as native document blocks (no parsing libs).
// Production xlsx is converted to CSV text server-side (xlsx package);
// production pdf/images also go as document/image blocks.

import { callClaude, extractJson, apiConfigured } from '@/lib/anthropic'

export const config = {
  maxDuration: 60,
  api: { bodyParser: { sizeLimit: '4mb' } },
}

function fileBlock(file) {
  const type = (file.type || '').toLowerCase()
  if (type === 'application/pdf') {
    return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: file.dataBase64 } }
  }
  if (type.startsWith('image/')) {
    return { type: 'image', source: { type: 'base64', media_type: type, data: file.dataBase64 } }
  }
  return null
}

async function xlsxToText(file) {
  const XLSX = await import('xlsx')
  const wb = XLSX.read(Buffer.from(file.dataBase64, 'base64'), { type: 'buffer' })
  const parts = []
  for (const name of wb.SheetNames.slice(0, 3)) {
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name])
    parts.push(`--- Sheet: ${name} ---\n${csv.slice(0, 12000)}`)
  }
  return parts.join('\n\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  if (!apiConfigured()) {
    return res.status(200).json({ ok: false, error: 'The generator isn’t switched on yet — Brian needs to add the API key.' })
  }

  const { ciFile = null, prodFile = null } = req.body || {}
  const content = []
  let prodNote = '(no production file provided)'

  try {
    if (ciFile?.dataBase64) {
      const block = fileBlock(ciFile)
      if (block) {
        content.push({ type: 'text', text: 'FILE 1 — the agent’s Culture Index report:' })
        content.push(block)
      }
    }
    if (prodFile?.dataBase64) {
      const type = (prodFile.type || '').toLowerCase()
      const isSheet =
        type.includes('spreadsheetml') || type.includes('ms-excel') || /\.(xlsx|xls|csv)$/i.test(prodFile.name || '')
      if (isSheet) {
        const text = type.includes('csv') || /\.csv$/i.test(prodFile.name || '')
          ? Buffer.from(prodFile.dataBase64, 'base64').toString('utf8').slice(0, 14000)
          : await xlsxToText(prodFile)
        content.push({ type: 'text', text: `FILE 2 — the agent’s production data (from ${prodFile.name}):\n${text}` })
        prodNote = ''
      } else {
        const block = fileBlock(prodFile)
        if (block) {
          content.push({ type: 'text', text: 'FILE 2 — the agent’s production report:' })
          content.push(block)
          prodNote = ''
        }
      }
    }

    content.push({
      type: 'text',
      text: `Extract the following from the file(s) above. ${ciFile ? '' : 'NO Culture Index report was provided — leave CI fields as empty strings. '}${prodNote}

Reply with ONLY JSON:
{
  "pattern": "<CI profile pattern name, e.g. Persuader, Specialist, Rainmaker — or ''>",
  "naturalEU": "<number or ''>",
  "jobEU": "<number or ''>",
  "traitNarrative": "<3-6 sentence summary of the CI trait narratives, or ''>",
  "productionSummary": "<6-10 line plain-text summary: total transactions, total volume, avg price, price band, geography, deal mix (buyer/seller), velocity/trend, sold-to-list if visible — real numbers, or '' if no production data>"
}`,
    })

    if (content.length === 1 && !ciFile && !prodFile) {
      // Nothing uploaded — valid (CI may come from Brian; production typed answers only)
      return res.status(200).json({
        ok: true,
        ciProvided: false,
        ci: { pattern: '', naturalEU: '', jobEU: '', traitNarrative: '' },
        productionSummary: '',
      })
    }

    const result = await callClaude({
      system: 'You are a precise data-extraction engine for a real-estate coaching platform. Extract only what is actually in the documents. Never invent numbers.',
      messages: [{ role: 'user', content }],
      maxTokens: 1200,
    })
    if (!result.ok) {
      return res.status(502).json({ ok: false, error: 'Couldn’t read your files. Try again, or use smaller PDFs.' })
    }

    const data = extractJson(result.text)
    if (!data) {
      return res.status(502).json({ ok: false, error: 'Couldn’t make sense of the files. Try a clearer PDF.' })
    }

    return res.status(200).json({
      ok: true,
      ciProvided: !!(ciFile && data.pattern),
      ci: {
        pattern: data.pattern || '',
        naturalEU: data.naturalEU ?? '',
        jobEU: data.jobEU ?? '',
        traitNarrative: data.traitNarrative || '',
      },
      productionSummary: data.productionSummary || '',
    })
  } catch (e) {
    console.error('extract failed:', e)
    return res.status(500).json({ ok: false, error: 'Something went wrong reading your files.' })
  }
}
