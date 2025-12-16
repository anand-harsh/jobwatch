import { useState } from "react";
import { JobTable } from "@/components/job-table";
import { initialJobs, JobApplication, JobStatus } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Building2,
  PieChart
} from "lucide-react";

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>(initialJobs);
  const { toast } = useToast();

  const handleUpdateStatus = (id: string, newStatus: JobStatus) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  // Calculate stats
  const totalApplied = jobs.length;
  const interviews = jobs.filter(j => 
    ["Interview Scheduled", "Technical Interview"].includes(j.status)
  ).length;
  const offers = jobs.filter(j => j.status === "Offer Received").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;
  
  // Recent activity (simulated by taking first 3 jobs as they are "newest" in our mock)
  const recentActivity = jobs.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-slate-950/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Briefcase className="h-5 w-5" />
          </div>
          JobTracker<span className="text-foreground font-light">Pro</span>
        </div>
        <nav className="ml-auto flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-foreground transition-colors hover:text-primary">Dashboard</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary">Applications</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary">Companies</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary">Calendar</a>
        </nav>
        <div className="ml-4 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 border overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </header>

      <main className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
              Welcome back, Alex!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Here's what's happening with your job search today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 h-9 border-slate-200 bg-white text-slate-700 shadow-sm">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applied
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplied}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interviews
              </CardTitle>
              <Clock className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{interviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                4 scheduled this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Offers
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                1 pending decision
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejections
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejected}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep going! 💪
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-7">
          {/* Main Table Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-heading font-semibold">Applications</h2>
                <p className="text-sm text-muted-foreground">Manage and track all your job applications.</p>
              </div>
            </div>
            
            <JobTable data={jobs} onUpdateStatus={handleUpdateStatus} />
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity Card */}
            <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Recent Updates</CardTitle>
                <CardDescription>Latest changes to your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((job, i) => (
                    <div key={job.id} className="flex items-start gap-4 group">
                      <div className="mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{job.company}</p>
                        <p className="text-xs text-muted-foreground">
                          Status updated to <span className="font-medium text-foreground">{job.status}</span>
                        </p>
                        <p className="text-xs text-slate-400">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Distribution Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Big Tech</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-blue-500 w-[35%]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Startups</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[45%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Mid-Tier</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-violet-500 w-[20%]" />
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have a healthy mix of applications across different company types. Consider focusing more on referrals for Big Tech roles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
