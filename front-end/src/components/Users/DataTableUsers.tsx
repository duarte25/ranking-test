"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { handleErrorMessages } from "@/errors/handleErrorMessage";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { fetchApi } from "@/api/services/fetchApi";
import { ViewScoreData } from "@/api/models/Score";
import { MoreHorizontal } from "lucide-react";
import { ApiResponse } from "@/types/api";
import { toast } from "react-toastify";
import { useState } from "react";

interface DataTableScoresProps {
  dados: ApiResponse<string>;
  onUpdate: () => void;
}

export default function DataTableUserScore({ dados, onUpdate }: DataTableScoresProps) {
  const [open, setOpen] = useState(false);
  const [scoreToDelete, setScoreToDelete] = useState<ViewScoreData | null>(null);

  const handleDelete = async () => {
    if (!scoreToDelete) return;

    try {
      const response = await fetchApi({
        route: `/scores/${scoreToDelete.id}`,
        method: "DELETE"
      });

      if (response.error) {
        const errorMessages = response.errors.map((error) => {
          // Verifica se o erro é um objeto ApiError ou uma string
          if (typeof error === "string") {
            return error;
          } else {
            return error.message;
          }
        });

        // Passa o array de strings para handleErrorMessages
        handleErrorMessages(errorMessages);
      } else {
        toast.success("Pontuação deletada.");
        onUpdate();
      }

    } catch (error) {
    } finally {
      setOpen(false);
    }
  };

  const handleOpenDeleteDialog = (score: ViewScoreData) => {
    setScoreToDelete(score);
    setOpen(true);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Motivo</TableHead>
            <TableHead className="text-white">Pontos</TableHead>
            <TableHead className="text-white">Data de criação</TableHead>
            <TableHead className="text-white">Data de update</TableHead>
            <TableHead className="text-white"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody  className="text-white">
          {Array.isArray(dados) &&
            dados.map((scores: ViewScoreData) => (
              <TableRow key={scores?.id} >
                <TableCell>{scores?.motivo}</TableCell>
                <TableCell>{scores?.pontos}</TableCell>
                <TableCell>{scores?.createdAt ? new Date(scores.createdAt).toLocaleString() : ""}</TableCell>
                <TableCell>{scores?.updatedAt ? new Date(scores.createdAt).toLocaleString() : ""}</TableCell>
                <TableCell className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-gray-200 focus:outline-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem>
                        <span className="cursor-pointer text-red-500" onClick={() => handleOpenDeleteDialog(scores)}>
                          Deletar pontos
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você realmente deseja deletar esta pontuação <strong>{scoreToDelete?.pontos}</strong>pts? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Sim, deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}