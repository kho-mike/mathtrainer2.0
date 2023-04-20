const app = {
    //
    show(currentStage = DB.currentStage){

        

        let app = document.getElementById('app');
        let mainMenu = document.getElementById('mainMenu');



        if(user.current){

            mainMenu.classList.remove('main__menu-hidden');

            mainMenu.innerHTML = this.HTMLmainMenu();
            

            switch (currentStage) {
                case "startExercise":
                    app.innerHTML = this.HTMLchooseOperation();
                    DB.currentStage = currentStage;
                    break;
    
                case "chooseOperand":
                    app.innerHTML = this.HTMLchooseOperand();
                    break;
    
                case "getAnswer":
                    app.innerHTML = this.HTMLgetAnswer();
                    break;

                case "userStatistic":
                    app.innerHTML = this.HTMLuserStatistic();
                    DB.currentStage = currentStage;
                    break;

                case "userSettings":
                    app.innerHTML = this.HTMLuserSettings();
                    DB.currentStage = currentStage;
                    break;                
            
                default:
                    break;
            };
        } else {
            //
            user.show_user_list();
        }

        if(this.temp.messages.length > 0){
            this.showMessages();
        }

        let input = document.getElementById('answer');
        if(input){
            input.focus();
        }
    },

    memory: {
        //
        timeStart: null,
        timeStop: null,
        timeLength: null,
        countAnsweres: 0,
        countRightAnsweres: 0,
        countWrongAnsweres: 0,

        rightAnsweres: [],
        wrongAnsweres: [],
        allAnsweres: [],

        operation: null,
        operand: null,
        operator: null,
    },

    temp: {
        currentStage: "chooseOperation",
        currentValue: null,
        currentResult: null,
        stage1: [],
        stage2: [],
        messages: [],
    },

    chooseOperation( inputOperation ){
        this.memory.operation = inputOperation;
        this.memory.operator = operators[inputOperation];
        this.show("chooseOperand");
    },

    chooseOperand( inputOperand ){

        this.memory.operand = inputOperand;
        this.memory.timeStart = new Date();

        const exerciseArray = exercises[`${this.memory.operation}_${this.memory.operand}`];

        for(let elem of exerciseArray){
            this.temp.stage1.push(elem);
        }

        while (this.temp.stage2.length < exerciseArray.length) {

            let randomIndex = Math.floor( Math.random()*exerciseArray.length);

            if(this.temp.stage2.indexOf(exerciseArray[randomIndex])>=0){
                continue;
            }
            this.temp.stage2.push(exerciseArray[randomIndex]);

        }

        this.temp.currentValue = this.temp.stage1[0][0];
        this.temp.currentResult = this.temp.stage1[0][1];
        this.temp.saved = "false";

        this.show("getAnswer");
    },

    getAnswer(inputAnswer){

        let answeres = this.memory.allAnsweres;
        let timeStart;
        let timeStop = new Date();

        if(answeres.length > 0){
            timeStart = answeres[answeres.length - 1].timeStop;
        }

        answeres.push( {
            timeStart: timeStart,
            timeStop: timeStop,
            timeLength: timeStop - timeStart,
            input: inputAnswer, 
            current: this.temp.currentResult,
        } );
        this.memory.countAnsweres++;

        if( this.checkAnswer(inputAnswer) ){
            this.memory.rightAnsweres.push( {input: inputAnswer, current: this.temp.currentResult,} );
            this.memory.countRightAnsweres++;

            this.showMessages( 'right', 'Молодец! Ответ верный!' );

            this.next();
        } else {
            this.memory.wrongAnsweres.push( {input: inputAnswer, current: this.temp.currentResult,} );
            this.memory.countWrongAnsweres++;

            this.showMessages( 'wrong', 'Попробуй еще разок...' );

        }

        this.show("getAnswer");

        if(answeres.length > 0){
            console.log(this.HTMLinfo());

            document.getElementById('app-wrapper__info').innerHTML = this.HTMLinfo();
        }

        

    },

    checkAnswer( inputAnswer ){
        return inputAnswer == this.temp.currentResult;
    },

    next(){
        let stage1 = this.temp.stage1;
        let stage2 = this.temp.stage2;

        if(stage1.length > 1){
            stage1.shift();
            this.temp.currentValue = stage1[0][0];
            this.temp.currentResult = stage1[0][1];
        } else if(stage2.length > 1){
            stage2.shift();
            this.temp.currentValue = stage2[0][0];
            this.temp.currentResult = stage2[0][1];
        } else {
            console.log('Всё!!!');
        }
    },

    showMessages(msgType, msgText){
        //
        if( document.getElementsByClassName('msg').length > 0 ){
            document.getElementById('msgBox').innerHTML = '';
        };
        let msg = document.createElement('div');
        let msgDate = new Date();
        let msgID = `${msgDate.getMinutes()}${msgDate.getSeconds()}${msgDate.getMilliseconds()}`;
        msg.id = msgID;
        msg.classList = `msg msg-${msgType} msg-created`
        msg.innerHTML = `
        <div class="msg__logo"><img src="icons/${msgType}.png" width="35" alt="info"></div>
        <div class="msg__body">
            <div class="msg__body-text">
                ${msgText}
            </div>
        </div>
        `;

        document.getElementById('msgBox').appendChild(msg);

        setTimeout(() => {
            msg.classList.add('msg-visible');
        }, 100);

        setTimeout(() => {
            this.hideMessages(msgID);
        }, 2000);

    },

    hideMessages(msgID){
        let msg = document.getElementById(msgID);

        if(msg){
            msg.classList.add('msg-hidden');
            setTimeout(() => { 
                if(msg){  
                    document.getElementById('msgBox').innerHTML = '';
                };
            }, 300);
        }

        
    },


    save(){

        if(this.temp.saved === "false"){
            this.memory.timeStop = new Date();
            this.memory.timeLength = this.memory.timeStop - this.memory.timeStart;

            user.current.archive.count++;
            user.current.archive[`${user.current.archive.count}`] = this.memory;
            this.temp.saved = "true";
        }
        
    },

    HTMLchooseOperation(){
            return `
                <div class="app-wrapper">
                    <div class="app__menu" id="first">
                        <div class="btn menu-item" id="multiplication" onclick="app.chooseOperation(this.id);">Умножение</div>
                        <div class="btn menu-item" id="division" onclick="app.chooseOperation(this.id);">Деление</div>
                        <div class="btn menu-item" id="composition" onclick="app.chooseOperation(this.id);">Состав числа</div>
                    </div>
                </div>
                `;
    },

    HTMLchooseOperand(){
        //
        let inner = `<div class="app-wrapper">
        <div class="menu" id="second">`;

        for(item of exercises[this.memory.operation]){
            inner += `
                <div class="btn menu-item" id="${item}" onclick="app.chooseOperand(this.id);">${item}</div>
            `;
        };

        inner += `
                </div>
            </div>
        `;

        return inner;
    },


    HTMLgetAnswer(){
        let inner = `<div class="app-wrapper" id="app-wrapper">`;

        if(this.temp.operation == 'composition'){
            inner += `
                <div class="app-wrapper__header">
                    Упражнение "СОСТАВ ЧИСЛА ${this.memory.operand}"
                </div>
                <div class="app-wrapper__content">
                    <div class="element" id="firstOperand"> ${ this.memory.operand } </div> 
                    <div class="element" id="operator">${ this.memory.operator }</div>
                    <input class="input-waiting" id="" type="text" autofocus onchange=" app.getAnswere(this.value); ">
                </div>
            `;
        } else {
            let operationRUS;
            if(this.memory.operation == 'multiplication'){
                operationRUS = 'УМНОЖЕНИЕ';
            } else if(this.memory.operation == 'division'){
                operationRUS = 'ДЕЛЕНИЕ';
            }
            inner += `
                <div class="app-wrapper__header">
                Упражнение "${operationRUS} НА ${this.memory.operand}"
                </div>
                <div class="app-wrapper__content">
                    <div class="element" id="firstOperand">${this.temp.currentValue}</div>
                    <div class="element" id="operator"> ${this.memory.operator} </div>
                    <div class="element" id="secondOperand">${this.memory.operand}</div>
                    <div class="element">=</div>
                    <input class="input-waiting" id="answer" type="text" autofocus onchange="app.getAnswer(this.value)">
                </div>
            `;
        };  
        
        inner += `<div class="app-wrapper__info" id="app-wrapper__info"></div>`

        inner += `</div>`;

        return inner;
    },

    HTMLmsg(msgType = '', msgText = ''){
        
        return ``;
    },


    HTMLuserStatistic(){
        return `This is page USER statistic`;
    },

    HTMLuserSettings(){
        return `This is page USER settings`;
    },

    HTMLmainMenu(){
        return `
            <div class="btn menu__item" id="startExercise" onclick="app.show(this.id);">Упражнение</div>
            <div class="btn menu__item" id="userStatistic" onclick="app.show(this.id);">Статистика</div>
            <div class="btn menu__item" id="userSettings" onclick="app.show(this.id);">Настройки</div>
        `;
    },

    HTMLinfo(){
        let info = `
        <div class="info__stat">
            <table class="table-stat" id="table-stat" cellspacing="0" cellpadding="5">
                <caption>Статистика упражнения</caption>
                <tr><td class="table-stat__first-col">Количество решенных примеров</td><td class="table-stat__second-col">${this.memory.rightAnsweres.length}</td></tr>
                <tr><td class="table-stat__first-col">Количество ошибок</td><td class="table-stat__second-col">${this.memory.wrongAnsweres.length}</td></tr>
                <tr><td class="table-stat__first-col">Всего введено ответов</td><td class="table-stat__second-col">${this.memory.allAnsweres.length}</td></tr>
                <tr><td class="table-stat__first-col">Время с начала упражнения</td><td class="table-stat__second-col">${this.memory.timeLength}</td></tr>
            </table>
        </div>
        <div class="info__log">
            <table class="table-log" id="table-log" cellspacing="0" cellpadding="5">
                <caption>Ввденные ответы:</caption>
                <tr>
                <th>Пример</th>
                <th>Ответ</th>
                <th>Ожидание</th>
                <th>Время</th>
                </tr>
        `;

        for (const item of this.memory.allAnsweres) {
            info += `
            <tr><td>34,5</td><td>3,5</td><td>36</td><td>${Math.round(item.timeLength/1000)} sec</td></tr>
            `;
        };

        info += `
        </table>
        </div>
        `;

        return info;
    },
}


if(DB.current){
    user.current = JSON.parse(DB.current);
}

window.addEventListener('unload', ()=>{
    if(user.current){
        app.save();
        DB.current = JSON.stringify(user.current);
    }
});

user.show();
app.show();