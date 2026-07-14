import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, AlertTriangle, BookOpen, FileWarning, CalendarDays, Activity, Info, X, ChevronDown, ChevronUp, Check, Minus, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import SplashCountdown from '../components/SplashCountdown';

interface SessionStatus {
  type: 'unmarked' | 'recorded' | 'excluded';
  details?: string;
}

interface AuditDay {
  date: string;
  day: string;
  isWeekend: boolean;
  fn: SessionStatus;
  an: SessionStatus;
}

const auditTimeline: AuditDay[] = [
  {
    date: '01/07/2026',
    day: 'Wednesday',
    isWeekend: false,
    fn: { type: 'unmarked', details: 'No data' },
    an: { type: 'unmarked', details: 'No data' },
  },
  {
    date: '02/07/2026',
    day: 'Thursday',
    isWeekend: false,
    fn: { type: 'unmarked', details: 'No data' },
    an: { type: 'recorded', details: 'Absentees: Amal, Amna, Anagha, Sreenidhi' },
  },
  {
    date: '03/07/2026',
    day: 'Friday',
    isWeekend: false,
    fn: { type: 'recorded', details: 'Absentees: Amna, Athul, Benedict, Dheeraj, Diya Mol, Rishad, Shammas, Nagul, Riya Mehar, Sreenidhi, Stanly. Late: Aamir, Omair, Najim, Ihsan, Naithik' },
    an: { type: 'unmarked', details: 'No data' },
  },
  {
    date: '04/07/2026',
    day: 'Saturday',
    isWeekend: true,
    fn: { type: 'excluded', details: 'Weekend - Excluded' },
    an: { type: 'excluded', details: 'Weekend - Excluded' },
  },
  {
    date: '05/07/2026',
    day: 'Sunday',
    isWeekend: true,
    fn: { type: 'excluded', details: 'Weekend - Excluded' },
    an: { type: 'excluded', details: 'Weekend - Excluded' },
  },
  {
    date: '06/07/2026',
    day: 'Monday',
    isWeekend: false,
    fn: { type: 'unmarked', details: 'No data' },
    an: { type: 'recorded', details: 'Absentees: Amna, Anatt T S, Athul, Dheeraj, Mefin K P, Rishad, Shibil, Najim, Adarsh' },
  },
  {
    date: '07/07/2026',
    day: 'Tuesday',
    isWeekend: false,
    fn: { type: 'unmarked', details: 'No data' },
    an: { type: 'unmarked', details: 'No data' },
  },
  {
    date: '08/07/2026',
    day: 'Wednesday',
    isWeekend: false,
    fn: { type: 'recorded', details: 'Absentees: Alan, Amna, Benedict, Christin, Milan, Minhana, Rishad, Naithik. Late: Ihsan, Najim, Shammas, Aamir, Omair' },
    an: { type: 'recorded', details: 'Absentees: Amal, Amna, Christin, Minhana, Rishad, Shibil' },
  },
  {
    date: '09/07/2026',
    day: 'Thursday',
    isWeekend: false,
    fn: { type: 'unmarked', details: 'No data' },
    an: { type: 'unmarked', details: 'No data' },
  },
  {
    date: '10/07/2026',
    day: 'Friday',
    isWeekend: false,
    fn: { type: 'unmarked', details: 'No data' },
    an: { type: 'recorded', details: 'Absentees: Aamir, Amal, Athul, Benedict, Milan, Minhana, Ihsan, Rishad, Shammas, Najim, Omair, Stanley' },
  },
  {
    date: '11/07/2026',
    day: 'Saturday',
    isWeekend: true,
    fn: { type: 'excluded', details: 'Weekend - Excluded' },
    an: { type: 'excluded', details: 'Weekend - Excluded' },
  },
  {
    date: '12/07/2026',
    day: 'Sunday',
    isWeekend: true,
    fn: { type: 'excluded', details: 'Weekend - Excluded' },
    an: { type: 'excluded', details: 'Weekend - Excluded' },
  },
  {
    date: '13/07/2026',
    day: 'Monday',
    isWeekend: false,
    fn: { type: 'unmarked', details: 'No data' },
    an: { type: 'recorded', details: 'Absentees: Aamir, Amna, Samrin, Fathima Safa, Ihsan, Rishad, Shammas, Omair, Rahul, Safa, Stanley' },
  },
  {
    date: '14/07/2026',
    day: 'Tuesday',
    isWeekend: false,
    fn: { type: 'recorded', details: 'Absentees: Amna, Dheeraj, Diya Mol, Zahra, Jose, Rishad, Shammas, Nagul, Rajaram. Late: Naithik, Shibil, Rishad, Aamir, Omair, Amal, Najim, Ihsan' },
    an: { type: 'unmarked', details: 'No data' },
  },
];

export default function Landing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);

  const dismissDisclaimer = () => {
    setShowDisclaimer(false);
  };

  // Simple debounce logic could be extracted to a hook
  const [debouncedSearch, setDebouncedSearch] = useState('');

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm) {
        setShowAll(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students', debouncedSearch, showAll],
    queryFn: async () => {
      if (!debouncedSearch && !showAll) return [];
      
      let query = supabase.from('students').select('*').order('name');
      
      if (debouncedSearch) {
        query = query.ilike('name', `%${debouncedSearch}%`).limit(5);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data as Database['public']['Tables']['students']['Row'][];
    },
    enabled: debouncedSearch.length > 0 || showAll,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-12 px-6 text-foreground selection:bg-primary/20 relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="liquid-glow-1" />
      <div className="liquid-glow-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-8 text-center relative z-10"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Attendance Tracker
            </h1>
            <span className="inline-flex items-center rounded-full bg-zinc-900/80 border border-zinc-800/60 px-3.5 py-1 text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase select-none">
              #DSFOREVER
            </span>
          </div>
          <p className="text-lg text-muted-foreground">
            Track your attendance in real time.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setShowDisclaimer(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 text-amber-400 text-xs font-bold hover:bg-amber-500/15 hover:border-amber-500/40 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-500/[0.02]"
            >
              <Calendar className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>S5 Module Test 1 Live Countdown & Schedule</span>
            </button>
          </div>
        </div>

        <div className="relative max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-5 w-5 text-zinc-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your name..."
              className="pl-11 h-14 text-lg rounded-xl glass-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-700 w-full"
            />
            {isLoading && (
              <Loader2 className="absolute right-4.5 h-5 w-5 text-zinc-500 animate-spin" />
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-950/30 text-red-400 text-sm rounded-xl border border-red-900/30 text-left">
              <strong>Connection Error:</strong> Could not load students. Please ensure your Supabase URL and Anon Key are set correctly in the Secrets panel, and that Row Level Security (RLS) policies allow reading from the `students` table.
            </div>
          )}

          {!showAll && !searchTerm && (
            <div className="mt-4">
              <button 
                onClick={() => setShowAll(true)}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center mx-auto cursor-pointer"
              >
                View all students
              </button>
            </div>
          )}

          <AnimatePresence>
            {!isLoading && !error && students && students.length === 0 && (searchTerm || showAll) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2.5 z-50 p-4 glass-card rounded-xl text-zinc-400 text-sm text-left"
              >
                No students found. If your database has data, please ensure Row Level Security (RLS) is configured to allow public reads.
              </motion.div>
            )}
            
            {students && students.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-2.5 z-50"
              >
                <div className="glass-card rounded-xl overflow-hidden shadow-2xl p-2 max-h-80 overflow-y-auto space-y-1.5">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => navigate(`/student/${student.id}`)}
                      className="w-full text-left px-3.5 py-3 glass-interactive rounded-lg flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                          {student.name}
                        </p>
                      </div>
                      <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wide mt-1.5 sm:mt-0 select-none">
                        {student.batch}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-12 w-full max-w-2xl mx-auto text-left space-y-4"
        >
          <h2 className="text-xl font-semibold tracking-tight flex items-center justify-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Critical Academic Policies
          </h2>
          <div className="grid gap-3 sm:grid-cols-1 pt-4 text-left">
            <Card className="p-4 border-l-4 border-l-amber-500/80 glass-card glass-card-hover">
              <div className="flex gap-3">
                <FileWarning className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-amber-400 leading-none">KTU "Year Back" Rule</h3>
                  <p className="text-sm text-zinc-300">
                    Students who have not secured a minimum of 18 credits combined across Semester 1 and Semester 2 will not be permitted to attend S5 classes.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-l-4 border-l-red-500/80 glass-card glass-card-hover">
              <div className="flex gap-3">
                <BookOpen className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-red-400 leading-none">Module Test & Series Exams</h3>
                  <p className="text-sm text-zinc-300">
                    A minimum of 35/50 is required in each module test. Failing both tests in a pair (e.g., Mod 1 & 2) disqualifies you from the corresponding series exam. Mandatory remedial classes after 4:15 PM apply for series exam failures.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-zinc-500/80 glass-card glass-card-hover">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-zinc-300 leading-none">S4 Supplementary Backlogs</h3>
                  <p className="text-sm text-zinc-400">
                    S4 results are out. Reduce your backlogs immediately to ensure eligibility for upcoming placements.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-6 w-full max-w-2xl mx-auto text-left space-y-4 pb-12"
        >
          <h2 className="text-xl font-semibold tracking-tight flex items-center justify-center gap-2 text-foreground">
            <Activity className="h-5 w-5 text-zinc-400" />
            Data Completeness Audit (July 1 – 14)
          </h2>
          <div className="grid gap-3 sm:grid-cols-1 pt-4 text-left">
            <Card className="p-4 border-l-4 border-l-zinc-500/80 glass-card glass-card-hover">
              <div className="flex gap-3">
                <CalendarDays className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
                <div className="space-y-2 w-full">
                  <h3 className="font-semibold text-zinc-300 leading-none">Attendance Reporting Gap</h3>
                  <div className="flex justify-between items-center text-sm text-zinc-400 pt-1">
                    <span>Total Possible Sessions:</span>
                    <span className="font-medium">20 (10 weekdays × 2)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-zinc-400">
                    <span>Recorded Data:</span>
                    <span className="font-medium">8 sessions</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-zinc-400">
                    <span>Unmarked Sessions:</span>
                    <span className="font-bold text-red-500">12 sessions (60%)</span>
                  </div>
                  <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-900 mt-2">
                    <strong>Note:</strong> Excluding weekends. Entire weekdays (July 1, 7, 9) have zero records. July 8 is the only fully documented day. A 60% data gap poses an administrative vulnerability given strict KTU attendance rules.
                  </p>
                </div>
              </div>
            </Card>

            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md hover:bg-zinc-900/60 text-sm font-semibold text-zinc-300 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <span>{showTimeline ? 'Hide' : 'View'} Day-by-Day Complete Timeline</span>
              {showTimeline ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
            </button>

            {showTimeline && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2.5 mt-2"
              >
                {auditTimeline.map((day) => (
                  <div
                    key={day.date}
                    className={`p-3.5 rounded-xl border ${
                      day.isWeekend
                        ? 'border-zinc-900/20 bg-zinc-950/10 opacity-30'
                        : 'border-zinc-800/50 bg-zinc-950/60 backdrop-blur-xs'
                    } flex flex-col gap-2.5`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                        <span className="text-sm font-semibold text-zinc-300">{day.date}</span>
                        <span className="text-xs text-zinc-500">({day.day})</span>
                      </div>
                      {day.isWeekend && (
                        <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 bg-zinc-900/60 border border-zinc-800/60 px-2 py-0.5 rounded-full select-none">
                          Weekend
                        </span>
                      )}
                    </div>

                    {!day.isWeekend && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-zinc-800 mt-0.5">
                        {/* FN Session */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                            Forenoon (FN)
                          </div>
                          {day.fn.type === 'unmarked' ? (
                            <p className="text-xs text-zinc-600 italic">Unmarked (No data)</p>
                          ) : (
                            <div className="space-y-1">
                              {day.fn.details?.split('Late:').map((part, idx) => {
                                if (idx === 0) {
                                  return (
                                    <p key={idx} className="text-xs text-red-400/95 leading-relaxed font-medium">
                                      {part.trim()}
                                    </p>
                                  );
                                }
                                return (
                                  <p key={idx} className="text-xs text-amber-500/95 leading-relaxed font-medium">
                                    Late: {part.trim()}
                                  </p>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* AN Session */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                            Afternoon (AN)
                          </div>
                          {day.an.type === 'unmarked' ? (
                            <p className="text-xs text-zinc-600 italic">Unmarked (No data)</p>
                          ) : (
                            <div className="space-y-1">
                              {day.an.details?.split('Late:').map((part, idx) => {
                                if (idx === 0) {
                                  return (
                                    <p key={idx} className="text-xs text-red-400/95 leading-relaxed font-medium">
                                      {part.trim()}
                                    </p>
                                  );
                                }
                                return (
                                  <p key={idx} className="text-xs text-amber-500/95 leading-relaxed font-medium">
                                    Late: {part.trim()}
                                  </p>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        <SplashCountdown isOpen={showDisclaimer} onClose={dismissDisclaimer} />
      </motion.div>

      <footer className="w-full max-w-xl text-center mt-auto pt-12 pb-6 relative z-10">
        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-500 tracking-wider">
          You know who made this ;-)
        </p>
      </footer>
    </div>
  );
}
