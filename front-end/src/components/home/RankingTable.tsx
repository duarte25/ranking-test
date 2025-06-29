import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableRow, } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { handleErrorMessages } from "@/errors/handleErrorMessage";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { convertBytesToImageUrl } from "@/utils/convertImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import { PopUpRegisterScore } from "./PopUpRegisterScore";
import { PopUpRegister } from "./PopUpRegisterUser";
import { ViewUserData } from "@/api/models/User";
import { useRouter } from "next/navigation";
import { Plus, Star } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import Image from "next/image";

function RankBadge({ posicao }: { posicao: number }) {
  const imageUrl = `/rank_${posicao <= 3 ? posicao : 4}.svg`;
  return (
    <div
      className="size-6 sm:size-10 md:size-12 lg:size-14 bg-contain bg-no-repeat bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url('${imageUrl}')` }}
    >
      {posicao}°
    </div>
  );
}

export interface FetchUsersResponse {
  data: ViewUserData[];
  totalPaginas: number;
  pagina: number;
  resultados?: number;
  limite?: number;
  code?: number;
  message?: string;
  errors?: string[];
}

export function RankingTable() {
  const router = useRouter();
  const [cadastrarUsuarioOpen, setCadastrarUsuarioOpen] = useState(false);
  const [cadastrarPontoOpen, setCadastrarPontoOpen] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ViewUserData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching,
  } = useInfiniteQuery<FetchUsersResponse, Error>({
    queryKey: ["listUser"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchUseQuery<unknown, any>({
        route: "/users",
        method: "GET",
        data: { pagina: (pageParam as number).toString() },
        nextOptions: {},
      });

      return {
        data: response.data ?? [],
        pagina: response.pagina ?? 1,
        totalPaginas: response.totalPaginas ?? 1,
        resultados: response.resultados ?? 0,
        limite: response.limite ?? 10,
        message: response.message ?? "",
      };
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagina + 1;
      return nextPage <= lastPage.totalPaginas ? nextPage : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Adaptando o Intersection Observer para useInfiniteQuery
  useEffect(() => {
    const target = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
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
    // As dependências agora são as propriedades do useInfiniteQuery
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const users = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetchUseQuery({
        route: `/users/${userId}`,
        method: "DELETE"
      });

      if (response.error) {
        const errorMessages = response.errors.map((error) => {
          return typeof error === "string" ? error : error.message;
        });
        throw new Error(errorMessages.join(", "));
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Usuário deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["firsrtRank"] });
      queryClient.invalidateQueries({ queryKey: ["listUser"] });
      queryClient.invalidateQueries({ queryKey: ["getUserScore"] });
    },
    onError: (error) => {
      handleErrorMessages([error.message || "Erro ao deletar usuário."]);
    },
    onSettled: () => {
      setOpenDeleteDialog(false);
    }
  });

  const imageUrls = useMemo(() => {
    return users.map((user) =>
      convertBytesToImageUrl(user.foto?.imagem) ||
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    );
  }, [users]);

  return (
    <div className="flex flex-col w-full aspect-[3/3] bg-[url('/tabela_pontuacao.svg')] bg-contain
    bg-no-repeat bg-center items-center justify-center pt-28 space-y-8 sm:space-y-4 lg:space-y-8">
      <PopUpRegister open={cadastrarUsuarioOpen}
        onOpenChange={setCadastrarUsuarioOpen} />

      <PopUpRegisterScore open={cadastrarPontoOpen}
        onOpenChange={setCadastrarPontoOpen} />

      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/5 rounded overflow-y-auto
         max-h-[40vh] sm:h-[10vh]  md:h-[25vh] lg:h-[35vh] xl:h-[40vh]2xl:h-[60vh]">
        <Table className="w-full border-separate border-spacing-y-2">
          <TableBody>
            {users.map((user, index: number) => {
              const posicao = index + 1;
              const imageUrl = imageUrls[index];
              return (
                <TableRow key={user.id} onClick={() => {
                  setSelectedUser(user);
                  setOpenUserDialog(true);
                }}>
                  <TableCell className="border-y-2 border-l-2 rounded-l-sm w-12 text-center align-middle py-0">
                    <RankBadge posicao={posicao} /> {/* Usando o novo componente */}
                  </TableCell>
                  <TableCell className="border-y-2 py-0">
                    <Avatar className="rounded-full">
                      <AvatarImage
                        src={imageUrl}
                        alt="Usuário"
                        className="object-cover rounded-full size-6 sm:size-10 md:size-12 lg:size-12"
                      />
                      <AvatarFallback className="rounded-md text-gray-font font-bold">
                        Usuário
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="border-y-2">
                    {user.nome}
                  </TableCell>
                  <TableCell className="border-y-2 border-r-2 rounded-r-sm text-gray-font font-bold py-0">
                    {user.pontuacao}
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Loader para carregamento inicial ou mais páginas */}
            {(isFetching || isFetchingNextPage) && ( // isFetching cobre o estado inicial também
              <TableRow>
                <TableCell colSpan={4} className="text-center py-2">
                  Carregando...
                </TableCell>
              </TableRow>
            )}

            {/* Elemento alvo para IntersectionObserver - apenas se houver mais páginas */}
            {hasNextPage && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div ref={observerRef} className="h-2 w-full" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex flex-row justify-between">
              <AlertDialogTitle>Ações para {selectedUser?.nome}</AlertDialogTitle>
              <Image className="hover:bg-red-200" onClick={() => setOpenUserDialog(false)} src="close.svg" alt="close" width={25} height={25} />
            </div>
            <AlertDialogDescription>
              O que você deseja fazer?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 flex flex-col items-center">
            <Button
              className="w-2/3 bg-gray-button"
              onClick={() => {
                if (selectedUser) {
                  router.push(`/usuarios/${selectedUser.id}/informacoes`);
                }
              }}
            >
              Visualizar usuário
            </Button>
            <Button
              variant="destructive"
              className="w-2/3 "
              onClick={() => {
                setOpenUserDialog(false); // Fecha o modal de ações
                setOpenDeleteDialog(true); // Abre o modal de confirmação de exclusão
              }}
            >
              Deletar colaborador
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita. Tem certeza que deseja excluir <strong>{selectedUser?.nome}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500"
              onClick={() => {
                if (selectedUser?.id) {
                  mutate(selectedUser.id);
                }
              }}
              disabled={isPending}>
              {isPending ? "Excluindo..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-x-4">
        <Button type="button" className="bg-gray-button sm:h-6 md:h-8" onClick={() => setCadastrarUsuarioOpen(true)}>
          <Plus /> NOVO COLABORADOR
        </Button>
        <Button type="button" className="bg-gray-button sm:h-6 md:h-8" onClick={() => setCadastrarPontoOpen(true)}>
          <Star /> ATRIBUIR PONTOS
        </Button>
      </div>
    </div>
  );
}