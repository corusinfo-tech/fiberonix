import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
  Legend,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 32000, customers: 2400 },
  { month: "Feb", revenue: 35000, customers: 2500 },
  { month: "Mar", revenue: 38000, customers: 2600 },
  { month: "Apr", revenue: 42000, customers: 2750 },
  { month: "May", revenue: 45000, customers: 2800 },
  { month: "Jun", revenue: 47238, customers: 2847 },
];

const deviceData = [
  { name: "Switches", value: 45, color: "hsl(217, 91%, 35%)" },
  { name: "Routers", value: 25, color: "hsl(200, 98%, 39%)" },
  { name: "Splitters", value: 20, color: "hsl(142, 71%, 45%)" },
  { name: "Offices", value: 10, color: "hsl(38, 92%, 50%)" },
];

const networkHealth = [
  { time: "00:00", uptime: 99.9, latency: 12 },
  { time: "04:00", uptime: 99.8, latency: 15 },
  { time: "08:00", uptime: 99.9, latency: 11 },
  { time: "12:00", uptime: 99.8, latency: 13 },
  { time: "16:00", uptime: 99.9, latency: 10 },
  { time: "20:00", uptime: 99.8, latency: 14 },
];

export function NetworkChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Revenue Chart */}
      <Card className="col-span-full lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Monthly Revenue & Growth
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(217, 91%, 35%)"
                strokeWidth={3}
                dot={{ fill: "hsl(217, 91%, 35%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(217, 91%, 35%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Distribution */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Device Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                strokeWidth={2}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {deviceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Health */}
      <Card className="col-span-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Network Performance (24h)
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={networkHealth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="uptime"
                fill="hsl(142, 71%, 45%)"
                name="Uptime %"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="latency"
                fill="hsl(200, 98%, 39%)"
                name="Latency (ms)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}