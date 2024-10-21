import './App.css'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

async function getTotalSpent() {
  const res = await api.expenses["total"].$get()
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await res.json()

  return data
}

function App() {
  const { isPending, error, data } = useQuery({ queryKey: ['total'], queryFn: getTotalSpent })

  if (error) return <div>Error: {error.message}</div>

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? '...': data.totalSpent}</CardContent>
    </Card>
  )
}

export default App
