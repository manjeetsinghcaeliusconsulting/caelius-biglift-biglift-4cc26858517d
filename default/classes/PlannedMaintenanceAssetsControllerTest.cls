/*-------------------------------------------------------------------------------\
| This module was programmed by manjeet.singh@consulting.com                                              |
+--------------------------------------------------------------------------------|
| Version 1.0                                                                    |
+--------------------------------------------------------------------------------+
| CODE DESCRIPTION                                                               |
| ________________                                                               |
|This Apex class is developed to test PlannedMaintenanceAssetsController         |                                                                 |
+--------------------------------------------------------------------------------*/

@isTest 
public class PlannedMaintenanceAssetsControllerTest {
    @isTest 
    static void testGetRelatedAssets() {
        // Arrange
        Planned_Maintenance__c pm = TestDataFactory.createPlannedMaintenance();
        Asset testAsset = TestDataFactory.createAssetUsingPlannedMaintenance(pm.Id);

        // Act
        Test.startTest();
        List <Asset> assets = PlannedMaintenanceAssetsController.getRelatedAssets(pm.Id);
        Test.stopTest();

        // Assert
        System.assertEquals(1, assets.size());
        System.assertEquals(testAsset.Id, assets[0].Id);
    }

    @isTest 
    static void testGetRelatedAssetsException() {
        // Arrange
        Id nullId = null;

        // Act
        AuraHandledException actualException;
        Test.startTest();
        try {
            List <Asset> assets = PlannedMaintenanceAssetsController.getRelatedAssets(nullId);
        } catch (AuraHandledException e) {
            actualException = e;
        }
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, actualException);
        // System.assertEquals('Error fetching assets: Attempt to de-reference a null object', actualException.getMessage());
    }
}