/*-------------------------------------------------------------------------------\
| This module was programmed by manjeet.singh@consulting.com                                              |
+--------------------------------------------------------------------------------|
| Version 1.0                                                                    |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION                                                               |
| ________________                                                               |
|This Apex class is used to create test data.                                    |                                                                 |
+--------------------------------------------------------------------------------*/

@isTest
public class TestDataFactory {
    public static Planned_Maintenance__c createPlannedMaintenance() {
        Planned_Maintenance__c pm = new Planned_Maintenance__c();
        insert pm;
        return pm;
    }
    
    public static Asset createAssetUsingPlannedMaintenance(Id plannedMaintenanceId) {
        Account newAccount = new Account(
            Name = 'accountName11'
            // Add more fields as needed
        );
        insert newAccount;
        Asset testAsset = new Asset(
            Name = 'abcd',
            SerialNumber = '1234',
            InstallDate = Date.today(),
            Asset_Number__c = '456',
            Planned_Maintenance__c = plannedMaintenanceId,
            AccountId = newAccount.Id
        );
        insert testAsset;
        return testAsset;
    }
    
    public static WorkOrder createWorkOrderWithCase(){
        Account newAccount = new Account(
            Name = 'accountName1'
            // Add more fields as needed
        );
        insert newAccount;
        
        Contact newContact = new Contact(
            FirstName = 'John',
            LastName = 'Doe1',
            Email = 'emailAddress1@test.com',
            AccountId = newAccount.Id
        );
        insert newContact;
        
        
        
        Case newCase = new Case(
            Subject = 'Test Case',
            Description = 'This is a test case',
            Status = 'New',
            ContactId = newContact.Id
            
            // Add more fields as needed
        );
        insert newCase;
        
        WorkOrder newWorkOrder = new WorkOrder(
            CaseId = newCase.Id
            // Add more fields as needed
        );
        insert newWorkOrder;
        return newWorkOrder;
    }
}