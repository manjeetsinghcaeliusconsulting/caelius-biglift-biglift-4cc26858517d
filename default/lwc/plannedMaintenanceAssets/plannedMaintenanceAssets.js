/*******************************************************************
* File Name         : WorkOrderAssetDataTable.js
* Description       : This is iterating Assets related to Planned Maintenance and displaying them in a data table.
*                    
* Revision History  :
* Date				Author    		                        Comments
* ---------------------------------------------------------------------------
* 21/04/2024		manjeet.singh@caeliusconsulting.com		Created.
/******************************************************************/

import { LightningElement, wire, api, track } from 'lwc';
import getRelatedAssets from '@salesforce/apex/PlannedMaintenanceAssetsController.getRelatedAssets';

const columns = [
    { label: 'Part/Model Number', fieldName: 'Name' },
    { label: 'Serial Number', fieldName: 'Name' },
    { label: 'Asset Number', fieldName: 'Asset_Number__c', type: 'Text' },
];

export default class PlannedMaintenanceAssets extends LightningElement {
    @api recordId;
    @track assets;
    @track error;
    columns = columns;

    @wire(getRelatedAssets, { pmId: '$recordId' })
    wiredAssets({ error, data }) {
        if (data) {
            this.assets = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.assets = undefined;
            console.error('Error fetching assets:', error);
        }
    }
}
