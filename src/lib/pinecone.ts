import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { EmbedText } from "./embeddings";
import md5 from "md5";
import { convertToASCII } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDF = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export const loadS3IntoPinecone = async (fileKey: string) => {
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could not retrieve file name");
  }

  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDF[];

  const documents = await Promise.all(pages.map(splitDocument));
  // Vectorize Data
  const vectors = await Promise.all(documents.flat().map(embedDocs));
  // Upload to PineconeDb

  const client = await getPineconeClient();
  const pineconeIndex = await client.index("pdfchat-ik");
  const namespace = pineconeIndex.namespace(convertToASCII(fileKey));
  await namespace.upsert(vectors);

  return documents[0];
};

export const splitString = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

const embedDocs = async (doc: Document) => {
  try {
    const embeddings = await EmbedText(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const splitDocument = async (pdf: PDF) => {
  let { pageContent, metadata } = pdf;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: splitString(pageContent, 36000),
      },
    }),
  ]);
  return docs;
};
