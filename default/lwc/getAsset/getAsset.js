import { LightningElement , wire} from 'lwc';
import getasset from '@salesforce/apex/caseController.getasset'
import getcontact from '@salesforce/apex/caseController.getcontact'
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import AccountId from '@salesforce/schema/User.AccountId';
import ContactId from '@salesforce/schema/User.ContactId';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';



const columns = [
    { label: 'Asset Number', fieldName: 'Name' },
    { label: 'Serial Number', fieldName: 'SerialNumber'},
    { label: 'Install Date', fieldName: 'InstallDate', type: 'date' },
    { label: 'Usage EndDate', fieldName: 'UsageEndDate', type: 'date' },
    { label: 'Purchase Date', fieldName: 'PurchaseDate', type: 'date' },
    { label: 'Warranty', fieldName: 'Warranty__c'},
];

export default class GetAsset extends LightningElement {

    data = [];
    columns = columns;
    RegionId;
    TerritoryId;
    userRole;
    store;
    AccountId;
    ContactId;
    searchResults;
    recordsList;

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, { recordId: Id, fields: [AccountId, ContactId]}) 
    currentUserInfo({error, data}) {
        if (data) {
            this.AccountId = data.fields.AccountId.value;
            this.ContactId = data.fields.ContactId.value;
            console.log('Region__cwwww',this.ContactId)
            this.getcontact();
        } else if (error) {
            this.error = error ;
        }
    }

    getcontact() {
        getcontact({
            searchTerm: this.ContactId
        }).then(result => {
            this.searchResults = result;
            console.log('Region__cwwww',result)
            this.RegionId = this.searchResults[0].Region__c;
            console.log('Region__cwwww',this.RegionId)

            this.TerritoryId = this.searchResults[0].Territory__c;
            this.userRole = this.searchResults[0].User_Role__c;
            this.store = this.searchResults[0].Store_Location__c;
            this.getasset();
        }).catch(error => {
            console.log(error);
        })
    }

    getasset() {
        getasset({
        }).then(result => {
           if (result) {
                if(this.userRole === 'Store Manager'){
                this.recordsList = JSON.parse(JSON.stringify(result));
                this.recordsList = this.recordsList.filter((record) => {
                    return record.AccountId === this.AccountId && record.Store__c === this.store;
                });
            } else if (this.userRole === 'Territory Manager'){
                this.recordsList = JSON.parse(JSON.stringify(result));
                this.recordsList = this.recordsList.filter((record) => {
                    return (record.AccountId === this.AccountId && (record.Territory__c === this.TerritoryId && this.TerritoryId != undefined) || record.Store__c === this.store);
                });
            }
            else if(this.userRole === 'Regional Manager'){
                console.log('in')
                this.recordsList = JSON.parse(JSON.stringify(result));
                this.recordsList = this.recordsList.filter((record) => {
                    return (record.AccountId === this.AccountId && (record.Region__c === this.RegionId && this.RegionId != undefined) || (record.Territory__c === this.TerritoryId && this.TerritoryId != undefined) || record.Store__c === this.store);
                });
            }
            else if(this.userRole === 'Corporate Manager'){
                this.recordsList = JSON.parse(JSON.stringify(result));
                this.recordsList = this.recordsList.filter((record) => {
                    return (record.AccountId === this.AccountId && this.AccountId != undefined);
                });
            }
                console.log('reclist',this.recordsList)
            } else {
                this.recordsList = [];
            }
        }).catch(error => {
            console.log(error);
        })
    }

    getSelectedName(event){
        console.log('event', event.detail.selectedRows)
        const selectedRows = event.detail.selectedRows;
        // const payload = { recordId: event.detail.selectedRows[0].Id };

        // publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
        if(selectedRows.length > 1){
            this.template.querySelector('lightning-datatable').selectedRows = [selectedRows[0]];
            alert('You cannot select multiple equipments');
            const payload = { recordId: ''};
            publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
            return
        } else if(selectedRows.length == 1){
            const payload = { recordId: event.detail.selectedRows[0].Id };
        publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
        } else if(selectedRows.length == 0){
            const payload = { recordId: ''};
            publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
        }
    }

    disconnectedCallback(){
        console.log('i am called')
    }
    
}