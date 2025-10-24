import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';


import ENDPOINTS from '../../../constants/endpoints';



class ResultGet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {     
      tabStepResult: [],     
      langSelected: "en",     
      tags: [
              {'cost_vat_xcl':[]},
              {'cost_vat_inc':[],},
              {'total_vat_xcl':[ ],},
              {'total_vat_inc':[], },
            ],   
    }
   
  }
 

  componentDidMount(){             
              this.resultDataGet();
    }

  resultDataGet(){
    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
  };
      fetch(ENDPOINTS.SERVER + '/step/result/', config)
      .then(res => res.json())
    // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
          (result) => {
            ;
            if (result.documents != null) {

              this.setState({
                tabStepResult: result.documents.filter(item => item.data.oss_admin_id == this.props.ossEmail && item.data.lang == this.props.language)
            })
                  
                               

                  let cost_vat_xcl_array = [];
                  let cost_vat_inc_array = [];


                  let total_vat_inc_array = [];
                  let total_vat_xcl_array = [];
                  
                    {this.state.tabStepResult.sort((a, b) => a.data.CreatedAt > b.data.CreatedAt ? 1:-1).map((stepVal, stepValindex) => {
                     
                      cost_vat_xcl_array[stepValindex] =[]
                      cost_vat_inc_array[stepValindex] =[]
                      total_vat_inc_array[stepValindex] =[]
                      total_vat_xcl_array[stepValindex] =[]
                    
                      {stepVal.data.cost_vat_xcl.map((nameArrVal, nameArrIndex) => {
                       
                          cost_vat_xcl_array[stepValindex][nameArrIndex]={ id: nameArrVal.field_id, name: nameArrVal.field_name,field_id:nameArrVal.id };
                      
                      })}

                      {stepVal.data.cost_vat_inc.map((nameArrVal1, nameArrIndex1) => {
                       
                        cost_vat_inc_array[stepValindex][nameArrIndex1]={ id: nameArrVal1.field_id, name: nameArrVal1.field_name ,field_id:nameArrVal1.id};
                      
                       })}

                       {stepVal.data.total_vat_inc.map((nameArrVal2, nameArrIndex2) => {
                       
                        total_vat_inc_array[stepValindex][nameArrIndex2]={ id: nameArrVal2.field_id, name: nameArrVal2.field_name ,field_id:nameArrVal2.id};
                      
                       })}

                       {stepVal.data.total_vat_xcl.map((nameArrVal3, nameArrIndex3) => {
                       
                        total_vat_xcl_array[stepValindex][nameArrIndex3]={ id: nameArrVal3.field_id, name: nameArrVal3.field_name ,field_id:nameArrVal3.id};
                      
                       })}

                     
                     
                 })}

                
                 this.state.tags[0].cost_vat_xcl =cost_vat_xcl_array
                 this.state.tags[1].cost_vat_inc =cost_vat_inc_array
                 this.state.tags[2].total_vat_xcl =total_vat_xcl_array
                 this.state.tags[3].total_vat_inc =total_vat_inc_array
                          this.forceUpdate()
            
                    this.setState({
                      tabStepResult: this.state.tabStepResult.filter(item => item.data.oss_admin_id == this.props.ossEmail && item.data.lang == this.props.language)
                  })
                  
                 
                  
                }

          },
          
      )
}




  render() {
   
    const { userdata,language,ossEmail } = this.props;
    let { bookDetails,tabStep ,tabStepResult,tags,suggestions,newTag,tags2,table2Tags,suggestionsTable2,tabStepResultTable2} = this.state;

    
    return (
      <React.Fragment>
        
       
          
        <div className="flex">
         
        </div>
      </React.Fragment>
    );

  }
}

export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
}))(ResultGet);
