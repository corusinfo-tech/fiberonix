import { NetworkLayout } from "@/components/NetworkLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Router,
  Cpu,
  Wifi,
  Activity,
} from "lucide-react";

const devices = [
  {
    id: "DEV-001",
    name: "Main Office Switch",
    type: "Switch",
    location: "Central Office",
    ip: "192.168.1.1",
    status: "online",
    customers: 24,
    lastSeen: "2 minutes ago",
  },
  {
    id: "DEV-002",
    name: "Fiber Splitter A1",
    type: "Splitter",
    location: "Zone A",
    ip: "192.168.1.15",
    status: "online",
    customers: 8,
    lastSeen: "5 minutes ago",
  },
  {
    id: "DEV-003",
    name: "Customer Router X23",
    type: "Router",
    location: "Building C",
    ip: "192.168.2.45",
    status: "offline",
    customers: 1,
    lastSeen: "2 hours ago",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-success text-success-foreground";
    case "offline":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getDeviceIcon = (type: string) => {
  switch (type) {
    case "Switch":
      return Router;
    case "Router":
      return Wifi;
    case "Splitter":
      return Cpu;
    default:
      return Activity;
  }
};

export default function Devices() {
  return (
    <NetworkLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Device Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Monitor and manage all network devices</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card via-card to-success/5 border-success/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-success">Online Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-warning/5 border-warning/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-warning">Offline Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">-1 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">Connected customers</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>Network Devices</CardTitle>
                <CardDescription>Manage your optical network infrastructure</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search devices..." className="pl-8 w-full" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Desktop/tablet table */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-[768px] w-full text-sm text-left border-separate border-spacing-y-1">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Device</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">IP Address</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Customers</th>
                    <th className="px-4 py-2">Last Seen</th>
                    <th className="px-4 py-2 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => {
                    const DeviceIcon = getDeviceIcon(device.type);
                    return (
                      <tr key={device.id} className="bg-muted/30 rounded-lg">
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <DeviceIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{device.name}</div>
                              <div className="text-sm text-muted-foreground">{device.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">{device.type}</td>
                        <td className="px-4 py-2">{device.location}</td>
                        <td className="px-4 py-2 font-mono">{device.ip}</td>
                        <td className="px-4 py-2">
                          <Badge className={getStatusColor(device.status)}>
                            {device.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">{device.customers}</td>
                        <td className="px-4 py-2 text-muted-foreground">{device.lastSeen}</td>
                        <td className="px-4 py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Device</DropdownMenuItem>
                              <DropdownMenuItem>Show on Map</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col space-y-4 p-2">
              {devices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type);
                return (
                  <div key={device.id} className="bg-muted/30 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DeviceIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{device.name}</div>
                        <div className="text-xs text-muted-foreground">{device.id}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div>
                        <strong>Type:</strong> {device.type}
                      </div>
                      <div>
                        <strong>Location:</strong> {device.location}
                      </div>
                      <div>
                        <strong>IP:</strong> <span className="font-mono">{device.ip}</span>
                      </div>
                      <div>
                        <strong>Status:</strong> <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
                      </div>
                      <div>
                        <strong>Customers:</strong> {device.customers}
                      </div>
                      <div>
                        <strong>Last Seen:</strong> <span className="text-muted-foreground">{device.lastSeen}</span>
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
                          <DropdownMenuItem>Edit Device</DropdownMenuItem>
                          <DropdownMenuItem>Show on Map</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
