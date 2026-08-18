import { FormEvent, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "./components/BrandLogo";

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="brand">
        <BrandLogo />
        <p>PERSONAL SCHEDULE MANAGER</p>
        <h1>
          나의 하루를 정리하는
          <br />
          가장 편안한 방법입니다.
        </h1>
        <span>계획부터 완료까지, 매일의 흐름을 한곳에서 관리하세요.</span>
      </section>
      <section className="auth-card">
        <header>
          <Link to="/" className="mobile-logo">
            GearVIa Me
          </Link>
          <h2>{title}</h2>
          <p>{description}</p>
        </header>
        {children}
      </section>
    </main>
  );
}

export function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

export function SubmitButton({
  children,
  pending,
  disabled,
}: {
  children: ReactNode;
  pending?: boolean;
  disabled?: boolean;
}) {
  return (
    <button className="primary" type="submit" disabled={pending || disabled}>
      {pending ? "처리 중..." : children}
    </button>
  );
}

export function useAsyncAction(
  action: () => Promise<unknown>,
  onSuccess?: () => void,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>();
  const run = async (event?: FormEvent) => {
    event?.preventDefault();
    setPending(true);
    setError(undefined);
    try {
      await action();
      onSuccess?.();
    } catch (caught) {
      setError(caught);
    } finally {
      setPending(false);
    }
  };
  return { run, pending, error, clearError: () => setError(undefined) };
}
