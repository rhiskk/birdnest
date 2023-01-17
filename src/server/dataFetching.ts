import { JSDOM } from "jsdom";
import axios from "axios";
import axiosRetry from "axios-retry";
import { droneData, NDZviolation } from "../types";
import { emitUpdate, getAllNDZViolations, updateRedis } from "./redis";

axiosRetry(axios, { retries: 3 });
let previousNDZviolations: Array<NDZviolation> = [];

const noFlyZone = {
  x: 250000,
  y: 250000,
  radius: 100,
};

function distanceToBirdnest(x: number, y: number): number {
  return Math.sqrt((x - noFlyZone.x) ** 2 + (y - noFlyZone.y) ** 2) / 1000;
}

function inNoFlyZone(distance: number): boolean {
  return distance <= noFlyZone.radius;
}

function hadUpdates(NDZviolations: Array<NDZviolation>) {
  return (
    JSON.stringify(NDZviolations) !== JSON.stringify(previousNDZviolations)
  );
}

async function fetchDrones(): Promise<Array<droneData>> {
  const doc = (
    await JSDOM.fromURL("http://assignments.reaktor.com/birdnest/drones")
  ).window.document;
  const capture = doc.querySelector("capture");
  const drones = capture!.querySelectorAll("drone");
  const droneData = Array.from(drones).map((drone) => {
    const serialNumber = drone.querySelector("serialNumber")!.textContent!;
    const x = parseFloat(drone.querySelector("positionX")!.textContent!);
    const y = parseFloat(drone.querySelector("positionY")!.textContent!);
    const closestDistance = distanceToBirdnest(x, y);
    return {
      serialNumber,
      closestDistance,
    };
  });
  return droneData;
}

async function populatePilotData(drone: droneData): Promise<NDZviolation> {
  try {
    const res = await axios
      .get(
        `http://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`
      )
      .then((res) => res.data);
    return {
      drone: drone,
      pilot: {
        firstName: res.firstName,
        lastName: res.lastName,
        phoneNumber: res.phoneNumber,
        email: res.email,
      },
    };
  } catch (err) {
    throw new Error("Could not fetch pilot data");
  }
}

async function getNDZViolations(): Promise<Array<NDZviolation>> {
  const drones = await fetchDrones();
  const noFlyZoneDrones = drones.filter((drone) =>
    inNoFlyZone(drone.closestDistance)
  );
  const ndzViolations = await Promise.all(
    noFlyZoneDrones.map((drone) => populatePilotData(drone))
  );
  return ndzViolations;
}

export function startFetching() {
  setInterval(async () => {
    const NDZviolations = await getNDZViolations();
    updateRedis(NDZviolations);
    const updatedNDZViolations = await getAllNDZViolations();
    if (hadUpdates(updatedNDZViolations)) {
      emitUpdate(updatedNDZViolations);
      previousNDZviolations = updatedNDZViolations;
    }
  }, 1500);
}
