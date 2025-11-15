export class IWorkOrderCheckInProcedure {
    public workOrder: string;
    public dateTimeCheckIn?: string;
    public journeyDistance: number;
    public checkInImageUrl?: string;
    public checkInLatitude: number;
    public checkInLongitude: number;
    public workType?: string;

    constructor({
        workOrder = '',
        dateTimeCheckIn = '',
        journeyDistance = 0,
        checkInImageUrl = '',
        checkInLatitude = 0,
        checkInLongitude = 0,
        workType = ''
    }) {
      this.workOrder = workOrder;
      this.dateTimeCheckIn = dateTimeCheckIn;
      this.journeyDistance = journeyDistance;
      this.checkInImageUrl = checkInImageUrl;
      this.checkInLatitude = checkInLatitude;
      this.checkInLongitude = checkInLongitude;
      this.workType = workType;
    }
  }