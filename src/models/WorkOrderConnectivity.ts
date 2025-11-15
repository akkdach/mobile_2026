export class WorkOrderConnectinvity {
  public cdCode: string;
  public imeiConnectivityDevice: string;
  public simMobileNo: string;
  public simICCID: string;
  public simServiceProvider: string;
  public connectivityDeviceType: string;

  constructor({
    cdCode = '',
    imeiConnectivityDevice = '',
    simMobileNo = '',
    simICCID = '',
    simServiceProvider = '',
    connectivityDeviceType = '',
  }) {
    this.cdCode = cdCode;
    this.imeiConnectivityDevice = imeiConnectivityDevice;
    this.simMobileNo = simMobileNo;
    this.simICCID = simICCID;
    this.simServiceProvider = simServiceProvider;
    this.connectivityDeviceType = connectivityDeviceType;
  }
}
