export const demoData = {
  buildingData: {
    numDwellings: 2,
    billingArea: 1558.9,
    constructionCostsEEM: 171,
    constructionCostsASM: 40,
    managementAndSupervision: 7,
    unforseenCosts: 3,
    subsidy: 15,
  },
  energyDrivers: {
    districtHeatingTariff: 50,
    preEnergyUseHeating: 99,
    postEnergyUseHeating: 67,
    energySavingsMargin: 5,
  },
  maintenance: {
    maintenanceFee: 0.5,
    reserveFunds: 0.2,
  },
  economic: {
    consumerPriceInflation: 2,
    energyPriceInflation: 4,
    energyVAT: 23,
    constructionVAT: 23,
    profitTax: 19,
  },
};

export const calc = {
  constrCostsEEMWOVAT: (data) => {
    const { buildingData } = data;
    return buildingData.constructionCostsEEM;
  },
  constrCostsEEMWVAT: (data) => {
    const { buildingData, economic } = data;
    return buildingData.constructionCostsEEM * (1 + economic.constructionVAT / 100);
  },
  constrCostsEEMTotalWOVAT: (data) => {
    const { buildingData } = data;
    return buildingData.constructionCostsEEM * buildingData.billingArea;
  },
  constrCostsEEMTotalWVAT: (data) => {
    const { buildingData, economic } = data;
    return buildingData.constructionCostsEEM * (1 + economic.constructionVAT / 100) * buildingData.billingArea;
  },

  constrCostsASMWOVAT: (data) => {
    const { buildingData } = data;
    return buildingData.constructionCostsASM;
  },
  constrCostsASMWVAT: (data) => {
    const { buildingData, economic } = data;
    return buildingData.constructionCostsASM * (1 + economic.constructionVAT / 100);
  },
  constrCostsASMTotalWOVAT: (data) => {
    const { buildingData } = data;
    return buildingData.constructionCostsASM * buildingData.billingArea;
  },
  constrCostsASMTotalWVAT: (data) => {
    const { buildingData, economic } = data;
    return buildingData.constructionCostsASM * (1 + economic.constructionVAT / 100) * buildingData.billingArea;
  },

  mngmtCostsWOVAT: (data) => {
    const { buildingData } = data;
    return buildingData.managementAndSupervision * (
      (buildingData.constructionCostsEEM + buildingData.constructionCostsASM + calc.unknownCostsWOVAT(data)) / 100
    );
  },
  mngmtCostsWVAT: (data) => {
    const { economic } = data;
    return (calc.mngmtCostsWOVAT(data) / 100) * (1 + economic.constructionVAT / 100);
  },
  mngmtCostsTotalWOVAT: (data) => {
    const { buildingData } = data;
    return (calc.mngmtCostsWOVAT(data) / 100) * buildingData.billingArea;
  },
  mngmtCostsTotalWVAT: (data) => {
    const { buildingData } = data;
    return calc.mngmtCostsWVAT(data) * buildingData.billingArea;
  },

  unknownCostsWOVAT: (data) => {
    const { buildingData } = data;
    return (buildingData.constructionCostsEEM + buildingData.constructionCostsASM) * buildingData.unforseenCosts / 100;
  },
  unknownCostsWVAT: (data) => {
    const { economic } = data;
    return calc.unknownCostsWOVAT(data) * (1 + economic.constructionVAT / 100);
  },
  unknownCostsTotalWOVAT: (data) => {
    const { buildingData } = data;
    return calc.unknownCostsWOVAT(data) * buildingData.billingArea;
  },
  unknownCostsTotalWVAT: (data) => {
    const { buildingData } = data;
    return calc.unknownCostsWVAT(data) * buildingData.billingArea;
  },

  constrCostsTotalUnitWOVAT: (data) => {
    const { buildingData } = data;
    return (
      buildingData.constructionCostsEEM + buildingData.constructionCostsASM +
      calc.mngmtCostsWOVAT(data) / 100 + calc.unknownCostsWOVAT(data)
    );
  },
  constrCostsTotalUnitWVAT: (data) => {
    const { economic } = data;
    return calc.constrCostsTotalUnitWOVAT(data) * (1 + economic.constructionVAT / 100);
  },
  constrCostsTotalWOVAT: (data) => {
    const { buildingData } = data;
    return calc.constrCostsTotalUnitWOVAT(data) * buildingData.billingArea;
  },
  constrCostsTotalWVAT: (data) => {
    const { buildingData } = data;
    return calc.constrCostsTotalUnitWVAT(data) * buildingData.billingArea;
  },

  subsidy: (data) => {
    const { buildingData } = data;
    return (calc.constrCostsEEMTotalWVAT(data) + calc.constrCostsASMTotalWVAT(data)) * (buildingData.subsidy / 100);
  },
  afterSubsidyTotal: (data) => {
    return calc.constrCostsTotalWVAT(data) - calc.subsidy(data);
  },
  districtHeatTariffWVAT: (data) => {
    const { energyDrivers, economic } = data;
    return energyDrivers.districtHeatingTariff * (1 + economic.energyVAT / 100);
  },
  preRenovationHeating: (data) => {
    const { energyDrivers, buildingData } = data;
    return energyDrivers.preEnergyUseHeating / 1000 * buildingData.billingArea;
  },
  postRenovationHeating: (data) => {
    const { energyDrivers, buildingData } = data;
    return energyDrivers.postEnergyUseHeating / 1000 * buildingData.billingArea;
  },
  savingsRatioPercent: (data) => {
    const { energyDrivers } = data;
    return (1 - energyDrivers.postEnergyUseHeating / energyDrivers.preEnergyUseHeating) * 100;
  },
  savingsGuranteePercent: (data) => {
    const { energyDrivers } = data;
    return calc.savingsRatioPercent(data) - energyDrivers.energySavingsMargin;
  },
  savingsGuranteeMwH: (data) => {
    return (1 - calc.savingsGuranteePercent(data) / 100) * calc.preRenovationHeating(data);
  },
  yearlyCostsHeating: (data, { num = 0 }) => {
    const { buildingData, energyDrivers, economic } = data;
    const tariff = calc.districtHeatTariffWVAT(data);

    const costs = [];
    for (let i = 0; i < num; i++) {
      costs[i] = (
        tariff *
        energyDrivers.preEnergyUseHeating *
        buildingData.billingArea *
        (1 + economic.energyPriceInflation / 100 * i)
      ) / 1000;
    }
    return costs;
  },
  yearlyCostsMaint: (data, { num }) => {
    const { buildingData, maintenance, economic } = data;

    const costs = [];
    for (let i = 0; i < num; i++) {
      costs[i] = (
        maintenance.maintenanceFee *
        12 *
        buildingData.billingArea *
        (1 + economic.constructionVAT / 100) *
        (1 + economic.consumerPriceInflation / 100 * i)
      );
    }
    return costs;
  },
  yearlyCostsResFund: (data, { num }) => {
    const { buildingData, maintenance, economic } = data;

    const costs = [];
    for (let i = 0; i < num; i++) {
      costs[i] = (
        maintenance.reserveFunds *
        buildingData.billingArea *
        12 *
        (1 + economic.consumerPriceInflation / 100 * i)
      );
    }
    return costs;
  },
  yearlyCostsTotal: (data, { num }) => {
    const yearlyCostsHeating = calc.yearlyCostsHeating(data, { num });
    const yearlyCostsMaint = calc.yearlyCostsMaint(data, { num });
    const yearlyCostsResFund = calc.yearlyCostsResFund(data, { num });
    const costs = [];
    for (let i = 0; i < num; i++) {
      costs[i] = yearlyCostsHeating[i] + yearlyCostsMaint[i] + yearlyCostsResFund[i];
    }
    return costs;
  },
  yearlyCostsSqMPMonth: (data, { num }) => {
    const { buildingData } = data;
    const totalCosts = calc.yearlyCostsTotal(data, { num });
    const costs = [];
    for (let i = 0; i < num; i++) {
      costs[i] = totalCosts[i] / buildingData.billingArea / 12;
    }
    return costs;
  },
};
