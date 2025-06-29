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
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import ButtonLoading from "../ButtonLoading";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import { CreateUserData, ViewUserData } from "@/api/models/User";
import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { handleErrorMessages } from "@/errors/handleErrorMessage";
import { fetchApi } from "@/api/services/fetchApi";

type InputDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PopUpRegister({
  open,
  onOpenChange
}: InputDialogProps) {

  const schema = UserSchemas.criar;

  const formUser = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      cargo: "",
      imagem: undefined as File | undefined,
    },
  });

  async function handleCadastrar(data: z.infer<typeof schema>) {
    try {
      let foto_id: string | null = null;

      // Só tenta enviar se tiver imagem
      if (data.imagem) {
        const formData = new FormData();
        formData.append("imagem", data.imagem);
        
        console.log("FormData:", formData.get("imagem"));

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
        route: "/users",
        method: "POST",
        data: userPayload
      });

      if (responseUser.error && responseUser.errors) {
        handleErrorMessages(responseUser.errors);
      }

      // fecha reseta form user e o preview de imagem
      onOpenChange(false);
      formUser.reset();
      setPreviewImage(null);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImageUrl] = useState<string | null>(null);

  console.log("OLHA O ERRO", formUser.formState.errors)

  return (

    <Form {...formUser}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Colaborador</DialogTitle>
          </DialogHeader>

          <form onSubmit={formUser.handleSubmit(handleCadastrar)}
            className="space-y-4"
          >

            <div className="flex justify-center items-center pt-2">
              <div className="relative w-2/6 aspect-square flex justify-center items-center rounded-full overflow-hidden cursor-pointer">
                {/* Exibir a imagem de prévia ou a imagem enviada */}
                {previewImage || uploadedImageUrl ? (
                  <Image
                    src={previewImage || uploadedImageUrl!}
                    alt="Foto do usuário"
                    width={500}  // Defina um valor adequado (obrigatório)
                    height={500} // Defina um valor adequado (obrigatório)
                    className="w-full h-full object-cover"
                    priority={true} // Se for uma imagem importante (opcional)
                  />
                ) : (
                  // Ícone quando não há imagem
                  <div className="flex flex-col justify-center items-center w-full h-full bg-gray-200 text-gray-500 text-4xl font-bold border-black  border-2 border-dotted rounded-full">
                    <span><Plus /></span>
                    <span className="text-xl font-medium">Carregar</span>
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
              <ButtonLoading className="bg-gray-button font-bold h-10" isLoading={formUser.formState.isSubmitting} type="submit" >
                Confirmar
              </ButtonLoading>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>

  );
}