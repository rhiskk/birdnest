import { router, publicProcedure } from "../trpc";
import { getAllNDZViolations, redisClient } from "../../redis";
import { NDZviolation } from "../../../types";
import { observable } from "@trpc/server/observable";

export const violationRouter = router({
  onUpdate: publicProcedure.subscription(async () => {
    return observable<NDZviolation[]>((emit) => {
      const onUpdate = (data: NDZviolation[]) => {
        emit.next(data);
      };
      redisClient.on("update", onUpdate);
      return () => {
        redisClient.off("update", onUpdate);
      };
    });
  }),
  getAll: publicProcedure.query(async () => {
    const violations = await getAllNDZViolations();
    return violations;
  }),
});
