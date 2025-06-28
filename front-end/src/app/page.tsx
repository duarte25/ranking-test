"use client";

import { ViewUserData } from "@/api/models/User";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["listUser"],
    queryFn: async () => {
      const response = await fetchUseQuery<ViewUserData[], unknown>({
        route: "/users",
        method: "GET",
        nextOptions: {},
      });

      return response.data;
    },
    retry: 2,
  });

  function convertBytesToImageUrl(byteArray: Record<number, number> | Uint8Array | undefined) {
    if (!byteArray) return null;

    // Se já for um Uint8Array, usa diretamente, senão converte
    const uint8Array = byteArray instanceof Uint8Array ? byteArray : new Uint8Array(Object.values(byteArray));

    const blob = new Blob([uint8Array], { type: "image/jpeg" }); // Ajuste o tipo conforme necessário
    return URL.createObjectURL(blob);
  }

  return (
    <div>
      <h1>OLA</h1>
      <div
        className="w-2/6 aspect-[3/3] bg-[url('/tabela_pontuacao.svg')] bg-contain bg-no-repeat bg-center border 
        flex items-center justify-center">
        <div className="w-3/5 rounded">
          <Table className="w-full pt-24 border-separate border-spacing-y-2">
            <TableBody>
              {Array.isArray(data) &&
                data.map((user: ViewUserData, index: number) => {
                  const posicao = index + 1;
                  return (
                    <TableRow key={user?.id}>
                      <TableCell className="border-y-2 border-l-2 rounded-l-sm w-12 text-center align-middle py-0">
                        {posicao <= 3 ? (
                          // Top 3 com imagem de fundo
                          <div
                            className="size-6 sm:size-10 md:size-12 lg:size-14 bvo bg-contain bg-no-repeat bg-center flex items-center justify-center
                 text-white"
                            style={{ backgroundImage: `url('/rank_${posicao}.svg')` }}
                          >
                            {posicao}°
                          </div>
                        ) : (
                          <div
                            className="size- sm:size-10 md:size-12 lg:size-14 bvo bg-contain bg-no-repeat bg-center flex items-center justify-center
                 text-white"
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
                              convertBytesToImageUrl(user?.foto?.imagem) ||
                              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                            }
                            alt={"Usuário"}
                            className="object-cover rounded-full size-6 sm:size-10 md:size-12 lg:size-12"
                          />
                          <AvatarFallback className="rounded-md text-[color:#465068] font-bold">
                            Usuário
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>

                      <TableCell className="border-y-2">{user.nome}</TableCell>
                      <TableCell className="border-y-2 border-r-2 rounded-r-sm text-[color:#465068] font-bold py-0">
                        {user.pontuacao}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>

          </Table>
        </div>
      </div>
    </div>
  );
}