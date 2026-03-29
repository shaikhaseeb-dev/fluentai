export default function AuthErrorPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Authentication Error</h1>
      <p>Something went wrong during login configuration.</p>
      <a href="/auth/signin">Go back to Sign In</a>
    </div>
  );
}