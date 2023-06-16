import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  async function testRestricted() {
    const response = await fetch("/api/test/restricted");
    const data = await response.json();
    // console.log(data);
  }

  if (session) {
    return (
      <div className="flex flex-row justify-between">
        <p>Signed in as {session.user?.email}</p>
        <button className="d-btn d-btn-sm" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <>
      <button
        className="d-btn d-btn-sm d-btn-secondary"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
