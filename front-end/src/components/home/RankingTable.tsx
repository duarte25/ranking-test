import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import {  Table,  TableBody,  TableCell,  TableRow,} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function RankingTable() {
  const router = useRouter();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<ViewUserData[]>([]);
  const [cadastrarUsuarioOpen, setCadastrarUsuarioOpen] = useState(false);
  const [cadastrarPontoOpen, setCadastrarPontoOpen] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ViewUserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<ViewUserData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Carrega os dados da página atual
  const { data, isFetching } = useQuery({
    queryKey: ["listUser", currentPage],
    queryFn: async () => {
      const response = await fetchUseQuery<unknown, ViewUserData[]>({
        route: "/users",
        method: "GET",
        data: { pagina: currentPage.toString() },
        nextOptions: {},
      });

      setTotalPages(response?.totalPaginas ?? 1);
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
    <div className="flex flex-col w-2/6 aspect-[3/3] bg-[url('/tabela_pontuacao.svg')] bg-contain 
    bg-no-repeat bg-center items-center justify-center pt-28 space-y-8">
      <PopUpRegister open={cadastrarUsuarioOpen}
        onOpenChange={setCadastrarUsuarioOpen} />

      <PopUpRegisterScore open={cadastrarPontoOpen}
        onOpenChange={setCadastrarPontoOpen} />

      <div className="w-3/5 rounded h-[40vh] overflow-y-auto">
        <Table className="w-full border-separate border-spacing-y-2">
          <TableBody>
            {users.map((user, index) => {
              const posicao = index + 1;
              const imageUrl = imageUrls[index];

              return (
                <TableRow key={user.id} onClick={() => {
                  setSelectedUser(user);
                  setOpenUserDialog(true);
                }}>
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

          <div className="space-y-2">
            <Button
              className="w-full"
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
              className="w-full"
              onClick={() => {
                setUserToDelete(selectedUser);
                setOpenUserDialog(false);
                setOpenDeleteDialog(true); // abre a modal de confirmação de exclusão
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
              Esta ação não poderá ser desfeita. Tem certeza que deseja excluir <strong>{userToDelete?.nome}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete?.id) {
                  mutate(userToDelete.id);
                }
              }}
              disabled={isPending}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-x-4">
        <Button type="button" className="bg-gray-button" onClick={() => setCadastrarUsuarioOpen(true)}>
          <Plus /> NOVO COLABORADOR
        </Button>
        <Button type="button" className="bg-gray-button" onClick={() => setCadastrarPontoOpen(true)}>
          <Star /> ATRIBUIR PONTOS
        </Button>
      </div>
    </div>
  );
}