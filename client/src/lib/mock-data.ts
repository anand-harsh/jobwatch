import { format } from "date-fns";

export type JobStatus = 
  | "Applied" 
  | "Shortlisted" 
  | "Interview Scheduled" 
  | "Technical Interview" 
  | "Offer Received" 
  | "Rejected" 
  | "Withdrawn";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: JobStatus;
  notes: string;
  category: "Big Tech" | "Startup" | "Mid-Tier" | "Other";
}

const companiesRaw = [
    // Big Tech/Service Companies
    "TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "HCLTech", "Tech Mahindra", 
    "Capgemini", "IBM", "Deloitte", "Amazon", "Microsoft", "Google", "Meta", "Adobe", 
    "Oracle", "Flipkart", "Walmart Labs", "Cisco", "Intel",
    
    // Startups
    "Jar", "Zepto", "Blinkit (Grofers)", "PhysicsWallah", "Unacademy", "Urban Company", 
    "PolicyBazaar", "Innoviti Solutions", "Rupeek", "Cuemath", "Fashinza", "Loop Health", 
    "Byju's", "Perfios", "Livspace", "INCREFF", "BlueStone.com", "Pristyn Care", 
    "Rentomojo", "MyGlamm", "Scripbox", "Lokal", "CoinSwitch", "DrinkPrime", 
    "ClearFeed", "RIM Labs", "Crafter Inc", "Liberin Technologies", "10x", 
    "Sadhana IT Solutions", "Futops Technologies", "Notetech Software", 
    "Propel Technology Group", "Mindtickle", "Agoda", "KiE Square Analytics", 
    "Vit", "ShortLoop", "Aikenist", "Fluxon",
    
    // Mid-Tier Product-Based Companies
    "Paytm", "Swiggy", "Zoho", "Freshworks", "Razorpay", "PhonePe", "CRED", 
    "Meesho", "InMobi", "Dream11", "Ather Energy", "Zerodha", "Pine Labs", 
    "NoBroker", "Nykaa", "Groww", "Udaan", "MakeMyTrip", "Ola Electric", 
    "Postman", "PostiPay", "Chargebee", "CleverTap", "MoEngage"
];

// Helper to guess category based on index/position in the original list isn't perfect, 
// so I'll just map them manually based on the provided text file groups for better accuracy if I were parsing,
// but for now I'll assign random categories for visual variety if not explicitly mapped, 
// or simpler: just all "Target".
// Actually, I can use the list order from the prompt:
// 0-19: Big Tech
// 20-59: Startups
// 60+: Mid-Tier

export const initialJobs: JobApplication[] = companiesRaw.map((company, index) => {
  let category: JobApplication["category"] = "Other";
  if (index < 20) category = "Big Tech";
  else if (index < 60) category = "Startup";
  else category = "Mid-Tier";

  // Simulate some random statuses
  const statuses: JobStatus[] = ["Applied", "Shortlisted", "Interview Scheduled", "Rejected", "Withdrawn"];
  const randomStatus = Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : "Applied";
  
  // Simulate dates within last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));

  return {
    id: `job-${index}`,
    company,
    role: "SDE/SWE/Backend",
    dateApplied: format(date, "yyyy-MM-dd"),
    status: randomStatus,
    notes: "",
    category
  };
});
