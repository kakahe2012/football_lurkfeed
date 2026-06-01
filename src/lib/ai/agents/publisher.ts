import type { PipelineOutput } from "./types";

/** 发布入库：标记待审状态，实际 DB 写入由 API 层完成 */
export function runPublisherAgent(draft: Omit<PipelineOutput, "steps" | "publish_status">) {
  return {
    ...draft,
    publish_status: "pending" as const,
    message: "已准备入库，等待人工审批后发布",
  };
}
