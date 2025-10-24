import HomePage from '../containers/pages/HomePage/HomePage';
import LoginPage from '../containers/pages/LoginPage/LoginPage';
import RegisterPage from '../containers/pages/RegisterPage/RegisterPage';
import ProfilePage from '../containers/pages/ProfilePage/ProfilePage';
import OrganizationsPage from '../containers/pages/OrganizationsPage/OrganizationsPage';
import AssetsPage from '../containers/pages/AssetsPage/AssetsPage';
import ProjectsPage from '../containers/pages/ProjectsPage/ProjectsPage';
import SingleOrganization from '../containers/pages/SingleOrganization/SingleOrganization';
import AssetPage from '../containers/pages/AssetPage/AssetPage';
import ProjectPage from '../containers/pages/ProjectPage/ProjectPage';
import ForgotPasswordPage from '../containers/pages/ForgotPasswordPage/ForgotPasswordPage';
import AdminPage from '../containers/pages/AdminPage/AdminPage';
import OrganizationMeetingPage from '../containers/pages/OrganizationMeetingPage/OrganizationMeetingPage';
import ConfirmUser from '../containers/pages/ConfirmUser/ConfirmUser';
import PageNotFound from '../containers/pages/PageNotFound/PageNotFound';
import EnergyCalculatorPage from '../containers/pages/EnergyCalculatorPage';
import FinancialCalculatorPage from '../containers/pages/FinancialCalculatorPage';
import ProfileNotificationsPage from '../containers/pages/ProfileNotificationsPage';
import ReportsPage from '../containers/pages/ReportsPage';
import BenchmarkingPage from '../containers/pages/BenchmarkingPage';
import { countryCodesCountries } from '../constants/countries';

const matchConfig = [
  {
    path: '/',
    component: HomePage,
    public: true,
  },
  {
    path: '/index',
    component: HomePage,
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
  {
    path: '',
    component: PageNotFound,
  }
];

export default matchConfig;
