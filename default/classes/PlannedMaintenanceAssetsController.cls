/*-------------------------------------------------------------------------------\
| This module was programmed by manjeet.singh@consulting.com                                              |
+--------------------------------------------------------------------------------|
| Version 1.0                                                                    |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION                                                               |
| ________________                                                               |
|This Apex class is developed to fetch Asset records related to Planned Maintenanance|                                                                 |
+--------------------------------------------------------------------------------*/


public with sharing class PlannedMaintenanceAssetsController {
    @AuraEnabled(cacheable=true)
    public static List<Asset> getRelatedAssets(Id pmId) {
        if (pmId == null) {
            throw new AuraHandledException('Planned Maintenance Id cannot be null');
        }
        try {
            return [SELECT Id, Name, SerialNumber, InstallDate,Asset_Number__c
                    FROM Asset
                    WHERE Planned_Maintenance__c = :pmId];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching assets: ' + e.getMessage());
        }
    }
}