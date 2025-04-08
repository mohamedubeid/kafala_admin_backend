import { BaseDTO } from "./base.dto";


export class ChildTransactionDTO extends BaseDTO {
  firstName: string;
  fatherName: string;
  familyName: string;
  imageUrl: string;
  createdDate: Date;
  reportImage: string;
  reportVideo: string;
  amountReceived: number;
  description: string;
}
