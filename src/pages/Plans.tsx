import { NetworkLayout } from "@/components/NetworkLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Package, Users, DollarSign, Zap, Wifi, TrendingUp } from "lucide-react";

const plans = [
  {
    id: "PLAN-001",
    name: "Basic Fiber",
    description: "Perfect for light internet usage",
    speed: "100 Mbps",
    price: 39.99,
    period: "month",
    customers: 324,
    status: "active",
    features: ["Unlimited Data", "24/7 Support", "Basic Installation"]
  },
  {
    id: "PLAN-002", 
    name: "Premium Fiber",
    description: "Great for families and remote work",
    speed: "500 Mbps",
    price: 79.99,
    period: "month",
    customers: 567,
    status: "active",
    features: ["Unlimited Data", "Priority Support", "Free Installation", "WiFi Router Included"]
  },
  {
    id: "PLAN-003",
    name: "Enterprise Fiber",
    description: "Maximum performance for businesses",
    speed: "1 Gbps",
    price: 149.99,
    period: "month",
    customers: 89,
    status: "active", 
    features: ["Unlimited Data", "Dedicated Support", "SLA Guarantee", "Static IP", "Backup Connection"]
  },
  {
    id: "PLAN-004",
    name: "Student Special",
    description: "Discounted plan for students",
    speed: "200 Mbps",
    price: 24.99,
    period: "month",
    customers: 156,
    status: "limited",
    features: ["Unlimited Data", "Student Verification Required", "Basic Support"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success text-success-foreground";
    case "limited": return "bg-warning text-warning-foreground";
    case "inactive": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getSpeedIcon = (speed: string) => {
  if (speed.includes("1 Gbps")) return TrendingUp;
  if (speed.includes("500")) return Zap;
  return Wifi;
};

export default function Plans() {
  return (
    <NetworkLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Plan Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Create and manage service plans</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Active service plans</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-success/5 border-success/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-success">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,136</div>
              <p className="text-xs text-muted-foreground">Across all plans</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-warning/5 border-warning/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-warning">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$73k</div>
              <p className="text-xs text-muted-foreground">From all plans</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-destructive/5 border-destructive/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Most Popular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Premium</div>
              <p className="text-xs text-muted-foreground">567 subscribers</p>
            </CardContent>
          </Card>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const SpeedIcon = getSpeedIcon(plan.speed);
            return (
              <Card key={plan.id} className="shadow-elegant backdrop-blur-sm bg-card/95 hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <SpeedIcon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">${plan.price}</div>
                      <div className="text-sm text-muted-foreground">per {plan.period}</div>
                      <div className="text-lg font-semibold mt-2">{plan.speed}</div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                        {plan.customers} customers
                      </div>
                    </div>

                    <div className="space-y-2">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Plan Table */}
        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Plan Overview</CardTitle>
                <CardDescription>Detailed view of all service plans</CardDescription>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search plans..." className="pl-8 w-full sm:w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop/tablet table */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => {
                    const SpeedIcon = getSpeedIcon(plan.speed);
                    const revenue = plan.customers * plan.price;
                    return (
                      <TableRow key={plan.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <SpeedIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{plan.name}</div>
                              <div className="text-sm text-muted-foreground">{plan.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{plan.speed}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                            {plan.price}/{plan.period}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                            {plan.customers}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">${revenue.toLocaleString()}/mo</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Plan</DropdownMenuItem>
                              <DropdownMenuItem>View Customers</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate Plan</DropdownMenuItem>
                              <DropdownMenuItem>Export Data</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col space-y-4 p-2">
              {plans.map((plan) => {
                const SpeedIcon = getSpeedIcon(plan.speed);
                const revenue = plan.customers * plan.price;
                return (
                  <div key={plan.id} className="bg-muted/30 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <SpeedIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-xs text-muted-foreground">{plan.id}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div>
                        <strong>Speed:</strong> {plan.speed}
                      </div>
                      <div>
                        <strong>Price:</strong> ${plan.price}/{plan.period}
                      </div>
                      <div>
                        <strong>Customers:</strong> {plan.customers}
                      </div>
                      <div>
                        <strong>Revenue:</strong> ${revenue.toLocaleString()}/mo
                      </div>
                      <div>
                        <strong>Status:</strong> <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Plan</DropdownMenuItem>
                          <DropdownMenuItem>View Customers</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate Plan</DropdownMenuItem>
                          <DropdownMenuItem>Export Data</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </NetworkLayout>
  );
}