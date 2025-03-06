import { BaseDTO } from "./base.dto";


export class ChildSponsoredDTO extends BaseDTO {
  firstName: string;
  fatherName: string;
  familyName: string;
  imageUrl: string;
  expirationDate: Date;
}
