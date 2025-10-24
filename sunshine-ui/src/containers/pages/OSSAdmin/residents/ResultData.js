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
import ReactTags from 'react-tag-autocomplete'
import './style.css';
const ResultData = props => {

    
  
    return props.tabStepResult.sort((a, b) => a.data.index > b.data.index ? 1:-1).map((menu, index) => {  
        let cost_vat_xcl = `cost_vat_xcl-${index}`,
        unit_vat_xcl = `unit_vat_xcl-${index}`,
        cost_vat_inc = `cost_vat_inc-${index}`,
        unit_vat_inc = `unit_vat_inc-${index}`,
        vat = `vat-${index}`,
        total_vat_xcl = `total_vat_xcl-${index}`,
        total_vat_inc = `total_vat_inc-${index}`,
        result_title = `result_title-${index}`;
        return (
        
       
                    <tr key={index}>
                        <td >  <DeleteIcon  style={{ width: '2em',height: '2em'}}onClick={() => props.deleteResultRow(menu.data.ID)} /></td>
                         <td style={{ width: '20%'}}><input type="text" className="input mt-2" id={result_title} name="result_title" onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index)} defaultValue={menu.data.result_title} style={{width: '100%',fontSize: '15px',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                      
                        <td style={{ width: '30%'}}> 
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[0].cost_vat_xcl[index]}
                                            suggestions={props.suggestions}
                                            onDelete={(e) =>props.onDelete(e,props.tags[0].cost_vat_xcl[index]) } 
                                          
                                            onAddition={(e) =>props.onAddition(e,'cost_vat_xcl',menu.data.ID) } minQueryLength={1}  />

                            {/* <select className="select-country" id={cost_vat_xcl} name="cost_vat_xcl" defaultValue={menu.data.cost_vat_xcl} onChange={(e) => props.resultValueUpdate(e,menu.data.ID,index)} id={cost_vat_xcl} style={{ background: 'none',width: '100%',fontSize: '15px',fontWeight: '900'}}  >
                                <option value="">Select</option>
                                {props.tabStep.map((stepVal, stepValindex) => {
                                            return (
                                            <optgroup key={index} label={stepVal.data.name}>
                                              
                                              {stepVal.data.step_fields.map((filedVal, filedValindex) => {
                                                    return (
                                                        <option key={filedValindex} value={filedVal.ID}>{filedVal.name}</option>
                                                        );
                                                    })}
                                            </optgroup>
                                            );
                                        })}                                                           
                                </select> */}
                        </td>
                        <td style={{ width: '10%'}}><input type="text" className="input mt-2" id={unit_vat_xcl} name="unit_vat_xcl" defaultValue={menu.data.unit_vat_xcl} onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index)}  style={{width: '100%',fontSize: '15px',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                        
                        <td style={{ width: '10%'}}><input type="text" className="input mt-2" id={vat} name="vat"  defaultValue={menu.data.vat} onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index)} style={{width: '100%',fontSize: '15px',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                        
                        <td>  
                            
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[1].cost_vat_inc[index]}
                                            suggestions={props.suggestions}
                                            onDelete={(e) =>props.onDelete(e,props.tags[1].cost_vat_inc[index]) } 
                                          
                                            onAddition={(e) =>props.onAddition(e,'cost_vat_inc',menu.data.ID) }minQueryLength={1}  />

                          
                             {/* <select className="select-country" id={cost_vat_inc} name="cost_vat_inc" defaultValue={menu.data.cost_vat_inc} onChange={(e) => props.resultValueUpdate(e,menu.data.ID,index)} id={cost_vat_xcl} style={{ background: 'none',width: '100%',fontSize: '15px',fontWeight: '900'}}  >
                                <option value="">Select</option>
                                {props.tabStep.map((stepVal, stepValindex) => {
                                            return (
                                            <optgroup key={index} label={stepVal.data.name}>
                                              
                                              {stepVal.data.step_fields.map((filedVal, filedValindex) => {
                                                    return (
                                                        <option key={filedValindex} value={filedVal.name}>{filedVal.name}</option>
                                                        );
                                                    })}
                                            </optgroup>
                                            );
                                        })}                                                           
                                </select> */}
                        </td>
                        
                        <td style={{ width: '10%'}}><input type="text" className="input mt-2" id={unit_vat_inc} name="unit_vat_inc" defaultValue={menu.data.unit_vat_inc}  onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index)}  style={{width: '100%',fontSize: '15px',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                      
                        <td>
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[2].total_vat_xcl[index]}
                                            suggestions={props.suggestions}
                                            onDelete={(e) =>props.onDelete(e,props.tags[2].total_vat_xcl[index]) } 
                                          
                                            onAddition={(e) =>props.onAddition(e,'total_vat_xcl',menu.data.ID) } minQueryLength={1}  />
                            
                            </td>
                       
                        <td>
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[3].total_vat_inc[index]}
                                            suggestions={props.suggestions}
                                            onDelete={(e) =>props.onDelete(e,props.tags[3].total_vat_inc[index]) } 
                                          
                                            onAddition={(e) =>props.onAddition(e,'total_vat_inc',menu.data.ID) } minQueryLength={1}  />
                            
                            </td>
                    </tr>
               
                
               );
      
            });
  
};


export { ResultData };
