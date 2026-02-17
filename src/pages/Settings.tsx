import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Bell, Shield, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        updates: true,
        security: true,
    });

    const toggleTheme = () => {
        // This is a dummy implementation. In a real app, this would use a context or store.
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AppLayout title="Settings" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Settings" }]}>
            <div className="max-w-4xl mx-auto space-y-6">
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>Customize the look and feel of the application.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Switch between light and dark themes.
                                        </p>
                                    </div>
                                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Manage how you receive notifications.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive updates via email.</p>
                                    </div>
                                    <Switch checked={notifications.email} onCheckedChange={() => handleNotificationChange("email")} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive updates on your device.</p>
                                    </div>
                                    <Switch checked={notifications.push} onCheckedChange={() => handleNotificationChange("push")} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Security Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Start receiving security alerts.</p>
                                    </div>
                                    <Switch checked={notifications.security} onCheckedChange={() => handleNotificationChange("security")} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Manage your password and account security.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Two-Factor Authentication</Label>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                    </div>
                                    <Button variant="outline">Enabled</Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Change Password</Label>
                                        <p className="text-sm text-muted-foreground">Update your password regularly to stay secure.</p>
                                    </div>
                                    <Button variant="secondary">Update Password</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </AppLayout>
    );
}
