"use client";

import { ViewFirtsRank, ViewLastScores, ViewUserData } from "@/api/models/User";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["listUser"],
    queryFn: async () => {
      const response = await fetchUseQuery<unknown, ViewUserData[]>({
        route: "/users",
        method: "GET",
        nextOptions: {},
      });

      return response.data;
    },
    retry: 2,
  });

  const { data: dataFirtsRank } = useQuery({
    queryKey: ["firsrtRank"],
    queryFn: async () => {
      const response = await fetchUseQuery<unknown, ViewFirtsRank>({
        route: "/users/first_rank",
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
    <div className="flex justify-between px-10">
      <div
        className="w-2/6 aspect-[3/3] bg-[url('/placa_primeiro_lugar.svg')] bg-contain bg-no-repeat bg-center 
        flex justify-center pt-60">
        <div className="-rotate-[16.33deg] flex flex-col gap-4 w-2/6">
          <span className="text-gray-font font-medium">{dataFirtsRank?.topUser.pontuacao}pts</span>
          <Avatar className="rounded-full flex justify-center">
            <AvatarImage
              src={
                convertBytesToImageUrl(dataFirtsRank?.topUser.foto?.imagem) ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
              alt={"Usuário"}
              className="object-cover rounded-full size-6 sm:size-10 md:size-12 lg:size-28"
            />
            <AvatarFallback className="rounded-md text-gray-font font-bold">
              Usuário
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-gray-font text-2xl font-bold text-center">{dataFirtsRank?.topUser.nome}</span>
            <span className="text-gray-font font-medium text-center">{dataFirtsRank?.topUser.cargo}</span>
          </div>
          <div className="flex flex-col gap-4 pt-22">
            {Array.isArray(dataFirtsRank?.lastScores) &&
              dataFirtsRank.lastScores.map((score: ViewLastScores, index: number) => (
                <div className="flex justify-between bg-gray-bar p-2 rounded-sm" key={index}>
                  <span className="text-gray-font font-medium truncate">{score?.motivo}</span>
                  <span className={`font-extrabold truncate text-right  ${Number(score?.pontos) > 0
                        ? 'text-[#779C65]'
                        : Number(score?.pontos) < 0
                          ? 'text-[#9C6577]'
                          : 'text-black'
                      }`}
                  >
                    {`${Number(score?.pontos) > 0 ? '+' : Number(score?.pontos) < 0 ? '-' : ''}${Math.abs(Number(score?.pontos) || 0)}`}
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div
        className="w-2/6 aspect-[3/3] bg-[url('/tabela_pontuacao.svg')] bg-contain bg-no-repeat bg-center 
        flex items-center justify-center pt-12">
        <div className="w-3/5 rounded overflow-y-auto h-[40vh]">
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
    </div>
  );
}