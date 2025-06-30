import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ViewFirtsRank, ViewLastScores } from "@/api/models/User";
import { convertBytesToImageUrl } from "@/utils/convertImage";
import SpinnerLoading from "../SpinnerLoading";

interface TopUserCardProps {
  dataFirtsRank: ViewFirtsRank | undefined;
  isLoading: boolean;
}

export function TopUserCard({ dataFirtsRank, isLoading }: TopUserCardProps) {

  return (
    <div className="relative w-full aspect-[3/3] bg-[url('/placa_primeiro_lugar.svg')] bg-contain bg-no-repeat bg-center flex justify-center pt-60
     sm:pt-24 md:pt-28 lg:pt-24 xl:pt-40 2xl:pt-60">
      {isLoading && (
        <div className="absolute flex justify-center items-cente z-10">
          <SpinnerLoading className="text-gray-200" />
        </div>
      )}
      {dataFirtsRank?.topUser && (
        <div className="-rotate-[16.33deg] flex flex-col lg:gap-2 xl:gap-4 w-2/6">
          <span className="text-gray-font font-medium
        sm:pt-2 md:pt-4 lg:pt-4 xl:pt-0 2xl:pt-0">
            {dataFirtsRank?.topUser.pontuacao}pts
          </span>
          <Avatar className="rounded-full flex justify-center">
            <AvatarImage
              src={
                convertBytesToImageUrl(dataFirtsRank?.topUser.foto?.imagem) ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png "
              }
              alt={"Usuário"}
              className="object-cover rounded-full 
             size-6 sm:size-5 md:size-10 lg:size-16 xl:size-24" />
            <AvatarFallback className="rounded-md text-gray-font font-bold">
              Usuário
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-gray-font text-2xl font-bold text-center">
              {dataFirtsRank?.topUser.nome}
            </span>
            <span className="text-gray-font font-medium text-center">
              {dataFirtsRank?.topUser.cargo}
            </span>
          </div>
          <div className="flex flex-col gap-4 sm:pt-2 md:pt-4 lg:pt-4 xl:pt-16 2xl:pt-18">
            {Array.isArray(dataFirtsRank?.lastScores) &&
              dataFirtsRank.lastScores.map((score: ViewLastScores, index: number) => (
                <div className="flex justify-between bg-gray-bar p-2 rounded-sm" key={index}>
                  <span className="text-gray-font font-medium truncate">{score?.motivo}</span>
                  <span
                    className={`font-extrabold truncate text-right ${Number(score?.pontos) > 0
                      ? "text-[#779C65]"
                      : Number(score?.pontos) < 0
                        ? "text-[#9C6577]"
                        : "text-black"
                      }`}
                  >
                    {`${Number(score?.pontos) > 0 ? "+" : Number(score?.pontos) < 0 ? "-" : ""}${Math.abs(Number(score?.pontos) || 0)
                      }`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}