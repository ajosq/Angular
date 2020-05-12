import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { each, eq, get, keys, find } from 'lodash-es';

import { COVCaseTimeSeries, COVStateWise, COVTested } from './interface/api-data.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    private trackerApis: Map<string, { [key: string]: string }> = new Map();
    public activeTab: string;
    public apiData: COVCaseTimeSeries | COVStateWise | COVTested;
    public apiStatusText: string;
    public isLoading = true;
    public selectedState = '';
    public stateData = {};

    public tabs: { [key: string]: string } = {
        STATE_WISE: 'STATE_WISE', CASE_TIME_SERIES: 'CASE_TIME_SERIES', TESTED: 'TESTED', DISTRICT_WISE: 'DISTRICT_WISE'
    };

    constructor(private http: HttpClient) { this.init(); }

    public setSelection(activeTab: string) {
        this.activeTab = activeTab;
        this.setApiData(activeTab);
    }

    private init() {
        this.setApiUrls();
        this.setSelection(this.tabs.STATE_WISE);
    }

    private async setApiData(selectedTab: string) {
        try {
            const { url, apiGroup } = this.trackerApis.get(selectedTab);
            this.apiStatusText = 'Please wait while data is loading...';
            this.isLoading = true;
            const data = await this.http.get(url).toPromise();
            if (eq(apiGroup, 'A')) {
                switch (selectedTab) {
                    case this.tabs.STATE_WISE:
                        this.apiData = data['statewise'];
                        break;
                    case this.tabs.CASE_TIME_SERIES:
                        this.apiData = data['cases_time_series'];
                        break;
                    case this.tabs.TESTED:
                        this.apiData = data['tested'];
                        break;
                }
            } else if (eq(apiGroup, 'B')) {
                this.selectedState = '';
                this.stateData = {};
                const states = keys(data);
                (this.apiData as any) = [];
                each(states, (state: string) => {
                    const districtData = get(data, [state, 'districtData']);
                    const districts = keys(districtData);
                    const details = { state, district: [] };
                    each(districts, (district: string) => details.district.push({ name: district, data: districtData[district] }));
                    (this.apiData as any).push(details);
                });
            }
            this.apiStatusText = '';
        } catch (e) {
            setTimeout(() => this.apiStatusText = 'Oops, looks like you are offline. Please check your connection.', 500);
        } finally {
            this.isLoading = false;
        }
    }

    public onStateChange() {
        this.stateData = find(this.apiData, (item) => eq(item.state, this.selectedState));
    }

    private setApiUrls() {
        this.trackerApis.set(
            'STATE_WISE',
            { apiGroup: 'A', url: 'https://api.covid19india.org/data.json' }
        );
        this.trackerApis.set(
            'CASE_TIME_SERIES',
            { apiGroup: 'A', url: 'https://api.covid19india.org/data.json' }
        );
        this.trackerApis.set(
            'TESTED',
            { apiGroup: 'A', url: 'https://api.covid19india.org/data.json' }
        );
        this.trackerApis.set(
            'DISTRICT_WISE',
            { apiGroup: 'B', url: 'https://api.covid19india.org/state_district_wise.json' }
        );
    }

}
