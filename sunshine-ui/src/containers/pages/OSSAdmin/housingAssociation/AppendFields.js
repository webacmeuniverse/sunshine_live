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

import Vector1 from '../../../../styles/assets/Vector1.png';
import snowflake_1 from '../../../../styles/assets/snowflake_1.png';

import Vector2 from '../../../../styles/assets/Vector2.png';


import Latvia from '../../../../styles/assets/images/country/Latvia.png';
import Spain from '../../../../styles/assets/images/country/Spain.png';
import Italy from '../../../../styles/assets/images/country/Italy.png';
import Portugal from '../../../../styles/assets/images/country/Portugal.png';
import UK from '../../../../styles/assets/images/country/UK.png';

const BookList = props => {
  return
};
const AppendFields = props => {


  return props.tabStep.sort((a, b) => a.data.index > b.data.index ? 1:-1).map((val, idx) => {
    let tabTitle = `tabTitleSub-${idx}`
    
    ;

    return (
      <div className={idx === 0 ? "tab-pane active show" : "tab-pane"} id={"tab-" + idx} key={val.data.ID}>

<div className="row mb-4">
<div className="col-12 col-md-12 col-lg-12" >
        <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={(e) => props.questionAdd(e,val.data.ID)} > 
                <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                                                            <PlusIcon />
                                                                                    </span></button>
                                                                                    </div>
                                                                                    </div>                                                                          
        {val.data.questions.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((questionValue, questionKey) => {
            let question = `question-${questionKey}`,
            filedType = `filedType-${questionValue.ID}`;
                  
              
                                return (
                                  <div className="row mb-4" key={questionKey}>
                                    <div className="col-12 col-md-12 col-lg-12 mb-4" >
                                      <h4 className="mb-2">Question {questionKey + 1}  <DeleteIcon  onClick={() => props.questionDelete(questionValue.ID)} /></h4>
                                      <hr></hr>
                                    </div>
                                  <div className="col-12 col-md-12 col-lg-12 mb-2" >
                                        <input type="text" className="input mt-2" id={question} name="name" defaultValue={questionValue.name}  onBlur={(e) => props.questionUpdate(e,questionValue.ID,idx,questionKey)}  style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />                      
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <select className="select-country" name="text_number" id={filedType} style={{ background: 'none' }} required="" >
                                                            <option value="Text"> Text </option>
                                                            <option value="Number">Number</option>
                                                            <option value="Checkbox Type Button">Checkbox Type Button</option>
                                                            <option value="Checkbox Type Box">Checkbox Type Box</option>
                                                            <option value="Radio Type Button" >Radio Type Button</option>
                                                            <option value="Radio Type Box" >Radio Type Box</option>
                                                            <option value="Dropdown" >Dropdown</option>                                                            
                                                          </select>
                                        <button className="btn btn-primary btn-md btn-default" onClick={() => props.addNewField(questionValue.ID)} >Add Field</button>  
                                  </div>                                 
                              
                              {questionValue.step_fields.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((fieldValue, fieldKey) => {
                                                            let question      = `question-${fieldKey}`,
                                                                checkboxValue = `checkboxValue-${fieldKey}`,
                                                                filedType     = `filedType-${idx}`,
                                                                divValue      = `divValue-${fieldKey}`,
                                                                title         = `title-${fieldKey}`,
                                                                placeholder   = `placeholder-${fieldKey}`,
                                                                inputType     = `inputType-${fieldKey}`;
                                                          
                                                        
                                                                if(fieldValue.input_type === 'Text' || fieldValue.input_type === 'Number'){                       
                                                                        return (
                                                                              <div className="col-md-6 mb-2 mt-3" id="textBoxDiv1">
                                                                                  <input type="text" className="input mt-2" id={placeholder} name="name" defaultValue={fieldValue.name}  onBlur={(e) => props.fieldUpdate(e,fieldValue.ID,idx,fieldKey,questionKey)}  style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />                             
                                                                                  <DeleteIcon  onClick={() => props.deleteFiled(fieldValue.ID,val.data.ID)} />
                                                                                  <br />
                                                                                  <input type="text" className="input mt-2" id={placeholder} name="placeholder" defaultValue={fieldValue.placeholder} onBlur={(e) => props.fieldUpdate(e,fieldValue.ID,idx,fieldKey,questionKey)} style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="placeholder" />                              
                                                                                  <div className="flex items-center text-gray-700 dark:text-gray-500 mt-2" style={{ display: 'inline-block' }}>
                                                                                        <input type="checkbox" className="input border mr-2" checked={fieldValue.require}  id="vertical-checkbox-chris-evans" defaultValue={fieldValue.require} name="require" onChange={(e) => props.fieldUpdate(e,fieldValue.ID,idx,fieldKey,questionKey)}/>
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
                                                                          <h4>Click Button For Add Multiple Option in {fieldValue.input_type} </h4>
                                                                          <input type="text" className="input mt-2" id={dropdownTitle} name="name" defaultValue={fieldValue.name}  onBlur={(e) => props.fieldUpdate(e,fieldValue.ID,idx,fieldKey,questionKey)}  style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />
                                                                          
                                                                            <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={(e) => props.addNewFieldOption(e,fieldValue.ID)} >  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                                                            <PlusIcon />
                                                                                    </span></button>
                                                                                    <DeleteIcon  onClick={() => props.deleteFiled(fieldValue.ID,val.data.ID)} />
                                                                                  <br />
                                                                        
                                                                        <div className="row mb-4">
                                                                          {fieldValue.options.sort((a, b) => a.CreatedAt < b.CreatedAt ? 1:-1).map((optionValue, optionKey) => {
                                                                              let dropdownOption = `dropdownOption-${optionKey}`;
                                                                                                          return ( 
                                                                                                            <div className="col-md-12 mb-2 mt-3" id="textBoxDiv1">
                                                                                                            <input type="text" className="input mt-2" id={dropdownValue} name="option_value" defaultValue={optionValue.option_value} onBlur={(e) => props.fieldOptionUpdate(e,optionValue.ID)}  style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />                              
                                                                                                            <DeleteIcon  onClick={() => props.deleteFieldOption(optionValue.ID)} />
                                                                                                            </div>
                                                                                                          );
                                                                                                })
                                                                                                        
                                                                                                } 
                                                                                      </div>       
                                                                        
                                                                      </div> 
                                                                      
                                                                      )
                                                                    }

                                                                if(fieldValue.input_type !== 'Question'){                            
                                                                  return (                                                          
                                                                                <div className="col-md-12 mb-3 mt-3"  key={fieldKey} >
                                                                                  <h4>Click Button For Add Multiple Option in {fieldValue.input_type} </h4>
                                                                                  <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={(e) => props.addNewFieldOption(e,fieldValue.ID)} >  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                                                            <PlusIcon />
                                                                                    </span></button>
                                                                                    <DeleteIcon  onClick={() => props.deleteFiled(fieldValue.ID,val.data.ID)} /> 																					   
                                                                                  <div className="row mb-4">                                                                                                                              
                                                                              {fieldValue.options.map((optionValue, optionKey) => {
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
                                                                                                                            
                                                                                                                              <label> <input type="text" id={option} name="name" defaultValue={optionValue.option_value}  onBlur={(e) => props.fieldOptionUpdate(e,optionValue.ID)}  style={{width: '80%' ,height:'30px',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />           
                                                                                                                              </label>
                                                                                                                              <DeleteIcon  onClick={() => props.deleteFieldOption(optionValue.ID)} />
                                                                                                                              <br />
                                                                                                                          </div>
                                                                                                                  )
                                                                                                          } else if (fieldValue.input_type === 'Checkbox Type Box') {                                                                                                                                          
                                                                                                            return (                                                                                                                                          
                                                                                                                    <div className="col-md-3 mt-2" id="checkBoxDesign" key={optionKey}> 
                                                                                                                    <DeleteIcon  onClick={() => props.deleteFieldOption(optionValue.ID)} />
                                                                                                                                                                                                      
                                                                                                                        <input id={checkBoxId} type="checkbox"   name="name" value={optionValue.option_value} />                                                                             
                                                                                                                            <label htmlFor={checkBoxId}>                                                                                 
                                                                                                                                <div className="serBox">
                                                                                                                                  <div className="row  row-eq-height" style={{height:'100px',marginRight:'0px',marginLeft:'0px'}}>
                                                                                                                                      <div className="col-md-12">                                                                                        
                                                                                                                                        <center>
                                                                                                                                          <img src={Vector1} alt="" style={{marginTop: '30px'}} />
                                                                                                                                          <img src={snowflake_1} alt="" style={{marginTop: '-17px'}} />
                                                                                                                                        </center>
                                                                                                                                      </div>                                              
                                                                                                                                  </div>
                                                                                                                                  <div className="row  row-eq-height" id="test" style={{height:'100px',marginRight:'0px',marginLeft:'0px'}}>
                                                                                                                                    <div className="col-md-12">
                                                                                                                                      <p><input type="text"    id={optionValueId} name="name" defaultValue={optionValue.option_value}  onBlur={(e) => props.fieldOptionUpdate(e,optionValue.ID)}  style={{width: '80%' ,color: 'black',height:'30px',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" /> </p>
                                                                                                                                    </div>                                              
                                                                                                                                  </div>                                                                                            
                                                                                                                                </div>
                                                                                                                              </label>
                                                                                                                            
                                                                                                                        </div>                                                                                                                                                          
                                                                                                                    );
                                                                                                          }else  if (fieldValue.input_type === 'Radio Type Button') {
                                                                                                            return (
                                                                                                              <div className="col-md-3 mb-3 mt-3" id="step5chk" key={optionKey}>                                                                               
                                                                                                                        <label> <input type="text" id={option} name="name" defaultValue={optionValue.option_value}  onBlur={(e) => props.fieldOptionUpdate(e,optionValue.ID)}  style={{width: '80%' ,height:'30px',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />           
                                                                                                                      </label>
                                                                                                                      <DeleteIcon  onClick={() => props.deleteFieldOption(optionValue.ID)} />
                                                                                                                    </div>
                                                                                                            )
                                                                                                          } else if (fieldValue.input_type === 'Radio Type Box') {                                                                                                                                    
                                                                                                            return (                                                                                                                                          
                                                                                                                    <div className="col-md-3 mt-2" id="ossStepRadio" key={optionKey}> 
                                                                                                                      <DeleteIcon  onClick={() => props.deleteFieldOption(optionValue.ID)} />                                                                       
                                                                                                                      <input id={radioId} type="radio"   name="name" value={optionValue.option_value} />                                                                             
                                                                                                                            <label htmlFor={radioId}>                                                                                 
                                                                                                                                <div className="serBox">
                                                                                                                                    <div className="row  row-eq-height" style={{height:'100px',marginRight:'0px',marginLeft:'0px'}}>
                                                                                                                                      <div className="col-md-12">                                                                                        
                                                                                                                                          <center>
                                                                                                                                            <img src={Vector1} alt="" style={{marginTop: '30px'}} />
                                                                                                                                            <img src={snowflake_1} alt="" style={{marginTop: '-17px'}} />
                                                                                                                                          </center>
                                                                                                                                      </div>                                              
                                                                                                                                    </div>
                                                                                                                                  <div className="row  row-eq-height" id="test" style={{height:'100px',marginRight:'0px',marginLeft:'0px'}}>
                                                                                                                                    <div className="col-md-12">
                                                                                                                                      <p><input type="text"    id={optionValueId} name="name" defaultValue={optionValue.option_value}  onBlur={(e) => props.fieldOptionUpdate(e,optionValue.ID)}  style={{width: '80%' ,color: 'black',height:'30px',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />  
                                                                                                                                      </p>
                                                                                                                                    </div>                                              
                                                                                                                                  </div>                                                                                            
                                                                                                                                </div>
                                                                                                                              </label>
                                                                                                                        </div>                                                                                                                                                           
                                                                                                                      );
                                                                                                          }else {
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
          <li> <button type="button" className="btn btn-primary btn-md btn-default-back" onClick={() => props.prevButtonClick()}>Back</button> </li>
          <li> <button type="button" onClick={() => props.nextButtonClick()} className="btn btn-primary btn-md btn-default">Next</button></li>
        </ul>

      </div>
    );
  });
};

const AppendStep = props => {
 
                          
  return props.tabStep.map((valnew, idx) => {
    let tabTitle = `tabTitle-${idx}`;
  
    
    return (
      <li className="nav-item" key={idx}>
        <a className={idx === 0 ? "nav-link active show" : "nav-link"} data-toggle="tab" href={"#tab-" + idx}>
        <DeleteIcon  onClick={() => props.deleteStep(valnew.data.ID)} />
         &nbsp;&nbsp;
          <div className="circle">{valnew.data.index}</div>
          <input type="text" className="input w-full border" onBlur={(e) => props.stepTitleUpdate(e,valnew.data.ID)} style={{ width: '70%', margin: '-9px 0px 0px 31px', position: 'absolute', background: '#ff000000' }} defaultValue={valnew.data.name} placeholder="Input Title" />
        </a>
      </li>
    );
  });
};
export { AppendStep, AppendFields };
