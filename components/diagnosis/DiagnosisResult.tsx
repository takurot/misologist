import type { DiagnosisResult as DiagnosisResultType } from '@/types';
import { useLocale } from '@/components/LocaleProvider';

const urgencyConfig = {
  GREEN: {
    badge: { bg: 'hsl(145, 40%, 9%)', border: 'hsl(145, 45%, 20%)', text: 'hsl(145, 55%, 52%)' },
    strip: { bg: 'hsl(145, 40%, 8%)', border: 'hsl(145, 45%, 16%)' },
  },
  YELLOW: {
    badge: { bg: 'hsl(35, 40%, 9%)', border: 'hsl(38, 50%, 24%)', text: 'hsl(38, 75%, 52%)' },
    strip: { bg: 'hsl(35, 40%, 8%)', border: 'hsl(38, 50%, 18%)' },
  },
  RED: {
    badge: { bg: 'hsl(4, 50%, 10%)', border: 'hsl(4, 55%, 28%)', text: 'hsl(4, 65%, 58%)' },
    strip: { bg: 'hsl(4, 50%, 8%)', border: 'hsl(4, 55%, 22%)' },
  },
};

interface DiagnosisResultProps {
  result: DiagnosisResultType;
}

export function DiagnosisResult({ result }: DiagnosisResultProps) {
  const { dict } = useLocale();
  const cfg = urgencyConfig[result.urgencyLevel];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Urgency Banner */}
      <div
        style={{
          padding: '1.5rem 2rem',
          background: cfg.strip.bg,
          border: `1px solid ${cfg.strip.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: result.urgencyLevel === 'RED' ? 'dangerPulse 2s ease-in-out infinite' : undefined,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: cfg.badge.text,
              marginBottom: '0.3rem',
            }}
          >
            {dict.diagnosisResult.urgencyHeading}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: cfg.badge.text,
              lineHeight: 1,
            }}
          >
            {dict.diagnosisResult.urgencyLabels[result.urgencyLevel]}
          </div>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '4rem',
            fontWeight: 300,
            color: cfg.badge.border,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {result.urgencyLevel}
        </div>
      </div>

      {/* Mold detection */}
      <div
        style={{
          background: 'hsl(25, 30%, 8%)',
          border: '1px solid hsl(25, 18%, 16%)',
          padding: '1.5rem',
          display: 'grid',
          gap: '1.25rem',
        }}
      >
        <InfoRow label={dict.diagnosisResult.detectedMold} value={result.moldType} large />
        <div style={{ borderTop: '1px solid hsl(25, 18%, 14%)', paddingTop: '1.25rem' }}>
          <InfoRow label={dict.diagnosisResult.cause} value={result.moldReason} />
        </div>
      </div>

      {/* Fermentation chemistry */}
      <div>
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>
          {dict.diagnosisResult.chemistry}
        </div>
        <div className="chemistry-block">
          {result.fermentationChemistry}
        </div>
      </div>

      {/* Immediate actions */}
      {result.immediateActions.length > 0 && (
        <div>
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            {dict.diagnosisResult.immediateActions}
          </div>
          <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {result.immediateActions.map((action, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  padding: '0.875rem 1.25rem',
                  background: 'hsl(25, 30%, 8%)',
                  border: '1px solid hsl(25, 18%, 14%)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    color: 'hsl(30, 68%, 45%)',
                    lineHeight: 1,
                    minWidth: '1.5rem',
                    textAlign: 'right',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'hsl(35, 20%, 80%)',
                    paddingTop: '0.1rem',
                  }}
                >
                  {action}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Prevention tips */}
      {result.preventionTips.length > 0 && (
        <div>
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>
            {dict.diagnosisResult.preventionTips}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result.preventionTips.map((tip, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  fontFamily: 'var(--font-lora), serif',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  color: 'hsl(35, 15%, 62%)',
                  padding: '0.25rem 0',
                  borderBottom: '1px solid hsl(25, 18%, 12%)',
                }}
              >
                <span style={{ color: 'hsl(30, 68%, 45%)', fontWeight: 500 }}>—</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Batch comparison */}
      {result.batchComparison && (
        <div
          style={{
            padding: '1.25rem',
            background: 'hsl(25, 30%, 8%)',
            border: '1px solid hsl(25, 18%, 16%)',
            borderLeft: '2px solid hsl(30, 68%, 40%)',
          }}
        >
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>
            {dict.diagnosisResult.batchComparison}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              color: 'hsl(35, 15%, 62%)',
            }}
          >
            {result.batchComparison}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: '0.4rem' }}>{label}</div>
      <p
        style={{
          fontFamily: large ? 'var(--font-cormorant), Georgia, serif' : 'var(--font-lora), serif',
          fontSize: large ? '1.3rem' : '0.9rem',
          fontWeight: large ? 400 : 400,
          color: 'hsl(35, 20%, 82%)',
          lineHeight: 1.5,
        }}
      >
        {value}
      </p>
    </div>
  );
}
