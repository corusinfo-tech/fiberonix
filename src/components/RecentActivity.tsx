import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  AlertTriangle,
  Router,
  Users,
  DollarSign,
  Clock,
  GitBranch,
  Server,
  Building2,
  UserCog,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getRecentActivities,
  subscribeToRecentActivity,
  getCurrentUserKey,
} from "@/services/activityLog";
import { useAuth } from "@/context/AuthContext";

function getIconForType(type: string) {
  switch ((type || "").toLowerCase()) {
    case "device":
      return Router;
    case "customer":
      return Users;
    case "junction":
      return GitBranch;
    case "olt":
      return Server;
    case "sub office":
      return Building2;
    case "staff":
      return UserCog;
    case "payment":
      return DollarSign;
    case "alert":
      return AlertTriangle;
    default:
      return CheckCircle;
  }
}

function formatTime(ts?: number) {
  if (!ts) return "just now";
  const diffMs = Date.now() - ts;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function initials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function RecentActivity() {
  const { token, name } = useAuth();
  // Derive a stable user key whenever auth changes
  const userKey = useMemo(() => getCurrentUserKey(), [token, name]);

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Load current user's activities
    setActivities(getRecentActivities(userKey));

    // Subscribe to current user's activity events
    const unsubscribe = subscribeToRecentActivity(() => {
      setActivities(getRecentActivities(userKey));
    }, userKey);

    return unsubscribe;
  }, [userKey]);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
 
      {/* Fixed height + scroll */}
      <CardContent className="space-y-4 max-h-[700px] overflow-y-auto">
        {activities.length === 0 && (
          <div className="text-sm text-muted-foreground">No recent activity yet.</div>
        )}
        {activities.map((activity) => {
          const Icon = getIconForType(activity.type);
          const status = (activity.status || "info").toLowerCase();
          const badgeVariant =
            status === "success"
              ? "default"
              : status === "warning"
              ? "destructive"
              : "secondary";

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    status === "success"
                      ? "bg-success/10 text-success"
                      : status === "warning"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {initials(activity.user || "System")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</span>
                  <Badge variant={badgeVariant as any} className="text-xs">
                    {status}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
