export interface COVCaseTimeSeries {
    dailyconfirmed: string;
    dailydeceased: string;
    dailyrecovered: string;
    date: string;
    totalconfirmed: string;
    totaldeceased: string;
    totalrecovered: string;
}

export interface COVStateWise {
    active: string;
    confirmed: string;
    deaths: string;
    deltaconfirmed: string;
    deltadeaths: string;
    deltarecovered: string;
    lastupdatedtime: string;
    recovered: string;
    state: string;
    statecode: string;
    statenotes: string;
}

export interface COVTested {
    individualstestedperconfirmedcase: string;
    positivecasesfromsamplesreported: string;
    samplereportedtoday: string;
    source: string;
    testpositivityrate: string;
    testsconductedbyprivatelabs: string;
    testsperconfirmedcase: string;
    totalindividualstested: string;
    totalpositivecases: string;
    totalsamplestested: string;
    updatetimestamp: string;
}

export interface COVDistrictWise {
    state: string;
    district: COVDistrict[];
}

interface COVDistrict {
    name: string;
    data: COVDistrictData;
}

interface COVDistrictData {
    active: string;
    confirmed: string;
    deceased: string;
    recovered: string;
}
