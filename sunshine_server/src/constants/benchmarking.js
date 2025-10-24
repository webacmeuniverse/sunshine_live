import {
  Apartment as BuildingsIcon,
  Business as IndustryIcon,
} from '@material-ui/icons';

export const measureTypes = {
  building: [
    { value: 'Building Fabric Measures', label: 'Building Fabric Measures' },
    { value: 'Combination of Building Fabric and HVAC', label: 'Combination of Building Fabric and HVAC' },
    { value: 'Compressed Air', label: 'Compressed Air' },
    { value: 'Cooling', label: 'Cooling' },
    { value: 'Heating', label: 'Heating' },
    { value: 'HVAC Plant', label: 'HVAC Plant' },
    { value: 'ICT', label: 'ICT' },
    { value: 'Integrated Renovation', label: 'Integrated Renovation' },
    { value: 'Lighting', label: 'Lighting' },
    { value: 'Metering, Monitoring and Energy Management', label: 'Metering, Monitoring and Energy Management' },
    { value: 'Motors', label: 'Motors' },
    { value: 'Power Systems', label: 'Power Systems' },
    { value: 'Pumps', label: 'Pumps' },
    { value: 'Refrigeration', label: 'Refrigeration' },
    { value: 'Street Lighting', label: 'Street Lighting' },
    { value: 'Ventilation & air conditioning', label: 'Ventilation & air conditioning' },
    { value: 'Waste heat (without power generation)', label: 'Waste heat (without power generation)' },
    { value: 'Waste heat (with power generation)', label: 'Waste heat (with power generation)' },
    { value: 'Other', label: 'Other' },
  ],
  industry: [
    { value: 'Compressed Air', label: 'Compressed Air' },
    { value: 'Cooling', label: 'Cooling' },
    { value: 'Heating', label: 'Heating' },
    { value: 'ICT', label: 'ICT' },
    { value: 'Metering, Monitoring and Energy Management', label: 'Metering, Monitoring and Energy Management' },
    { value: 'Motors', label: 'Motors' },
    { value: 'Power Systems', label: 'Power Systems' },
    { value: 'Pumps', label: 'Pumps' },
    { value: 'Refrigeration', label: 'Refrigeration' },
    { value: 'Street Lighting', label: 'Street Lighting' },
    { value: 'Waste heat (without power generation)', label: 'Waste heat (without power generation)' },
    { value: 'Waste heat (with power generation)', label: 'Waste heat (with power generation)' },
    { value: 'Other', label: 'Other' },
  ],
};

export const buildingTypes = [
  { value: 'DETACHED', label: 'Detached single family dwellings' },
  { value: 'data centre', label: 'Data centre' },
  { value: 'SINGLE', label: 'Other single family dwellings' },
  { value: 'MULTI4', label: 'Multi-family buildings 1-4 storeys' },
  { value: 'MULTI5', label: 'Multi-family buidings 5+ storeys' },
  { value: 'PRIVATE', label: 'Office buildings' },
  { value: 'PUBLIC', label: 'Public buildings' },
  { value: 'WHOLESALE', label: 'Wholesale and retail trade' },
  { value: 'HOTEL', label: 'Hotels & restaurants' },
  { value: 'HEALTH', label: 'Health care' },
  { value: 'EDUCATION', label: 'Educational buildings' },
  { value: 'SPORT', label: 'Sport Facilities' },
  { value: 'INDUSTRY', label: 'Industry' },
];

export const types = [
  { label: 'Buildings', value: 'building', Icon: BuildingsIcon },
  { label: 'Industry', value: 'industry', Icon: IndustryIcon },
];

export const resultTypes = [
  {
    label: 'Unit energy saving per measure',
    value: 'energy',
    settings: {
      value: 'EUR/m2/year',
      dataKey: 'saving',
      dataKeys: [
        { dataKey: 'SumEnergySavedFormatted', name: 'Energy Saved', color: '#34495e' },
      ],
    },
  },
  {
    label: 'Unit energy costs per measure',
    value: 'economic',
    settings: {
      value: 'EUR investment | EUR energy cost saved per year',
      dataKey: 'costs',
      dataKeys: [
        { dataKey: 'Investment', name: 'Investment', color: '#e67e22' },
        { dataKey: 'Energycostsaved', name: 'Energy cost saved per year', color: '#34495e' },
      ],
    },
  },
  {
    label: 'Payback time',
    value: 'payback',
    settings: {
      dataKey: 'time',
      dataKeys: [
        { dataKey: 'SimplePaybackTime', name: 'Years', color: '#34495e' },
      ],
      yLabel: 'years',
    },
  },
];
