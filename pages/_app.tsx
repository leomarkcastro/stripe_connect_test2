import { trpc } from "@/lib/trpc";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";

const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
