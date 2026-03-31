import { useState } from "react";
import type { RecommendResponse } from "../../types";
import { AppLayout } from "../../components/AppLayout";
import { RecommendForm } from "./RecommendForm";
import { RecommendResult } from "./RecommendResult";
import "../Recommend.css";

export default function Recommend() {
  const [result, setResult] = useState<RecommendResponse | null>(null);

  return (
    <AppLayout>
      <section className="recommend">
        <div className="container recommend__container">
          {result ? (
            <RecommendResult result={result} onReset={() => setResult(null)} />
          ) : (
            <RecommendForm onResult={setResult} />
          )}
        </div>
      </section>
    </AppLayout>
  );
}
