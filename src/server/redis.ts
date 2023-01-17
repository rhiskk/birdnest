import Redis from "ioredis";
import { NDZviolation } from "../types";

const EXPIRATION_TIME = 600;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = new Redis(REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
});

export function emitUpdate(NDZviolations: Array<NDZviolation>) {
  redisClient.emit("update", NDZviolations);
}

export async function getAllNDZViolations(): Promise<Array<NDZviolation>> {
  const pattern = "NDZ-*";
  const NDZviolations: Array<NDZviolation> = [];
  let cursor = 0;
  while (true) {
    const scan = await redisClient.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      1000
    );
    cursor = parseInt(scan[0]);
    const keys = scan[1];
    if (keys.length < 1) break;
    const violations = await redisClient.mget(keys).then((violations) => {
      return violations.map((violation) => {
        if (violation) return JSON.parse(violation);
      });
    });
    NDZviolations.push(...violations);
    if (cursor === 0) break;
  }
  return NDZviolations;
}

async function getNDZViolationWithMatchingKey(
  key: string
): Promise<NDZviolation | null> {
  return redisClient.get(key).then((violation) => {
    if (violation) return JSON.parse(violation);
  });
}

async function setValueAndExpire(key: string, value: NDZviolation) {
  redisClient.setex(key, EXPIRATION_TIME, JSON.stringify(value));
}

export async function updateRedis(NDZViolations: Array<NDZviolation>) {
  for (const violation of NDZViolations) {
    const key = `NDZ-${violation.drone.serialNumber}`;
    const drone = violation.drone;
    const previousSighting = await getNDZViolationWithMatchingKey(key);
    if (previousSighting) {
      const previousDistance = previousSighting.drone.closestDistance;
      if (previousDistance < drone.closestDistance) {
        drone.closestDistance = previousDistance;
      }
    }
    setValueAndExpire(key, violation);
  }
}
