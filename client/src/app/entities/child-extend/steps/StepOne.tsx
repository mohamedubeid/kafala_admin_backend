import React, { useState } from 'react';
import { Form, Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';

interface FormData {
  email: string;
  name: string;
  fatherName: string;
  motherName: string;
  familyName: string;
  gender: string;
  age: string;
  image: string;
  vedio: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  fatherName?: string;
  motherName?: string;
  familyName?: string;
  gender?: string;
  age?: string;
  image?: string;
  vedio?: string;
}

const StepOne = ({ onSubmit }) => {
  const [notes, setNotes] = useState([{ note: '' }]);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    fatherName: '',
    motherName: '',
    familyName: '',
    gender: '',
    age: '',
    image: '',
    vedio: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleAddNote = () => {
    setNotes([...notes, { note: '' }]);
  };

  const handleNoteChange = (index, event) => {
    const newNotes = [...notes];
    newNotes[index].note = event.target.value;
    setNotes(newNotes);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.email) errors.email = 'Email is required';
    if (!formData.name) errors.name = 'First child name is required';
    if (!formData.fatherName) errors.fatherName = 'Father name is required';
    if (!formData.motherName) errors.motherName = 'Mother name is required';
    if (!formData.familyName) errors.familyName = 'Family name is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.age) errors.age = 'Age is required';
    if (!formData.image) errors.image = 'Image is required';
    if (!formData.vedio) errors.vedio = 'Video is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const entity = {
        ...formData,
        childNotes: notes.map(note => ({
          notes: {
            note: note.note
          }
        })),
      };
      onSubmit(entity);
    }
  };

  return (
    <div className='stepContainer'>
      <Form id='profileForm' onSubmit={handleSubmit}>
        <Row>
          <Col xs="12" md="6">
            <FormGroup controlId="email">
              <Label>البريد الالكتروني</Label>
              <Input
                name="email"
                id='email'
                type="email"
                value={formData.email}
                onChange={handleChange}
                invalid={!!formErrors.email}
              />
              {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="6" lg="3">
            <FormGroup controlId="firstChildName">
              <Label>اسم الطفل الأول</Label>
              <Input
                name='name'
                id='firstChildName'
                type="text"
                value={formData.name}
                onChange={handleChange}
                invalid={!!formErrors.name}
              />
              {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
            </FormGroup>
          </Col>
          <Col xs="12" md="6" lg="3">
            <FormGroup controlId="fatherName">
              <Label>اسم الأب</Label>
              <Input
                name='fatherName'
                id="fatherName"
                type="text"
                value={formData.fatherName}
                onChange={handleChange}
                invalid={!!formErrors.fatherName}
              />
              {formErrors.fatherName && <div className="text-danger">{formErrors.fatherName}</div>}
            </FormGroup>
          </Col>
          <Col xs="12" md="6" lg="3">
            <FormGroup controlId="motherName">
              <Label>اسم الأم</Label>
              <Input
                name='motherName'
                id="motherName"
                type="text"
                value={formData.motherName}
                onChange={handleChange}
                invalid={!!formErrors.motherName}
              />
              {formErrors.motherName && <div className="text-danger">{formErrors.motherName}</div>}
            </FormGroup>
          </Col>
          <Col xs="12" md="6" lg="3">
            <FormGroup controlId="familyName">
              <Label>اسم العائلة</Label>
              <Input
                name='familyName'
                id="familyName"
                type="text"
                value={formData.familyName}
                onChange={handleChange}
                invalid={!!formErrors.familyName}
              />
              {formErrors.familyName && <div className="text-danger">{formErrors.familyName}</div>}
            </FormGroup>
          </Col>
        </Row>
        <Row className='mt-1'>
          <Col xs="12" md="12" lg="6">
            <Label>جنس الطفل</Label>
            <div className="d-flex gap-5">
              <FormGroup>
                <Input
                  id='male'
                  name="gender"
                  type="radio"
                  value="MALE"
                  checked={formData.gender === "MALE"}
                  onChange={handleChange}
                  invalid={!!formErrors.gender}
                />
                {' '}
                <Label className='ms-2'>ذكر</Label>
              </FormGroup>
              <FormGroup>
                <Input
                  id='female'
                  name="gender"
                  type="radio"
                  value="FEMALE"
                  checked={formData.gender === "FEMALE"}
                  onChange={handleChange}
                  invalid={!!formErrors.gender}
                />
                {' '}
                <Label className='ms-2'>أنثى</Label>
              </FormGroup>
            </div>
            {formErrors.gender && <div className="text-danger">{formErrors.gender}</div>}
          </Col>
          <Col xs="12" md="12" lg="6">
            <FormGroup>
              <Label>السن الحالي للطفل</Label>
              <Input
                name='age'
                id='childAge'
                type="number"
                value={formData.age}
                onChange={handleChange}
                invalid={!!formErrors.age}
              />
              {formErrors.age && <div className="text-danger">{formErrors.age}</div>}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12" lg="6">
            <FormGroup>
              <Label>فيديو للطفل</Label>
              <Input
                name='vedio'
                id="childVideo"
                type="text"
                value={formData.vedio}
                onChange={handleChange}
                invalid={!!formErrors.vedio}
              />
              {formErrors.vedio && <div className="text-danger">{formErrors.vedio}</div>}
            </FormGroup>
          </Col>
        </Row>
        <Row className='mt-1'>
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
          <Col xs="12" className='mt-3'>
            <FormGroup className='correctInfoGroup'>
              <Input id='correctInfo' name="correctInfo" type="checkbox" />
              {' '}
              <Label className='ms-2'>
                اتعهد أن المعلومات التي ادخلتها صحيحة وحقيقية.
                <Button type='button'>اعرف المزيد</Button>
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default StepOne;
