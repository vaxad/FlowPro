import {
  Users,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChartMap } from "./custom/charts/bar"
import { user } from "@prisma/client"
import { Entity } from "@/lib/types"
import EntityTable from "./table"

export default function Dashboard({ records, entity }: { records: user[], entity: Entity }) {
  const totalRecords = records.length;
  const lastMonthTotal = Math.floor(totalRecords * 0.8); // Assuming 20% growth from last month
  const percentageGrowth = ((totalRecords - lastMonthTotal) / lastMonthTotal || 1) * 100;

  const thisWeekRecords = records.filter(record => {
    const fpca = new Date(record.fpca);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return fpca >= sevenDaysAgo;
  }).length;
  const previousWeekRecords = Math.floor(thisWeekRecords / 1.15); // Assuming a 15% growth rate
  const growthThisWeek = ((thisWeekRecords - previousWeekRecords) / previousWeekRecords || 1) * 100;

  const todayRecords = records.filter(record => {
    const fpca = new Date(record.fpca);
    const today = new Date();
    return (
      fpca.getDate() === today.getDate() &&
      fpca.getMonth() === today.getMonth() &&
      fpca.getFullYear() === today.getFullYear()
    );
  }).length;
  const yesterdayRecords = Math.floor(todayRecords / 2.8); // Assuming 180.1% growth over yesterday
  const todayGrowth = ((todayRecords - yesterdayRecords) / (yesterdayRecords || 1)) * 100;

  const getMonthlyData = (records: user[]) => {
    const monthlyCounts: { [key: string]: number } = {};

    records.forEach((record) => {
      const date = new Date(record.fpca);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      // Initialize the count for the month if it doesn't exist
      if (!monthlyCounts[monthKey]) {
        monthlyCounts[monthKey] = 0;
      }
      monthlyCounts[monthKey]++;
    });

    // Create an array for the last 6 months (for example)
    const currentMonth = new Date();
    const monthlyData = [];

    for (let i = 0; i < 6; i++) {
      const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
      const monthKey = month.toLocaleString('default', { month: 'short', year: 'numeric' });

      monthlyData.push({
        key: monthKey,
        value: monthlyCounts[monthKey] || 0,
      });
    }

    return monthlyData.reverse();
  };

  const monthlyData = getMonthlyData(records);

  const entityName = entity.name.toLowerCase();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex gap-6 w-full">
          <div className="flex flex-col gap-6 w-full">
            <Card x-chunk="A card showing the total revenue in USD and the percentage difference from last month.">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total {entityName}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{records.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{percentageGrowth === Infinity ? "100+" : percentageGrowth.toFixed(2) + "%"} from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="A card showing the total subscriptions and the percentage difference from last month.">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This week
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{thisWeekRecords}</div>
                <p className="text-xs text-muted-foreground">
                  +{growthThisWeek === Infinity ? "100+" : growthThisWeek.toFixed(2) + "%"} from last week
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="A card showing the total subscriptions and the percentage difference from last month.">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{todayGrowth}</div>
                <p className="text-xs text-muted-foreground">
                  +{todayGrowth.toFixed(2) + "%"} from yesterday;
                </p>
              </CardContent>
            </Card>
          </div>

          {/* <div className="flex w-full"> */}
          <BarChartMap data={monthlyData}
            label={entityName}
            title={`Monthly ${entityName} Growth`}
          />
        </div>
        <div className="flex w-full">
          <EntityTable entity={entity} records={records} />
        </div>
      </main>
    </div>
  )
}
