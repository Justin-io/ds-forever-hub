import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, CheckCircle2, Play, Flame, X, BookOpen, Sparkles, ChevronRight } from 'lucide-react';

interface SplashCountdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Exam {
  code: string;
  name: string;
  dateStr: string; // "DD/MM/YYYY"
  date: Date;      // Start date & time
  durationHours: number;
}

const examsData: Exam[] = [
  {
    code: 'PCCST501',
    name: 'Computer Networks',
    dateStr: '21/07/2026',
    date: new Date('2026-07-21T10:30:00'),
    durationHours: 2,
  },
  {
    code: 'PCCST502',
    name: 'Design and Analysis of Algorithms',
    dateStr: '22/07/2026',
    date: new Date('2026-07-22T10:30:00'),
    durationHours: 2,
  },
  {
    code: 'PCCDT503',
    name: 'Data Analytics',
    dateStr: '23/07/2026',
    date: new Date('2026-07-23T10:30:00'),
    durationHours: 2,
  },
  {
    code: 'PBCDT504',
    name: 'Big Data Processing',
    dateStr: '24/07/2026',
    date: new Date('2026-07-24T10:30:00'),
    durationHours: 2,
  },
  {
    code: 'PECST522',
    name: 'Artificial Intelligence',
    dateStr: '27/07/2026',
    date: new Date('2026-07-27T10:30:00'),
    durationHours: 2,
  },
];

export default function SplashCountdown({ isOpen, onClose }: SplashCountdownProps) {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Find next active exam or ongoing one
  const getExamStatus = (exam: Exam, index: number) => {
    const startTime = exam.date.getTime();
    const endTime = startTime + exam.durationHours * 60 * 60 * 1000;
    const currentTime = now.getTime();

    if (currentTime > endTime) {
      return { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 };
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return { label: 'Running Now', color: 'text-red-400 bg-red-500/15 border-red-500/30 animate-pulse', icon: Flame };
    } else {
      // Is it the very first upcoming exam?
      const isNextUp = examsData.findIndex(e => e.date.getTime() > currentTime) === index;
      if (isNextUp) {
        return { label: 'Next Up', color: 'text-amber-400 bg-amber-500/10 border-amber-500/25', icon: Play };
      }
      return { label: 'Upcoming', color: 'text-zinc-400 bg-zinc-900/60 border-zinc-800/60', icon: Calendar };
    }
  };

  // Find next target exam for countdown
  const nextExam = examsData.find(exam => {
    const endTime = exam.date.getTime() + exam.durationHours * 60 * 60 * 1000;
    return now.getTime() < endTime;
  }) || examsData[examsData.length - 1];

  // Calculate countdown time
  const getTimeRemaining = () => {
    const diff = nextExam.date.getTime() - now.getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: diff };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, total: diff };
  };

  const countdown = getTimeRemaining();
  const isOngoing = now.getTime() >= nextExam.date.getTime() && now.getTime() <= (nextExam.date.getTime() + nextExam.durationHours * 60 * 60 * 1000);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Liquid Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 pointer-events-auto cursor-pointer"
          />

          {/* Sliding Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-zinc-950/95 border-t border-zinc-800/80 rounded-t-3xl shadow-2xl z-50 pointer-events-auto text-left overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header with cool styling */}
            <div className="p-6 pb-4 border-b border-zinc-900 flex justify-between items-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-800 rounded-full mt-2" />
              <div className="flex items-center gap-2.5 mt-1">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                    S5 Module Test 1
                    <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-800/80 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-zinc-400 uppercase select-none">
                      #DSFOREVER
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">Department of CSE (Data Science) • July 2026</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 no-scrollbar">
              {/* Dynamic Cinematic Counter Card */}
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/60 to-zinc-950/40 p-5 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />
                
                {isOngoing ? (
                  <div className="space-y-1 py-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-red-400 bg-red-950/30 border border-red-900/30">
                      <Flame className="w-3.5 h-3.5 animate-pulse" /> EXAM RUNNING NOW
                    </span>
                    <h4 className="text-lg font-bold text-zinc-100 pt-2 leading-tight">
                      {nextExam.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono">10:30 AM to 12:30 PM</p>
                  </div>
                ) : countdown.total <= 0 ? (
                  <div className="space-y-1 py-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/30 border border-emerald-900/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ALL TESTS CONCLUDED
                    </span>
                    <h4 className="text-lg font-bold text-zinc-300 pt-2 leading-tight">
                      Fifth Semester Module Test 1 Ended
                    </h4>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                        Countdown to {nextExam.code}
                      </span>
                      <h4 className="text-sm font-semibold text-zinc-300 truncate">
                        {nextExam.name}
                      </h4>
                    </div>

                    {/* Cinematic Countdown Numbers */}
                    <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5">
                        <div className="text-2xl font-black font-mono text-zinc-100">
                          {String(countdown.days).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Days</div>
                      </div>
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5">
                        <div className="text-2xl font-black font-mono text-zinc-100">
                          {String(countdown.hours).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Hours</div>
                      </div>
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5">
                        <div className="text-2xl font-black font-mono text-zinc-100">
                          {String(countdown.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Mins</div>
                      </div>
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5">
                        <div className="text-2xl font-black font-mono text-amber-400">
                          {String(countdown.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Secs</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Timeline Lists */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Official Exam Schedule
                </h4>
                
                <div className="space-y-2.5">
                  {examsData.map((exam, index) => {
                    const status = getExamStatus(exam, index);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div
                        key={exam.code}
                        className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all duration-300 ${
                          status.label === 'Completed'
                            ? 'bg-zinc-950/30 border-zinc-900 opacity-60'
                            : status.label === 'Running Now'
                            ? 'bg-red-950/5 border-red-500/40 shadow-lg shadow-red-500/5'
                            : status.label === 'Next Up'
                            ? 'bg-zinc-900/40 border-zinc-800'
                            : 'bg-zinc-950/50 border-zinc-900/60'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-zinc-500 font-bold">
                              {exam.code} • {exam.dateStr} (10:30 AM)
                            </span>
                            <h5 className="text-sm font-semibold text-zinc-200 leading-snug">
                              {exam.name}
                            </h5>
                          </div>

                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase select-none border ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance disclaimer reminder inside */}
              <div className="p-3.5 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-1.5 text-xs text-zinc-500 leading-relaxed">
                <p>
                  <strong className="text-zinc-400">ℹ️ Attendance Data Sync:</strong> Unmarked or missing sessions correspond strictly to days when no attendance reports were published. Once reports are updated, stats sync instantly.
                </p>
              </div>
            </div>

            {/* Sticky bottom CTA */}
            <div className="p-6 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-semibold text-sm py-3 rounded-xl transition-all cursor-pointer"
              >
                <span>Enter Attendance Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
