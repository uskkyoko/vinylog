import { AppLayout } from "./AppLayout";

export function PageNotFound({
  section,
  containerClass = "container",
  message,
}: {
  section: string;
  containerClass?: string;
  message: string;
}) {
  return (
    <AppLayout>
      <section className={section}>
        <div className={containerClass}>
          <p>{message}</p>
        </div>
      </section>
    </AppLayout>
  );
}
