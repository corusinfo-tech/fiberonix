import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Activity, AlertTriangle } from "lucide-react";

const stats = [
  {
    title: "Total Customers",
    value: "2,847",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active subscribers",
  },
  {
    title: "Monthly Revenue",
    value: "$47,238",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "This month",
  },
  {
    title: "Network Health",
    value: "99.8%",
    change: "Optimal",
    changeType: "positive" as const,
    icon: Activity,
    description: "Uptime status",
  },
  {
    title: "Active Alerts",
    value: "3",
    change: "-2 from yesterday",
    changeType: "warning" as const,
    icon: AlertTriangle,
    description: "Requires attention",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-network transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  stat.changeType === "positive"
                    ? "text-success"
                    : stat.changeType === "warning"
                    ? "text-warning"
                    : "text-destructive"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}