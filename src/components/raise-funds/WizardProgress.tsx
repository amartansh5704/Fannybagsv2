import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const steps = ['Song Detail', 'Distribution', 'Funding Details', 'Review']

export default function WizardProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((label, idx) => {
        const stepNum = idx + 1
        const done = stepNum < current
        const active = stepNum === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all',
                done && 'bg-green-500/20 border-green-500/50 text-green-400',
                active && 'bg-purple-500/20 border-purple-500/60 text-purple-300',
                !done && !active && 'bg-white/5 border-white/10 text-zinc-600'
              )}>
                {done ? <Check size={14} /> : stepNum}
              </div>
              <span className={cn('text-xs whitespace-nowrap', active ? 'text-white' : 'text-zinc-600')}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn('flex-1 h-px mx-3 mb-4 transition-all', done ? 'bg-green-500/40' : 'bg-white/8')} />
            )}
          </div>
        )
      })}
    </div>
  )
}