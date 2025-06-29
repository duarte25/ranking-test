import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";

export default function SkeletonLoading() {
  return (
    <Table className="p-10">
      <TableBody>
        <TableRow >
          <TableCell>
            <Skeleton className="h-10 w-fulll" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-fulll" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-fulll" />
          </TableCell>
        </TableRow>
        {[...Array(10)].map((_, index) => (
          <TableRow key={index}>
            <TableCell colSpan={3}>
              <Skeleton className="h-10 w-fulll" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  );
}
