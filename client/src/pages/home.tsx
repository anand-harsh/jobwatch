import { useState, useEffect } from "react";
import { JobTable } from "@/components/job-table";
import { JobApplication } from "@/lib/mock-data";
import { jobApi } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Building2,
  PieChart,
  LogOut,
  Loader2
} from "lucide-react";

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobApi.getJobs();
      setJobs(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (id: string, field: keyof JobApplication, value: any) => {
    try {
      const updatedJob = await jobApi.updateJob(id, { [field]: value });
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === id ? { ...job, ...updatedJob } : job)
      );
      
      if (field === 'status') {
        toast({
          title: "Status Updated",
          description: `Application status changed to ${value}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      });
    }
  };

  const handleAddJob = async () => {
    try {
      const newJobData = {
        company: "New Company",
        role: "Software Engineer",
        dateApplied: format(new Date(), "yyyy-MM-dd"),
        status: "Applied" as const,
        notes: "",
        category: "Startup" as const
      };

      const newJob = await jobApi.addJob(newJobData);
      setJobs(prevJobs => [newJob, ...prevJobs]);
      
      toast({
        title: "Application Added",
        description: "New job application added to the top of the list.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add job",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJobs = async (ids: string[]) => {
    try {
      await jobApi.deleteJobs(ids);
      setJobs(prevJobs => prevJobs.filter(job => !ids.includes(job.id)));
      
      toast({
        title: "Deleted",
        description: `Successfully removed ${ids.length} application(s).`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete jobs",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ["Company", "Role", "Category", "Date Applied", "Status", "Notes"];
    
    const csvRows = [
      headers.join(","),
      ...jobs.map(job => {
        const row = [
          `"${job.company}"`,
          `"${job.role}"`,
          `"${job.category}"`,
          `"${job.dateApplied}"`,
          `"${job.status}"`,
          `"${job.notes || ""}"`
        ];
        return row.join(",");
      })
    ];
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `job-tracker-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Calculate stats
  const totalApplied = jobs.length;
  const interviews = jobs.filter(j => 
    ["Interview Scheduled", "Technical Interview"].includes(j.status)
  ).length;
  const offers = jobs.filter(j => j.status === "Offer Received").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;
  
  // Category distribution
  const bigTechCount = jobs.filter(j => j.category === "Big Tech").length;
  const startupCount = jobs.filter(j => j.category === "Startup").length;
  const midTierCount = jobs.filter(j => j.category === "Mid-Tier").length;
  const bigTechPercent = totalApplied > 0 ? Math.round((bigTechCount / totalApplied) * 100) : 0;
  const startupPercent = totalApplied > 0 ? Math.round((startupCount / totalApplied) * 100) : 0;
  const midTierPercent = totalApplied > 0 ? Math.round((midTierCount / totalApplied) * 100) : 0;
  
  // Recent activity
  const recentActivity = jobs.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <div className="flex items-center gap-4 border-l pl-6 ml-2">
             <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
               {user?.username}
             </span>
             <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
               <LogOut className="h-4 w-4" />
             </Button>
          </div>
        </nav>
      </header>

      <main className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
              Welcome back, {user?.username}!
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
                All time applications
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
                Active interviews
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
                Offers received
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
                Keep going!
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
            
            <JobTable 
              data={jobs} 
              onUpdateJob={handleUpdateJob} 
              onAddJob={handleAddJob}
              onDeleteJobs={handleDeleteJobs}
              onExportCSV={handleExportCSV}
            />
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
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No applications yet. Add your first one!</p>
                ) : (
                  <div className="space-y-6">
                    {recentActivity.map((job) => (
                      <div key={job.id} className="flex items-start gap-4 group">
                        <div className="mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{job.company}</p>
                          <p className="text-xs text-muted-foreground">
                            Status: <span className="font-medium text-foreground">{job.status}</span>
                          </p>
                          <p className="text-xs text-slate-400">{job.dateApplied}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <span className="font-medium">{bigTechPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${bigTechPercent}%` }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Startups</span>
                    <span className="font-medium">{startupPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${startupPercent}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Mid-Tier</span>
                    <span className="font-medium">{midTierPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-violet-500" style={{ width: `${midTierPercent}%` }} />
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {totalApplied === 0 
                      ? "Start adding job applications to see your distribution insights."
                      : "Track your application distribution across different company types."}
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
