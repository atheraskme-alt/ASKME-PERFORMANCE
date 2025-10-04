import React, { useState, useEffect } from 'react';
import { User, Notification } from '@/entities/all';
import { SendEmail } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast, useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function SendNotification({ user }) {
    const [employees, setEmployees] = useState([]);
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchEmployees = async () => {
            const users = await User.filter({ role: 'user' });
            setEmployees(users);
        };
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recipient || !subject || !body) {
            toast({ title: "Missing Fields", description: "Please fill out all fields.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            await SendEmail({
                to: recipient === 'all' ? employees.map(e => e.email).join(',') : recipient,
                subject: subject,
                body: body,
                from_name: "Ask Me Solutions HR"
            });

            await Notification.create({
                recipient_email: recipient,
                subject: subject,
                body: body,
                sent_by: user.email,
            });

            toast({ title: "Success", description: "Notification sent successfully." });
            setRecipient('');
            setSubject('');
            setBody('');
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to send notification.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return <div className="text-center p-8"><p>Access Denied. This page is for HR Admins only.</p></div>;
    }

    return (
        <div>
            <Toaster />
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Send Email Notification</h1>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="recipient">Recipient</Label>
                            <Select value={recipient} onValueChange={setRecipient}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a recipient..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Employees</SelectItem>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.email}>
                                            {emp.full_name} ({emp.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="body">Body</Label>
                            <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required rows={8} placeholder="Write your message here..." />
                        </div>
                    </CardContent>
                    <CardContent>
                         <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Notification'}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
