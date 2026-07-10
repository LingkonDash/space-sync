'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the useGSAP hook safely
gsap.registerPlugin(useGSAP);

interface MetricCard {
  id: string;
  label: string;
  targetValue: number;
  suffix: string;
  badge: string;
  badgeType: 'success' | 'neutral';
  chartType: 'line' | 'bar' | 'radial';
}

const metricsData: MetricCard[] = [
  {
    id: '1',
    label: 'Spaces Listed',
    targetValue: 1200,
    suffix: '+',
    badge: '+18% this month',
    badgeType: 'success',
    chartType: 'line',
  },
  {
    id: '2',
    label: 'Cities Covered',
    targetValue: 45,
    suffix: '',
    badge: '+8 new cities',
    badgeType: 'neutral',
    chartType: 'bar',
  },
  {
    id: '3',
    label: 'Active Hosts',
    targetValue: 850,
    suffix: '+',
    badge: '+24% this month',
    badgeType: 'success',
    chartType: 'line',
  },
  {
    id: '4',
    label: 'Completed Bookings',
    targetValue: 18,
    suffix: 'K+',
    badge: '+32% this month',
    badgeType: 'success',
    chartType: 'radial',
  },
];

export default function ImpactMetrics() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Reveal cards with a fluid, staggered cinematic entrance
    gsap.fromTo(
      '.metric-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' }
    );

    // 2. Smooth Numerical Counter Ticking Effect
    const countElements = gsap.utils.toArray<HTMLElement>('.counter-value');
    countElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 2,
        ease: 'power3.out',
        delay: 0.2,
        onUpdate: () => {
          el.innerText = Math.floor(obj.value).toLocaleString();
        },
      });
    });

    // 3. Line Chart Animation (Drawing the line and fading the gradient area)
    gsap.fromTo(
      '.chart-line-path',
      { strokeDashoffset: 400, strokeDasharray: 400 },
      { strokeDashoffset: 0, duration: 2, ease: 'power2.out', delay: 0.4 }
    );
    gsap.fromTo(
      '.chart-area-fill',
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power1.out', delay: 1.2 }
    );
    gsap.fromTo(
      '.chart-line-dot',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.8, ease: 'back.out(2)' }
    );

    // 4. Bar Chart Animation (Scaling bars cleanly from base up)
    gsap.fromTo(
      '.chart-bar',
      { scaleY: 0 },
      { scaleY: 1, transformOrigin: 'bottom', duration: 1.4, stagger: 0.08, ease: 'elastic.out(1, 0.75)', delay: 0.5 }
    );

    // 5. Radial Chart Animation (Drawing the progress circle stroke)
    gsap.fromTo(
      '.chart-radial-fill',
      { strokeDashoffset: 220, strokeDasharray: 220 },
      { strokeDashoffset: 55, duration: 1.8, ease: 'power3.out', delay: 0.4 }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full px-4 py-12 md:px-8 max-w-7xl mx-auto bg-[var(--color-neutral-bg)]">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-neutral-text)]">
          Our Impact in Numbers
        </h2>
      </div>

      {/* Grid Setup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <div
            key={metric.id}
            className="metric-card opacity-0 bg-white border border-[var(--color-neutral-border)] rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            {/* Header / Text Metrics Details */}
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{metric.label}</p>
              <div className="flex items-baseline gap-1 text-3xl font-bold text-[var(--color-neutral-text)] mb-1">
                <span className="counter-value" data-target={metric.targetValue}>0</span>
                <span>{metric.suffix}</span>
              </div>
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                  metric.badgeType === 'success'
                    ? 'text-[var(--colro-accent)] bg-teal-50'
                    : 'text-slate-600 bg-slate-100'
                }`}
              >
                {metric.badge}
              </span>
            </div>

            {/* Dynamic Custom Chart Render Engine */}
            <div className="w-full h-24 mt-6 flex items-end overflow-hidden">
              {metric.chartType === 'line' && (
                <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id={`grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Shaded Area Under Line */}
                  <path
                    d="M 10 70 Q 35 50 55 60 T 110 35 T 155 50 T 190 20 L 190 80 L 10 80 Z"
                    fill={`url(#grad-${metric.id})`}
                    className="chart-area-fill"
                  />
                  {/* Clean SVG Vector Trendline */}
                  <path
                    d="M 10 70 Q 35 50 55 60 T 110 35 T 155 50 T 190 20"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="chart-line-path"
                  />
                  {/* Highlight Anchor Nodes */}
                  <circle cx="55" cy="60" r="3" fill="#4F46E5" className="chart-line-dot origin-center" />
                  <circle cx="110" cy="35" r="3" fill="#4F46E5" className="chart-line-dot origin-center" />
                  <circle cx="155" cy="50" r="3" fill="#4F46E5" className="chart-line-dot origin-center" />
                </svg>
              )}

              {metric.chartType === 'bar' && (
                <svg viewBox="0 0 200 80" className="w-full h-full items-end overflow-visible">
                  {/* Dynamic Height Proportional Layout Columns */}
                  <rect x="10" y="68" width="10" height="12" rx="4" fill="#4F46E5" className="chart-bar" />
                  <rect x="34" y="58" width="10" height="22" rx="4" fill="#4F46E5" className="chart-bar" />
                  <rect x="58" y="48" width="10" height="32" rx="4" fill="#4F46E5" className="chart-bar" />
                  <rect x="82" y="54" width="10" height="26" rx="4" fill="#4F46E5" className="chart-bar" />
                  <rect x="106" y="32" width="10" height="48" rx="4" fill="#4F46E5" className="chart-bar" />
                  <rect x="130" y="38" width="10" height="42" rx="4" fill="#4F46E5" className="chart-bar" />
                  <rect x="154" y="16" width="10" height="64" rx="4" fill="#4F46E5" className="chart-bar" />
                </svg>
              )}

              {metric.chartType === 'radial' && (
                <div className="w-full h-full flex justify-center items-center">
                  <svg viewBox="0 0 80 80" className="w-[76px] h-[76px] -rotate-90 overflow-visible">
                    {/* Background Ring Track */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="8"
                    />
                    {/* Animated Fill Circle Arc */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="chart-radial-fill"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}