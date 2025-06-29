"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { UserSchemas } from "@/schemas/UserSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleErrorMessages } from "@/errors/handleErrorMessage";
import { Input } from "../ui/input";
import ButtonLoading from "../ButtonLoading";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import { CreateUserData, ViewUserData } from "@/api/models/User";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { fetchApi } from "@/api/services/fetchApi";
import { z } from "zod";
import { fetchPhotoApi } from "@/api/services/fetchPhoto";
import { toast } from "react-toastify";

type InputDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
};

export function PopUpAlterUser({
  open,
  onOpenChange,
  slug
}: InputDialogProps) {

  const { data } = useQuery<ViewUserData>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await fetchApi<any, any>({
        route: `/users/${slug}`,
        method: "GET",
        nextOptions: {},
      });

      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const schema = UserSchemas.criar;

  const formUser = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      cargo: "",
      imagem: undefined,
    },
  });

  useEffect(() => {
    if (data) {
      formUser.reset({
        nome: data.nome,
        cargo: data.cargo,
        imagem: undefined,
      });
    }
  }, [data]);

  async function handleCadastrar(data: z.infer<typeof schema>) {
    try {
      let foto_id: string | null = null;

      // Só tenta enviar se tiver imagem
      if (data.imagem) {
        const formData = new FormData();
        formData.append("imagem", data.imagem);

        const responseImagem = await fetchApi<{ image_id: string }, any>({
          route: "/photos",
          method: "POST",
          data: formData
        });

        if (responseImagem.error && responseImagem.errors) {
          handleErrorMessages(responseImagem.errors);
          return;
        }

        foto_id = responseImagem.data.id;
      }

      const { imagem, ...userData } = data;
      const userPayload = {
        ...userData,
        ...(foto_id && { foto_id }), // só adiciona se tiver imagem
      };

      const responseUser = await fetchUseQuery<CreateUserData, { data: ViewUserData }>({
        route: `/users/${slug}`,
        method: "PATCH",
        data: userPayload
      });

      if (responseUser.error && responseUser.errors) {
        handleErrorMessages(responseUser.errors);
      }

      toast.success("Colaborador atualizado com sucesso!");
      // Essa ideia de da query client fetch em todas acho uma ideia pessima não gosto
      // Primeiro: invalida e refaz o fetch de userInfo
      await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      await queryClient.refetchQueries({ queryKey: ["userInfo"] });

      // Depois: isso garante que o novo foto_id seja carregado
      await queryClient.refetchQueries({ queryKey: ["photoPerfilInformation", foto_id] });

      // Outros dados
      queryClient.invalidateQueries({ queryKey: ["firsrtRank"] });
      queryClient.invalidateQueries({ queryKey: ["listUser"] });

      // fecha reseta form user e o preview de imagem
      onOpenChange(false);
      formUser.reset();
      setPreviewImage(null);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: dataPhoto } = useQuery<string>({
    queryKey: ["photoPerfilInformation", data?.foto_id],
    queryFn: async () => {

      if (!data?.foto_id) return null;

      const response = await fetchPhotoApi<undefined, any>({
        route: `/photos/${data.foto_id}`,
        method: "GET",
        nextOptions: {},
      });

      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!data?.foto_id,
  });

  return (

    <Form {...formUser}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center">
            <Image src={"../../icon_register.svg"} alt={"userIcon"} width={50} height={50} />
            <DialogTitle>Editar Colaborador</DialogTitle>
          </DialogHeader>

          <form onSubmit={formUser.handleSubmit(handleCadastrar)}
            className="space-y-4"
          >

            <div className="flex justify-center items-center pt-2">
              <div className="relative w-2/6 aspect-square flex justify-center items-center rounded-full overflow-hidden cursor-pointer">
                {/* Exibir a imagem de prévia ou a imagem enviada */}
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Nova imagem selecionada"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : dataPhoto ? (
                  <Image
                    src={dataPhoto}
                    alt="Imagem do usuário"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-full bg-gray-200 text-gray-500 text-4xl font-bold">
                    +
                  </div>
                )}

                {/* Input invisível sobre a bolinha */}
                <FormField
                  control={formUser.control}
                  name="imagem"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            if (file) {
                              setPreviewImage(URL.createObjectURL(file)); // Atualiza a prévia
                              onChange(file); // Atualiza o estado do formulário
                            }
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={formUser.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formUser.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="border-gray-button border-2 bg-white font-bold h-10 text-gray-button" onClick={() => onOpenChange(false)} type="submit" >
                Cancelar
              </Button>
              <ButtonLoading className="bg-gray-button font-bold h-10" isLoading={formUser.formState.isSubmitting}>
                Confirmar
              </ButtonLoading>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>

  );
}