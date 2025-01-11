import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockTweets } from "@/data/mockTweets";

export async function POST(request: Request) {
  try {
    const { username, influencerId, limit = 10 } = await request.json();

    if (!username || !influencerId) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios ausentes" },
        { status: 400 }
      );
    }

    let tweets;
    let remainingCalls = "100"; // Valor padrão para dados mockados

    if (username in mockTweets) {
      // Usar dados mockados para influenciadores específicos
      tweets = mockTweets[username].slice(0, limit);
    } else {
      // Chamada real à API para outros nomes de usuário
      const response = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=${limit}&tweet.fields=created_at`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          {
            error: `Falha ao buscar tweets: ${response.statusText}`,
            details: errorText,
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      tweets = data.data;
      remainingCalls = response.headers.get("x-rate-limit-remaining") || "0";
    }

    // Armazenar tweets no banco de dados
    if (tweets && Array.isArray(tweets)) {
      const storedTweets = await Promise.all(
        tweets.map(async (tweet: any) => {
          return prisma.tweet.create({
            data: {
              tweetId: tweet.id,
              content: tweet.text,
              createdAt: new Date(tweet.created_at),
              influencerId: influencerId,
            },
          });
        })
      );

      return NextResponse.json({
        message: `Buscou e armazenou ${storedTweets.length} tweets com sucesso`,
        tweets: storedTweets,
        remainingCalls: remainingCalls,
      });
    }

    return NextResponse.json(
      { error: "Nenhum tweet encontrado" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Erro ao buscar tweets:", error);
    return NextResponse.json(
      {
        error: "Falha ao buscar e armazenar tweets",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
