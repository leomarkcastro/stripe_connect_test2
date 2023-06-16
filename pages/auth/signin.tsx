import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="shadow-xl d-card w-96 bg-base-100">
        <div className="font-bold text-center d-card-body font-AlegreyaSans">
          <h1 className="text-4xl font-bold">Login</h1>
          <div>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="w-full max-w-xs d-form-control">
              <label className="d-label">
                <span className="d-label-text">Email</span>
              </label>
              <input
                name="username"
                type="text"
                placeholder="name@email.com"
                className="w-full max-w-xs d-input d-input-bordered d-input-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="w-full max-w-xs d-form-control">
              <label className="d-label">
                <span className="d-label-text">Password</span>
              </label>
              <input
                name="password"
                type="password"
                className="w-full max-w-xs d-input d-input-bordered d-input-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />
            <button
              className="d-btn-sm d-btn"
              onClick={async () => {
                const resp = await signIn("credentials", {
                  username,
                  password,
                  redirect: false,
                });
                if (resp?.error) {
                  alert(resp.error);
                } else {
                  // console.log("resp", resp);
                  router.replace("/");
                }
              }}
            >
              Sign in
            </button>
            <br />
            <Link href="/auth/signup">Sign Up Instead</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
