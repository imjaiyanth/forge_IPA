import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateMember } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
    const { toast } = useToast();
    const [user, setUser] = useState({
        id: 0,
        name: "",
        email: "",
        role: "",
        phone: "",
        department: "Management", // Department is not in the Member model, keeping it static or fetched if added
        joinDate: "January 15, 2023" // Join date is not in the Member model
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser({
                ...user,
                id: parsedUser.id,
                name: parsedUser.name,
                email: parsedUser.email,
                role: parsedUser.role,
                phone: parsedUser.contact || "",
            });
        }
    }, []);

    const handleSave = async () => {
        try {
            const updateData = {
                name: user.name,
                email: user.email, // Usually email shouldn't be editable or needs verification, but allowed here
                contact: user.phone
            };
            const updatedUser = await updateMember(user.id, updateData);

            // Update local storage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUser));

            toast({
                title: "Profile Updated",
                description: "Your profile information has been updated successfully.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Update Failed",
                description: "There was an error updating your profile.",
                variant: "destructive"
            });
        }
    };

    const getInitials = (name: string) => {
        return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <AppLayout title="My Profile" breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Profile" }]}>
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-col items-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{user.name || "User"}</CardTitle>
                            <CardDescription>{user.role}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <div className="font-medium text-muted-foreground mb-1">Email</div>
                                <div>{user.email}</div>
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-muted-foreground mb-1">Phone</div>
                                <div>{user.phone}</div>
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-muted-foreground mb-1">Department</div>
                                <div>{user.department}</div>
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-muted-foreground mb-1">Member Since</div>
                                <div>{user.joinDate}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>Update your personal information and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" value={user.role} disabled className="bg-muted" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>

                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
