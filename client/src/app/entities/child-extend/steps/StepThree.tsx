import { Select, MenuItem, SelectChangeEvent, FormControl, FormHelperText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Label, Input, FormGroup, Button } from 'reactstrap'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


const StepThree = () => {
    const [categorization, setCategorization] = useState('');
    const [dateOfDeath, setDateOfDeath] = useState<Date | null>();

    const handleCategorization = (event: SelectChangeEvent) => {
        setCategorization(event.target.value);
    };

    const handleDateOfDeath = (value: Date) => {
        console.log('value', value)
        if(value) setDateOfDeath(value);
    };

    useEffect(() => {
        console.log('dateOfDeath', dateOfDeath)

    }, [dateOfDeath])
  return (
    <div className='stepContainer'>
        <Form id='maritalStatusForm' onSubmit={() => alert("submit")}>
        <Row>
        <Col xs="12" md="12" lg="6">
          <FormGroup>
            <Label>تصنيف اليتم</Label>
            <Select
            className='custom-select w-100'
            id='categorization'
          value={categorization}
          onChange={handleCategorization}
          displayEmpty
          name='categorization'
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem className='d-none' value="">
          </MenuItem>
          <MenuItem value="Fatherless">يتيم شرعي - يتيم الأب</MenuItem>
          <MenuItem value="Motherless">يتيم شرعي - يتيم الأم</MenuItem>
        </Select>
          </FormGroup>
        </Col>
        
        <Col xs="12" md="12" lg="6">
          <FormGroup>
            <Label>تاريخ الوفاه</Label>
            <DatePicker wrapperClassName='w-100' className='custom-date form-control w-100' id='dateOfDeath' selected={dateOfDeath} onChange={(date: Date) => handleDateOfDeath(date)} />
          </FormGroup>
        </Col>
    </Row>
    <Row>
        <Col xs="12">
            <FormGroup>
                <Label>برجاء رفع شهادة الوفاه (إن وجدت)</Label>
                <Input id="deathFile" type="text" />
            </FormGroup>
        </Col>
        <Col xs="12" md="12" lg="6">
            <FormGroup>
                <Label>عدد الأخوة والأخوات</Label>
                <Input id="numberOfSiblings" className='custom-number text-start' min={0} max={100} type="number" />
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

export default StepThree