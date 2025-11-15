export interface LoginInterface {
  username: string;
  password: string;
}

export class LoginResponseInterface {
  public access_token: string;
  public role: string;
  public wk_ctr: string;
  public fullName: string;
  public urlProfile: string;
  public employeeId: string;

  constructor({ access_token = '', role = '', wk_ctr = '', fullName = '', urlProfile = '', employeeId = '' }) {
    this.access_token = access_token
    this.role = role
    this.wk_ctr = wk_ctr
    this.fullName = fullName
    this.urlProfile = urlProfile
    this.employeeId = employeeId
  }
}
