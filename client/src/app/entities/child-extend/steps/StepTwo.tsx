import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { DisabilityTypes } from 'app/shared/model/enumerations/disability-types.model';
import { HealthStatus } from 'app/shared/model/enumerations/health-status.model';
import { MentalIllnessTypes } from 'app/shared/model/enumerations/mental-illness-types.model';
import React, { useState } from 'react';
import { Form, Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';

interface FormData {
  healthStatus: HealthStatus | null;
  chronicDisease: boolean;
  hasDisability: boolean;
  disabilityType: DisabilityTypes | null;
  disabilityImage: string;
  hasMentalIllness: boolean;
  mentalIllnessType: MentalIllnessTypes | null;
  mentalIllnessImage: string;
  sychologicalHealth: boolean;
  sychologicalHealthType: null | string;
  sychologicalHealthImage: string;
  healthReport: string;
}

const StepTwo = ({ onSubmit }) => {
  const [notes, setNotes] = useState([{ note: '' }]);
  const [formData, setFormData] = useState<FormData>({
    healthStatus: null,
    chronicDisease: false,
    hasDisability: false,
    disabilityType: null,
    disabilityImage: '',
    hasMentalIllness: false,
    mentalIllnessType: null,
    mentalIllnessImage: '',
    sychologicalHealth: false,
    sychologicalHealthType: null,
    sychologicalHealthImage: '',
    healthReport: '',
  });

  const handleAddNote = () => {
    setNotes([...notes, { note: '' }]);
  };

  const handleNoteChange = (index, event) => {
    const newNotes = [...notes];
    newNotes[index].note = event.target.value;
    setNotes(newNotes);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const entity = {
      ...formData,
      childNotes: notes.map((note) => ({
        notes: {
          note: note.note,
        },
      })),
    };
    onSubmit(entity);
  };

  return (
    <div className="stepContainer">
      <Form id="healthStatusForm" onSubmit={handleSubmit}>
        <Row>
          <Col xs="12" md="12" lg="6">
            <FormGroup controlId="healthStatus">
              <Label>الحالة الصحية للطفل</Label>
              <Select
                className="custom-select w-100"
                id="healthStatus"
                name="healthStatus"
                value={formData.healthStatus || ''}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={handleChange}
              >
                {Object.values(HealthStatus).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === HealthStatus.GOOD && 'حالة صحية جيدة'}
                    {type === HealthStatus.WEAK && 'حالة صحية ضعيفة'}
                    {type === HealthStatus.POOR && 'حالة صحية سيئة'}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12" lg="6">
            <Label>هل يعاني الطفل من مرض مزمن؟</Label>
            <div className="d-flex gap-5">
              <FormGroup>
                <Input id="illnessYes" name="chronicDisease" type="radio" value="true" checked={formData.chronicDisease === true} onChange={handleChange} />
                {' '}
                <Label className="ms-2">نعم</Label>
              </FormGroup>
              <FormGroup>
                <Input id="illnessNo" name="chronicDisease" type="radio" value="false" checked={formData.chronicDisease === false} onChange={handleChange} />
                {' '}
                <Label className="ms-2">لا</Label>
              </FormGroup>
            </div>
          </Col>
          <Col xs="12" md="12" lg="6">
            <Label>هل يعاني الطفل من أي نوع من الإعاقة؟</Label>
            <div className="d-flex gap-5">
              <FormGroup>
                <Input id="suffersDisabilityYes" name="hasDisability" type="radio" value="true" checked={formData.hasDisability === true} onChange={handleChange} />
                {' '}
                <Label className="ms-2">نعم</Label>
              </FormGroup>
              <FormGroup>
                <Input id="suffersDisabilityNo" name="hasDisability" type="radio" value="false" checked={formData.hasDisability === false} onChange={handleChange} />
                {' '}
                <Label className="ms-2">لا</Label>
              </FormGroup>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12" lg="6">
            <FormGroup controlId="disabilityType">
              <Label>نوع الإعاقة</Label>
              <Select
                className="custom-select w-100"
                id="disabilityType"
                name="disabilityType"
                value={formData.disabilityType || ''}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {Object.values(DisabilityTypes).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === DisabilityTypes.PHYSICAL && 'إعاقة بدنية'}
                    {type === DisabilityTypes.VISUAL && 'إعاقة بصرية'}
                    {type === DisabilityTypes.HEARING && 'إعاقة سمعية'}
                    {type === DisabilityTypes.COGNITIVE && 'إعاقة إدراكية'}
                    {type === DisabilityTypes.OTHER && 'إعاقة أخرى'}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </Col>
          <Col xs="12" md="12" lg="6">
            <FormGroup>
              <Label>برجاء رفع مستند الإعاقة (إن وجدت)</Label>
              <Input onChange={handleChange} name="disabilityImage" id="disabilityFile" type="text" value={formData.disabilityImage} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12" lg="6">
            <Label>هل يعاني الطفل من مرض عقلي؟</Label>
            <div className="d-flex gap-5">
              <FormGroup>
                <Input id="mentalIllnessYes" name="hasMentalIllness" type="radio" value="true" checked={formData.hasMentalIllness === true} onChange={handleChange} />
                {' '}
                <Label className="ms-2">نعم</Label>
              </FormGroup>
              <FormGroup>
                <Input id="mentalIllnessNo" name="hasMentalIllness" type="radio" value="false" checked={formData.hasMentalIllness === false} onChange={handleChange} />
                {' '}
                <Label className="ms-2">لا</Label>
              </FormGroup>
            </div>
          </Col>
          <Col xs="12" md="12" lg="6">
            <Label>هل يعاني الطفل من مرض نفسي؟</Label>
            <div className="d-flex gap-5">
              <FormGroup>
                <Input id="psychiatricDisorderYes" name="sychologicalHealth" type="radio" value="true" checked={formData.sychologicalHealth === true} onChange={handleChange} />
                {' '}
                <Label className="ms-2">نعم</Label>
              </FormGroup>
              <FormGroup>
                <Input id="psychiatricDisorderNo" name="sychologicalHealth" type="radio" value="false" checked={formData.sychologicalHealth === false} onChange={handleChange} />
                {' '}
                <Label className="ms-2">لا</Label>
              </FormGroup>
            </div>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col xs="12">
            <FormGroup>
              <Label>ملحوظات</Label>
              {notes.map((note, index) => (
                <Input
                  type="textarea"
                  key={index}
                  value={note.note}
                  onChange={(e) => handleNoteChange(index, e)}
                  className="mb-2"
                />
              ))}
            </FormGroup>
            <Button type="button" className="add-note-btn" onClick={handleAddNote}>
              إضافة ملحوظات أخرى
            </Button>
          </Col>
          <Col xs="12">
            <Button className="add-report-btn" id="addReport">
              إضافة تقرير صحي
            </Button>
          </Col>
          <Col xs="12" className="mt-3">
            <FormGroup className="correctInfoGroup">
              <Input id="correctInfo" name="correctInfo" type="checkbox" />
              {' '}
              <Label className="ms-2">
                اتعهد أن المعلومات التي ادخلتها صحيحة وحقيقية.
                <Button type="button">اعرف المزيد</Button>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs="12">
            <Button type="submit" color="primary">Submit</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default StepTwo;
