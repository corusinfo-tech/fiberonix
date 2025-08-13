import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Users,
  GitBranch,
  Router,
  Server,
  Building2,
  UserCog,
} from "lucide-react";
import {
  fetchAllCustomers,
  fetchDevices,
  fetchJunctions,
  fetchOffices,
  fetchSub,
  fetchStaffs,
} from "@/services/api";

export function DashboardStats() {
  const [counts, setCounts] = useState({
    customers: 0,
    junctions: 0,
    devices: 0,
    offices: 0,
    subOffices: 0,
    staffs: 0,
  });

  useEffect(() => {
    const normalizeCount = (res: any): number => {
      if (Array.isArray(res)) return res.length;
      if (res && typeof res === "object") {
        if (Array.isArray((res as any).results)) return (res as any).results.length;
        if (typeof (res as any).count === "number") return (res as any).count;
        if (Array.isArray((res as any).data)) return (res as any).data.length;
      }
      return 0;
    };

    const loadCounts = async () => {
      try {
        const [customersRes, devicesRes, junctionsRes, officesRes, subRes, staffsRes] =
          await Promise.all([
            fetchAllCustomers(),
            fetchDevices(),
            fetchJunctions(),
            fetchOffices(),
            fetchSub(),
            fetchStaffs(),
          ]);

        setCounts({
          customers: Array.isArray(customersRes) ? customersRes.length : normalizeCount(customersRes),
          devices: normalizeCount(devicesRes),
          junctions: normalizeCount(junctionsRes),
          offices: normalizeCount(officesRes),
          subOffices: normalizeCount(subRes),
          staffs: Array.isArray(staffsRes) ? staffsRes.length : normalizeCount(staffsRes),
        });
      } catch (err) {
        console.error("Failed to load dashboard counts", err);
      }
    };

    loadCounts();
  }, []);

  const format = (n: number) => n.toLocaleString();

  const stats = [
    {
      title: "Customers",
      value: format(counts.customers),
      icon: Users,
      description: "Total",
    },
    {
      title: "Junctions",
      value: format(counts.junctions),
      icon: GitBranch,
      description: "Total",
    },
    {
      title: "Devices",
      value: format(counts.devices),
      icon: Router,
      description: "Total",
    },
    {
      title: "OLT",
      value: format(counts.offices),
      icon: Server,
      description: "Total",
    },
    {
      title: "Sub Offices",
      value: format(counts.subOffices),
      icon: Building2,
      description: "Total",
    },
    {
      title: "Staffs",
      value: format(counts.staffs),
      icon: UserCog,
      description: "Total",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-network transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}