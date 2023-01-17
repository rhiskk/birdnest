type pilotData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

export type droneData = {
  serialNumber: string;
  closestDistance: number;
};

export type NDZviolation = {
  drone: droneData;
  pilot: pilotData;
};
