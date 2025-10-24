export const initialState = {
  buildingData: {
    numDwellings: '',
    billingArea: '',
    constructionCostsEEM: '',
    constructionCostsASM: '',
    managementAndSupervision: '',
    unforseenCosts: '',
    subsidy: '',
  },
  energyDrivers: {
    districtHeatingTariff: '',
    preEnergyUseHeating: '',
    postEnergyUseHeating: '',
    energySavingsMargin: '',
  },
  maintenance: {
    maintenanceFee: '',
    reserveFunds: '',
  },
  economic: {
    consumerPriceInflation: '',
    energyPriceInflation: '',
    energyVAT: '',
    constructionVAT: '',
    profitTax: '',
  },
  calc: {
    constrCostsEEMWOVAT: null,
    constrCostsEEMWVAT: null,
    constrCostsEEMTotalWOVAT: null,
    constrCostsEEMTotalWVAT: null,

    constrCostsASMWOVAT: null,
    constrCostsASMWVAT: null,
    constrCostsASMTotalWOVAT: null,
    constrCostsASMTotalWVAT: null,

    mngmtCostsWOVAT: null,
    mngmtCostsWVAT: null,
    mngmtCostsTotalWOVAT: null,
    mngmtCostsTotalWVAT: null,

    unknownCostsWOVAT: null,
    unknownCostsWVAT: null,
    unknownCostsTotalWOVAT: null,
    unknownCostsTotalWVAT: null,

    constrCostsUnitWOVAT: null,
    constrCostsUnitWVAT: null,
    constrCostsTotalWOVAT: null,
    constrCostsTotalWVAT: null,

    subsidy: null,
    afterSubsidyTotal: null,

    districtHeatTariffWVAT: null,
    preRenovationHeating: null,
    postRenovationHeating: null,
    savingsRatioPercent: null,
    savingsGuranteePercent: null,
    savingsGuranteeMwH: null,

    yearlyCotsHeating: [],
    yearlyCostsMaint: [],
    yearlyCostsResFund: [],
    yearlyCostsTotal: [],
    yearlyCostsSqMPMonth: [],
  },
  validationErrors: {},
};

export default function reducer(state = initialState, payload) {
  const m = payload.type.match(/^set#([a-z]+)$/i);
  if (m) {
    const key = m[1];
    const validationErrors = { ...state.validationErrors };
    Object.keys(payload.data).forEach(k => {
      delete validationErrors[k];
    });

    return { ...state, [key]: { ...state[key], ...payload.data }, validationErrors };
  }

  if (payload.type === 'setValidationErrors') {
    return { ...state, validationErrors: { ...state.validationErrors, ...payload.errors } };
  }

  if (payload.type === 'resetData') {
    return { ...initialState };
  }

  return state;
}
