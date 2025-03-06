import { Select, MenuItem, SelectChangeEvent, FormControl, FormHelperText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Label, Input, FormGroup, Button } from 'reactstrap'

const StepFour = () => {
    const [relationship, setRelationship] = useState('');

    const handleRelationship = (event: SelectChangeEvent) => {
        setRelationship(event.target.value);
    };


  return (
    <div className='stepContainer'>
        <Form id='educationalForm' onSubmit={() => alert("submit")}>
        <Row>
        <Col xs="12" md="12" lg="6">
          <FormGroup>
            <Label>اسم الجهة الراعية </Label>
            <Input id='entityName' type="text" />
          </FormGroup>
        </Col>
        
        <Col xs="12" md="12" lg="6">
          <FormGroup>
            <Label>صلة الجهة الراعية</Label>
            <Select
            className='custom-select w-100'
            id='relationship'
          value={relationship}
          onChange={handleRelationship}
          displayEmpty
          name='relationship'
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem className='d-none' value="">
          </MenuItem>
          <MenuItem value="primary"></MenuItem>
          <MenuItem value="intermediate">المرحلة الاعدادية</MenuItem>
          <MenuItem value="secondary">المرحلة الثانوية</MenuItem>
        </Select>
          </FormGroup>
        </Col>
    </Row>


        <Row className='mt-1'>
      <Col xs="12">
          <FormGroup >
            <Label>ملحوظات</Label>
            <Input type="textarea" id='note'/>
          </FormGroup>

          <Button className="add-note-btn" id='addNote'>
          إضافة ملحوظات أخرى
          </Button>
        </Col>

        <Col xs="12" className='mt-3'>
        <FormGroup
   className='correctInfoGroup'
    >
      <Input
      id='correctInfo'
        name="correctInfo"
        type="checkbox"
      />
      {' '}
      <Label  className='ms-2'>
      اتعهد أن المعلومات التي ادخلتها صحيحة وحقيقية. <Button type='button'>
      اعرف المزيد
      </Button>
      </Label>
    </FormGroup>
    </Col>
        </Row>
        </Form>
    </div>
  )
}

export default StepFour