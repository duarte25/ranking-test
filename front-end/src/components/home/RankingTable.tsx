import { ViewUserData } from "@/api/models/User";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { convertBytesToImageUrl } from "@/utils/convertImage";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { PopUpRegister } from "./PopUpRegister";
import { Plus } from "lucide-react";

export function RankingTable() {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<ViewUserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cadastrarUsuarioOpen, setCadastrarUsuarioOpen] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Carrega os dados da página atual
  const { data, isFetching } = useQuery({
    queryKey: ["listUser", currentPage],
    queryFn: async () => {
      setIsLoading(true);
      const response = await fetchUseQuery<unknown, ViewUserData[]>({
        route: "/users",
        method: "GET",
        data: { pagina: currentPage.toString() },
        nextOptions: {},
      });

      setTotalPages(response?.totalPaginas ?? 1);
      setIsLoading(false);
      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: currentPage <= totalPages,
  });

  useEffect(() => {
    if (currentPage === 1) {
      setUsers([]); // Reseta a lista
    }
  }, [currentPage]);

useEffect(() => {
  if (data) {
    setUsers((prev) => {
      if (currentPage === 1) return data;

      const merged = [...prev, ...data];
      const uniqueMap = new Map();
      for (const user of merged) {
        uniqueMap.set(user.id, user);
      }
      return Array.from(uniqueMap.values());
    });
  }
}, [data, currentPage]);


  // Observa o último elemento para carregar mais dados
  useEffect(() => {
    const target = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [isFetching, currentPage, totalPages]);

  return (
    <div className="flex flex-col w-2/6 aspect-[3/3] bg-[url('/tabela_pontuacao.svg')] bg-contain bg-no-repeat bg-center items-center justify-center pt-12">
      <PopUpRegister open={cadastrarUsuarioOpen}
        onOpenChange={setCadastrarUsuarioOpen} />

      <div className="w-3/5 rounded h-[40vh] overflow-y-auto">
        <Table className="w-full pt-24 border-separate border-spacing-y-2">
          <TableBody>
            {users.map((user, index) => {
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

            {/* Loader */}
            {isFetching && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-2">
                  Carregando...
                </TableCell>
              </TableRow>
            )}

            {/* Elemento alvo para IntersectionObserver */}
            <TableRow>
              <TableCell colSpan={4}>
                <div ref={observerRef} className="h-2 w-full" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Button type="button" className="bg-gray-button" onClick={() => setCadastrarUsuarioOpen(true)}> <Plus /> NOVO COLABORADOR</Button>
    </div>
  );
}