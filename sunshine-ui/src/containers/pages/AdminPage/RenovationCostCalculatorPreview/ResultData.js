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

    
    return props.tabStepResult.filter(item => item.data.table_type === 'Table 1' ).map((menu, index) => {  
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
                     
                         <td >
                         <textarea  className="input mt-2" id={result_title} name="result_title" onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index,'Table 1')}  style={{width: '100%',fontWeight: '900',border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} rows="4" cols="50" defaultValue={menu.data.result_title}>{menu.data.result_title}</textarea>
                             
                           </td>
                      
                        <td > 
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[0].cost_vat_xcl[index]}
                                            
                                            minQueryLength={1}  />

                           
                        </td>
                        <td ><input type="text" className="input mt-2" id={unit_vat_xcl} name="unit_vat_xcl" defaultValue={menu.data.unit_vat_xcl} onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index,'Table 1')}  style={{width: '100%',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                        
                        <td ><input type="text" className="input mt-2" id={vat} name="vat"  defaultValue={menu.data.vat} onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index,'Table 1')} style={{width: '100%',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                        
                        <td>  
                            
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[1].cost_vat_inc[index]}
                                           minQueryLength={1}  />

                          
                        </td>
                        
                        <td ><input type="text" className="input mt-2" id={unit_vat_inc} name="unit_vat_inc" defaultValue={menu.data.unit_vat_inc}  onBlur={(e) => props.resultValueUpdate(e,menu.data.ID,index,'Table 1')}  style={{width: '100%',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>
                      
                        <td>
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[2].total_vat_xcl[index]}
                                            minQueryLength={1}  />
                            
                            </td>
                       
                        <td>
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[3].total_vat_inc[index]}
                                             minQueryLength={1}  />
                            
                            </td>
                    </tr>
               
                
               );
      
            });
  
};


export { ResultData };
