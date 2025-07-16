import { NetworkLayout } from "@/components/NetworkLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Users, MapPin, Wifi } from "lucide-react";

const customers = [
  {
    id: "CUST-001",
    name: "John Anderson",
    email: "john@example.com",
    phone: "+1 234-567-8901",
    location: "123 Fiber St, Building A",
    plan: "Premium",
    device: "DEV-045",
    status: "active",
    lastPayment: "Jan 15, 2024",
    joinDate: "Dec 2023"
  },
  {
    id: "CUST-002",
    name: "Sarah Chen",
    email: "sarah.chen@email.com", 
    phone: "+1 234-567-8902",
    location: "456 Network Ave, Unit 5B",
    plan: "Basic",
    device: "DEV-012",
    status: "active",
    lastPayment: "Jan 12, 2024",
    joinDate: "Nov 2023"
  },
  {
    id: "CUST-003",
    name: "Mike Rodriguez",
    email: "mike.r@company.com",
    phone: "+1 234-567-8903", 
    location: "789 Optical Blvd, Suite 12",
    plan: "Enterprise",
    device: "DEV-078",
    status: "suspended",
    lastPayment: "Dec 28, 2023",
    joinDate: "Oct 2023"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success text-success-foreground";
    case "suspended": return "bg-warning text-warning-foreground";
    case "inactive": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getPlanColor = (plan: string) => {
  switch (plan) {
    case "Basic": return "bg-muted text-muted-foreground";
    case "Premium": return "bg-primary text-primary-foreground";
    case "Enterprise": return "bg-gradient-primary text-primary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Customers() {
  return (
    <NetworkLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Customer Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage customer accounts and subscriptions</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-success/5 border-success/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-success">Active Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,198</div>
              <p className="text-xs text-muted-foreground">96.1% retention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-warning/5 border-warning/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-warning">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">Awaiting activation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-destructive/5 border-destructive/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">17</div>
              <p className="text-xs text-muted-foreground">Payment issues</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Customer Database</CardTitle>
                <CardDescription>View and manage all customer accounts</CardDescription>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-8 w-full sm:w-64" />
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{customer.email}</div>
                          <div className="text-xs text-muted-foreground">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 max-w-48">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{customer.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlanColor(customer.plan)}>
                          {customer.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-mono">{customer.device}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{customer.lastPayment}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                            <DropdownMenuItem>Show on Map</DropdownMenuItem>
                            <DropdownMenuItem>Payment History</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col space-y-4 p-2">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-muted/30 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.id}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div>
                      <strong>Email:</strong> {customer.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {customer.phone}
                    </div>
                    <div>
                      <strong>Location:</strong> {customer.location}
                    </div>
                    <div>
                      <strong>Plan:</strong> <Badge className={getPlanColor(customer.plan)}>{customer.plan}</Badge>
                    </div>
                    <div>
                      <strong>Device:</strong> <span className="font-mono">{customer.device}</span>
                    </div>
                    <div>
                      <strong>Status:</strong> <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </div>
                    <div>
                      <strong>Last Payment:</strong> <span className="text-muted-foreground">{customer.lastPayment}</span>
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                        <DropdownMenuItem>Show on Map</DropdownMenuItem>
                        <DropdownMenuItem>Payment History</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </NetworkLayout>
  );
}