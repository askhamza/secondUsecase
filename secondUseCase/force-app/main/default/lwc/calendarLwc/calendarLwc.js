import { LightningElement,wire, track } from 'lwc';
import NAVIGATE_ICON from '@salesforce/resourceUrl/navigate';
import { NavigationMixin } from 'lightning/navigation';
import LEFT_ICON from '@salesforce/resourceUrl/left';
import RIGHT_ICON from '@salesforce/resourceUrl/right';
import getEvents from '@salesforce/apex/SM_Event.getEventsByDate';


export default class CalendarLwc extends NavigationMixin(LightningElement) {

    dayHours = ["00 AM","01 AM","02 AM","03 AM","04 AM","05 AM","06 AM","07 AM","08 AM","09 AM","10 AM", "11 AM","12 AM",
                "01 PM","02 PM","03 PM","04 PM","05 PM","06 PM","07 PM","08 PM","09 PM","10 PM", "11 PM","12 PM" ];

    redirectIcon = NAVIGATE_ICON ; 
    tomorrowIcon = RIGHT_ICON ; 
    yesterdayIcon = LEFT_ICON ; 
    listEvents ;
    mapEvents =  []; 
    events = [];
    currentDate = new Date();
    filterDate = this.currentDate.toJSON().slice(0, 10);
    formatedDate = this.currentDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    @track listCopy  = [] ; 
    positionRedline = "top:"+this.convertHourToPixel(this.currentDate.getHours(),this.currentDate.getMinutes())+"px" ;


    
    

    @wire(getEvents, { day: '$filterDate'} )
    wiredMovieList(result){
        console.log('IN') ;   
        console.log('result  : ', result )  ;   
        console.log('result data : ', result.data )  ;   
        this.listEvents = result.data ;  
        this.listCopy = [];
        this.events = []; 
        this.mapEvents = [];
       if(result.data  != null){
            result.data.forEach(event => {

                let startDate = new Date(Date.parse(event.StartDateTime));
                let endDate = new Date(Date.parse(event.EndDateTime));

                console.log('start date : ', startDate) ; 
                console.log('end date : ', endDate) ; 

                let startPixel = this.convertHourToPixel(startDate.getHours(),startDate.getMinutes()) ;
                let endPixel = this.convertHourToPixel(endDate.getHours(),endDate.getMinutes()) ;
                let styleToAdd = "height: "+ event.DurationInMinutes  + "px; top: "+ startPixel + "px;" ;
                let time = startDate.getHours() + ":" + startDate.getMinutes() + " - " + endDate.getHours() + ":" + endDate.getMinutes() ;
                let contact = event.Who.Name ;
                console.log('contact : ' , contact);
                let item = {Subject : event.Subject , Style :styleToAdd , Time :time , Contact : contact} ;
                console.log('item ' ,  item) ;
                //this.listCopy.push(item);

                
                if(this.mapEvents.length === 0){
                    console.log('yes first element ');
                    let values =  []; 
                    values.push(item);
                    this.mapEvents.push({key : endPixel , value : values });
                }else{
                    let length = this.mapEvents.length ;
                    console.log('length : ' + length ); 
                    console.log('details element : ' , this.mapEvents[length-1]);
                    console.log('key last element : ' , this.mapEvents[length-1].key);
                    console.log('start pixel : ' + startPixel + ' end pixel : ' + this.mapEvents[length-1].key) ;
                    if(startPixel <= this.mapEvents[length-1].key){
                        console.log('length of map : ' + this.mapEvents.length) ;
                        console.log('Overlap');
                        let values =  []; 
                        values = this.mapEvents[length-1].value ; 
                        console.log('new list length before : ' +values.length );
                        values.push(item); 
                        console.log('new list length  after : ' +values.length );
                        this.mapEvents[length-1].value = values ;
                        if(endPixel > this.mapEvents[length-1].key){
                            console.log('change key '); 
                            console.log('last key : ' ,this.mapEvents[length-1].key ) ;
                            this.mapEvents[length-1].key = endPixel ;
                            console.log('new key : ' ,this.mapEvents[length-1].key ) ;
                        }
                        
                        console.log('length of map values (last item ) : ' , this.mapEvents[length-1]) ;

                    }else{
                        console.log('No Overlap');
                        let values =  []; 
                        values.push(item); 
                        this.mapEvents.push({key : endPixel , value : values });
                    }
                }
                
            });
            console.log('map length: ' + this.mapEvents.length ) ;
            console.log('map key : ' + this.mapEvents[0].key ) ;
            console.log('map value : ' ,this.mapEvents ) ;
            
            if(this.mapEvents.length != 0){
               
                this.mapEvents.forEach(e => {
                        let numberOfItems = e.value.length ; 
                        let left = 18;
                        console.log('number of item is : ' + numberOfItems) ;
                        if(numberOfItems > 0 ){
                            console.log('im in condition of number of items is more than 0 ') ;
                            e.value.forEach(subevent => {
                                let newWidth = 80/numberOfItems ;
                                console.log('100/? : ' + numberOfItems) ;
                                subevent.Style = subevent.Style + "width:"+ newWidth +"%; left:" +left +"%";
                                this.events.push(subevent);
                                left = left + newWidth;
                            });
                        }
                       
                });
                console.log('length of final list : ' ,this.events.length ) ;
                console.log('final list : ' ,this.events ) ;
            }
           
       }
       this.listCopy = this.events ; 
        console.log('copy ' ,  this.listCopy) ;
       
    }

    

    navigateToCalandar(){
      
        console.log('click handle');
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Event',
                actionName: 'home',
            },
        });

    }
     
   
   
    timer = setInterval(function() {
        let timerDate = new Date();
        this.positionRedline = "top:"+this.convertHourToPixel(timerDate.getHours(),timerDate.getMinutes())+"px" ;
        console.log('execute each 5 minute ');
    }, 60 * 1000 * 5); 
    

    convertHourToPixel( hour, minute){
        let pixel =  (hour * 60) + minute + 182;
        return pixel ;
    }

    todayHandler(){
        this.currentDate = new Date();
        this.filterDate = this.currentDate.toJSON().slice(0, 10);
        this.formatedDate = this.currentDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

        console.log('TODAY DAY : ' , this.filterDate) ;

    }

    addDay(){
    
        this.currentDate.setDate(this.currentDate.getDate() +1);
        console.log('ADD DAY : ' , this.currentDate) ;
        this.filterDate = this.currentDate.toJSON().slice(0, 10);
        this.formatedDate = this.currentDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

    }

    subtractDay(){
        
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        console.log('SUBTRACT DAY : ' , this.currentDate) ;
        this.filterDate = this.currentDate.toJSON().slice(0, 10);
        this.formatedDate = this.currentDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

    }
}
  
