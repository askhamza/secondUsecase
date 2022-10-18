public with sharing class SM_Event {
   
    @AuraEnabled(cacheable=true)
    public static list<Event> getEventsByDate(Date day){
        System.debug(DM_Event.getEventsByDate(day)) ;
        return DM_Event.getEventsByDate(day);
    }
}
