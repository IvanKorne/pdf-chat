import { Pinecone } from "@pinecone-database/pinecone";
import { convertToASCII } from "./utils";
import { EmbedText } from "./embeddings";

export const getMatches = async (embeddings: number[], fileKey: string) => {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("pdfchat-ik");
    const namespace = pineconeIndex.namespace(convertToASCII(fileKey));

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (err) {
    console.log("Error querying macthes", err);
    throw err;
  }
};

type MetaData = {
  text: string;
  pageNumber: number;
};
export const getContext = async (query: string, fileKey: string) => {
  const queryEmbeddings = await EmbedText(query);
  const matches = await getMatches(queryEmbeddings, fileKey);
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );
  let docs = qualifyingDocs.map((match) => (match.metadata as MetaData).text);
  return docs.join("\n").substring(0, 3000);
};
