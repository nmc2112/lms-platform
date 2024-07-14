import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChartComponent } from './(components)/BarChart'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function Dashboard() {

  return (
    <div className='flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Total Students */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <CardDescription>Number of students enrolled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">150</div>
          </CardContent>
        </Card>

        {/* Total Teachers */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
            <CardDescription>Number of active teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">20</div>
          </CardContent>
        </Card>

        {/* Total Classes */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
            <CardDescription>Number of classes being conducted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10</div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <div className="w-full mt-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue overview for the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent />
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manage Students</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/student-manage">
              <Button className="w-full justify-between">
                Go to Students <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manage Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/teacher-manage">
              <Button className="w-full justify-between">
                Go to Teachers <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manage Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/class-manage">
              <Button className="w-full justify-between">
                Go to Classes <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
