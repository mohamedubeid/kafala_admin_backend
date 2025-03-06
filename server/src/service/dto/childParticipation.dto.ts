import { BaseDTO } from "./base.dto";


export class ChildCertificateDTO extends BaseDTO {
  firstName: string;
  fatherName: string;
  familyName: string;
  imageUrl: string;
  createdDate: Date;
  certificateImage: string;
  description: string;
}
