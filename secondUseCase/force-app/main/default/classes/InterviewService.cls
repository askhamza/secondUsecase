@RestResource(urlMapping='/Interview/*')
global with sharing class InterviewService {

    @HttpGet
    global static List<Interview__c> getInterviews() {

        Datetime startDate ;
        Datetime endDate ;

        System.debug('start date : ' + startDate) ;
        System.debug('end date : ' + endDate) ;

        if(RestContext.request.params.get('startDate') != null){
             startDate = (DateTime)JSON.deserialize('"' + RestContext.request.params.get('startDate') + '"', DateTime.class);
        }
        if(RestContext.request.params.get('endDate') != null){
            endDate = (DateTime)JSON.deserialize('"' + RestContext.request.params.get('endDate') + '"', DateTime.class);
       }

        String query = 'SELECT Id,Name, Date_Time__c,Interviewer__r.Name, Interviewer__c, Job_Application__c, Duration__c, Job_Application__r.Candidate__r.First_Name__c,Job_Application__r.Candidate__r.Last_Name__c  FROM Interview__c WHERE ';
        Datetime currentDate = System.now();

        try{

            if(startDate == null && endDate == null){
                query += 'Date_Time__c >= :currentDate' ;
                return Database.query(query);
            }
            if(startDate != null && endDate != null){
                query += 'Date_Time__c >= :request.startDate AND Date_Time__c <= :request.endDate' ;
                return Database.query(query);
            }
            if(startDate != null && endDate == null){
                query += 'Date_Time__c >= :request.startDate' ;
                return Database.query(query);
            }
            if(startDate == null && endDate != null){
                query += 'Date_Time__c >= :currentDate AND Date_Time__c <= :request.endDate' ;
                return Database.query(query);
            }

            return null ;

        }catch(Exception e){
            System.debug('Error : ' + e.getMessage());
            return null ;
        }
    }


    @HttpPost
    global static Response updateInterview( Request interview) {
        Response response = new Response();
        Interview__c interviewToUpdate = new Interview__c();
        System.debug('before deserialize' ) ;

       // Request interview = (Request)json.deserialize(RestContext.request.requestBody.toString(), Request.class);

        if( interview == null){
            System.debug('Data not valid') ;
            return generateResponse(false ,'Data not valid') ;
        }

        if( interview.interviewId == null || interview.interviewerId.length() != 18 ){
            System.debug('Interview Id not valid') ;
            return generateResponse(false ,'Interview Id not valid') ;
        }
        System.debug('Id  : ' + interview.interviewId  ) ;
        interviewToUpdate = [SELECT Id,Name, Date_Time__c, Interviewer__c, Job_Application__c,Duration__c
                                            FROM Interview__c
                                            WHERE Id = :interview.interviewId WITH SECURITY_ENFORCED LIMIT 1 ];
        
        System.debug('query result  : ' + interviewToUpdate  ) ;
        if(interviewToUpdate == null){
            System.debug('Interview not found' ) ;
            return generateResponse(false ,'Interview not found' ) ;
        }

        if(interview.interviewerId == null || interview.jobApplicationId == null || interview.startDate == null ){
            System.debug('Missing required data' ) ;
            return generateResponse(false ,'Missing required data' ) ;
        }
        interviewToUpdate.Interviewer__c = interview.interviewerId;
        interviewToUpdate.Job_Application__c = interview.jobApplicationId; 
        interviewToUpdate.Duration__c = interview.duration ;
        interviewToUpdate.Date_Time__c = interview.startDate ;

        try{
            Database.SaveResult srList = Database.update(interviewToUpdate, true);
            return generateResponse(true , null) ;
        }catch(Exception e){
            return generateResponse(false , e.getMessage()) ;
        }
       
    }

    public static Response generateResponse (Boolean success ,  String message){
        Response response = new Response (); 
        response.isSuccess = success ; 
        response.errorMessage = message ; 
        return response ;
    }

    global with sharing class Request {

        public String interviewId ;
        public String interviewerId ;
        public String jobApplicationId ;
        public Datetime startDate ;
        public Decimal duration ;

    }

    global with sharing class Response {
        public Boolean isSuccess;
        public String errorMessage;
    }
   

}
