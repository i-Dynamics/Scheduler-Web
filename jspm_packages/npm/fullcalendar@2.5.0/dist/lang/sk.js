/* */ 
"format cjs";
!function(a){"function"==typeof define&&define.amd?define(["jquery","moment"],a):a(jQuery,moment)}(function(a,b){function c(a){return a>1&&5>a}function d(a,b,d,e){var f=a+" ";switch(d){case"s":return b||e?"pár sekúnd":"pár sekundami";case"m":return b?"minúta":e?"minútu":"minútou";case"mm":return b||e?f+(c(a)?"minúty":"minút"):f+"minútami";case"h":return b?"hodina":e?"hodinu":"hodinou";case"hh":return b||e?f+(c(a)?"hodiny":"hodín"):f+"hodinami";case"d":return b||e?"deň":"dňom";case"dd":return b||e?f+(c(a)?"dni":"dní"):f+"dňami";case"M":return b||e?"mesiac":"mesiacom";case"MM":return b||e?f+(c(a)?"mesiace":"mesiacov"):f+"mesiacmi";case"y":return b||e?"rok":"rokom";case"yy":return b||e?f+(c(a)?"roky":"rokov"):f+"rokmi"}}var e="január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),f="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");(b.defineLocale||b.lang).call(b,"sk",{months:e,monthsShort:f,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(e,f),weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:d,m:d,mm:d,h:d,hh:d,d:d,dd:d,M:d,MM:d,y:d,yy:d},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.fullCalendar.datepickerLang("sk","sk",{closeText:"Zavrieť",prevText:"&#x3C;Predchádzajúci",nextText:"Nasledujúci&#x3E;",currentText:"Dnes",monthNames:["január","február","marec","apríl","máj","jún","júl","august","september","október","november","december"],monthNamesShort:["Jan","Feb","Mar","Apr","Máj","Jún","Júl","Aug","Sep","Okt","Nov","Dec"],dayNames:["nedeľa","pondelok","utorok","streda","štvrtok","piatok","sobota"],dayNamesShort:["Ned","Pon","Uto","Str","Štv","Pia","Sob"],dayNamesMin:["Ne","Po","Ut","St","Št","Pia","So"],weekHeader:"Ty",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""}),a.fullCalendar.lang("sk",{buttonText:{month:"Mesiac",week:"Týždeň",day:"Deň",list:"Rozvrh"},allDayText:"Celý deň",eventLimitText:function(a){return"+ďalšie: "+a}})});