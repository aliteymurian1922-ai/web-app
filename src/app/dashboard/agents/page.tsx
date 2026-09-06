import { getAgentStats } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/ui";
import { AgentsPanel } from "@/components/dashboard/AgentsPanel";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const agents = await getAgentStats();
  return (
    <>
      <PageHeader
        title="کارشناسان و لینک‌های اختصاصی"
        desc="هر کارشناس کال‌سنتر یک لینک یونیک دارد؛ هر لیدی که از آن لینک ثبت شود به نام همان کارشناس ثبت می‌شود."
      />
      <AgentsPanel agents={agents} />
    </>
  );
}
