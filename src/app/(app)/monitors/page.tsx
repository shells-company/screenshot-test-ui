"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, MoreHorizontal, Pause, Play, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState, PageHeader, StatCard, StatusBadge } from "@/components/shared";
import { useStore } from "@/lib/store";
import { relativeTime } from "@/lib/format";

export default function MonitorsPage() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const monitors = state.monitors;
  const up = monitors.filter((m) => m.status === "up").length;
  const down = monitors.filter((m) => m.status === "down").length;

  return (
    <>
      <PageHeader
        title="Uptime checks"
        description="Each card is one endpoint we ping from several regions."
        actions={
          <Button nativeButton={false} render={<Link href="/monitors/new" />} data-testid="create-monitor">
            <Plus data-icon="inline-start" /> New check
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Checks" value={monitors.length} />
        <StatCard label="Healthy" value={up} deltaTone="up" />
        <StatCard label="Failing" value={down} delta={down > 0 ? "Needs attention" : undefined} deltaTone="down" />
        <StatCard label="Avg. uptime (30d)" value="99.63%" />
      </div>

      {monitors.length === 0 ? (
        <EmptyState icon={Activity} title="No monitors" description="Create a monitor to get alerted when an endpoint goes down." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="monitors-table">
          {monitors.map((m) => (
            <Card
              key={m.id}
              className="cursor-pointer gap-3 border-l-4 p-4 transition hover:shadow-md"
              style={{ borderLeftColor: m.status === "up" ? "#16a34a" : m.status === "down" ? "#dc2626" : "#a1a1aa" }}
              onClick={() => router.push(`/monitors/${m.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold">{m.name}</div>
                  <div className="truncate font-mono text-xs text-muted-foreground">
                    {m.method} {m.url}
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/60 p-3 text-center">
                <div>
                  <div className="text-lg font-semibold tabular-nums">{m.status === "paused" ? "—" : `${m.uptime30d.toFixed(2)}%`}</div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Availability</div>
                </div>
                <div>
                  <div className="text-lg font-semibold tabular-nums">{m.status === "paused" ? "—" : `${m.avgLatencyMs}ms`}</div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Response</div>
                </div>
                <div>
                  <div className="text-lg font-semibold tabular-nums">{m.intervalSec}s</div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Every</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {m.regions.map((r) => (
                    <Badge key={r} variant="secondary" className="font-mono text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs text-muted-foreground">Checked {relativeTime(m.lastCheckedAt)}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Monitor actions" />}>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => dispatch({ type: "monitor.toggle", id: m.id })}>
                        {m.status === "paused" ? <Play /> : <Pause />}
                        {m.status === "paused" ? "Resume" : "Pause"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Check triggered")}>Run check now</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          dispatch({ type: "monitor.delete", id: m.id });
                          toast(`Deleted ${m.name}`);
                        }}
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
