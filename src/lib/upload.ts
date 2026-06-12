const MAX_SERVERLESS_BYTES = 4 * 1024 * 1024 // 4MB

export async function uploadFile(file: File): Promise<string> {

  // ── Small file: go through your existing API route ───────────────────────
  if (file.size <= MAX_SERVERLESS_BYTES) {
    const fd = new FormData()
    fd.append('file', file)

    const res  = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()

    if (!json.success) throw new Error(json.error || 'Upload failed')
    return json.url
  }

  // ── Large file: get signature then upload direct to Cloudinary ───────────
  // Step 1: get signature from your API
  const signRes  = await fetch('/api/upload/sign', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ mime: file.type, filename: file.name }),
  })
  const signJson = await signRes.json()
  if (!signJson.success) throw new Error('Could not sign upload')

  const {
    timestamp,
    signature,
    folder,
    resourceType,
    cloudName,
    apiKey,
  } = signJson

  // Step 2: upload direct to Cloudinary (no Vercel size limit)
  const fd = new FormData()
  fd.append('file',       file)
  fd.append('api_key',    apiKey)
  fd.append('timestamp',  String(timestamp))
  fd.append('signature',  signature)
  fd.append('folder',     folder)

  const uploadRes  = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: fd }
  )
  const uploadJson = await uploadRes.json()

  if (uploadJson.error) {
    throw new Error(uploadJson.error.message || 'Cloudinary upload failed')
  }

  return uploadJson.secure_url
}