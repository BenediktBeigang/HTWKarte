export class MissingRoomException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MissingBuildingException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MissingRoomWithValidBuildingException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FloorSVGLoadingTimeoutException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
