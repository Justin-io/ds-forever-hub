import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, Calendar, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Database } from '../types/database.types';

const COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Present, Absent, Late

function getStatusColor(percent: number) {
  if (percent >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  if (percent >= 80) return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
  if (percent >= 75) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  return 'text-red-500 bg-red-500/10 border-red-500/20';
}

function getStatusText(percent: number) {
  if (percent >= 90) return 'Excellent';
  if (percent >= 80) return 'Good';
  if (percent >= 75) return 'Warning';
  return 'Critical';
}

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('students').select('*').eq('id', id as string).single();
      if (error) throw error;
      return data as Database['public']['Tables']['students']['Row'];
    },
  });

  const { data: records, isLoading: loadingRecords } = useQuery({
    queryKey: ['attendance_records', student?.name],
    queryFn: async () => {
      if (!student?.name) return [];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_name', student.name)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []) as Database['public']['Tables']['attendance_records']['Row'][];
    },
    enabled: !!student?.name,
  });

  const isLoading = loadingStudent || loadingRecords;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-24" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Student not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  const AUDIT_TIMELINE = [
    {
      date: '2026-07-01',
      day: 'Wednesday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-01',
      day: 'Wednesday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-02',
      day: 'Thursday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-02',
      day: 'Thursday',
      session: 'AN',
      isUnmarked: false,
      absentees: ['Amal', 'Amna', 'Anagha', 'Sreenidhi'],
      lates: [],
    },
    {
      date: '2026-07-03',
      day: 'Friday',
      session: 'FN',
      isUnmarked: false,
      absentees: ['Amna', 'Athul', 'Benedict', 'Dheeraj', 'Diya Mol', 'Rishad', 'Shammas', 'Nagul', 'Riya Mehar', 'Sreenidhi', 'Stanly'],
      lates: ['Aamir', 'Omair', 'Najim', 'Ihsan', 'Naithik'],
    },
    {
      date: '2026-07-03',
      day: 'Friday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-04',
      day: 'Saturday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-04',
      day: 'Saturday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-05',
      day: 'Sunday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-05',
      day: 'Sunday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-06',
      day: 'Monday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-06',
      day: 'Monday',
      session: 'AN',
      isUnmarked: false,
      absentees: ['Amna', 'Anatt T S', 'Athul', 'Dheeraj', 'Mefin K P', 'Rishad', 'Shibil', 'Najim', 'Adarsh'],
      lates: [],
    },
    {
      date: '2026-07-07',
      day: 'Tuesday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-07',
      day: 'Tuesday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-08',
      day: 'Wednesday',
      session: 'FN',
      isUnmarked: false,
      absentees: ['Alan', 'Amna', 'Benedict', 'Christin', 'Milan', 'Minhana', 'Rishad', 'Naithik'],
      lates: ['Ihsan', 'Najim', 'Shammas', 'Aamir', 'Omair'],
    },
    {
      date: '2026-07-08',
      day: 'Wednesday',
      session: 'AN',
      isUnmarked: false,
      absentees: ['Amal', 'Amna', 'Christin', 'Minhana', 'Rishad', 'Shibil'],
      lates: [],
    },
    {
      date: '2026-07-09',
      day: 'Thursday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-09',
      day: 'Thursday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-10',
      day: 'Friday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-10',
      day: 'Friday',
      session: 'AN',
      isUnmarked: false,
      absentees: ['Aamir', 'Amal', 'Athul', 'Benedict', 'Milan', 'Minhana', 'Ihsan', 'Rishad', 'Shammas', 'Najim', 'Omair', 'Stanley'],
      lates: [],
    },
    {
      date: '2026-07-11',
      day: 'Saturday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-11',
      day: 'Saturday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-12',
      day: 'Sunday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
      unmarkedNote: 'No attendance data; only academic notices shared',
    },
    {
      date: '2026-07-12',
      day: 'Sunday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
      unmarkedNote: 'No attendance data',
    },
    {
      date: '2026-07-13',
      day: 'Monday',
      session: 'FN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
    {
      date: '2026-07-13',
      day: 'Monday',
      session: 'AN',
      isUnmarked: false,
      absentees: ['Aamir', 'Amna', 'Samrin', 'Fathima Safa', 'Ihsan', 'Rishad', 'Shammas', 'Omair', 'Rahul', 'Safa', 'Stanley'],
      lates: [],
    },
    {
      date: '2026-07-14',
      day: 'Tuesday',
      session: 'FN',
      isUnmarked: false,
      absentees: ['Amna', 'Dheeraj', 'Diya Mol', 'Zahra', 'Jose', 'Rishad', 'Shammas', 'Nagul', 'Rajaram'],
      lates: ['Naithik', 'Shibil', 'Rishad', 'Aamir', 'Omair', 'Amal', 'Najim', 'Ihsan'],
    },
    {
      date: '2026-07-14',
      day: 'Tuesday',
      session: 'AN',
      isUnmarked: true,
      absentees: [],
      lates: [],
    },
  ];

  function matchesName(studentName: string, targetName: string): boolean {
    if (!studentName || !targetName) return false;
    const s1 = studentName.toLowerCase().replace(/[^a-z]/g, '');
    const s2 = targetName.toLowerCase().replace(/[^a-z]/g, '');
    return s1.includes(s2) || s2.includes(s1);
  }

  const mappedTimeline = AUDIT_TIMELINE.map((session, index) => {
    let status: 'UNMARKED' | 'ABSENT' | 'LATE' | 'PRESENT' = 'UNMARKED';
    if (!session.isUnmarked) {
      if (session.absentees.some(name => matchesName(student.name, name))) {
        status = 'ABSENT';
      } else if (session.lates.some(name => matchesName(student.name, name))) {
        status = 'LATE';
      } else {
        status = 'PRESENT';
      }
    }
    return {
      id: `audit-${index}`,
      ...session,
      status,
    };
  });

  const displaySummary = {
    total_classes: 8,
    present_count: mappedTimeline.filter((s) => s.status === 'PRESENT' || s.status === 'LATE').length,
    absent_count: mappedTimeline.filter((s) => s.status === 'ABSENT').length,
    late_count: mappedTimeline.filter((s) => s.status === 'LATE').length,
    unmarked_count: mappedTimeline.filter((s) => s.status === 'UNMARKED').length,
  };

  const calculatedPercent = Math.round((displaySummary.present_count / displaySummary.total_classes) * 100);

  const absentees = mappedTimeline.filter((s) => s.status === 'ABSENT').map(s => ({
    id: s.id,
    date: s.date,
    session: s.session,
    source: 'Manual Audit Log',
  }));

  const lates = mappedTimeline.filter((s) => s.status === 'LATE').map(s => ({
    id: s.id,
    date: s.date,
    session: s.session,
    source: 'Manual Audit Log',
  }));

  const pieData = [
    { name: 'Present', value: displaySummary.present_count },
    { name: 'Absent', value: displaySummary.absent_count },
    { name: 'Late', value: displaySummary.late_count },
  ];

  const trendData: { name: string; percent: number }[] = [];
  let runningPresent = 0;
  let runningRecorded = 0;
  mappedTimeline.forEach((s) => {
    if (s.status !== 'UNMARKED') {
      runningRecorded++;
      if (s.status === 'PRESENT' || s.status === 'LATE') {
        runningPresent++;
      }
      const dateFormatted = format(parseISO(s.date), 'MMM d');
      trendData.push({
        name: `${dateFormatted} (${s.session})`,
        percent: Math.round((runningPresent / runningRecorded) * 100),
      });
    }
  });

  const totalSemesterClasses = 150;
  const semesterProgress = Math.round((displaySummary.total_classes / totalSemesterClasses) * 100);
  const minRequired = 75;
  const classesRemaining = totalSemesterClasses - displaySummary.total_classes;
  const maxPossiblePercent = Math.round(
    ((displaySummary.present_count + classesRemaining) / totalSemesterClasses) * 100
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="liquid-glow-1" />
      <div className="liquid-glow-2" />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer animate-fade-in"
        >
          <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800/80 group-hover:bg-zinc-800/60 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Search
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{student.name}</h1>
            <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
              <span>{student.batch}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <span>Roll No {student.roll_no}</span>
            </p>
          </div>
          <Badge
            variant="outline"
            className={`px-4 py-2 text-sm font-bold tracking-wide uppercase border bg-zinc-900/60 border-zinc-800/80 ${getStatusColor(calculatedPercent)}`}
          >
            {getStatusText(calculatedPercent)} • {calculatedPercent}%
          </Badge>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="glass-card glass-card-hover rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Present
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{displaySummary.present_count}</div>
              <div className="mt-2 text-xs text-emerald-500 font-medium flex items-center gap-1">
                Verified records
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card glass-card-hover rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-red-400 font-medium">
                <AlertCircle className="w-4 h-4" /> Absent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{displaySummary.absent_count}</div>
              <div className="mt-2 text-xs text-zinc-500 font-medium flex items-center gap-1">
                Total classes: {displaySummary.total_classes}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card glass-card-hover rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-amber-400 font-medium">
                <Clock className="w-4 h-4" /> Late
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{displaySummary.late_count}</div>
            </CardContent>
          </Card>
          <Card className="glass-card glass-card-hover rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-zinc-400 font-medium">
                <Calendar className="w-4 h-4" /> Total Classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{displaySummary.total_classes}</div>
            </CardContent>
          </Card>
        </motion.div>

        {calculatedPercent < minRequired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl border-l-4 border-l-red-500/80 glass-card text-red-400 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Warning: Low Attendance</h4>
              <p className="text-sm opacity-90 mt-1 text-zinc-300">
                Your attendance is below the minimum required {minRequired}%. You need to attend the next few classes
                continuously to return above the threshold.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Charts Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-bold text-zinc-100">Attendance Trend</CardTitle>
                <CardDescription className="text-zinc-400">Your attendance percentage over the semester</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#71717a' }}
                      dy={10}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#71717a' }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(9, 9, 11, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                      itemStyle={{ color: '#fafafa' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percent"
                      stroke="#ffffff"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#000000', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reconstructed Attendance Timeline & Data Audit Card */}
            <Card className="glass-card rounded-2xl shadow-lg border border-zinc-800/50">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="font-bold text-zinc-100 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-zinc-400" />
                      Day-by-Day Reconstructed Timeline
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Comprehensive day-by-day audit for July 1 – July 14, 2026
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit border-amber-500/25 bg-amber-500/10 text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase">
                    71.4% DATA GAP IDENTIFIED
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Data Audit Summary Block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/40">
                  <div className="space-y-1">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Audit Period</div>
                    <div className="text-sm font-semibold text-zinc-200">July 1 – July 14, 2026</div>
                    <div className="text-xs text-zinc-500">14 Days (28 Sessions)</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Recorded Data</div>
                    <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      8 Sessions (28.6%)
                    </div>
                    <div className="text-xs text-zinc-500 font-mono text-zinc-400">Documented attendances</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Unmarked (No Data)</div>
                    <div className="text-sm font-semibold text-red-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      20 Sessions (71.4%)
                    </div>
                    <div className="text-xs text-zinc-500 font-mono text-zinc-400">Reporting gap identified</div>
                  </div>
                </div>

                {/* Grid of days */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
                  {Array.from(new Set(mappedTimeline.map(s => s.date))).map(dateStr => {
                    const daySessions = mappedTimeline.filter(s => s.date === dateStr);
                    const dayName = daySessions[0]?.day || '';
                    const parsedDate = parseISO(dateStr);
                    const formattedDate = format(parsedDate, 'EEE, MMM d');

                    return (
                      <div key={dateStr} className="p-3 rounded-xl border border-zinc-900/80 bg-zinc-950/60 flex flex-col gap-2 hover:border-zinc-800/60 transition-colors">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                          <span className="text-xs font-bold text-zinc-300">{formattedDate}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{dayName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {daySessions.map(sess => {
                            let badgeStyle = '';
                            let icon = null;
                            let statusLabel = '';

                            if (sess.status === 'PRESENT') {
                              badgeStyle = 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10';
                              icon = <Check className="w-3 h-3 text-emerald-400" />;
                              statusLabel = 'Present';
                            } else if (sess.status === 'ABSENT') {
                              badgeStyle = 'bg-red-500/5 text-red-400 border-red-500/10';
                              icon = <AlertCircle className="w-3 h-3 text-red-400" />;
                              statusLabel = 'Absent';
                            } else if (sess.status === 'LATE') {
                              badgeStyle = 'bg-amber-500/5 text-amber-400 border-amber-500/10';
                              icon = <Clock className="w-3 h-3 text-amber-400" />;
                              statusLabel = 'Late';
                            } else {
                              badgeStyle = 'bg-zinc-900/40 text-zinc-500 border-zinc-900/60';
                              icon = <AlertTriangle className="w-3 h-3 text-zinc-600" />;
                              statusLabel = 'Unmarked';
                            }

                            return (
                              <div key={sess.id} className={`flex flex-col p-2 rounded-lg border text-left gap-1 ${badgeStyle}`}>
                                <div className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80">
                                  {sess.session === 'FN' ? 'Forenoon' : 'Afternoon'}
                                </div>
                                <div className="flex items-center gap-1.5 font-semibold text-xs mt-0.5">
                                  {icon}
                                  <span>{statusLabel}</span>
                                </div>
                                {sess.unmarkedNote && (
                                  <div className="text-[9px] text-zinc-500 mt-1 leading-tight font-mono">
                                    {sess.unmarkedNote}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Timelines and Details */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="glass-card rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="font-bold text-zinc-100">Absence Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {absentees && absentees.length > 0 ? (
                    <div className="space-y-4">
                      {absentees.map((record) => (
                        <div key={record.id} className="flex flex-col gap-1 pb-4 border-b border-zinc-900 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-zinc-200">{format(parseISO(record.date), 'MMM d, yyyy')}</span>
                            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/20">
                              {record.session === 'FN' ? 'Forenoon' : record.session === 'AN' ? 'Afternoon' : 'Full Day'}
                            </Badge>
                          </div>
                          {record.source && <p className="text-sm text-zinc-500">Source: {record.source}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 text-center py-6">No absences recorded.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="font-bold text-zinc-100">Late Arrivals</CardTitle>
                </CardHeader>
                <CardContent>
                  {lates && lates.length > 0 ? (
                    <div className="space-y-4">
                      {lates.map((record) => (
                        <div key={record.id} className="flex flex-col gap-1 pb-4 border-b border-zinc-900 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-zinc-200">{format(parseISO(record.date), 'MMM d, yyyy')}</span>
                            <Badge variant="outline" className="w-fit text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">
                              Late Arrival
                            </Badge>
                          </div>
                          {record.source && <p className="text-sm text-zinc-500">Source: {record.source}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 text-center py-6">No late arrivals recorded.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-bold text-zinc-100">Semester Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Semester Completed</span>
                    <span className="font-medium text-zinc-200">{semesterProgress}%</span>
                  </div>
                  <Progress value={semesterProgress} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Current Attendance</span>
                    <span className="font-medium text-zinc-200">{calculatedPercent}%</span>
                  </div>
                  <Progress
                    value={calculatedPercent}
                    className="h-2 [&>div]:bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-bold text-zinc-100">Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                  <span className="text-sm text-zinc-400">Department Average</span>
                  <span className="font-semibold text-zinc-400">89%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                  <span className="text-sm text-zinc-400">Your Attendance</span>
                  <span className="font-semibold text-zinc-200">{calculatedPercent}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card shadow-lg rounded-2xl border border-zinc-800/80">
              <CardHeader>
                <CardTitle className="font-bold text-zinc-100">Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  Keep attending every class to reach a maximum of <span className="text-white font-bold">{maxPossiblePercent}%</span> by the end of the term.
                </p>
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/60">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Required for Goal</div>
                  <div className="text-sm text-zinc-300">Maintain {minRequired}% threshold</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="font-bold text-zinc-100">Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(9, 9, 11, 0.9)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                        itemStyle={{ color: '#fafafa' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="w-full text-center pt-12 pb-6">
          <p className="text-xs font-mono text-zinc-600 dark:text-zinc-500 tracking-wider">
            You know who made this ;-)
          </p>
        </footer>
      </div>
    </div>
  );
}
