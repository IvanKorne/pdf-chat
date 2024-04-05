"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const query = new QueryClient();

type ChildrenProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ChildrenProps) => {
  return <QueryClientProvider client={query}>{children}</QueryClientProvider>;
};

export default Providers;
