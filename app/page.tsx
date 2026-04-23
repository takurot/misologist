'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';

export default function HomePage() {
  const { dict } = useLocale();
  const [featureOne, featureTwo, featureThree] = dict.home.features;

  return (
    <div>
      {/* ── Hero ─────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '7rem 1.5rem 6rem',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Breathing background gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-20%',
            background: 'radial-gradient(ellipse 70% 60% at 50% 60%, hsl(28, 55%, 14%) 0%, transparent 70%)',
            animation: 'breathe 20s ease-in-out infinite',
            zIndex: 0,
          }}
        />
        {/* Secondary warm glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-10%',
            background: 'radial-gradient(ellipse 40% 35% at 30% 40%, hsl(8, 50%, 12%) 0%, transparent 65%)',
            animation: 'breathe 28s ease-in-out infinite reverse',
            zIndex: 0,
          }}
        />

        <div
          className="max-w-6xl mx-auto w-full"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Decorative label */}
          <div className="animate-in" style={{ marginBottom: '1.5rem' }}>
            <span className="section-label">{dict.home.label}</span>
          </div>

          {/* Main headline */}
          <h1
            className="animate-in delay-1"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              color: 'hsl(35, 25%, 90%)',
              marginBottom: '1.5rem',
              maxWidth: '18ch',
            }}
          >
            {dict.home.headlineLeading}<br />
            <em
              style={{
                fontStyle: 'italic',
                color: 'hsl(30, 68%, 55%)',
                fontWeight: 400,
              }}
            >
              {dict.home.headlineAccent}
            </em>
          </h1>

          {/* Sub copy */}
          <p
            className="animate-in delay-2"
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'hsl(35, 15%, 55%)',
              maxWidth: '44ch',
              marginBottom: '2.5rem',
            }}
          >
            {dict.home.descriptionLine1}<br />
            {dict.home.descriptionLine2}
          </p>

          <div className="animate-in delay-3">
            <Link href="/diagnosis">
              <span className="btn-primary">{dict.home.cta}</span>
            </Link>
          </div>
        </div>

        {/* Large decorative kanji */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-2%',
            top: '10%',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(12rem, 22vw, 26rem)',
            fontWeight: 300,
            color: 'hsl(25, 30%, 11%)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.05em',
            zIndex: 0,
          }}
        >
          {dict.home.decorativeMark}
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid hsl(25, 18%, 12%)',
          padding: '0 1.5rem',
        }}
      >
        <div
          className="max-w-6xl mx-auto"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}
        >
          {/* Feature 01 — large */}
          <FeatureCard
            num="01"
            href="/diagnosis"
            title={featureOne.title}
            subtitle={featureOne.subtitle}
            description={featureOne.description}
            delay="delay-1"
            large
          />
          {/* Feature 02 */}
          <FeatureCard
            num="02"
            href="/batches"
            title={featureTwo.title}
            subtitle={featureTwo.subtitle}
            description={featureTwo.description}
            delay="delay-2"
            borderLeft
          />
          {/* Feature 03 */}
          <FeatureCard
            num="03"
            href="/knowledge"
            title={featureThree.title}
            subtitle={featureThree.subtitle}
            description={featureThree.description}
            delay="delay-3"
            borderLeft
          />
        </div>
      </section>

      {/* ── Divider quote ────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto animate-in">
          <div
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'hsl(35, 20%, 65%)',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
            }}
          >
            &ldquo;{dict.home.quoteLine1}<br />
            {dict.home.quoteLine2}&rdquo;
          </div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'hsl(30, 68%, 45%)',
            }}
          >
            Misologist — Anthropic Hackathon 2025
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  num: string;
  href: string;
  title: string;
  subtitle: string;
  description: string;
  delay: string;
  large?: boolean;
  borderLeft?: boolean;
}

function FeatureCard({
  num, href, title, subtitle, description, delay, large, borderLeft,
}: FeatureCardProps) {
  const { dict } = useLocale();

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        className={`animate-in ${delay}`}
        style={{
          padding: large ? '3.5rem 2.5rem' : '3.5rem 2rem',
          borderLeft: borderLeft ? '1px solid hsl(25, 18%, 12%)' : undefined,
          height: '100%',
          transition: 'background 0.25s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'hsl(25, 30%, 8%)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '3.5rem',
            fontWeight: 300,
            color: 'hsl(30, 68%, 22%)',
            lineHeight: 1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          {num}
        </div>

        <div
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'hsl(30, 68%, 50%)',
            fontFamily: 'var(--font-lora), serif',
            marginBottom: '0.6rem',
          }}
        >
          {subtitle}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: large ? '1.8rem' : '1.5rem',
            fontWeight: 400,
            color: 'hsl(35, 25%, 88%)',
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.875rem',
            lineHeight: 1.75,
            color: 'hsl(35, 15%, 50%)',
          }}
        >
          {description}
        </p>

        <div
          style={{
            marginTop: '2rem',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'hsl(30, 55%, 45%)',
            fontFamily: 'var(--font-lora), serif',
          }}
        >
          {dict.home.featureExplore}
        </div>
      </article>
    </Link>
  );
}
