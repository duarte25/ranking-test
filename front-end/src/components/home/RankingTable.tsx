// components/RankingTable.tsx
import { ViewUserData } from "@/api/models/User";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { convertBytesToImageUrl } from "@/utils/convertImage";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface RankingTableProps {
  data: ViewUserData[] | undefined;
}

export function RankingTable({ data }: RankingTableProps) {

  return (
    <div
      className="w-2/6 aspect-[3/3] bg-[url('/tabela_pontuacao.svg')] bg-contain bg-no-repeat bg-center 
        flex items-center justify-center pt-12">
      <div className="w-3/5 rounded h-[40vh] overflow-y-auto">
        <Table className="w-full pt-24 border-separate border-spacing-y-2">
          <TableBody>
            {Array.isArray(data) &&
              data.slice(0, 5).map((user: ViewUserData, index: number) => {
                const posicao = index + 1;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="border-y-2 border-l-2 rounded-l-sm w-12 text-center align-middle py-0">
                      {posicao <= 3 ? (
                        <div
                          className="size-6 sm:size-10 md:size-12 lg:size-14 bg-contain bg-no-repeat bg-center flex items-center justify-center text-white"
                          style={{ backgroundImage: `url('/rank_${posicao}.svg')` }}
                        >
                          {posicao}°
                        </div>
                      ) : (
                        <div
                          className="size-6 sm:size-10 md:size-12 lg:size-14 bg-contain bg-no-repeat bg-center flex items-center justify-center text-white"
                          style={{ backgroundImage: "url('/rank_4.svg')" }}
                        >
                          {posicao}°
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="border-y-2 py-0">
                      <Avatar className="rounded-full">
                        <AvatarImage
                          src={
                            convertBytesToImageUrl(user.foto?.imagem) ||
                            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png "
                          }
                          alt="Usuário"
                          className="object-cover rounded-full size-6 sm:size-10 md:size-12 lg:size-12"
                        />
                        <AvatarFallback className="rounded-md text-gray-font font-bold">
                          Usuário
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="border-y-2">{user.nome}</TableCell>
                    <TableCell className="border-y-2 border-r-2 rounded-r-sm text-gray-font font-bold py-0">
                      {user.pontuacao}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}