import { Suspense } from 'react';
import Link from 'next/link';
import { APP_NAME, APP_DESCRIPTION } from '@shared/constants';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 sm:px-12">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -z-10 h-100 w-100 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute -bottom-40 right-0 -z-10 h-100 w-100 rounded-full bg-accent/60 blur-[100px]" />
      <div className="absolute top-1/2 left-10 -z-10 h-50 w-50 animate-float rounded-full bg-primary/10 blur-[80px]" />
      
      <div className="relative z-10 mx-auto max-w-4xl text-center animate-fade-in-up">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border bg-white/50 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-white/80">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Elevate Your Career Trajectory
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none">
          Master Your <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            Technical Interviews
          </span>
        </h1>
        
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed font-light">
          {APP_DESCRIPTION} Build confidence through hyper-realistic AI mock interviews, designed to feel exactly like the real thing.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/register"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/30 sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started for Free
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link
            href="/login"
            className="group flex w-full items-center justify-center rounded-xl border border-input bg-card/60 px-8 py-4 text-base font-semibold backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground sm:w-auto hover:-translate-y-1 hover:shadow-sm"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { title: "Smart Scenarios", desc: "AI tailored to senior & staff engineering problems." },
            { title: "Instant Feedback", desc: "Get real-time insights into your answer quality and tone." },
            { title: "Targeted Practice", desc: "Focus precisely on weak areas with custom modules." }
          ].map((feature, i) => (
             <div key={i} className="flex flex-col items-center rounded-2xl border bg-white/50 p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-primary/10 text-center">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <h3 className="font-semibold text-lg">{feature.title}</h3>
               <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}