import { LightningElement , wire} from 'lwc';
import getplanned from '@salesforce/apex/caseController.getplanned'
import getcontact from '@salesforce/apex/caseController.getcontact'
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import AccountId from '@salesforce/schema/User.AccountId';
import ContactId from '@salesforce/schema/User.ContactId';

const columns = [
    { label: 'Planned Maintenance Name', fieldName: 'Name' },
    { label: 'Primary Service Provider', fieldName: 'Primary_Service_Provider__c'},
    { label: 'Secondary Service Provider', fieldName: 'Secondary_Service_Provider__c'},
    { label: 'Upcoming Planned Maintenance Date', fieldName: 'Upcoming_Planned_Maintenance_Date__c', type: 'date' },
    { label: 'Planned Maintenance Interval(In Months)', fieldName: 'Planned_Maintenance_Interval__c'},
];

export default class GetPlannedMaintenance extends LightningElement {

    data = [];
    columns = columns;
    ContactId;
    recordsList;

    @wire(getRecord, { recordId: Id, fields: [AccountId, ContactId]}) 
    currentUserInfo({error, data}) {
        if (data) {
            this.ContactId = data.fields.ContactId.value;
            console.log('Region__cwwww',this.ContactId)
            this.getplanned();
        } else if (error) {
            this.error = error ;
        }
    }

    getplanned() {
        getplanned({ ContactId: this.ContactId}).then(result => {
           if (result) {
                this.recordsList = JSON.parse(JSON.stringify(result));
                this.recordsList = this.recordsList.map(opt => {return {...opt, "Primary_Service_Provider__c": opt.Primary_Service_Provider__r.Name, "Secondary_Service_Provider__c": opt.Secondary_Service_Provider__r.Name}});
                console.log('recordlist',this.recordsList)
            } else {
                this.recordsList = [];
            }
        }).catch(error => {
            console.log(error);
        })
    }

}