import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  AlertTriangle, 
  Router, 
  Users, 
  DollarSign,
  Clock
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "device",
    icon: Router,
    title: "New device connected",
    description: "Router R-2847 came online in Sector 7",
    time: "2 minutes ago",
    status: "success",
    user: "System",
  },
  {
    id: 2,
    type: "customer",
    icon: Users,
    title: "New customer signup",
    description: "John Smith upgraded to Premium plan",
    time: "15 minutes ago",
    status: "success",
    user: "JS",
  },
  {
    id: 3,
    type: "alert",
    icon: AlertTriangle,
    title: "Network latency spike",
    description: "Latency increased to 45ms in Zone B",
    time: "1 hour ago",
    status: "warning",
    user: "Monitor",
  },
  {
    id: 4,
    type: "payment",
    icon: DollarSign,
    title: "Payment received",
    description: "$79.99 from Customer #2843",
    time: "2 hours ago",
    status: "success",
    user: "PS",
  },
  {
    id: 5,
    type: "device",
    icon: CheckCircle,
    title: "Maintenance completed",
    description: "Scheduled maintenance for Sector 12 finished",
    time: "3 hours ago",
    status: "success",
    user: "Tech",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activity.status === "success" 
                  ? "bg-success/10 text-success" 
                  : activity.status === "warning"
                  ? "bg-warning/10 text-warning"
                  : "bg-primary/10 text-primary"
              }`}>
                <activity.icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {activity.user}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
                <Badge variant={
                  activity.status === "success" 
                    ? "default" 
                    : activity.status === "warning"
                    ? "destructive"
                    : "secondary"
                } className="text-xs">
                  {activity.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}