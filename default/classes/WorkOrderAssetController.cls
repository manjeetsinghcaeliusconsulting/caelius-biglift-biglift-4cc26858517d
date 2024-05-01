/*-------------------------------------------------------------------------------\
| This module was programmed by manjeet.singh@consulting.com                                              |
+--------------------------------------------------------------------------------|
| Version 1.0                                                                    |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION                                                               |
| ________________                                                               |
|This Apex class is developed to fetch Asset records related to Work Order|                                                                 |
+--------------------------------------------------------------------------------*/

public with sharing class WorkOrderAssetController {
    @AuraEnabled(cacheable=true)
    public static List<Asset> getRelatedAssets(Id workOrderId) {
        try {
            WorkOrder workOrder = [SELECT Planned_Maintenance__c, CaseId FROM WorkOrder WHERE Id = :workOrderId LIMIT 1];
            Id plannedMaintenanceId = workOrder.Planned_Maintenance__c;
            Id caseId = workOrder.CaseId;

            if (plannedMaintenanceId != null) {
                return [SELECT Id, Name, SerialNumber, InstallDate, Asset_Number__c
                        FROM Asset
                        WHERE Planned_Maintenance__c = :plannedMaintenanceId];
            } else if (caseId != null) {
                Case caseRecord = [SELECT Asset_Number_without_hyperlink__c FROM Case WHERE Id = :caseId LIMIT 1];
                String assetNumber = caseRecord.Asset_Number_without_hyperlink__c;

                if (assetNumber != null) {
                    return [SELECT Id, Name, SerialNumber, InstallDate, Asset_Number__c
                            FROM Asset
                            WHERE Asset_Number__c = :assetNumber];
                }
            }
            return new List<Asset>();
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching assets: ' + e.getMessage());
        }
    }
}