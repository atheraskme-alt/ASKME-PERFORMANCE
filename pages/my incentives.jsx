import React, { useState, useEffect } from 'react';
import { Incentive } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Award } from 'lucide-react';

export default function MyIncentives({ user }) {
    const [incentives, setIncentives] = useState([]);
    const [totalEarned, setTotalEarned] = useState(0);

    useEffect(() => {
        const fetchIncentives = async () => {
            if (user) {
                const data = await Incentive.filter({ employee_email: user.email }, '-date_awarded');
                setIncentives(data);
                const total = data.reduce((sum, incentive) => sum + incentive.amount, 0);
                setTotalEarned(total);
            }
        };
        fetchIncentives();
    }, [user]);

    const getTypeBadge = (type) => {
        const colors = {
            bonus: 'bg-green-100 text-green-800',
            performance_incentive: 'bg-blue-100 text-blue-800',
            project_completion: 'bg-purple-100 text-purple-800',
            monthly_reward: 'bg-yellow-100 text-yellow-800',
            annual_bonus: 'bg-red-100 text-red-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return <Badge className={colors[type]}>{type.replace('_', ' ')}</Badge>;
    };

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-800">My Incentives & Bonuses</h1>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Total Earned This Year</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-green-600">${totalEarned.toFixed(2)}</div>
                    <p className="text-gray-500 mt-2">From {incentives.length} awards</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Incentive History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {incentives.map(incentive => (
                                <TableRow key={incentive.id}>
                                    <TableCell>{format(new Date(incentive.date_awarded), 'MMMM d, yyyy')}</TableCell>
                                    <TableCell>{getTypeBadge(incentive.type)}</TableCell>
                                    <TableCell className="font-bold text-green-600">${incentive.amount}</TableCell>
                                    <TableCell className="max-w-xs truncate">{incentive.description}</TableCell>
                                </TableRow>
                            ))}
                            {incentives.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                        No incentives awarded yet. Keep up the great work!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
