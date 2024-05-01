/*******************************************************************
* File Name         : WorkOrderAssetDataTable.js
* Description       : This is iterating Assets related to Work Order and displaying them in a data table.
*                    
* Revision History  :
* Date				Author    		                        Comments
* ---------------------------------------------------------------------------
* 21/04/2024		manjeet.singh@caeliusconsulting.com		Created.
/******************************************************************/

import { LightningElement, api, wire, track } from 'lwc';
import getRelatedAssets from '@salesforce/apex/WorkOrderAssetController.getRelatedAssets';
import { NavigationMixin } from 'lightning/navigation';

const columns = [
    { label: 'Part/Model Number', fieldName: 'Name' },
    { label: 'Serial Number', fieldName: 'Name' },
    { label: 'Asset Number', fieldName: 'Asset_Number__c', type: 'Text' },
    { label: 'Navigate to Asset', type: 'button', initialWidth: 135,
      typeAttributes: { 
          label: 'Click here', 
          name: 'navigate_to_asset', 
          title: 'Click to view asset', 
          variant: 'base' 
      } 
    }
];

export default class WorkOrderAssetDataTable extends NavigationMixin(LightningElement) {
    @api recordId; // Work Order record Id
    @track assets;
    @track error;
    columns = columns;

    @wire(getRelatedAssets, { workOrderId: '$recordId' })
    wiredAssets({ error, data }) {
        if (data) {
            this.assets = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.assets = undefined;
            console.error('Error fetching assets:', JSON.stringify(error));
            this.error = 'Error fetching assets: ' + error.body.message;
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'navigate_to_asset':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    },
                });
                break;
            default:
        }
    }
}