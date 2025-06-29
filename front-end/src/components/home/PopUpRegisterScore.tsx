"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { handleErrorMessages } from "@/errors/handleErrorMessage";
import { useQueryClient } from "@tanstack/react-query";
import { ScoreSchemas } from "@/schemas/ScoreSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateScoreData } from "@/api/models/Score";
import ComboboxDebounce from "../ComboboxDebounce";
import { fetchApi } from "@/api/services/fetchApi";
import { ViewUserData } from "@/api/models/User";
import ButtonLoading from "../ButtonLoading";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import Image from "next/image";
import { z } from "zod";

type InputDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PopUpRegisterScore({
  open,
  onOpenChange
}: InputDialogProps) {
  const schema = ScoreSchemas.criar;
  const queryClient = useQueryClient();

  const formScore = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      motivo: "",
      pontos: 0,
      usuario_id: "",
    },
  });

  async function handleCadastrar(data: z.infer<typeof schema>) {
    const response = await fetchApi<typeof data, CreateScoreData>({
      route: "/scores",
      method: "POST",
      data: data,
    });

    if (response.error && response.errors) {
      handleErrorMessages(response.errors);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["firsrtRank"] });
    queryClient.invalidateQueries({ queryKey: ["listUser"] });
    toast.success("Pontuação criada.");
    onOpenChange(false);
    formScore.reset();
  }

  const [users, setUsers] = useState<ViewUserData | null>(null);

  return (
    <Form {...formScore}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center">
            <Image src={"icon_register.svg"} alt={"userIcon"} width={50} height={50} />
            <DialogTitle>Atribuir Pontos</DialogTitle>
          </DialogHeader>

          <form onSubmit={formScore.handleSubmit(handleCadastrar)}
            className="space-y-4"
          >
            <FormField
              control={formScore.control}
              name="usuario_id"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel htmlFor="usuario_id">Colaborador<span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <ComboboxDebounce
                        route={`/users?nome`}
                        queryKey="usersQueryKey"
                        multipleOption={false}
                        placeholderInputSearch={"Busque por colaborador"}
                        placeholderUnselected={"Selecione o colaborador"}
                        selecionado={field.value}
                        setSelecionado={(value) => {
                          const body = value as unknown as ViewUserData;
                          field.onChange(body.id);
                          setUsers(body)
                        }}
                        selectedField={(selecionado) => {
                          const body = selecionado as unknown as ViewUserData;
                          return typeof selecionado === 'string' ? selecionado : body.nome || body.id || '';
                        }}
                        visualizacao={users?.nome}
                        renderOption={(dados) => (
                          <span key={(dados as unknown as ViewUserData).id}>
                            {typeof dados === 'string' ? dados : (dados as ViewUserData)?.nome}
                          </span>
                        )} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={formScore.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formScore.control}
              name="pontos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="border-gray-button border-2 bg-white font-bold h-10 text-gray-button" onClick={() => onOpenChange(false)} type="submit" >
                Cancelar
              </Button>
              <ButtonLoading className="bg-gray-button font-bold h-10" isLoading={formScore.formState.isSubmitting}>
                Confirmar
              </ButtonLoading>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>

  );
}