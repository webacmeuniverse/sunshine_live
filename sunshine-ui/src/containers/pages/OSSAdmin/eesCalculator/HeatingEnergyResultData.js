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
const HeatingEnergyResultData = props => {

    
    return props.tabStepResult.filter(item => item.data.table_type === 'Heating Energy' ).map((menu, index) => {  
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
                         <td >
                         <textarea  className="input mt-2" id={result_title} name="result_title" onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index,'Heating Energy')}  style={{width: '100%',fontWeight: '900',border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} rows="4" cols="50">{menu.data.result_title}</textarea>
                             
                           </td>

                           <td>  
                            
                            <ReactTags className="input mt-2"
                                                ref={props.reactTags}
                                                tags={props.tagsHeatingEnergy[1].cost_vat_inc[index]}
                                                suggestions={props.suggestions}
                                                onDelete={(e) =>props.onDelete(e,props.tagsHeatingEnergy[1].cost_vat_inc[index]) } 
                                              
                                                onAddition={(e) =>props.onAdditionHeating(e,'cost_vat_inc',menu.data.ID,index) }minQueryLength={1}  />
    
                              
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
                      
                        <td ><input type="text" className="input mt-2" id={unit_vat_xcl} name="unit_vat_xcl" defaultValue={menu.data.unit_vat_xcl} onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index,'Heating Energy')}  style={{width: '100%',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                        
                        <td ><input type="text" className="input mt-2" id={vat} name="vat"  defaultValue={menu.data.vat} onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index,'Heating Energy')} style={{width: '100%',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                        <td > 
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tagsHeatingEnergy[0].cost_vat_xcl[index]}
                                            suggestions={props.suggestions}
                                            onDelete={(e) =>props.onDelete(e,props.tagsHeatingEnergy[0].cost_vat_xcl[index]) } 
                                          
                                            onAddition={(e) =>props.onAdditionHeating(e,'cost_vat_xcl',menu.data.ID,index) } minQueryLength={1}  />

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
                        
                        
                       
                        <td>
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tagsHeatingEnergy[2].total_vat_xcl[index]}
                                            suggestions={props.suggestions}
                                            onDelete={(e) =>props.onDelete(e,props.tagsHeatingEnergy[2].total_vat_xcl[index]) } 
                                          
                                            onAddition={(e) =>props.onAdditionHeating(e,'total_vat_xcl',menu.data.ID,index) } minQueryLength={1}  />
                            
                            </td>
                       
                        
                    </tr>
               
                
               );
      
            });
  
};


export { HeatingEnergyResultData };
