import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Key, Image, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  monthlyUsage: number;
  monthlyLimit: number;
  apiKeyCount: number;
  historyCount: number;
}

export const StatsCards = ({
  monthlyUsage,
  monthlyLimit,
  apiKeyCount,
  historyCount,
}: StatsCardsProps) => {
  const usagePercent = Math.min((monthlyUsage / monthlyLimit) * 100, 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Usage
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyUsage}{' '}
            <span className="text-sm font-normal text-muted-foreground">/ {monthlyLimit}</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(monthlyLimit - monthlyUsage)} requests remaining
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            API Keys
          </CardTitle>
          <Key className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{apiKeyCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Active API keys</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Images Generated
          </CardTitle>
          <Image className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{historyCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Total this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Usage Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usagePercent.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground mt-1">Of monthly quota used</p>
        </CardContent>
      </Card>
    </div>
  );
};
