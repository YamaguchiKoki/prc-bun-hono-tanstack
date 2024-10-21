import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
  await new Promise((r) => setTimeout(r, 3000))
  const res = await api.expenses.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await res.json()

  return data
}

function Expenses() {
  const { isPending, error, data } = useQuery({ queryKey: ['get-all-expense'], queryFn: getAllExpenses })

  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='p-2 max-w-3xl m-auto'>
      <Table>
        <TableHeader>
          <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ?Array(3)
            .fill(0)
            .map((_, i) => (
              <TableRow key={i}>
                  <TableCell className="font-medium"><Skeleton className='h-4'/></TableCell>
                  <TableCell><Skeleton className='h-4'/></TableCell>
                  <TableCell><Skeleton className='h-4'/></TableCell>
              </TableRow>
            ))
            : data?.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="w-[100px]">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </div>
  )
}
