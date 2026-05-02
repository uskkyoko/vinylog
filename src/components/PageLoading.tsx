import { AppLayout } from "./AppLayout";
import "./PageLoading.css";

export function PageLoading() {
  return (
    <AppLayout>
      <div className="page-loading">
        <div className="page-loading__spinner" />
      </div>
    </AppLayout>
  );
}
