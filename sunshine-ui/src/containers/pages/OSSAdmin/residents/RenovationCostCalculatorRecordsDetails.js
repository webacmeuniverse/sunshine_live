import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import ENDPOINTS from '../../../../constants/endpoints';
// COMPONENTS
import { Helmet } from 'react-helmet';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../../smartcomponents/ossMobileNavContainer';
import TopBar from '../../../../components/ossnavigation/TopBar';



class RenovationCostCalculatorRecordsDetails extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      userInputDataGet: [],


    }

  }
  componentDidMount() {

    this.userListGet();

  }
  userListGet() {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };
console.log(ENDPOINTS.SERVER + '/renovation/calc/input/' + this.props.match.params.id);

    fetch(ENDPOINTS.SERVER + '/renovation/calc/input/' + this.props.match.params.id, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {
            this.setState({
              userInputDataGet: [result],

            })

          } else {

            // alert({
            //   text: 'data not available',
            //   type: 'success',
            //   delay: 800,
            //   closer: true
            // });

          }



        },

      ).catch(error => {

        // alert({
        //   text: 'data not available',
        //   type: 'error',
        //   delay: 800,
        //   closer: true

        // });
      });
  }

  resultTabChange = (evt, cityName) => {

    let i = '';

    let tabcontent = '';
    let tablinks = '';


    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

  }
  runCallback = (cb) => {
    return cb();
  };
  render() {
    const {
      alerts,
      match,
      myUserData,
      publicUserData,
      userdata,
      loadingUser,
      t,
      ossAdmin,
    } = this.props;



    return (
      <div style={{ height: '100%' }}>

        <Helmet title='User Profile | SUNShINE' >
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size:14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
        <MobileNavContainer />
        <div className="flex">
          <NavContainer formName='profileUpdate' />
          <div className="content oss-admin">
            <TopBar pageTitleAction="/oss/onboarding/records" subTitleAction="" userdata={userdata} pageTitle='translations:ossMenu.Records' subTitle='translations:ossMenu.Answer' />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <section style={{ marginTop: '10px', marginBottom: '0px' }}    >
                  <div className="container oss-admin h-auto">

                    <div className="grid grid-cols-12 gap-6">


                      <div className="intro-y col-span-12 md:col-span-12">
                        <div className="box">

                          <div className="flex flex-wrap lg:flex-no-wrap items-center justify-center p-5">
                            <div className="w-full  mb-4 lg:mb-0 mr-auto">
                              <h2 className="text-lg font-bold mr-auto">{t('translations:ossOnboardingTitle.BasicInformation')} </h2>
                              <hr />
                              {this.state.userInputDataGet.map((data, index) => {
                                return (
                                  <>

                                    <div className="grid grid-cols-12 gap-1 mt-5 mb-5">
                                      <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                        <label>{t('translations:recordsTitle.Name')}</label>
                                        <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{data.name === '' ? data.session : data.name} </div>
                                      </div>
                                      <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                        <label>{t('translations:recordsTitle.Surname')} </label>
                                        <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{data.surname}</div>
                                      </div>

                                      <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                        <label>{t('translations:recordsTitle.NameofOrganization')} </label>
                                        <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{data.org_name}</div>
                                      </div>

                                      <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                        <label>{t('translations:recordsTitle.Email')}</label>
                                        <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{data.email} </div>
                                      </div>

                                      <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                        <label>{t('translations:recordsTitle.Country')}</label>
                                        <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{data.country}</div>
                                      </div>
                                      <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                        <label>{t('translations:recordsTitle.City')}</label>
                                        <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{data.city}</div>
                                      </div>
                                      <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                        <label>{t('translations:recordsTitle.Time')} </label>
                                        <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{data.CreatedAt}  </div>
                                      </div>
                                    </div>


                                    <h2 className="text-lg font-bold mr-auto">{t('translations:ossOnboardingTitle.QuestionAnswer')}</h2>
                                    <hr />
                                    <div className="grid grid-cols-12 gap-1 mt-5 mb-5">
                                      {data.calculation_input.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((c, i) => {
                                        let ghjkk = i + 1;
                                        return (
                                          <>
                                            <div className="col-span-12 sm:col-span-4 xxl:col-span-4 box p-1">
                                              <label>{c.ees_field_title}</label>
                                              <div className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>{c.ees_field_value}</div>
                                            </div>


                                          </>
                                        );
                                      })}
                                    </div>

                                    <h2 className="text-lg font-bold mr-auto">{t('translations:financialCalculator.titles.results')}</h2>
                                    <hr />
                                    <div className="row">
                                      <div className="col-md-12 mb-2" id="esscaltab" style={{ overflow: 'auto' }}>
                                        <div className="tab">
                                          <button type="button" className="tablinks active" onClick={(e) => this.resultTabChange(e, 'Table1')} >{t('translations:ossOnboardingTitle.Totalcosts')}</button>
                                          <button type="button" className="tablinks" onClick={(e) => this.resultTabChange(e, 'Table2')} >{t('translations:ossOnboardingTitle.Energyindicators')}</button>
                                          <button type="button" className="tablinks" onClick={(e) => this.resultTabChange(e, 'YEARLYDISTRIBUTIONOFCOSTS')}   >{t('translations:ossOnboardingTitle.beforerenovation')}</button>
                                          <button type="button" className="tablinks" onClick={(e) => this.resultTabChange(e, 'table4')}   >{t('translations:ossOnboardingTitle.afterrenovation')}</button>

                                        </div>
                                      </div>
                                    </div>

                                    <div className="row">
                                      <div className="col-md-12 mb-3" id="esscaltab">
                                        <div id="Table1" className="tabcontent" style={{ display: 'block' }}>

                                          {/* <ResultGet this.props.language={this.props.language} ossEmail={ossEmail}/> */}

                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Title')}</th>
                                                <th scope="col"> {t('translations:essCalculaterResultTableTitle.Costunitexclvat')}</th>
                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.VAT')}</th>
                                                <th scope="col"> {t('translations:essCalculaterResultTableTitle.Costunitinclvat')}</th>

                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Unit')}</th>

                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Totalsexclvat')}</th>
                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Totalinclvat')}</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {data.get_res_tbl_1.filter(item => item.table_type === 'Table 1').map((menu, index) => (
                                                <tr key={index}>
                                                  <td>{menu.result_title}
                                                  </td>
                                                  <td>{menu.cost_vat_xcl}</td>
                                                  <th>{menu.vat}</th>

                                                  <td>{menu.cost_vat_inc}</td>
                                                  <td>{menu.unit_vat_inc}</td>
                                                  <td>{menu.total_vat_xcl}</td>
                                                  <td style={{ background: '#FE9B00', border: '0.752825px solid #F18419', color: '#FFFFFF' }}>
                                                    {menu.total_vat_inc}</td>
                                                </tr>
                                              ))
                                              }
                                            </tbody>

                                          </table>
                                        </div>

                                        <div id="Table2" className="tabcontent">

                                          {/* <ResultGet this.props.language={this.props.language} ossEmail={ossEmail}/> */}

                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Title')}</th>
                                                <th scope="col"> %</th>
                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Unit')} </th>
                                                <th scope="col"> {t('translations:essCalculaterResultTableTitle.VAT')}</th>

                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.TariffinclVAT')}</th>

                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.EnergyuseforBuilding')}</th>

                                              </tr>
                                            </thead>
                                            <tbody>



                                              {data.get_res_tbl_1.filter(item => item.table_type === 'Heating Energy').map((menu, index) => (
                                                <tr key={index}>
                                                  <td>{menu.result_title}
                                                  </td>
                                                  <td>{menu.cost_vat_inc}</td>
                                                  <th>{menu.unit_vat_xcl}</th>

                                                  <td>{menu.vat}</td>
                                                  <td>{menu.cost_vat_xcl}</td>
                                                  <td style={{ background: '#FE9B00', border: '0.752825px solid #F18419', color: '#FFFFFF' }}>{menu.total_vat_xcl}</td>

                                                </tr>
                                              ))
                                              }

                                            </tbody>

                                          </table>
                                        </div>
                                        <div id="YEARLYDISTRIBUTIONOFCOSTS" className="tabcontent">
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Years')} </th>

                                                {this.runCallback(() => {
                                                  const row = [];
                                                  for (var i = 1; i <= data.before_renovation_year; i++) {
                                                    row.push(<th scope="col" key={i}>{i}</th>);

                                                  }
                                                  return row;
                                                })}

                                              </tr>
                                            </thead>
                                            <tbody>
                                              {data.get_result_tbl_2.filter(item => item.table_type === 'Before').map((menu, index) => (
                                                <tr key={index}>
                                                  <td>{menu.result_title} </td>
                                                  {menu.year_value.map((menu1, index1) => (
                                                    <td>{menu1.value}</td>
                                                  ))}
                                                </tr>

                                              ))
                                              }
                                            </tbody>
                                          </table>
                                        </div>

                                        <div id="table4" className="tabcontent">
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th scope="col">{t('translations:essCalculaterResultTableTitle.Years')} </th>

                                                {this.runCallback(() => {
                                                  const row = [];
                                                  for (var i = 1; i <= data.after_renovation_year; i++) {
                                                    row.push(<th scope="col" key={i}>{i}</th>);

                                                  }
                                                  return row;
                                                })}

                                              </tr>
                                            </thead>
                                            <tbody>
                                              {data.get_result_tbl_2.filter(item => item.table_type === 'After').map((menu, index) => (
                                                <tr key={index}>
                                                  <td>{menu.result_title} </td>
                                                  {menu.year_value.map((menu1, index1) => (
                                                    <td>{menu1.value}</td>
                                                  ))}
                                                </tr>

                                              ))
                                              }
                                            </tbody>
                                          </table>
                                        </div>



                                      </div>
                                    </div>

                                  </>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}



export default withRouter(withTranslation('translations')(connect(
  state => ({
    userIsLogged: state.user.isAuthenticated,
    myUserData: state.user.profileInfo,

    loadingUser: state.user.isFetching,

    alerts: state.alerts.pending,
    userdata: state.user.profileInfo.data,
    ossAdmin: state.user.profileInfo.data.is_oss_admin,
  }),

)(withTranslation('translations')(RenovationCostCalculatorRecordsDetails))));
