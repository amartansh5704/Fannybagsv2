import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {

  // ── Image uploader (cover art, screenshots, profile pics) ────────────────
  imageUploader: f({
    image: { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      // No auth required — public upload
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      console.log('[UPLOAD] image complete:', file.url)
      return { url: file.url }
    }),

  // ── Audio uploader (demo tracks, song files) ──────────────────────────────
  audioUploader: f({
    audio: { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      console.log('[UPLOAD] audio complete:', file.url)
      return { url: file.url }
    }),

  // ── Any file uploader (docs, videos, anything) ────────────────────────────
  generalUploader: f({
    image:   { maxFileSize: '16MB', maxFileCount: 1 },
    audio:   { maxFileSize: '16MB', maxFileCount: 1 },
    video:   { maxFileSize: '64MB', maxFileCount: 1 },
    pdf:     { maxFileSize: '16MB', maxFileCount: 1 },
    'text/plain': { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      console.log('[UPLOAD] file complete:', file.url)
      return { url: file.url }
    }),

} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter