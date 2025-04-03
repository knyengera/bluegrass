
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Account settings
  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || ""
  });

  // Password settings
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // App settings
  const [appSettings, setAppSettings] = useState({
    language: "english",
    timezone: "Africa/Johannesburg",
    currency: "ZAR"
  });
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAppSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAppSettings({
      ...appSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!accountForm.name || !accountForm.email) {
      toast.error("Name and email are required");
      return;
    }
    
    // Save settings
    toast.success("Account settings saved successfully");
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!passwordForm.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (passwordForm.newPassword && passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    // Save settings
    toast.success("Password changed successfully");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const handleAppSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings
    toast.success("App settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your account and application settings.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex items-center">
            <div>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </div>
            <Badge variant="outline" className="ml-auto">
              {user?.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger className="flex-1" value="account">Account</TabsTrigger>
              <TabsTrigger className="flex-1" value="password">Password</TabsTrigger>
              <TabsTrigger className="flex-1" value="notifications">Notifications</TabsTrigger>
              <TabsTrigger className="flex-1" value="app">App Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={accountForm.name} 
                    onChange={handleAccountChange}
                    placeholder="Full Name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={accountForm.email} 
                    onChange={handleAccountChange}
                    placeholder="Email address" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input 
                    id="mobile" 
                    name="mobile" 
                    value={accountForm.mobile} 
                    onChange={handleAccountChange}
                    placeholder="Mobile number" 
                  />
                </div>
                
                <Button type="submit" className="mt-4">Save Account Settings</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword" 
                    type="password" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChange}
                    placeholder="••••••••" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChange}
                    placeholder="••••••••" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    value={passwordForm.confirmPassword} 
                    onChange={handlePasswordChange}
                    placeholder="••••••••" 
                  />
                </div>
                
                <Button type="submit" className="mt-4">Change Password</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive order updates and important notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive real-time updates and notifications in the browser
                    </p>
                  </div>
                  <Switch 
                    id="pushNotifications" 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications} 
                  />
                </div>
                
                <div className="space-y-3 pt-3">
                  <h3 className="font-medium">Notification Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="order-updates" defaultChecked />
                      <label htmlFor="order-updates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Order Updates
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="product-alerts" defaultChecked />
                      <label htmlFor="product-alerts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Low Stock Alerts
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="user-activity" />
                      <label htmlFor="user-activity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        User Activity
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-4">Save Notification Settings</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="app">
              <form onSubmit={handleAppSettingsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language" 
                    name="language"
                    value={appSettings.language}
                    onChange={handleAppSettingsChange}
                    className="w-full flex h-10 bg-background rounded-md border border-input px-3 py-2 text-sm"
                  >
                    <option value="english">English</option>
                    <option value="afrikaans">Afrikaans</option>
                    <option value="zulu">Zulu</option>
                    <option value="xhosa">Xhosa</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select 
                    id="timezone" 
                    name="timezone"
                    value={appSettings.timezone}
                    onChange={handleAppSettingsChange}
                    className="w-full flex h-10 bg-background rounded-md border border-input px-3 py-2 text-sm"
                  >
                    <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="America/New_York">America/New_York (GMT-5)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency" 
                    name="currency"
                    value={appSettings.currency}
                    onChange={handleAppSettingsChange}
                    className="w-full flex h-10 bg-background rounded-md border border-input px-3 py-2 text-sm"
                  >
                    <option value="ZAR">South African Rand (ZAR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                
                <div className="flex items-center mt-6 space-x-3">
                  <Switch 
                    id="darkMode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                  <Label htmlFor="darkMode">Dark Mode</Label>
                </div>
                
                <Button type="submit" className="mt-4">Save App Settings</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
