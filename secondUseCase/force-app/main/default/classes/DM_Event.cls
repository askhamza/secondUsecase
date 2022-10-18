public with sharing class DM_Event {
    

    public static List<Event> getEventsByDate(Date day){
        return [SELECT Id, Subject, DurationInMinutes,  ActivityDateTime, StartDateTime, EndDateTime, Style__c ,WhoId ,Who.Name
                FROM Event WHERE ActivityDate =: day ORDER BY StartDateTime  ] ;
    }

}
