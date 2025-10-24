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
                     <input type="text"   className="input mt-2" id={filedName} name="name" defaultValue={subval.name} onBlur={(e) => props.textBoxChange(e,subval.ID,idx,fieldidx)}  style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="Title" />                      
                                         
                 <DeleteIcon  onClick={() => props.delete(subval.ID,val.data.ID)} />
                 <br />
                <input type="text" className="input mt-2" id={placeholder} name="placeholder" defaultValue={subval.placeholder} onBlur={(e) => props.textBoxChange(e,subval.ID,idx,fieldidx)} style={{width: '50%' ,borderWidth: '1px' ,border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} placeholder="placeholder" />
                <select className="select-country" name="text_number" id={inputType} style={{ background: 'none' }} required="" onChange={(e) => props.textBoxChange(e,subval.ID,idx,fieldidx)} defaultValue={subval.text_number}>
                  <option value="text"> Text </option>
                  <option value="number">Number</option>
                </select>
                  <div className="flex items-center text-gray-700 dark:text-gray-500 mt-2" style={{ display: 'inline-block' }}>
                         <input type="checkbox" className="input border mr-2" checked={subval.require}  id="vertical-checkbox-chris-evans" defaultValue={subval.require} name="require" onChange={(e) => props.textBoxChange(e,subval.ID,idx,fieldidx)}/>
                          <label className="cursor-pointer select-none" htmlFor="vertical-checkbox-chris-evans">Is Required</label>
                   </div>
              </div>
            )
          })

          } 

        </div>
        <div className="row" >
          <div className="col-md-6">
              <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => props.add(idx)} >
                              <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                <PlusIcon />
                                 </span>
                </button>

           
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
 
  let ggg = 1            
  return props.tabStep.sort((a, b) => a.data.CreatedAt > b.data.CreatedAt ? 1:-1).map((valnew, idx) => {
    let tabTitle = `tabTitle-${idx}`;
    
    return (
      <li className="nav-item" key={idx}>
        <a className={idx === 0 ? "nav-link active show" : "nav-link"} data-toggle="tab" href={"#tab-" + idx} style={{     lineHeight: '20px' }}>
        <DeleteIcon  onClick={() => props.deleteStep(valnew.data.ID)} />
         &nbsp;&nbsp;
          <div className="circle">{ggg++}</div>
          {props.fetching ? <></>:
          <input type="text" className="input w-full" onBlur={(e) => props.stepTitleUpdate(e,valnew.data.ID)} style={{ width: '70%', margin: '-9px 0px 0px 31px', position: 'absolute', background: '#ff000000',borderWidth: '1px',border: 'none',borderBottom: '0.89246px solid #BFD4E4'}} defaultValue={valnew.data.name} placeholder="Input Title" />
               }
          </a>
      </li>
    );
  });
};
export { AppendStep, AppendFields };
