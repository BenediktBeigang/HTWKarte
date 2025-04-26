export type ContactInfo = {
  roomName: string;
  person?: string;
  email?: string;
  telephone?: [{ number: string }];
  department?: string;
};

export type BuildingInfo = {
  name: string;
  address: string;
  abbreviation: string;
  janitor?: string;
  description?: string;
};

export type EventInJson = {
  name: string;
  start: Date;
  end: Date;
  day: string;
  free: boolean;
  rooms: string;
  week: string;
  eventType: string;
};
