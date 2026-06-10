'use client'

import { Check } from 'lucide-react'

const steps = ['Song Detail', 'Distribution', 'Funding', 'Review']

export default function WizardProgress({ current }: { current: number }) {
  return (
    <>
      <style>{`
        @keyframes wpPulse { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.3)} 50%{box-shadow:0 0 0 8px rgba(139,92,246,0)} }
        @keyframes wpCheck { from{transform:scale(0) rotate(-45deg)} to{transform:scale(1) rotate(0deg)} }
      `}</style>

      <div style={{ display:'flex', alignItems:'flex-start', width:'100%' }}>
        {steps.map((label, idx) => {
          const stepNum = idx + 1
          const done    = stepNum < current
          const active  = stepNum === current
          const isLast  = idx === steps.length - 1

          return (
            <div key={label} style={{ display:'flex', alignItems:'flex-start', flex: isLast ? '0 0 auto' : 1 }}>

              {/* Step circle + label */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <div style={{
                  width:36, height:36, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, fontWeight:700,
                  transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  ...(done ? {
                    background:'rgba(16,185,129,0.15)',
                    border:'2px solid rgba(16,185,129,0.4)',
                    color:'#34d399',
                    boxShadow:'0 0 16px rgba(16,185,129,0.15)',
                  } : active ? {
                    background:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.15))',
                    border:'2px solid rgba(139,92,246,0.5)',
                    color:'#c4b5fd',
                    animation:'wpPulse 2s ease-in-out infinite',
                    boxShadow:'0 0 20px rgba(139,92,246,0.2)',
                  } : {
                    background:'rgba(255,255,255,0.04)',
                    border:'2px solid rgba(255,255,255,0.08)',
                    color:'#3f3f46',
                  }),
                }}>
                  {done ? (
                    <div style={{ animation:'wpCheck 0.3s ease-out' }}>
                      <Check size={16} />
                    </div>
                  ) : stepNum}
                </div>

                <span style={{
                  fontSize:11, fontWeight:600, whiteSpace:'nowrap',
                  transition:'all 0.3s ease',
                  color: done ? '#34d399' : active ? '#e4e4e7' : '#3f3f46',
                  letterSpacing: active ? '0.02em' : '0',
                }}>
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  flex:1, height:2, marginTop:17,
                  marginLeft:8, marginRight:8,
                  borderRadius:999,
                  position:'relative', overflow:'hidden',
                  background:'rgba(255,255,255,0.06)',
                }}>
                  {/* Filled portion */}
                  <div style={{
                    position:'absolute', top:0, left:0, bottom:0,
                    width: done ? '100%' : '0%',
                    background:'linear-gradient(90deg,rgba(16,185,129,0.5),rgba(16,185,129,0.3))',
                    borderRadius:999,
                    transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                  {/* Active shimmer */}
                  {active && (
                    <div style={{
                      position:'absolute', top:0, left:0, bottom:0, width:'40%',
                      background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent)',
                      borderRadius:999,
                      animation:'rfGradShift 2s ease-in-out infinite',
                      backgroundSize:'200% 100%',
                    }} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}