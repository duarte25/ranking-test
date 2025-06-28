import { ViewFirtsRank, ViewLastScores } from "@/api/models/User";
import { convertBytesToImageUrl } from "@/utils/convertImage";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface TopUserCardProps {
  dataFirtsRank: ViewFirtsRank | undefined;
}

export function TopUserCard({ dataFirtsRank }: TopUserCardProps) {

  return (
    <div className="w-2/6 aspect-[3/3] bg-[url('/placa_primeiro_lugar.svg')] bg-contain bg-no-repeat bg-center flex justify-center pt-60">
      <div className="-rotate-[16.33deg] flex flex-col gap-4 w-2/6">
        <span className="text-gray-font font-medium">
          {dataFirtsRank?.topUser.pontuacao}pts
        </span>
        <Avatar className="rounded-full flex justify-center">
          <AvatarImage
            src={
              convertBytesToImageUrl(dataFirtsRank?.topUser.foto?.imagem) ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png "
            }
            alt={"Usuário"}
            className="object-cover rounded-full size-6 sm:size-10 md:size-12 lg:size-28"
          />
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
        <div className="flex flex-col gap-4 pt-22">
          {Array.isArray(dataFirtsRank?.lastScores) &&
            dataFirtsRank.lastScores.map((score: ViewLastScores, index: number) => (
              <div className="flex justify-between bg-gray-bar p-2 rounded-sm" key={index}>
                <span className="text-gray-font font-medium truncate">{score?.motivo}</span>
                <span
                  className={`font-extrabold truncate text-right ${
                    Number(score?.pontos) > 0
                      ? "text-[#779C65]"
                      : Number(score?.pontos) < 0
                      ? "text-[#9C6577]"
                      : "text-black"
                  }`}
                >
                  {`${Number(score?.pontos) > 0 ? "+" : Number(score?.pontos) < 0 ? "-" : ""}${
                    Math.abs(Number(score?.pontos) || 0)
                  }`}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}