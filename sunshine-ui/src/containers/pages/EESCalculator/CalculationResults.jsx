import React from 'react';
import {
  FormControl,
  Grid,
  TextField,
  Select,
  InputLabel,
  InputAdornment,
  FormHelperText,
} from '@material-ui/core';


function CalculationResults(props) {
  const { data,datalist } = props;

const appendList = () => {

 


}
  return (
    
    <React.Fragment>
      <div className="row" id="newdata">
      <button type="button" onClick={() => appendList()} className="btn btn-primary btn-md btn-default">Next</button>

      <NavigationButtons  datalist={datalist}/>

          <div className="col-md-4 mb-3">
          <label htmlFor="inputEmail4">&nbsp;</label><br/>
            <center>  <select className="select-country" name="location" id="location" style={{ background: 'none' ,width: '50%'}} required>
													<option value="+">+</option>
													<option value="-">-</option>
													<option value="*">*</option>
													<option value="/">/</option>
                          <option value="%">%</option>
												</select></center>
          </div>

          <NavigationButtons datalist={datalist}/>

         
     
    </div>
     </React.Fragment>
  );
}

function NavigationButtons(props) {
  const { datalist } = props;


    return (
      <>
       <div className="col-md-3 mb-3">
              <label htmlFor="inputEmail4">Type</label><br/>
              <select className="select-country" name="location" id="location" style={{ background: 'none' ,width: '100%'}} required>
                 <option value="" >Select</option>
                  { datalist.map((menu, index) => (
                           <optgroup label={menu.data.name} key={index}>
                              {menu.data.menu_sub_items.map((c, i) => (

                                        <option value="10" key={i}>{c.name}</option>
                                  ))}
                           </optgroup>
												
													
                          ))
                        }          
							</select>
          </div>
      </>
  );

}

export default CalculationResults;
