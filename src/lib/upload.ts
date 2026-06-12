export async function uploadFile(file: File): Promise<string> {

  // ── All files go direct to Cloudinary via signed upload ──────────────────
  // This bypasses Vercel's 4.5MB serverless body limit entirely.

  // Step 1 — get a signed upload token from your API
  const signRes = await fetch('/api/upload/sign', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ mime: file.type, filename: file.name }),
  })

  if (!signRes.ok) {
    throw new Error('Failed to get upload signature')
  }

  const signJson = await signRes.json()
  if (!signJson.success) throw new Error('Could not sign upload')

  const { timestamp, signature, folder, resourceType, cloudName, apiKey } = signJson

  // ── Guard: make sure cloudName came back correctly ────────────────────────
  if (!cloudName || cloudName === 'undefined') {
    throw new Error('Cloudinary cloud name is not configured on the server')
  }

  // Step 2 — upload directly from browser to Cloudinary (no Vercel limit)
  const fd = new FormData()
  fd.append('file',      file)
  fd.append('api_key',   apiKey)
  fd.append('timestamp', String(timestamp))
  fd.append('signature', signature)
  fd.append('folder',    folder)

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: fd }
  )

  const uploadJson = await uploadRes.json()

  if (uploadJson.error) {
    throw new Error(uploadJson.error.message || 'Cloudinary upload failed')
  }

  if (!uploadJson.secure_url) {
    throw new Error('No URL returned from Cloudinary')
  }

  return uploadJson.secure_url
}