import { HeadComponent } from "@/components/global/HeadComponents";
import LoginButton from "@/components/auth/LoginButton";
import { trpc } from "@/lib/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function StripeService() {
  const { data: session } = useSession();
  const stripeNewAccount = trpc.stripe.createNewAccount.useMutation();
  const stripeVerifyLink = trpc.stripe.createAccountLink.useMutation();
  const stripeCheckout = trpc.stripe.testCheckout.useMutation();

  const router = useRouter();

  if (!session) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2 m-2">
      <button
        className="d-btn d-btn-sm d-btn-primary"
        onClick={async () => {
          const result = await stripeNewAccount.mutateAsync();
          console.log(result);
        }}
      >
        Create Stripe Account
      </button>
      <button
        className="d-btn d-btn-primary d-btn-sm"
        onClick={async () => {
          const urlData = await stripeVerifyLink.mutateAsync();
          router.push(urlData.accountLink.url);
        }}
      >
        Verify Account
      </button>
      <button
        className="d-btn d-btn-secondary d-btn-sm"
        onClick={async () => {
          const urlData = await stripeCheckout.mutateAsync();
          router.push(urlData.purchaseLink.url || "");
        }}
      >
        Test Checkout
      </button>
    </div>
  );
}

export default function Home(test: { test: string }) {
  return (
    <>
      <HeadComponent />
      <main className="w-full h-full max-w-screen-md p-4 m-12 mx-auto">
        <LoginButton />
        <StripeService />
      </main>
    </>
  );
}
