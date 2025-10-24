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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
                                      <h4 className="mb-2">{props.t('translations:ossOnboardingTitle.Title')} {questionKey + 1}  <DeleteIcon  onClick={() => props.questionDelete(questionValue.ID)} /></h4>
                                      <hr></hr>
                                    </div>
                                  <div className="col-12 col-md-12 col-lg-12 mb-2" >
                                        <input type="text" className="input mt-2" id={question} name="name" defaultValue={questionValue.name}  onBlur={(e) => props.questionUpdate(e,questionValue.ID,idx,questionKey)}  style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />                      
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                       
                                        <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => props.addNewField(questionValue.ID)} title={props.t('translations:ossOnboardingTitle.AddQuestion')}><PlusIcon /></button>  
                                  </div>                                 
                              
                              {questionValue.step_fields.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((fieldValue, fieldKey) => {
                                                            let question      = `question-${fieldKey}`,
                                                                checkboxValue = `checkboxValue-${fieldKey}`,
                                                                filedType     = `filedType-${idx}`,
                                                                divValue      = `divValue-${fieldKey}`,
                                                                title         = `title-${fieldKey}`,
                                                                placeholder   = `placeholder-${fieldKey}`,
                                                                inputType     = `inputType-${fieldKey}`;

                                                               


                                                                if(fieldValue.input_type !== 'Question'){                            
                                                                  return (     
                                                                    < >   
                                                                        <div className="col-12 col-md-12 col-lg-12 mb-4" >
                                                                            <h4 className="mb-2">{props.t('translations:ossOnboardingTitle.Question')} {fieldKey + 1}  </h4>
                                                                            <hr></hr>
                                                                          </div> 
                                                                      <div className="col-12 col-md-12 col-lg-12 mb-2" >
                                                                      <CKEditor id={question} name="name" 
                                                                                editor={ ClassicEditor }
                                                                                data={fieldValue.name}
                                                                                onReady={ editor => {
                                                                                    // You can store the "editor" and use when it is needed.
                                                                                   
                                                                                } }
                                                                                onChange={ ( event, editor ) => {
                                                                                    const data = editor.getData();
                                                                                   
                                                                                } }
                                                                                onBlur={(e, editor) => props.ckEditorUpdateFiledData(e,fieldValue.ID,idx,fieldKey,questionKey,editor.getData()) }
                                                                                onFocus={ ( event, editor ) => {
                                                                                   
                                                                                } }
                                                                            />
                                                                                   &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                
                                                                                  <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={(e) => props.addNewFieldOption(e,fieldValue.ID)} >  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                                                        <PlusIcon />
                                                                                    </span></button>

                                                                                    <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => props.deleteFiled(fieldValue.ID,val.data.ID)}>  
                                                                                    <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                                                    <DeleteIcon  /> 	
                                                                                    </span></button>
                                                                                    <select className="select-country" name="default_score" id="cars" onChange={(e) => props.fieldUpdate(e,fieldValue.ID,idx,fieldKey,questionKey)} value={fieldValue.default_score}style={{ background: 'none', fontSize: '14px' }}>
                                                                                    <option value="0">0</option>
                                                                                      <option value="1">1</option>
                                                                                      <option value="2">2</option>
                                                                                      <option value="3">3</option>
                                                                                      <option value="4">4</option>
                                                                                      <option value="5">5</option>
                                                                                      <option value="6">6</option>
                                                                                      <option value="7">7</option>
                                                                                      <option value="8">8</option>
                                                                                      <option value="9">9</option>
                                                                                      <option value="10">10</option>
                                                                                    </select>
                                                                            </div>                                      
                                                                                <div className="col-12 col-md-12 col-lg-12 mb-2"  >
                                                                              
                                                                                 
                                                                                   																				   
                                                                                  <div className="row mb-4">                                                                                                                              
                                                                              {fieldValue.options.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((optionValue, optionKey) => {
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
                                                                     </>

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
 
                          
  return props.tabStep.map((valnew, idx) => {
    let tabTitle = `tabTitle-${idx}`;
  
    
    return (
      <li className="nav-item" key={idx}>
        <a className={idx === 0 ? "nav-link active show" : "nav-link"} data-toggle="tab" href={"#tab-" + idx} style={{     lineHeight: '20px' }}>
        <DeleteIcon  onClick={() => props.deleteStep(valnew.data.ID)} />
         &nbsp;&nbsp;
          <div className="circle">{valnew.data.index}</div>
          {props.fetching ?
                                                   <></>
                                                      :
          <input type="text" className="input w-full " onBlur={(e) => props.stepTitleUpdate(e,valnew.data.ID)} style={{ width: '80%', margin: '-9px 0px 0px 9px', position: 'absolute', background: '#ff000000',borderWidth: '1px',border: 'none',borderBottom: '0.89246px solid #BFD4E4' }} defaultValue={valnew.data.name} placeholder="Input Title" />
                }
          </a>
      </li>
    );
  });
};
export { AppendStep, AppendFields };
