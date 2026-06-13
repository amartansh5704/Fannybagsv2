'use client'

import { useState, useRef } from 'react'
import { Plus, X, Upload, Music2, Loader2, Image as ImageIcon, FileText } from 'lucide-react'
import { uploadFile } from '@/lib/upload'

const GENRES = [
  'Hip-Hop / Rap', 'Indie Pop', 'R&B / Soul', 'Electronic',
  'Folk / Acoustic', 'Bollywood Pop', 'Punjabi', 'Classical Fusion',
  'Rock', 'Jazz', 'Devotional', 'Other',
]

const CONTRIBUTOR_ROLES = [
  'Producer', 'Lyricist', 'Composer', 'Co-Writer',
  'Arranger', 'Mixing Engineer', 'Mastering Engineer', 'Other',
]

export interface Contributor {
  name: string
  role: string
}

interface DistributionData {
  releaseStatus: 'released' | 'unreleased' | ''
  migrationApproved: boolean
  releaseName: string
  primaryGenre: string
  releaseDate: string
  explicitLyrics: boolean
  coverArtDist: string
  primaryArtist: string
  additionalArtists: string[]
  songFileUrl: string
  hasFreeBeat: boolean
  spotifyLink: string
  appleMusicLink: string
  releaseType: 'single' | 'album'
  contributors: Contributor[]
}

interface Props {
  data: DistributionData
  onChange: (data: DistributionData) => void
}

// ── Distribution Contract Generator ──────────────────────────────────────────
function generateDistributionContract(artistName: string, releaseName: string) {
  const date    = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
  const year    = new Date().getFullYear()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Distribution Agreement — ${releaseName || 'Musical Work'}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Georgia',serif;background:#fff;color:#111;font-size:13px;line-height:1.8}
.page{max-width:780px;margin:0 auto;padding:56px 64px}
.header{text-align:center;border-bottom:3px solid #111;padding-bottom:28px;margin-bottom:36px}
.brand{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#666;margin-bottom:10px}
.doc-title{font-size:26px;font-weight:bold;letter-spacing:-0.5px;margin-bottom:6px}
.doc-sub{font-size:13px;color:#555}
.meta{display:flex;justify-content:space-between;margin-bottom:36px;padding:16px 20px;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;flex-wrap:wrap;gap:12px}
.meta-item{text-align:center}
.meta-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;display:block;margin-bottom:4px}
.meta-value{font-size:13px;font-weight:bold;color:#111}
.section{margin-bottom:32px}
.section-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;border-bottom:1px solid #e8e8e8;padding-bottom:6px;margin-bottom:16px;font-weight:bold}
p{margin-bottom:12px;text-align:justify}
strong{font-weight:bold}
.parties-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px}
.party-box{border:1px solid #e0e0e0;border-radius:6px;padding:18px}
.party-role{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px}
.party-name{font-size:15px;font-weight:bold;margin-bottom:4px}
.party-sub{font-size:12px;color:#555}
.highlight{background:#f0f4ff;border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:24px}
.highlight p{margin:0;color:#1e3a8a;font-weight:600;font-size:14px}
.clauses ol{padding-left:22px}
.clauses ol li{margin-bottom:14px;padding-left:4px}
.clauses ol li strong{display:block;margin-bottom:4px}
.rights-table{width:100%;border-collapse:collapse;margin:16px 0 24px}
.rights-table th{background:#f5f5f5;padding:10px 14px;text-align:left;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#555;border:1px solid #e0e0e0}
.rights-table td{padding:10px 14px;border:1px solid #e0e0e0;font-size:13px;vertical-align:top}
.rights-table tr:nth-child(even) td{background:#fafafa}
.tick{color:#16a34a;font-weight:bold}
.cross{color:#dc2626;font-weight:bold}
.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:52px}
.sig-box{border-top:2px solid #111;padding-top:12px}
.sig-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:6px}
.sig-name{font-weight:bold;font-size:14px;margin-bottom:2px}
.sig-role{font-size:12px;color:#555}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #e0e0e0;text-align:center;font-size:10px;color:#aaa;letter-spacing:0.5px}
@media print{body{background:white}.page{padding:40px}}
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="brand">FannyBags Platform</div>
    <div class="doc-title">Music Distribution Agreement</div>
    <div class="doc-sub">Non-Exclusive Digital Distribution & Royalty Reporting Contract</div>
  </div>

  <div class="meta">
    <div class="meta-item"><span class="meta-label">Date</span><span class="meta-value">${date}</span></div>
    <div class="meta-item"><span class="meta-label">Artist</span><span class="meta-value">${artistName || 'Artist'}</span></div>
    <div class="meta-item"><span class="meta-label">Release</span><span class="meta-value">${releaseName || 'Musical Work'}</span></div>
    <div class="meta-item"><span class="meta-label">Agreement Type</span><span class="meta-value">Non-Exclusive Distribution</span></div>
  </div>

  <div class="section">
    <div class="section-title">Parties to this Agreement</div>
    <div class="parties-grid">
      <div class="party-box">
        <div class="party-role">🎤 Artist (Licensor)</div>
        <div class="party-name">${artistName || 'The Artist'}</div>
        <div class="party-sub">Owner of Masters & IP<br/>Hereinafter referred to as "Artist"</div>
      </div>
      <div class="party-box">
        <div class="party-role">🏢 Distributor (Licensee)</div>
        <div class="party-name">FannyBags</div>
        <div class="party-sub">Digital Distribution Platform<br/>Hereinafter referred to as "FannyBags"</div>
      </div>
    </div>
  </div>

  <div class="highlight">
    <p>⚖️ IMPORTANT: The Artist retains full ownership of all Intellectual Property (IP), Master Recordings, and Copyrights. FannyBags is granted only a limited, non-exclusive licence to distribute the Work digitally. This agreement does not transfer any ownership rights to FannyBags.</p>
  </div>

  <div class="section">
    <div class="section-title">Rights Ownership Summary</div>
    <table class="rights-table">
      <thead>
        <tr>
          <th>Right</th>
          <th>Artist</th>
          <th>FannyBags</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Master Recording Ownership</td><td class="tick">✓ Retained</td><td class="cross">✗ Not granted</td></tr>
        <tr><td>Copyright / IP Ownership</td><td class="tick">✓ Retained</td><td class="cross">✗ Not granted</td></tr>
        <tr><td>Songwriting / Composition Rights</td><td class="tick">✓ Retained</td><td class="cross">✗ Not granted</td></tr>
        <tr><td>Digital Distribution Rights</td><td>Licensed to FannyBags</td><td class="tick">✓ Granted (non-exclusive)</td></tr>
        <tr><td>Royalty Reporting & Collection</td><td>Managed by FannyBags</td><td class="tick">✓ Authorised</td></tr>
        <tr><td>Migration to Other Distributors</td><td>Requires FannyBags approval</td><td class="tick">✓ Approval required</td></tr>
        <tr><td>Takedown / Deletion of Release</td><td>Requires FannyBags approval</td><td class="tick">✓ Approval required</td></tr>
        <tr><td>Sync / Licensing Rights</td><td class="tick">✓ Retained</td><td class="cross">✗ Not granted</td></tr>
        <tr><td>Merchandise Rights</td><td class="tick">✓ Retained</td><td class="cross">✗ Not granted</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section clauses">
    <div class="section-title">Terms and Conditions</div>
    <ol>
      <li>
        <strong>1. Grant of Distribution Licence</strong>
        The Artist grants FannyBags a non-exclusive, worldwide, royalty-bearing licence to distribute, deliver, and make available the musical work titled <strong>"${releaseName || 'the Work'}"</strong> (the "Work") across digital streaming platforms (DSPs) including but not limited to Spotify, Apple Music, YouTube Music, Amazon Music, JioSaavn, Gaana, and other platforms as determined by FannyBags. This licence is limited solely to digital distribution and does not extend to any other exploitation of the Work.
      </li>
      <li>
        <strong>2. Retention of Intellectual Property</strong>
        The Artist expressly retains full and exclusive ownership of: (a) all Master Recording rights; (b) all Copyright and Intellectual Property in the Work including lyrics, melody, and composition; (c) all Neighbouring Rights; (d) all Sync and Licensing rights; (e) all Moral Rights as recognised under applicable law. Nothing in this Agreement shall be construed as a transfer, assignment, or waiver of any such rights.
      </li>
      <li>
        <strong>3. Restrictions on Migration and Deletion</strong>
        The Artist acknowledges that FannyBags has made substantial investments in distributing and promoting the Work. Accordingly, the Artist shall NOT: (a) migrate the Work to another distributor without prior written consent from FannyBags; (b) request deletion or takedown of the Work from DSPs without prior written consent from FannyBags; (c) submit the same Work to any other distributor simultaneously during the term of this Agreement. Any unauthorised migration or takedown may result in loss of accrued royalties and legal liability.
      </li>
      <li>
        <strong>4. Royalty Collection and Payment</strong>
        FannyBags shall collect all streaming royalties generated by the Work from DSPs. FannyBags shall retain a platform commission as agreed separately and remit the remaining balance to the Artist's FannyBags wallet. FannyBags shall provide transparent royalty statements accessible through the Artist's dashboard. Royalty payments are processed periodically and are subject to DSP reporting timelines.
      </li>
      <li>
        <strong>5. Fan Revenue Sharing</strong>
        If the Artist has created a crowdfunding campaign for the Work on FannyBags, a portion of streaming royalties shall be distributed to Fan Investors as per the Fan Revenue Share percentage agreed upon in the campaign. This obligation survives the termination of this Distribution Agreement for as long as the Work generates streaming revenue.
      </li>
      <li>
        <strong>6. Platform Commission</strong>
        FannyBags shall retain a distribution service fee as specified in the platform's current pricing schedule. This fee covers distribution, royalty collection, reporting, and platform maintenance services. The fee schedule may be updated by FannyBags with 30 days' written notice to the Artist.
      </li>
      <li>
        <strong>7. Artist Warranties and Representations</strong>
        The Artist warrants and represents that: (a) they are the sole and legitimate owner of or hold all necessary rights to the Work; (b) the Work does not infringe any third-party copyright, trademark, or other intellectual property right; (c) the Work does not contain unlicensed samples or interpolations; (d) they have the full authority to enter into this Agreement; (e) the Work complies with all applicable laws and DSP content policies.
      </li>
      <li>
        <strong>8. Content Standards and DSP Compliance</strong>
        The Artist agrees that the Work shall comply with the content standards and terms of service of all DSPs through which it is distributed. FannyBags reserves the right to withhold or remove the Work from distribution if it violates DSP policies, applicable laws, or FannyBags' content guidelines, without liability to the Artist.
      </li>
      <li>
        <strong>9. Metadata and Accuracy</strong>
        The Artist is responsible for providing accurate metadata including title, artist name, genre, release date, ISRC codes (if applicable), and contributor information. FannyBags shall not be liable for errors in royalty reporting or distribution arising from inaccurate metadata provided by the Artist.
      </li>
      <li>
        <strong>10. Term and Termination</strong>
        This Agreement shall commence on the date of submission and continue for an initial term of 12 (twelve) months, automatically renewing for successive 12-month periods unless either party provides 60 days' written notice of termination. Upon termination: (a) FannyBags shall initiate takedown of the Work from DSPs within a commercially reasonable timeframe; (b) all accrued but unpaid royalties shall be remitted to the Artist; (c) Fan Revenue Sharing obligations shall survive termination.
      </li>
      <li>
        <strong>11. Indemnification</strong>
        The Artist shall indemnify, defend, and hold harmless FannyBags and its officers, directors, employees, and agents from and against any claims, damages, losses, and expenses (including reasonable legal fees) arising out of: (a) any breach of the Artist's warranties under this Agreement; (b) any third-party claims relating to the Work's content or ownership; (c) any misrepresentation made by the Artist.
      </li>
      <li>
        <strong>12. Limitation of Liability</strong>
        FannyBags shall not be liable for: (a) any failure or delay in distribution caused by DSP technical issues or policy changes; (b) fluctuations in streaming royalty rates set by DSPs; (c) any indirect, consequential, or punitive damages arising from this Agreement. FannyBags' total liability shall not exceed the total royalties collected on behalf of the Artist in the 3 months preceding the claim.
      </li>
      <li>
        <strong>13. Confidentiality</strong>
        Both parties agree to keep confidential any proprietary information, royalty data, or business terms disclosed under this Agreement, except as required by law or with the prior written consent of the other party.
      </li>
      <li>
        <strong>14. Amendments</strong>
        FannyBags reserves the right to amend these terms with 30 days' written notice. Continued use of FannyBags' distribution services after such notice constitutes acceptance of the amended terms.
      </li>
      <li>
        <strong>15. Governing Law and Jurisdiction</strong>
        This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of India. The parties agree to first attempt resolution through good-faith negotiation before commencing legal proceedings.
      </li>
      <li>
        <strong>16. Entire Agreement</strong>
        This Agreement, together with any campaign-specific terms accepted on the FannyBags platform, constitutes the entire agreement between the parties regarding the subject matter hereof and supersedes all prior negotiations, representations, or agreements, whether oral or written.
      </li>
    </ol>
  </div>

  <div class="section">
    <div class="section-title">Acknowledgement</div>
    <p>By submitting this release on the FannyBags platform, the Artist confirms that they have read, understood, and agreed to all terms of this Distribution Agreement. The Artist acknowledges that they retain full ownership of their Intellectual Property and Masters, and that FannyBags is granted only a limited, non-exclusive distribution licence as described herein.</p>
    <p>The Artist further acknowledges that migration to another distributor or deletion of the Work requires prior written approval from FannyBags, and that Fan Revenue Sharing obligations, if applicable, survive the term of this Agreement.</p>
  </div>

  <div class="signature-grid">
    <div class="sig-box">
      <div class="sig-label">Artist (Licensor)</div>
      <div class="sig-name">${artistName || 'Artist'}</div>
      <div class="sig-role">Recording Artist · ${date}</div>
    </div>
    <div class="sig-box">
      <div class="sig-label">Distributor (Licensee)</div>
      <div class="sig-name">FannyBags</div>
      <div class="sig-role">Digital Distribution Platform · ${date}</div>
    </div>
  </div>

  <div class="footer">
    <p>FannyBags Music Distribution Agreement · Generated ${date} · © ${year} FannyBags. All rights reserved.</p>
    <p style="margin-top:4px;">This document is generated for record-keeping purposes. For legal advice, consult a qualified music lawyer.</p>
  </div>

</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `FannyBags-Distribution-Agreement-${(releaseName || 'Release').replace(/\s+/g, '-')}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export default function DistributionDetail({ data, onChange }: Props) {
  const [newArtist, setNewArtist] = useState('')
  const [newContribName, setNewContribName] = useState('')
  const [newContribRole, setNewContribRole] = useState(CONTRIBUTOR_ROLES[0])

  const [songUploading, setSongUploading] = useState(false)
  const [songUploadError, setSongUploadError] = useState('')
  const [coverDistUploading, setCoverDistUploading] = useState(false)
  const [coverDistError, setCoverDistError] = useState('')

  const songFileRef  = useRef<HTMLInputElement>(null)
  const coverDistRef = useRef<HTMLInputElement>(null)

  const update = (key: keyof DistributionData, val: unknown) =>
    onChange({ ...data, [key]: val })

  const addArtist = () => {
    if (!newArtist.trim()) return
    update('additionalArtists', [...data.additionalArtists, newArtist.trim()])
    setNewArtist('')
  }

  const removeArtist = (idx: number) =>
    update('additionalArtists', data.additionalArtists.filter((_, i) => i !== idx))

  const addContributor = () => {
    if (!newContribName.trim()) return
    update('contributors', [...(data.contributors ?? []), { name: newContribName.trim(), role: newContribRole }])
    setNewContribName('')
    setNewContribRole(CONTRIBUTOR_ROLES[0])
  }

  const removeContributor = (idx: number) =>
    update('contributors', (data.contributors ?? []).filter((_, i) => i !== idx))

  const handleSongFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setSongUploading(true)
    setSongUploadError('')
    try {
      const url = await uploadFile(file)
      onChange({ ...data, songFileUrl: url })
    } catch (err: unknown) {
      setSongUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setSongUploading(false)
    }
  }

  const handleCoverDistUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setCoverDistUploading(true)
    setCoverDistError('')
    try {
      const url = await uploadFile(file)
      onChange({ ...data, coverArtDist: url })
    } catch (err: unknown) {
      setCoverDistError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setCoverDistUploading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .page { color: white; font-family: Inter, sans-serif; }
        .header { margin-bottom: 36px; }
        .title { font-size: 34px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.04em; }
        .subtitle { color: #71717a; font-size: 15px; }
        .section {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px; padding: 24px; margin-bottom: 22px; backdrop-filter: blur(20px);
        }
        .label {
          display: block; margin-bottom: 12px; color: #71717a; font-size: 11px;
          letter-spacing: 0.24em; text-transform: uppercase; font-weight: 700;
        }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .field { margin-bottom: 20px; }
        .input, .select {
          width: 100%; height: 58px; border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
          padding: 0 18px; color: white; outline: none; font-size: 14px;
          transition: all 0.3s ease; box-sizing: border-box;
        }
        .input:focus, .select:focus {
          border-color: rgba(168,85,247,0.45); box-shadow: 0 0 0 4px rgba(168,85,247,0.12);
        }
        .select option { background: #09090b; }
        .toggleGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .toggleBtn {
          height: 60px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); color: #71717a; cursor: pointer;
          font-size: 14px; font-weight: 600; transition: all 0.3s ease;
        }
        .toggleBtn:hover { border-color: rgba(255,255,255,0.18); }
        .activeGreen  { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.35);  color: #6ee7b7; }
        .activePurple { background: rgba(168,85,247,0.12); border-color: rgba(168,85,247,0.35);  color: #d8b4fe; }
        .activePink   { background: rgba(236,72,153,0.12); border-color: rgba(236,72,153,0.35);  color: #f9a8d4; }
        .warning {
          background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.18);
          border-radius: 22px; padding: 20px;
        }
        .warningTitle { color: #fcd34d; font-weight: 600; margin-bottom: 10px; }
        .warningText  { color: #71717a; line-height: 1.7; font-size: 14px; margin-bottom: 16px; }
        .checkRow { display: flex; align-items: center; gap: 12px; }
        .uploadBox {
          border: 1px dashed rgba(168,85,247,0.35); background: rgba(168,85,247,0.05);
          border-radius: 24px; padding: 38px 20px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px; text-align: center;
          cursor: pointer; transition: all 0.3s ease;
        }
        .uploadBox:hover { background: rgba(168,85,247,0.09); }
        .uploadTitle { font-size: 15px; font-weight: 600; }
        .uploadSub   { color: #71717a; font-size: 12px; }
        .artistWrap  { display: flex; gap: 10px; }
        .addBtn {
          height: 58px; border: none; padding: 0 18px; border-radius: 18px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white;
          font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;
        }
        .tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
        .tag {
          display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 10px 14px; font-size: 13px;
        }
        .remove { background: transparent; border: none; color: #71717a; cursor: pointer; }
        .contributors { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
        .contributor {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 16px;
        }
        .contributorName { font-size: 14px; font-weight: 600; }
        .contributorRole { color: #71717a; font-size: 12px; margin-top: 4px; }
        .uploadedCard {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.18);
          border-radius: 22px; padding: 18px;
        }
        .uploadedLeft { display: flex; align-items: center; gap: 14px; }
        .uploadedIcon {
          width: 46px; height: 46px; border-radius: 14px; background: rgba(34,197,94,0.12);
          display: flex; align-items: center; justify-content: center; color: #4ade80;
        }
        .uploadedName { font-size: 14px; font-weight: 600; max-width: 500px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .uploadedSub  { margin-top: 4px; color: #71717a; font-size: 12px; }
        .removeBtn { background: transparent; border: none; color: #71717a; cursor: pointer; }
        .uploadingZone {
          border: 1px dashed rgba(168,85,247,0.3); background: rgba(168,85,247,0.03);
          border-radius: 24px; padding: 38px 20px; display: flex; flex-direction: column;
          align-items: center; gap: 10px; text-align: center;
        }
        .uploadingText { font-size: 13px; color: #9f7aea; }
        .errorBox {
          margin-top: 8px; padding: 10px 14px; background: rgba(239,68,68,0.08);
          border: 0.5px solid rgba(239,68,68,0.2); border-radius: 10px; font-size: 12px; color: #f87171;
        }
        .coverCard {
          display: flex; gap: 16px; align-items: center; background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px 16px;
        }
        .coverImg {
          width: 72px; height: 72px; object-fit: cover; border-radius: 10px; flex-shrink: 0;
          border: 0.5px solid rgba(255,255,255,0.07);
        }
        .coverInfo   { flex: 1; min-width: 0; }
        .coverStatus { font-size: 11px; color: #34d399; margin-bottom: 8px; }
        .coverRemove {
          background: none; border: none; font-size: 11.5px; color: #f87171;
          cursor: pointer; font-family: inherit; padding: 0;
        }
        @keyframes distSpin { to { transform: rotate(360deg); } }
        .distSpin { animation: distSpin 1s linear infinite; color: #7c3aed; }
        @media (max-width: 900px) {
          .grid { grid-template-columns: 1fr; }
          .toggleGrid { grid-template-columns: 1fr; }
          .artistWrap { flex-direction: column; }
          .coverCard { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* Hidden file inputs */}
      <input ref={songFileRef}  type="file" accept="audio/*" style={{ display:'none' }} onChange={handleSongFileUpload} />
      <input ref={coverDistRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleCoverDistUpload} />

      <div className="page">
        <div className="header">
          <div className="title">Distribution Details</div>
          <div className="subtitle">Tell us about your release and streaming setup.</div>
        </div>

        {/* RELEASE STATUS */}
        <div className="section">
          <label className="label">Release Status *</label>
          <div className="toggleGrid">
            <button type="button" onClick={() => update('releaseStatus', 'released')}
              className={`toggleBtn ${data.releaseStatus === 'released' ? 'activeGreen' : ''}`}>
              🎵 Already Released
            </button>
            <button type="button" onClick={() => update('releaseStatus', 'unreleased')}
              className={`toggleBtn ${data.releaseStatus === 'unreleased' ? 'activePurple' : ''}`}>
              🚀 Unreleased
            </button>
          </div>
        </div>

        {/* RELEASED */}
        {data.releaseStatus === 'released' && (
          <div className="section">
            <div className="warning">
              <div className="warningTitle">⚠ Migration Approval Required</div>
              <div className="warningText">
                Allow FANNYBAGS to manage royalty reporting and migration for your existing release.
              </div>
              <label className="checkRow">
                <input type="checkbox" checked={data.migrationApproved}
                  onChange={e => update('migrationApproved', e.target.checked)} />
                <span>I approve migration management</span>
              </label>
            </div>

            <div className="field" style={{ marginTop:20 }}>
              <label className="label">Spotify Link</label>
              <input type="url" value={data.spotifyLink} onChange={e => update('spotifyLink', e.target.value)}
                placeholder="https://open.spotify.com/track/..." className="input" />
            </div>

            <div className="field">
              <label className="label">Apple Music Link</label>
              <input type="url" value={data.appleMusicLink} onChange={e => update('appleMusicLink', e.target.value)}
                placeholder="https://music.apple.com/..." className="input" />
            </div>
          </div>
        )}

        {/* UNRELEASED */}
        {data.releaseStatus === 'unreleased' && (
          <>
            {/* Release Type */}
            <div className="section">
              <label className="label">Release Type *</label>
              <div className="toggleGrid">
                <button type="button" onClick={() => update('releaseType', 'single')}
                  className={`toggleBtn ${data.releaseType === 'single' ? 'activePink' : ''}`}>
                  🎤 Single Track
                </button>
                <button type="button" onClick={() => update('releaseType', 'album')}
                  className={`toggleBtn ${data.releaseType === 'album' ? 'activePink' : ''}`}>
                  💿 Album / EP
                </button>
              </div>
            </div>

            {/* Song details */}
            <div className="section">
              <div className="grid">
                <div className="field">
                  <label className="label">Release Name *</label>
                  <input type="text" value={data.releaseName} onChange={e => update('releaseName', e.target.value)}
                    placeholder="Album or single name" className="input" />
                </div>
                <div className="field">
                  <label className="label">Primary Genre *</label>
                  <select value={data.primaryGenre} onChange={e => update('primaryGenre', e.target.value)} className="select">
                    <option value="">Select genre</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Release Date *</label>
                  <input type="date" value={data.releaseDate} onChange={e => update('releaseDate', e.target.value)} className="input" />
                </div>
                <div className="field">
                  <label className="label">Explicit Lyrics</label>
                  <label className="checkRow">
                    <input type="checkbox" checked={data.explicitLyrics} onChange={e => update('explicitLyrics', e.target.checked)} />
                    <span>Contains explicit content</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Artists */}
            <div className="section">
              <div className="field">
                <label className="label">Primary Artist *</label>
                <input type="text" value={data.primaryArtist} onChange={e => update('primaryArtist', e.target.value)}
                  placeholder="Artist name" className="input" />
              </div>
              <div className="field">
                <label className="label">Featured Artists</label>
                <div className="artistWrap">
                  <input type="text" value={newArtist} onChange={e => setNewArtist(e.target.value)}
                    placeholder="Add featured artist..." className="input" />
                  <button type="button" onClick={addArtist} className="addBtn"><Plus size={16} /> Add</button>
                </div>
                {data.additionalArtists.length > 0 && (
                  <div className="tags">
                    {data.additionalArtists.map((a, i) => (
                      <div key={i} className="tag">{a}
                        <button type="button" className="remove" onClick={() => removeArtist(i)}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Art Upload */}
            <div className="section">
              <label className="label">Cover Art</label>

              {coverDistUploading && (
                <div className="uploadingZone">
                  <Loader2 size={24} className="distSpin" />
                  <div className="uploadingText">Uploading cover art...</div>
                </div>
              )}

              {!coverDistUploading && data.coverArtDist && (
                <div className="coverCard">
                  <img src={data.coverArtDist} alt="cover" className="coverImg" />
                  <div className="coverInfo">
                    <div className="coverStatus">✓ Uploaded to cloud</div>
                    <button type="button" className="coverRemove"
                      onClick={() => update('coverArtDist', '')}>Remove cover</button>
                  </div>
                </div>
              )}

              {!coverDistUploading && !data.coverArtDist && (
                <div className="uploadBox" onClick={() => coverDistRef.current?.click()}
                  role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && coverDistRef.current?.click()}>
                  <ImageIcon size={30} style={{ color:'#7c3aed' }} />
                  <div className="uploadTitle">Upload Cover Art</div>
                  <div className="uploadSub">JPG, PNG, WEBP — min 500×500px recommended</div>
                </div>
              )}

              <p style={{ fontSize:11, color:'#52525b', marginTop:8, lineHeight:1.6 }}>
                File too large?{' '}
                <a href="https://www.freeconvert.com/image-compressor" target="_blank" rel="noreferrer"
                  style={{ color:'#c084fc', textDecoration:'none', fontWeight:700 }}>
                  Compress image free here ↗
                </a>
              </p>

              {coverDistError && <div className="errorBox">⚠ {coverDistError} — please try again</div>}
            </div>

            {/* Song File Upload */}
            <div className="section">
              <div className="field">
                <label className="label">{data.releaseType === 'album' ? 'Album / EP Upload' : 'Song Upload'}</label>

                {songUploading && (
                  <div className="uploadingZone">
                    <Loader2 size={24} className="distSpin" />
                    <div className="uploadingText">Uploading audio file...</div>
                  </div>
                )}

                {!songUploading && data.songFileUrl && (
                  <div className="uploadedCard">
                    <div className="uploadedLeft">
                      <div className="uploadedIcon"><Music2 size={18} /></div>
                      <div>
                        <div className="uploadedName">✓ Audio uploaded</div>
                        <div className="uploadedSub">Upload completed successfully</div>
                      </div>
                    </div>
                    <button type="button" className="removeBtn" onClick={() => update('songFileUrl', '')}><X size={16} /></button>
                  </div>
                )}

                {!songUploading && !data.songFileUrl && (
                  <div className="uploadBox" onClick={() => songFileRef.current?.click()}
                    role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && songFileRef.current?.click()}>
                    <Upload size={30} style={{ color:'#7c3aed' }} />
                    <div className="uploadTitle">{data.releaseType === 'album' ? 'Upload Album / EP Files' : 'Upload Song File'}</div>
                    <div className="uploadSub">MP3, WAV, FLAC — max 100MB</div>
                  </div>
                )}

                <p style={{ fontSize:11, color:'#52525b', marginTop:8, lineHeight:1.6 }}>
                  File too large?{' '}
                  <a href="https://www.freeconvert.com/wav-compressor" target="_blank" rel="noreferrer"
                    style={{ color:'#c084fc', textDecoration:'none', fontWeight:700 }}>
                    Compress audio free here ↗
                  </a>
                </p>

                {songUploadError && <div className="errorBox">⚠ {songUploadError} — please try again</div>}
              </div>

              <div className="field" style={{ marginTop:20 }}>
                <label className="label">Free Beat / Sample</label>
                <label className="checkRow">
                  <input type="checkbox" checked={data.hasFreeBeat} onChange={e => update('hasFreeBeat', e.target.checked)} />
                  <span>Beat is royalty-free</span>
                </label>
              </div>
            </div>

            {/* Contributors */}
            <div className="section">
              <label className="label">Contributors</label>
              <div className="artistWrap">
                <input type="text" value={newContribName} onChange={e => setNewContribName(e.target.value)}
                  placeholder="Contributor name" className="input" />
                <select value={newContribRole} onChange={e => setNewContribRole(e.target.value)} className="select">
                  {CONTRIBUTOR_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="button" onClick={addContributor} className="addBtn"><Plus size={16} /> Add</button>
              </div>
              {(data.contributors ?? []).length > 0 && (
                <div className="contributors">
                  {(data.contributors ?? []).map((c, i) => (
                    <div key={i} className="contributor">
                      <div>
                        <div className="contributorName">{c.name}</div>
                        <div className="contributorRole">{c.role}</div>
                      </div>
                      <button type="button" className="remove" onClick={() => removeContributor(i)}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── DISTRIBUTION CONTRACT ──────────────────────────────────────────── */}
        {data.releaseStatus !== '' && (
          <div className="section" style={{ background:'linear-gradient(135deg,rgba(168,85,247,0.06),rgba(236,72,153,0.03))', border:'1px solid rgba(168,85,247,0.18)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
              {/* Icon */}
              <div style={{ width:48, height:48, borderRadius:14, background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <FileText size={22} color="#c084fc" />
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 6px 0' }}>
                  Distribution Agreement
                </h3>
                <p style={{ fontSize:13, color:'#71717a', margin:'0 0 16px 0', lineHeight:1.6 }}>
                  By submitting this release, you agree to FannyBags&apos; Distribution Agreement. This document confirms that:
                </p>

                {/* Key points */}
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                  {[
                    { icon:'✅', text:'You retain full ownership of your Masters and IP' },
                    { icon:'✅', text:'FannyBags receives a non-exclusive distribution licence only' },
                    { icon:'⚠️', text:'Migration to another distributor requires FannyBags approval' },
                    { icon:'⚠️', text:'Deletion or takedown of the release requires FannyBags approval' },
                    { icon:'📊', text:'Royalties are collected and reported by FannyBags' },
                    { icon:'💎', text:'Fan Revenue Sharing obligations survive termination' },
                  ].map((point, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>{point.icon}</span>
                      <span style={{ fontSize:13, color:'#a1a1aa', fontWeight:500 }}>{point.text}</span>
                    </div>
                  ))}
                </div>

                {/* Download button */}
                <button
                  type="button"
                  onClick={() => generateDistributionContract(
                    data.primaryArtist,
                    data.releaseName,
                  )}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform    = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow    = '0 6px 24px rgba(168,85,247,0.3)'
                    e.currentTarget.style.borderColor  = 'rgba(168,85,247,0.45)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform    = 'translateY(0)'
                    e.currentTarget.style.boxShadow    = 'none'
                    e.currentTarget.style.borderColor  = 'rgba(168,85,247,0.25)'
                  }}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:8,
                    padding:'12px 22px', borderRadius:14,
                    background:'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.1))',
                    border:'1px solid rgba(168,85,247,0.25)',
                    color:'#c084fc', fontSize:14, fontWeight:700,
                    cursor:'pointer', transition:'all 0.3s ease',
                    fontFamily:'inherit',
                  }}
                >
                  <FileText size={16} />
                  Download Distribution Agreement
                </button>

                <p style={{ fontSize:11, color:'#3f3f46', marginTop:10, lineHeight:1.6 }}>
                  ℹ️ This agreement is auto-generated based on your release details. For legal advice, consult a qualified music lawyer.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}