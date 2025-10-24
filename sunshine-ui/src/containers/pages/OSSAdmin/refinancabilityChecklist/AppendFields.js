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
import ProgressBar from '../../../../components/utils/ProgressBar';
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
                                  <div className="row mb-4">
                                    <div className="col-8 col-md-8 col-lg-8 mb-2" >
                                    <label>{props.t('translations:ossOnboardingTitle.Title')} </label>
                                    <input type="text" className="input mt-2" id={question} name="name" defaultValue={questionValue.name}  onBlur={(e) => props.questionUpdate(e,questionValue.ID,idx,questionKey)}  style={{width: '100%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />                      
                                    
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-2 mb-2" >
                                    <label>{props.t('translations:ossOnboardingTitle.Weightofq')}</label>
                                                        <input type="text" name="default_score"  defaultValue={questionValue.default_score} onBlur={(e) => props.questionDefaultScoreUpdate(e,questionValue.ID,idx,questionKey)} className="input mt-2" style={{width: '100%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Input text"/>
                                    </div>

                                    <div className="col-2 col-md-2 col-lg-2 mb-2" >
                                    <label><br></br></label>
                                    <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => props.addNewField(questionValue.ID)} title={props.t('translations:ossOnboardingTitle.AddQuestion')}><PlusIcon /></button>  
                                    </div>
                                  </div>
                                          
                                       
                                                
                                           
                                      
                                       
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
                                                                                    {/* <select className="select-country" name="default_score" id="cars" onChange={(e) => props.fieldUpdate(e,fieldValue.ID,idx,fieldKey,questionKey)} value={fieldValue.default_score}style={{ background: 'none', fontSize: '14px' }}>
                                                                                    <option value="0">0</option>
                                                                                    <option value="0.3">0.3</option>
                                                                                      <option value="0.2">0.2</option>
                                                                                      <option value="0.15">0.15</option>
                                                                                      <option value="0.5">0.5</option>
                                                                                      <option value="0.1">0.1</option>
                                                                                      <option value="0.05">0.05</option>
                                                                                      <option value="0.3">0.3</option>
                                                                                    </select> */}
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
                                                                                  
                                                                                    
                                                                                                         if (fieldValue.input_type === 'Radio Type Button') {
                                                                                                            return (
                                                                                                              <div className="col-md-6 mb-1 mt-1" id="step5chk" key={optionKey}>  
                                                                                                                             <div className="row mb-2"> 
                                                                                                                             <div className="col-md-2 mb-2 mt-1" style={{ textAlign: 'center' }}> 
                                                                                                                             <DeleteIcon  onClick={() => props.deleteFieldOption(optionValue.ID)} style={{position: 'absolute',top: '40%'}}/>
                                                                                                                             </div>
                                                                                                                             <div className="col-md-5 mb-2 mt-1">  
                                                                                                                             <label style={{     width: '100%',minWidth: '100%'}}> <input type="text" id={option} name="name" defaultValue={optionValue.option_value}  onBlur={(e) => props.fieldOptionUpdate(e,optionValue.ID)}  style={{width: '80%' ,height:'30px',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />           
                                                                                                                              </label>
                                                                                                                             </div>   
                                                                                                                             <div className="col-md-5 mb-2 mt-1">  
                                                                                                                             <p style={{ marginTop:'0px' }}>{props.t('translations:ossOnboardingTitle.Score')}</p>
                                                                                                                              <input type="text" name="default_score"  defaultValue={optionValue.default_score} onBlur={(e) => props.fieldOptionDefaultScoreUpdate(e,optionValue.ID)} className="input mt-2" style={{width: '100%' ,borderWidth: '1px' ,    padding: '0px',textAlign: 'center',border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Input text"/>
                                
                                                                                                                             </div>                                                               
                                                                                                                             </div> 
                                                                                                                     
                                                                                                                       
                                                                                                                        {/* <select className="select-country" name="default_score" id="cars" onChange={(e) => props.fieldOptionDefaultScoreUpdate(e,optionValue.ID)} value={optionValue.default_score}style={{ background: 'none', fontSize: '14px' }}>
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
                                                                                                                                </select>  */}
                                                                                                                      
                                                                                                                     
                                                                                                                     
                                                                                                                    </div>
                                                                                                            )
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
       
          {props.fetching ?
                                                <></>
                                                      :
                                                      <>
                                                       <DeleteIcon  onClick={() => props.deleteStep(valnew.data.ID)} />
         &nbsp;&nbsp;
          <div className="circle">{valnew.data.index}</div>
          <select className="select-country" name="default_score" id="cars" onChange={(e) => props.stepDefaultScoreUpdate(e,valnew.data.ID)} value={valnew.data.default_score}style={{ background: 'none', fontSize: '14px',border: 'solid 1px #BFD4E4' }}>
                                                                                    <option value="0">0</option>
                                                                                    <option value="0.1">0.1</option>
                                                                                    <option value="0.2">0.2</option>
                                                                                      <option value="0.3">0.3</option>
                                                                                      <option value="0.4">0.4</option>
                                                                                      <option value="0.5">0.5</option>
                                                                                      <option value="0.6">0.6</option>
                                                                                      <option value="0.7">0.7</option>
                                                                                     
                                                                                   
                                                                                    </select> 
          <input type="text" className="input w-full " onBlur={(e) => props.stepTitleUpdate(e,valnew.data.ID)} style={{ width: 'auto', margin: '-9px 0px 0px 0px', position: 'absolute',fontSize: '11px', background: '#ff000000',borderWidth: '1px',border: 'none',borderBottom: '0.89246px solid #BFD4E4' }} defaultValue={valnew.data.name} placeholder="Input Title" />
          </>
        }
          </a>
      </li>
    );
  });
};
export { AppendStep, AppendFields };
