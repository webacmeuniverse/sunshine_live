
import LandingPage from '../containers/pages/LandingPage/LandingPage';
import EESCalculator from '../containers/pages/EESCalculator/EESCalculator';
import Matchmaking from '../containers/pages/Matchmaking/MatchmakingView';
import FindMyPartner from '../containers/pages/FindMyPartner/FindMyPartnerView';
import FindMyPartnerDetails from '../containers/pages/FindMyPartner/FindMyPartnerDetails_old';
import EESRefinancabilityChecklist from '../containers/pages/EESRefinancabilityChecklist/EESRefinancabilityChecklist';
import MarketOperator from '../containers/pages/marketOperator/MarketOperator';
import ServiceOperatorChecklist from '../containers/pages/serviceOperatorChecklist/ServiceOperatorChecklist';
import ServicesProvider from '../containers/pages/ServicesProvider/ServicesProviderView';
import HomePage from '../containers/pages/HomePage/HomePage';

import NationalBenchmarking from '../containers/pages/HomePage/NationalBenchmarking';

import LoginPage from '../containers/pages/LoginPage/LoginPage';
import RegisterPage from '../containers/pages/RegisterPage/RegisterPage';
import ProfilePage from '../containers/pages/ProfilePage/ProfilePage';
import OrganizationsPage from '../containers/pages/OrganizationsPage/OrganizationsPage';
import AssetsPage from '../containers/pages/AssetsPage/AssetsPage';
import ProjectsPage from '../containers/pages/ProjectsPage/ProjectsPage';
import SingleOrganization from '../containers/pages/SingleOrganization/SingleOrganization';
import AssetPage from '../containers/pages/AssetPage/AssetPage';

import AssetEnergyCertificatePage from '../containers/pages/AssetEnergyCertificatePage/EnergyCertificatePage';
import AdminAssetEnergyCertificatePage from '../containers/pages/AssetEnergyCertificatePage/AdminEnergyCertificatePage';

import ProjectPage from '../containers/pages/ProjectPage/ProjectPage';
import ForgotPasswordPage from '../containers/pages/ForgotPasswordPage/ForgotPasswordPage';
import AdminPage from '../containers/pages/AdminPage/AdminPage';
import OrganizationMeetingPage from '../containers/pages/OrganizationMeetingPage/OrganizationMeetingPage';
import ConfirmUser from '../containers/pages/ConfirmUser/ConfirmUser';
import PageNotFound from '../containers/pages/PageNotFound/PageNotFound';
import EnergyCalculatorPage from '../containers/pages/EnergyCalculatorPage';
import BuildingCalculator from '../containers/pages/BuildingCalculator';
import FinancialCalculatorPage from '../containers/pages/FinancialCalculatorPage';
import ProfileNotificationsPage from '../containers/pages/ProfileNotificationsPage';
import ReportsPage from '../containers/pages/ReportsPage';
import BenchmarkingPage from '../containers/pages/BenchmarkingPage';
import { countryCodesCountries } from '../constants/countries';
import FAQ from '../containers/pages/FAQ';
import Resources from '../containers/pages/Resources';
// OSS Admin
import OSSAdmin from '../containers/pages/OSSAdmin/Dashboard/DashboardPage';
import OSSProfile from '../containers/pages/OSSAdmin/profile/ProfilePage';
import OSSAssets from '../containers/pages/OSSAdmin/assets/AssetsPage';
import OSSProjects from '../containers/pages/OSSAdmin/projects/ProjectsPage';
import OSSEESCalculator from '../containers/pages/OSSAdmin/eesCalculator/EESCalculatorPage';
import OnboardingResidents from '../containers/pages/OSSAdmin/residents/MainPage';
import OSSRefinancabilityChecklist from '../containers/pages/OSSAdmin/refinancabilityChecklist/MainPage';
import OnboardingResidentsRecords from '../containers/pages/OSSAdmin/residents/Records';
import OnboardingResidentsRecordsDetails from '../containers/pages/OSSAdmin/residents/RecordsDetails';
import RenovationCostCalculatorRecordsDetails from '../containers/pages/OSSAdmin/residents/RenovationCostCalculatorRecordsDetails';
import OnboardingBackup from '../containers/pages/OSSAdmin/residents/Backup';
import SimulationToolsRecords from '../containers/pages/OSSAdmin/eesChecklist/Records';
import SimulationToolsRecordsDetails from '../containers/pages/OSSAdmin/eesChecklist/RecordsDetails';
import SimulationToolsBackup from '../containers/pages/OSSAdmin/eesChecklist/Backup';
import OSSEESChecklist from '../containers/pages/OSSAdmin/eesChecklist/MainPage';
import OnboardingHousingAssociation from '../containers/pages/OSSAdmin/housingAssociation/MainPage';
import Support from '../containers/pages/OSSAdmin/Support';
import UserSupport from '../containers/pages/userSupport/Support';
import OnboardingResident from '../containers/pages/OnboardingResident/OnboardingResident';
import UserEESChecklist from '../containers/pages/UserEESChecklist/EESChecklist';
import OnboardingPreview from '../containers/pages/OSSAdmin/residents/preview/OnboardingResident';
import OnboardingOperatorPreview from '../containers/pages/OSSAdmin/residents/preview/Operator/MarketOperator';
import EESChecklistPreview from '../containers/pages/OSSAdmin/eesChecklist/preview/EESChecklist';
import EESRefinancabilityChecklistPreview from '../containers/pages/OSSAdmin/refinancabilityChecklist/preview/EESRefinancabilityChecklist';
//Go to my project
import MagicLink from '../containers/pages/MagicLink/MagicLink';
import SignupOTP from '../containers/pages/MagicLink/SignupOTP';
// Admin
import AdminOnboardingPage from '../containers/pages/AdminPage/OnboardingPage';
import AdminSimulationTools from '../containers/pages/AdminPage/SimulationTools';
import AdminOnboardingPreview from '../containers/pages/AdminPage/OnboardingPreview';
import AdminOnboardingOperatorPreview from '../containers/pages/AdminPage/OperatorPreview';
import AdminRefinancabilityChecklistPreview from '../containers/pages/AdminPage/RefinancabilityChecklist';
import AdminEESChecklistPreview from '../containers/pages/AdminPage/EESChecklist';

import AdminRenovationCostCalculatorPreview from '../containers/pages/AdminPage/RenovationCostCalculator';

const matchConfig = [
 {
    path: '/dashboard',
    component: OSSAdmin,
    
  },
  {
    path: '/residents',
    component: OnboardingResident,
    public: true,
  },
  {
    path: '/national-benchmarking',
    component: NationalBenchmarking,
    public: true,
  },
  {
    path: '/ees-checklist',
    component: UserEESChecklist,
    
  },
  // {
  //   path: '/oss/profile',
  //   component: ProfilePage,

  // },
  // {
  //   path: '/oss/assets',
  //   component: OSSAssets,

  // },
  {
    path: '/oss/preview/residents',
    component: OnboardingPreview,
  
  },
  {
    path: '/oss/preview/housing',
    component: OnboardingPreview,
  
  },
  {
    path: '/oss/preview/operator',
    component: OnboardingOperatorPreview,
  
  },
  {
    path: '/oss/preview/operator',
    component: OnboardingOperatorPreview,
  
  },
  {
    path: '/oss/preview/ees-checklist',
    component: EESChecklistPreview,
  
  },
  {
    path: '/oss/preview/sustainability',
    component: OnboardingPreview,
  
  },
  {
    path: '/oss/preview/standard-renovation-packages',
    component: OnboardingPreview,
  
  },
  {
    path: '/oss/preview/contract',
    component: OnboardingPreview,
  
  },
  {
    path: '/oss/preview/measurement-project',
    component: OnboardingPreview,
  
  },
  {
    path: '/oss/preview/refinancability-Checklist',
    component: EESRefinancabilityChecklistPreview,
  
  },
  {
    path: '/oss/projects',
    component: OSSProjects,

  },
  {
    path: '/oss/onboarding/residents',
    component: OnboardingResidents,

  },
  {
    path: '/oss/onboarding/housing',
    component: OnboardingResidents,

  },
  {
    path: '/oss/onboarding/operator',
    component: OnboardingResidents ,

  },

  // Admin onboarding Tools
  {
    path: '/onboarding/admin/residents',
    component: OnboardingResidents,

  },
  {
    path: '/onboarding/admin/housing',
    component: OnboardingResidents,

  },
  {
    path: '/onboarding/admin/operator',
    component: OnboardingResidents ,

  },
  {
    path: '/simulationTools/admin/eesCalculator',
    component: OSSEESCalculator,

  },
  {
    path: '/simulationTools/admin/ees-checklist',
    component: OSSEESChecklist ,

  },
   {
    path: '/simulation/admin/refinancability-Checklist',
    component: OSSRefinancabilityChecklist ,

  },
  {
    path: '/onboarding/admin/operator/preview/:id',
    component: AdminOnboardingOperatorPreview,
  
  },
  {
    path: '/onboarding/admin/preview/:id',
    component: AdminOnboardingPreview,
  
  },
  {
    path: '/simulationTools/admin/preview/refinancability-Checklist/:id',
    component: AdminRefinancabilityChecklistPreview,
  
  },
  {
    path: '/simulationTools/admin/preview/ees-checklist/:id',
    component: AdminEESChecklistPreview,
  
  },
  {
    path: '/simulationTools/admin/preview/renovation-cost-calculator/:id',
    component: AdminRenovationCostCalculatorPreview,
  
  },
  // Admin onboarding Tools End
  {
    path: '/oss/onboarding/records',
    component: OnboardingResidentsRecords ,

  },
  {
    path: '/oss/onboarding/records/:id',
    component: OnboardingResidentsRecordsDetails ,

  },
  {
  path: '/oss/RenovationCostCalculator/records/:id',
  component: RenovationCostCalculatorRecordsDetails ,

  },
  {
    path: '/oss/onboarding/backup',
    component: OnboardingBackup ,

  },
  {
    path: '/oss/eesCalculator',
    component: OSSEESCalculator,

  },
  {
    path: '/oss/simulation/building-calculator',
    component: EnergyCalculatorPage ,

  },
  {
    path: '/building-calculator',
    component: BuildingCalculator,
    public: true,

  },
  {
    path: '/oss/ees-checklist',
    component: OSSEESChecklist ,

  },
  {
    path: '/oss/simulation-tools/records',
    component: SimulationToolsRecords ,

  },
  {
    path: '/oss/simulation-tools/records/:id',
    component: SimulationToolsRecordsDetails ,

  },
  {
    path: '/oss/simulation-tools/backup',
    component: SimulationToolsBackup ,

  },
  {
    path: '/oss/support',
    component: Support,
    
  },
  {
    path: '/user/support',
    component: UserSupport,
    
  },
  {
    path: '/faq',
    component: FAQ,
    public: true,
  },
  {
    path: '/resources',
    component: Resources,
    public: true,
  },
  // {
  //   path: '/oss/ees-checklist/sustainability',
  //   component: OnboardingResidents ,

  // },
  // {
  //   path: '/oss/ees-checklist/standard-renovation-packages',
  //   component: OnboardingResidents ,

  // },
  // {
  //   path: '/oss/ees-checklist/contract',
  //   component: OnboardingResidents ,

  // },
  // {
  //   path: '/oss/ees-checklist/measurement-project',
  //   component: OnboardingResidents ,

  // },
  {
    path: '/oss/simulation/refinancability-Checklist',
    component: OSSRefinancabilityChecklist ,

  },

  {
    path: '/go-to-my-project',
    component: MagicLink,
    public: true,
  },
  {
    path: '/sign-in-with-otp',
    component: SignupOTP,
    public: true,
  },
  
  {
    path: '/',
    component: LandingPage,
    public: true,
  },
  {
    path: '/home',
    component: HomePage,
    public: true,
  },
  {
    path: '/index',
    component: LandingPage,
    public: true,
  },
  {
    path: '/find-my-partner',
    component: FindMyPartner,
    public: true,
  },
  {
    path: '/find-my-partner/:id',
    component: FindMyPartnerDetails,
    public: true,
  },
  {
    path: '/operators',
    component: ServicesProvider,
    public: true,
  },
  {
    path: '/ees_calculator',
    component: EESCalculator,
    public: true,
  },
  
  {
    path: '/ees-refinancability-checklist',
    component: EESRefinancabilityChecklist,
   
  },
  {
    path: '/market_operator',
    component: MarketOperator,
    public: true,
  },
  {
    path: '/service-operator-checklist',
    component: ServiceOperatorChecklist,
    public: true,
  },
  {
    path: '/login',
    component: LoginPage,
    public: true,
  },
  {
    path: '/register',
    component: RegisterPage,
    public: true,
  },
  {
    path: '/profile',
    component: ProfilePage,
  },
  {
    path: '/profile/notifications',
    component: ProfileNotificationsPage,
  },
  {
    path: '/user/:id',
    component: ProfilePage,
  },
  {
    path: '/organizations',
    component: OrganizationsPage,
    public: true,
  },
  {
    path: '/organization/:id',
    component: SingleOrganization,
  },
  {
    path: '/assets',
    component: AssetsPage,
    public: true,
  },
  {
    path: '/asset/:id',
    component: AssetPage,
  },
  {
    path: '/asset/energy_certificate/:id',
    component: AssetEnergyCertificatePage,
  },
  {
    path: '/asset/admin_energy_certificate/:id',
    component: AdminAssetEnergyCertificatePage,
  },
  {
    path: '/reset_password/:token',
    component: ForgotPasswordPage,
    public: true,
  },
  {
    path: '/projects',
    component: ProjectsPage,
  },
  {
    path: '/project/:id',
    component: ProjectPage,
  },
  {
    path: '/profile/:token',
    component: ProfilePage,
    public: true,
  },
  {
    path: '/admin',
    component: AdminPage,
  },
  {
    path: '/project/:id/overview',
    component: ProjectPage,
    componentProps: { outerIndex: 0, innerIndex: 0 },
  },
  {
    path: '/project/:id/project-manager',
    component: ProjectPage,
    componentProps: { outerIndex: 0, innerIndex: 1 },
  },
  {
    path: '/project/:id/asset-aquisition',
    component: ProjectPage,
    componentProps: { outerIndex: 1, innerIndex: 0 },
  },
  {
    path: '/project/:id/works-phase',
    component: ProjectPage,
    componentProps: { outerIndex: 1, innerIndex: 1 },
  },
  {
    path: '/project/:id/results-monitoring',
    component: ProjectPage,
    componentProps: { outerIndex: 1, innerIndex: 2 },
  },
  {
    path: '/project/:id/contract',
    component: ProjectPage,
    componentProps: { outerIndex: 2, innerIndex: 0 },
  },
  {
    path: '/project/:id/annexes',
    component: ProjectPage,
    componentProps: { outerIndex: 2, innerIndex: 1 },
  },
  {
    path: '/project/:id/terms',
    component: ProjectPage,
    componentProps: { outerIndex: 2, innerIndex: 2 },
  },
  {
    path: '/project/:id/forfaiting-agreement',
    component: ProjectPage,
    componentProps: { outerIndex: 2, innerIndex: 3 },
  },
  {
    path: '/project/:id/contract-history',
    component: ProjectPage,
    componentProps: { outerIndex: 2, innerIndex: 4 },
  },
  {
    path: '/admin/users',
    component: AdminPage,
  },
  {
    path: '/admin/roles',
    component: AdminPage,
  },
  {
    path: '/admin/organizations',
    component: AdminPage,
  },
  {
    path: '/admin/assets',
    component: AdminPage,
  },
  {
    path: '/admin/projects',
    component: AdminPage,
  },
  {
    path: '/admin/documents',
    component: AdminPage,
  },
  {
    path: '/admin/documents/all',
    component: AdminPage,
  },
  {
    path: '/project/:id/single-milestone/:key',
    component: ProjectPage,
  },
  {
    path: '/meeting/:id',
    component: OrganizationMeetingPage,
  },
  {
    path: '/confirm_user/:id',
    component: ConfirmUser,
    public: true,
  },
  {
    path: '/calculator',
    component: EnergyCalculatorPage,
    public: true,
  },
  {
    path: '/reports',
    component: ReportsPage,
  },
  {
    path: '/financial-calculator',
    component: FinancialCalculatorPage,
    public: true,
  },
  {
    path: `/benchmarking/:country(${Object.keys(countryCodesCountries).map((c) => c.toLowerCase()).join('|')})`,
    component: BenchmarkingPage,
    public: true,
  },
////Admin
{
  path: '/onboarding',
  component: AdminOnboardingPage,
  
},
{
  path: '/simulationTools',
  component: AdminSimulationTools,
  
},
{
  path: '/preview/operator/:id',
  component: AdminOnboardingOperatorPreview,

},
{
  path: '/preview/onboarding/:id',
  component: AdminOnboardingPreview,

},
{
  path: '/preview/refinancability-Checklist/:id',
  component: AdminRefinancabilityChecklistPreview,

},
{
  path: '/preview/ees-checklist/:id',
  component: AdminEESChecklistPreview,

},
{
  path: '/preview/renovation-cost-calculator/:id',
  component: AdminRenovationCostCalculatorPreview,

},

  {
    path: '',
    component: PageNotFound,
  }
];

export default matchConfig;
