/*-------------------------------------------------------------------------------\
| This module was programmed by manjeet.singh@consulting.com                                              |
+--------------------------------------------------------------------------------|
| Version 1.0                                                                    |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION                                                               |
| ________________                                                               |
|This Apex class is developed to test orkOrderAssetController                    |                                                                 |
+--------------------------------------------------------------------------------*/

@isTest
public class WorkOrderAssetControllerTest {
    @isTest 
    static void testGetRelatedAssets() {
        // Arrange
        Planned_Maintenance__c pm = TestDataFactory.createPlannedMaintenance();
        Asset testAsset = TestDataFactory.createAssetUsingPlannedMaintenance(pm.Id);
        WorkOrder wo = new WorkOrder(Planned_Maintenance__c = pm.Id);
        insert wo;

       // Act
       Test.startTest();
        List<Asset> assets = WorkOrderAssetController.getRelatedAssets(wo.Id);
		Test.stopTest();
        // Assert
        System.assertEquals(1, assets.size());
        System.assertEquals(testAsset.Id, assets[0].Id);
        
        
        
      
    }
    @isTest 
    static void testGetRelatedAssets_withCaseID() {
        WorkOrder testWorkOrder = TestDataFactory.createWorkOrderWithCase();
         Test.startTest();
        List<Asset> testAssets = WorkOrderAssetController.getRelatedAssets(testWorkOrder.Id);
		Test.stopTest();
        
    }
}