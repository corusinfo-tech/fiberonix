import { NetworkLayout } from "@/components/NetworkLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Building, 
  Palette, 
  Shield, 
  Bell, 
  Database,
  Mail,
  CreditCard,
  Users,
  Save
} from "lucide-react";

export default function Settings() {
  return (
    <NetworkLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure your network management system</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Settings */}
          <Card className="lg:col-span-2 shadow-elegant backdrop-blur-sm bg-card/95">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-primary" />
                <CardTitle>Company Information</CardTitle>
              </div>
              <CardDescription>Update your company details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="NetworkCommand" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Contact Email</Label>
                  <Input id="company-email" type="email" defaultValue="contact@networkcommand.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Address</Label>
                <Textarea id="company-address" defaultValue="123 Fiber Street, Network City, NC 12345" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone</Label>
                  <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input id="company-website" defaultValue="https://networkcommand.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Backup Database
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Audit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                User Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Email Templates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Settings */}
        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <CardTitle>System Configuration</CardTitle>
            </div>
            <CardDescription>Configure system behavior and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-primary" />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive system alerts via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="device-alerts">Device Alerts</Label>
                        <p className="text-sm text-muted-foreground">Alert when devices go offline</p>
                      </div>
                      <Switch id="device-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="payment-reminders">Payment Reminders</Label>
                        <p className="text-sm text-muted-foreground">Send payment due reminders</p>
                      </div>
                      <Switch id="payment-reminders" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Palette className="w-4 h-4 mr-2 text-primary" />
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable dark theme</p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                      </div>
                      <Switch id="compact-mode" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-primary" />
                    Payment Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Input id="currency" defaultValue="USD" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-gateway">Payment Gateway</Label>
                      <Input id="payment-gateway" defaultValue="Stripe" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-billing">Auto Billing</Label>
                        <p className="text-sm text-muted-foreground">Automatically charge recurring payments</p>
                      </div>
                      <Switch id="auto-billing" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-primary" />
                    Data & Backup
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Input id="backup-frequency" defaultValue="Daily" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data-retention">Data Retention (days)</Label>
                      <Input id="data-retention" type="number" defaultValue="365" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-backup">Auto Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </NetworkLayout>
  );
}