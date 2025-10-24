import React from "react";
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
  Delete as DeleteIcon,
  Add as PlusIcon,
} from '@material-ui/icons';
import ENDPOINTS from '../../../../constants/endpoints';

import Vector from '../../../../styles/assets/Vector.png';
import Group from '../../../../styles/assets/Group.png';
import noisePollution_1 from '../../../../styles/assets/noise-pollution_1.png';
import fix_window from '../../../../styles/assets/fix_window.png';
import AcImage from '../../../../styles/assets/ac.png';
import solarPanel from '../../../../styles/assets/solar-panel.png';
import Group_1 from '../../../../styles/assets/Group_1.png';
import Group3837 from '../../../../styles/assets/Group3837.png';
import image1 from '../../../../styles/assets/IMG_5322_1.png';
import ScreenShot from '../../../../styles/assets/ScreenShot.png';
import mfrkwcq1iwuz1 from '../../../../styles/assets/mfrkwcq1iwuz1.png';
import oldBlockHouses1 from '../../../../styles/assets/old-block-houses1.png';
import snowflake_1 from '../../../../styles/assets/snowflake_1.png';
import Central from '../../../../styles/assets/Central.png';
import None from '../../../../styles/assets/None.png';
import Other from '../../../../styles/assets/Other.png';
import Group38416 from '../../../../styles/assets/Group38416.png';
import Group3839 from '../../../../styles/assets/Group3839.png';
import Group3840 from '../../../../styles/assets/Group3840.png';
import energyAudits from '../../../../styles/assets/energy_audits.png';
import technicalInspection from '../../../../styles/assets/technical_inspection.png';
import projectDesign from '../../../../styles/assets/project_design.png';
import construction from '../../../../styles/assets/construction.png';
import roof1 from '../../../../styles/assets/roof1.png';
import Electric from '../../../../styles/assets/Electric.png';
import very_cold from '../../../../styles/assets/very_cold.png';
import moldy_environment from '../../../../styles/assets/moldy_environment.png';
import im_not_sure from '../../../../styles/assets/im_not_sure.png';

import Vector1 from '../../../../styles/assets/Vector1.png';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Latvia from '../../../../styles/assets/images/country/Latvia.png';
import Spain from '../../../../styles/assets/images/country/Spain.png';
import Italy from '../../../../styles/assets/images/country/Italy.png';
import Portugal from '../../../../styles/assets/images/country/Portugal.png';
import UK from '../../../../styles/assets/images/country/UK.png';

const langNode = (selectedValue) => {

  if (selectedValue === 'Vector.png')
    return (<img src={Vector} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Group.png')
    return (<img src={Group} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

  else if (selectedValue === 'snowflake_1.png')
    return (<img src={snowflake_1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

  else if (selectedValue === 'noise-pollution_1.png')
    return (<img src={noisePollution_1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'fix_window.png')
    return (<img src={fix_window} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'ac.png')
    return (<img src={AcImage} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'fix_window.png')
    return (<img src={fix_window} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'solar-panel.png')
    return (<img src={solarPanel} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Group_1.png')
    return (<img src={Group_1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Group3837.png')
    return (<img src={Group3837} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

  // else if (selectedValue === 'Central.png')
  // return (<img src={Central} className="dropdown-toggle" type="button"  style={{marginTop:'30px',cursor: 'pointer',border: '1px solid #fdc133',padding: '5px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)



  else if (selectedValue === 'IMG_5322_1.png')
    return (<img src={image1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', height: '60px', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'ScreenShot.png')
    return (<img src={ScreenShot} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', height: '60px', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'mfrkwcq1iwuz1.png')
    return (<img src={mfrkwcq1iwuz1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', height: '60px', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'old-block-houses1.png')
    return (<img src={oldBlockHouses1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', height: '60px', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)


}

const langNode1 = (selectedValue) => {

  if (selectedValue === 'Central.png')
    return (<img src={Central} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'None.png')
    return (<img src={None} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Other.png')
    return (<img src={Other} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Group38416.png')
    return (<img src={Group38416} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Group3839.png')
    return (<img src={Group3839} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Group3840.png')
    return (<img src={Group3840} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'energy_audits.png')
    return (<img src={energyAudits} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'technical_inspection.png')
    return (<img src={technicalInspection} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'project_design.png')
    return (<img src={projectDesign} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'construction.png')
    return (<img src={construction} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'roof1.png')
    return (<img src={roof1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'Electric.png')
    return (<img src={Electric} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'very_cold.png')
    return (<img src={very_cold} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
  else if (selectedValue === 'moldy_environment.png')
    return (<img src={moldy_environment} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

}

const langNode2 = (selectedValue) => {

  if (selectedValue === 'im_not_sure.png')
    return (<img src={im_not_sure} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)




  else
    return (<img src={Vector1} className="dropdown-toggle" type="button" style={{ marginTop: '30px', cursor: 'pointer', border: '1px solid #fdc133', padding: '5px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

}
const BookList = props => {
  return
};
const AppendFields = props => {


  return props.tabStep.map((val, idx) => {
    let tabTitle = `tabTitleSub-${idx}`

      ;

    return (
      <div className={idx === 0 ? "tab-pane active show" : "tab-pane"} id={"tab-" + idx} key={val.data.ID}>

        <div className="row mb-4">
          <div className="col-12 col-md-12 col-lg-12" >
            <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={(e) => props.questionAdd(e, val.data.ID)} >
              <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                <PlusIcon />
              </span></button>
          </div>
        </div>
        {val.data.questions.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((questionValue, questionKey) => {
          let question = `question-${questionKey}`,
            filedType = `filedType-${questionValue.ID}`;


          return (
            <div className="row mb-4" key={questionKey}>
              <div className="col-12 col-md-12 col-lg-12 mb-4" >
                <h4 className="mb-2">{props.t('translations:ossOnboardingTitle.Question')} {questionKey + 1}  <DeleteIcon onClick={() => props.questionDelete(questionValue.ID)} /> </h4>
                <hr></hr>
              </div>
              <div className="col-12 col-md-12 col-lg-12 mb-2" >
                <input type="text" className="input mt-2" id={question} name="name" defaultValue={questionValue.name} onBlur={(e) => props.questionUpdate(e, questionValue.ID, idx, questionKey)} style={{ width: '50%', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <select className="select-country" name="text_number" id={filedType} style={{ background: 'none' }} required="" >
                  <option value="Text"> Text </option>
                  <option value="Number">Number</option>
                  <option value="Checkbox Type Button">Checkbox Button</option>
                  <option value="Checkbox Type Box">Checkbox Box</option>
                  <option value="Radio Type Button" >Radio Button</option>
                  <option value="Radio Type Box" >Radio Box</option>
                  <option value="Dropdown" >Dropdown</option>
                  {/* <option value="File Upload" >File Upload</option>                                                              */}
                </select>
                <button className="btn btn-primary btn-md btn-default" onClick={() => props.addNewField(questionValue.ID)} >{props.t('translations:ossOnboardingTitle.AddField')}</button>
              </div>

              {questionValue.step_fields.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((fieldValue, fieldKey) => {
                let question = `question-${fieldKey}`,
                  checkboxValue = `checkboxValue-${fieldKey}`,
                  filedType = `filedType-${idx}`,
                  divValue = `divValue-${fieldKey}`,
                  title = `title-${fieldKey}`,
                  placeholder = `placeholder-${fieldKey}`,
                  inputType = `inputType-${fieldKey}`;


                if (fieldValue.input_type === 'Text' || fieldValue.input_type === 'Number') {
                  return (
                    <div className="col-md-6 mb-2 mt-3" id="textBoxDiv1">
                      <input type="text" className="input mt-2" id={placeholder} name="name" defaultValue={fieldValue.name} onBlur={(e) => props.fieldUpdate(e, fieldValue.ID, idx, fieldKey, questionKey)} style={{ width: '50%', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />
                      <DeleteIcon onClick={() => props.deleteFiled(fieldValue.ID, val.data.ID)} />
                      <br />
                      <input type="text" className="input mt-2" id={placeholder} name="placeholder" defaultValue={fieldValue.placeholder} onBlur={(e) => props.fieldUpdate(e, fieldValue.ID, idx, fieldKey, questionKey)} style={{ width: '50%', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="placeholder" />
                      <div className="flex items-center text-gray-700 dark:text-gray-500 mt-2" style={{ display: 'inline-block' }}>
                        <input type="checkbox" className="input border mr-2" checked={fieldValue.require} id="vertical-checkbox-chris-evans" defaultValue={fieldValue.require} name="require" onChange={(e) => props.fieldUpdate(e, fieldValue.ID, idx, fieldKey, questionKey)} />
                        <label className="cursor-pointer select-none" htmlFor="vertical-checkbox-chris-evans">Is Required</label>
                      </div>
                    </div>
                  );
                }

                if (fieldValue.input_type === 'Dropdown') {

                  let dropdownTitle = `dropdownTitle-${fieldKey}`,
                    dropdownValue = `dropdownValue-${fieldKey}`;

                  return (

                    <div className="col-md-6 mb-2 mt-3" id="textBoxDiv1">

                      <h4>{props.t('translations:ossOnboardingTitle.Question')} {props.t('translations:ossOnboardingTitle.' + fieldValue.input_type)} </h4>
                      <input type="text" className="input mt-2" id={dropdownTitle} name="name" defaultValue={fieldValue.name} onBlur={(e) => props.fieldUpdate(e, fieldValue.ID, idx, fieldKey, questionKey)} style={{ width: '50%', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />

                      <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={(e) => props.addNewFieldOption(e, fieldValue.ID)} >  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                        <PlusIcon />
                      </span></button>
                      <DeleteIcon onClick={() => props.deleteFiled(fieldValue.ID, val.data.ID)} />
                      <br />

                      <div className="row mb-4">
                        {fieldValue.options.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((optionValue, optionKey) => {
                          let dropdownOption = `dropdownOption-${optionKey}`;
                          return (
                            <div className="col-md-12 mb-2 mt-3" id="textBoxDiv1">
                              <input type="text" className="input mt-2" id={dropdownValue} name="option_value" defaultValue={optionValue.option_value} onBlur={(e) => props.fieldOptionUpdate(e, optionValue.ID)} style={{ width: '50%', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />
                              <DeleteIcon onClick={() => props.deleteFieldOption(optionValue.ID)} />
                            </div>
                          );
                        })

                        }
                      </div>

                    </div>

                  )
                }

                if (fieldValue.input_type !== 'Question' && fieldValue.input_type !== 'File Upload') {
                  return (
                    <div className="col-md-12 mb-3 mt-3" key={fieldKey} >

                      <h4>{props.t('translations:ossOnboardingTitle.filedTypeTitle')} {props.t('translations:ossOnboardingTitle.' + fieldValue.input_type)}  </h4>
                      <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={(e) => props.addNewFieldOption(e, fieldValue.ID)} >  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                        <PlusIcon />
                      </span></button>
                      <DeleteIcon onClick={() => props.deleteFiled(fieldValue.ID, val.data.ID)} />
                      <div className="row mb-4">
                        {fieldValue.options.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((optionValue, optionKey) => {
                          let option = `option-${optionKey}`,
                            kind_of_attic = `kind_of_attic-${optionKey}`,
                            optionValueId = `optionValue-${optionKey}`,
                            optionImageId = `optionImage-${optionKey}`,
                            checkBoxId = `checkBoxId-${optionKey}`,
                            radioId = `radioId-${optionKey}`,
                            title = `title-${optionKey}`,
                            placeholder = `placeholder-${optionKey}`,
                            inputType = `inputType-${optionKey}`;


                          if (fieldValue.input_type === 'Checkbox Type Button') {
                            return (
                              <div className="col-md-3 mb-3 mt-3" id="step5chk" key={optionKey}>

                                <label> <input type="text" id={option} name="name" defaultValue={optionValue.option_value} onBlur={(e) => props.fieldOptionUpdate(e, optionValue.ID)} style={{ width: '80%', height: '50px', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />
                                </label>
                                <DeleteIcon onClick={() => props.deleteFieldOption(optionValue.ID)} />
                                <br />
                              </div>
                            )
                          } else if (fieldValue.input_type === 'Checkbox Type Box') {
                            return (
                              <div className="col-md-3 mt-2" id="checkBoxDesign" key={optionKey}>
                                <DeleteIcon onClick={() => props.deleteFieldOption(optionValue.ID)} />

                                <input id={checkBoxId} type="checkbox" name="name" value={optionValue.option_value} />
                                <label htmlFor={checkBoxId}>
                                  <div className="serBox">
                                    <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}>
                                      <div className="col-md-12">
                                        <center>

                                          <div className="dropdown">
                                            {langNode(optionValue.image) || langNode1(optionValue.image) || langNode2(optionValue.image)}
                                            <ul className="dropdown-menu"
                                              aria-labelledby="dropdownMenuButton" style={{ height: '200px', overflow: 'auto' }}>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Vector.png")} style={{ borderBottom: '1px solid #fdcf00' }}>

                                                <center><img src={Vector} alt="" style={{ padding: '10PX' }} /> </center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "snowflake_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>

                                                <center><img src={snowflake_1} alt="" style={{ padding: '10PX' }} /> </center>

                                              </li>


                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group} alt="" style={{ padding: '10PX' }} /></center>
                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "noise-pollution_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={noisePollution_1} alt="" style={{ padding: '10PX' }} /></center>
                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "fix_window.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={fix_window} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "ac.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={AcImage} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "solar-panel.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center> <img src={solarPanel} alt="" style={{ padding: '10PX' }} /></center>


                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group_1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group3837.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group3837} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>


                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Central.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Central} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "None.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={None} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Other.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Other} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group38416.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group38416} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group3839.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group3839} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group3840.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group3840} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "energy_audits.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={energyAudits} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "technical_inspection.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={technicalInspection} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "project_design.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={projectDesign} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "construction.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={construction} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "roof1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={roof1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Electric.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Electric} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "IMG_5322_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={image1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "ScreenShot.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={ScreenShot} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "mfrkwcq1iwuz1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={mfrkwcq1iwuz1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "old-block-houses1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={oldBlockHouses1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "very_cold.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={very_cold} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "moldy_environment.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={moldy_environment} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "im_not_sure.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={im_not_sure} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>


                                            </ul>
                                          </div>



                                        </center>
                                      </div>
                                    </div>
                                    <div className="row  row-eq-height" id="test" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}>
                                      <div className="col-md-12">
                                        <p><input type="text" id={optionValueId} name="name" defaultValue={optionValue.option_value} onBlur={(e) => props.fieldOptionUpdate(e, optionValue.ID)} style={{ width: '80%', color: 'black', height: '50px', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" /> </p>
                                      </div>
                                    </div>
                                  </div>
                                </label>

                              </div>
                            );
                          } else if (fieldValue.input_type === 'Radio Type Button') {
                            return (
                              <div className="col-md-3 mb-3 mt-3" id="step5chk" key={optionKey}>
                                <label> <input type="text" id={option} name="name" defaultValue={optionValue.option_value} onBlur={(e) => props.fieldOptionUpdate(e, optionValue.ID)} style={{ width: '80%', height: '50px', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />
                                </label>
                                <DeleteIcon onClick={() => props.deleteFieldOption(optionValue.ID)} />
                              </div>
                            )
                          } else if (fieldValue.input_type === 'Radio Type Box') {
                            return (
                              <div className="col-md-3 mt-2" id="ossStepRadio" key={optionKey}>
                                <DeleteIcon onClick={() => props.deleteFieldOption(optionValue.ID)} />
                                <input id={radioId} type="radio" name="name" value={optionValue.option_value} />
                                <label htmlFor={radioId}>
                                  <div className="serBox">
                                    <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}>
                                      <div className="col-md-12">
                                        <center>

                                          <div className="dropdown">
                                            {langNode(optionValue.image) || langNode1(optionValue.image) || langNode2(optionValue.image)}
                                            <ul className="dropdown-menu"
                                              aria-labelledby="dropdownMenuButton" style={{ height: '200px', overflow: 'auto' }}>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Vector.png")} style={{ borderBottom: '1px solid #fdcf00' }}>

                                                <center><img src={Vector} alt="" style={{ padding: '10PX' }} /> </center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "snowflake_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>

                                                <center><img src={snowflake_1} alt="" style={{ padding: '10PX' }} /> </center>

                                              </li>


                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group} alt="" style={{ padding: '10PX' }} /></center>
                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "noise-pollution_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={noisePollution_1} alt="" style={{ padding: '10PX' }} /></center>
                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "fix_window.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={fix_window} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "ac.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={AcImage} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "solar-panel.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center> <img src={solarPanel} alt="" style={{ padding: '10PX' }} /></center>


                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group_1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group3837.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group3837} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>


                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Central.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Central} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "None.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={None} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Other.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Other} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group38416.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group38416} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group3839.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group3839} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Group3840.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Group3840} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "energy_audits.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={energyAudits} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "technical_inspection.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={technicalInspection} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "project_design.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={projectDesign} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "construction.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={construction} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "roof1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={roof1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "Electric.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={Electric} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "IMG_5322_1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={image1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "ScreenShot.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={ScreenShot} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "mfrkwcq1iwuz1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={mfrkwcq1iwuz1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "old-block-houses1.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={oldBlockHouses1} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "very_cold.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={very_cold} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>

                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "moldy_environment.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={moldy_environment} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                              <li className="dropdown-item" onClick={(e) => props.fieldOptionImageUpdate(e, optionValue.ID, "im_not_sure.png")} style={{ borderBottom: '1px solid #fdcf00' }}>
                                                <center><img src={im_not_sure} alt="" style={{ padding: '10PX' }} /></center>

                                              </li>
                                            </ul>
                                          </div>



                                        </center>
                                      </div>
                                    </div>
                                    <div className="row  row-eq-height" id="test" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}>
                                      <div className="col-md-12">
                                        <p><input type="text" id={optionValueId} name="name" defaultValue={optionValue.option_value} onBlur={(e) => props.fieldOptionUpdate(e, optionValue.ID)} style={{ width: '80%', color: 'black', height: '50px', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            );
                          } else {
                            return (
                              <div></div>
                            )
                          }









                        })

                        }
                      </div>
                    </div>
                  );

                }

                if (fieldValue.input_type === 'File Upload') {
                  { fieldValue.input_type }
                  return (
                    <div className="col-md-6 mb-2 mt-3" id="textBoxDiv1">
                      <input type="text" className="input mt-2" id={placeholder} name="name" defaultValue={fieldValue.name} onBlur={(e) => props.fieldUpdate(e, fieldValue.ID, idx, fieldKey, questionKey)} style={{ width: '50%', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="Title" />
                      <DeleteIcon onClick={() => props.deleteFiled(fieldValue.ID, val.data.ID)} />
                      <br />
                      <input type="text" className="input mt-2" id={placeholder} name="placeholder" defaultValue={fieldValue.placeholder} onBlur={(e) => props.fieldUpdate(e, fieldValue.ID, idx, fieldKey, questionKey)} style={{ width: '50%', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} placeholder="placeholder" />
                      <div className="flex items-center text-gray-700 dark:text-gray-500 mt-2" style={{ display: 'inline-block' }}>
                        <input type="checkbox" className="input border mr-2" checked={fieldValue.require} id="vertical-checkbox-chris-evans" defaultValue={fieldValue.require} name="require" onChange={(e) => props.fieldUpdate(e, fieldValue.ID, idx, fieldKey, questionKey)} />
                        <label className="cursor-pointer select-none" htmlFor="vertical-checkbox-chris-evans">Is Required</label>
                      </div>
                    </div>
                  );
                }

              })

              }



            </div>
          );

        })

        }





        <div className="row" >
          <div className="col-md-6">


          </div>
        </div>





        <ul className="list-inline pull-left mt-3" id="firstStep">
          <li> <button type="button" className="btn btn-primary btn-md btn-default-back" onClick={() => props.prevButtonClick()}>{props.t('translations:ossOnboardingTitle.Back')}</button> </li>
          <li> <button type="button" onClick={() => props.nextButtonClick()} className="btn btn-primary btn-md btn-default">{props.t('translations:ossOnboardingTitle.Next')}</button></li>
        </ul>

      </div>
    );
  });
};

const AppendStep = props => {

  let ggg = 1

  return props.tabStep.map((valnew, idx) => {
    let tabTitle = `tabTitle-${idx}`;


    return (
      <li className="nav-item" key={idx}>
        <a className={idx === 0 ? "nav-link active show" : "nav-link"} data-toggle="tab" href={"#tab-" + idx} style={{ lineHeight: '20px' }}>
          <DeleteIcon onClick={() => props.deleteStep(valnew.data.ID)} />
          &nbsp;&nbsp;
          <div className="circle">{ggg++}</div>
          {props.fetching ?
            <></>
            :
            <input type="text" className="input w-full " onBlur={(e) => props.stepTitleUpdate(e, valnew.data.ID)} style={{ width: '70%', margin: '-9px 0px 0px 31px', position: 'absolute', background: '#ff000000', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} defaultValue={valnew.data.name} placeholder="Input Title" />
          }
        </a>
      </li>
    );
  });
};


export { AppendStep, AppendFields };
