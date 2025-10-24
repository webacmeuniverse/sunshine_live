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
const ResultDataTable2 = props => {

    
  
  return props.tabStepResult.filter(item => item.data.table_type === 'Before' ).map((menu, index) => {  
        let first_year_value = `first_year_value-${index}`,
        unit_vat_xcl = `unit_vat_xcl-${index}`,
        cost_vat_inc = `cost_vat_inc-${index}`,
        unit_vat_inc = `unit_vat_inc-${index}`,
        vat = `vat-${index}`,
        total_vat_xcl = `total_vat_xcl-${index}`,
        total_vat_inc = `total_vat_inc-${index}`,
        result_title = `result_title-${index}`;

        return (               
                    <tr key={index}>                       
                        <td style={{ width: '20%'}}><input type="text" className="input mt-2" id={result_title} name="result_title"  defaultValue={menu.data.result_title} style={{width: '100%',fontSize: '15px',fontWeight: '900',borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}}  /></td>                      
                        <td style={{ width: '30%'}}> 
                        <ReactTags className="input mt-2"
                                            ref={props.reactTags}
                                            tags={props.tags[0].first_year_value[index]}
                                             minQueryLength={1}  />                        
                        </td>                        
                    </tr>                               
               );
      
            });
  
};


export { ResultDataTable2 };
