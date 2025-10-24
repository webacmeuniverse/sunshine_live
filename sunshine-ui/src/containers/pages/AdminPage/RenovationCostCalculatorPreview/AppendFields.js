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
const BookList = props => {
  return
};
const AppendFields = props => {


  return props.tabStep.sort((a, b) => a.data.CreatedAt > b.data.CreatedAt ? 1:-1).map((val, idx) => {
    let tabTitle = `tabTitleSub-${idx}`;
   
    return (
      <div className={idx === 0 ? "tab-pane active show" : "tab-pane"} id={"tab-" + idx} key={val.data.ID}>

        <div className="row mb-4">
          <div className="col-12 col-md-12 col-lg-12">
            <h2 className="mt-3" style={{ fontSize: '21.2266px' }}>{val.data.name} </h2>
          </div>
        </div>

        <div className="row" id="getTouch"  key={idx}>
        {val.data.step_fields.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((subval, fieldidx) => {
         
            let title = `title-${fieldidx}`,
              placeholder = `placeholder-${fieldidx}`,
              inputType = `inputType-${fieldidx}`,
              filedName = `filedName-${fieldidx}`;
            return (
              <div className="col-md-6 mb-2 mt-3" key={fieldidx} id="textBoxDiv1">
                 <label htmlFor="inputEmail4">{subval.name}
                                                                                                                  {(() => {
                                                                                                                      if (subval.require == true) {
                                                                                                                          return "*";
                                                                                                                      }
                                                                                                                  })()}
                                                                                                              </label>
                   
                 <br />
                <input type="text" className="input mt-2" id={placeholder} name="placeholder"  style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder={subval.placeholder} />
                
                 
              </div>
            )
          })

          } 

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
 
  let ggg = 1            
  return props.tabStep.sort((a, b) => a.data.CreatedAt > b.data.CreatedAt ? 1:-1).map((valnew, idx) => {
    let tabTitle = `tabTitle-${idx}`;
    {valnew.data.name}
    return (
      <li className="nav-item" key={idx}>
        <a className={idx === 0 ? "nav-link active show" : "nav-link"} data-toggle="tab" href={"#tab-" + idx} style={{     lineHeight: '20px' }}>
       
        <div className="nav-item-title" style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'600',fontsize:'11.50833px',lineHeight:'11px',color:'rgba(35, 31, 32, 0.5)'  }}><div className="circle">{ggg++}</div>&nbsp;&nbsp;{valnew.data.name}</div>
            </a>
      </li>
    );
  });
};
export { AppendStep, AppendFields };
