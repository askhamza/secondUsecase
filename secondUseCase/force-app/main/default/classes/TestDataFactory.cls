public with sharing class TestDataFactory {
    
    public static User createAdminUser(String name, Id profId){
        return new User(
            Username = randomizeString(name)+ '@test.com' ,
            LastName = 'User',
            FirstName = 'test',
            Email = 'test.user@gmail.com',
            Alias = 'tstusr',
            LanguageLocaleKey = 'en_US',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = profId 
        );
    }
    public static User createUserByProfileName(String name, String profName){
        return new User(
            Username = randomizeString(name)+ '@test.com' ,
            LastName = 'User',
            FirstName = 'test',
            Email = 'test.user@gmail.com',
            Alias = 'tstusr',
            LanguageLocaleKey = 'en_US',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = getProfileByName(profName)
        );
    }

    public static Id getProfileByName (String profileName){
        return ( [ SELECT Id from profile WHERE Name = :profileName].Id );
    }

    //return a random unique String 
    public static String randomizeString(String name){
        String charsForRandom = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        String randStr = '';
        while (randStr.length() < 6) {
           Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), charsForRandom.length());
           randStr += charsForRandom.substring(idx, idx+1);
        }
        return name+randStr;
    }
}
