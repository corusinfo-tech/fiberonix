import { NetworkLayout } from "@/components/NetworkLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, DollarSign, TrendingUp, Download, CreditCard } from "lucide-react";

const payments = [
  {
    id: "PAY-001",
    customer: "John Anderson",
    customerId: "CUST-001",
    amount: 79.99,
    plan: "Premium",
    date: "Jan 15, 2024",
    status: "completed",
    method: "Credit Card",
    invoice: "INV-2024-001"
  },
  {
    id: "PAY-002",
    customer: "Sarah Chen", 
    customerId: "CUST-002",
    amount: 39.99,
    plan: "Basic",
    date: "Jan 12, 2024",
    status: "completed",
    method: "Bank Transfer",
    invoice: "INV-2024-002"
  },
  {
    id: "PAY-003",
    customer: "Mike Rodriguez",
    customerId: "CUST-003",
    amount: 149.99,
    plan: "Enterprise", 
    date: "Jan 10, 2024",
    status: "pending",
    method: "Credit Card",
    invoice: "INV-2024-003"
  },
  {
    id: "PAY-004",
    customer: "Lisa Wang",
    customerId: "CUST-004",
    amount: 79.99,
    plan: "Premium",
    date: "Jan 8, 2024",
    status: "failed",
    method: "Credit Card",
    invoice: "INV-2024-004"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-success text-success-foreground";
    case "pending": return "bg-warning text-warning-foreground";
    case "failed": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Payments() {
  return (
    <NetworkLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Payment Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Track payments, invoices, and revenue</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card via-card to-success/5 border-success/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-success">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$47,892</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-warning/5 border-warning/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-warning">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">$1,847 total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-destructive/5 border-destructive/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Recent transactions and payment status</CardDescription>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search payments..." className="pl-8 w-full sm:w-64" />
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
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <DollarSign className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-mono text-sm">{payment.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.customer}</div>
                          <div className="text-sm text-muted-foreground">{payment.customerId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">${payment.amount}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.plan}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{payment.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{payment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                          {payment.invoice}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                            <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                            {payment.status === "failed" && (
                              <DropdownMenuItem>Retry Payment</DropdownMenuItem>
                            )}
                            {payment.status === "completed" && (
                              <DropdownMenuItem className="text-destructive">Refund</DropdownMenuItem>
                            )}
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
              {payments.map((payment) => (
                <div key={payment.id} className="bg-muted/30 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold font-mono">{payment.id}</div>
                      <div className="text-xs text-muted-foreground">{payment.customerId}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div>
                      <strong>Customer:</strong> {payment.customer}
                    </div>
                    <div>
                      <strong>Amount:</strong> ${payment.amount}
                    </div>
                    <div>
                      <strong>Plan:</strong> <Badge variant="outline">{payment.plan}</Badge>
                    </div>
                    <div>
                      <strong>Date:</strong> {payment.date}
                    </div>
                    <div>
                      <strong>Method:</strong> {payment.method}
                    </div>
                    <div>
                      <strong>Status:</strong> <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                    </div>
                    <div>
                      <strong>Invoice:</strong> <span className="text-primary">{payment.invoice}</span>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                        <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                        {payment.status === "failed" && (
                          <DropdownMenuItem>Retry Payment</DropdownMenuItem>
                        )}
                        {payment.status === "completed" && (
                          <DropdownMenuItem className="text-destructive">Refund</DropdownMenuItem>
                        )}
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