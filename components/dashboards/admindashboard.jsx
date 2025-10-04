import React, { useState, useEffect } from 'react';
import { User, PerformanceRecord, Update } from '@/entities/all';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, ClipboardList, Megaphone } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({ employees: 0, records: 0, updates: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [employees, records, updates] = await Promise.all([
        User.filter({ role: 'user' }),
        PerformanceRecord.list(),
        Update.list(),
      ]);
      setStats({
        employees: employees.length,
        records: records.length,
        updates: updates.length,
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {user.full_name}. Here's an overview of the portal.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Records Logged</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.records}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates Published</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.updates}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Use the sidebar to manage employees, log performance, or post new updates.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
