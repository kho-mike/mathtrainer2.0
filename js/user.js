const user = {

    register(){
        let login = document.getElementById('form-reg_login').value;
        let name = document.getElementById('form-reg_name').value;
        DB[`user-${login}`] = JSON.stringify({
            login: login,
            name: name,
            avatar: 0,
            archive: {
                count: 0,
            },
        })
        window.location.reload();
    },

    signin(id){
        this.current = JSON.parse(DB[id]);
        window.location.reload();
    },

    signout(){

        DB[`user-${this.current.login}`] = JSON.stringify(this.current);

        delete this.current;
        delete DB.current;

        window.location.reload();
    },

    list(){
        return Object.keys(DB).filter( (elem)=>{
            return elem.includes('user-');
        } );
    },

    choose(id){
        this.current = JSON.parse(DB[id]);
    },

    show(){
        if(this.current){
            let user = document.getElementById('user');


            user.innerHTML = `
            <div class="user">
                <img src="img/avatar${this.current.avatar}.png" class="header__user-avatar" alt="ava" width="54">
                <div class="header__user-name">
                    ${this.current.name}
                </div>
            </div>
            <div class="btn user__btn-exit" onclick="user.signout();"><p>Exit</p></div>
            `;
        }

    },

    show_register_form(){
        let app = document.getElementById('app');

        app.innerHTML = `
        <div class="user-register">
            <div class="login">
                <label for="login">Логин: </label><input type="text" id="login">
            </div>
            <div class="name">
                <label for="name">Имя: </label><input type="text" id="name">
            </div>
            <div class="control">
                <div class="btn" onclick="user.register();">
                    Зарегистрироваться
                </div>
            </div>
        </div>
        `;
    },

    show_user_list(){
        let app = document.getElementById('app');
        let user_list = this.list();
        app.innerHTML = '';
        if(app && user_list.length > 0){
            for (const user_item of user_list) {
                let user = JSON.parse(DB[user_item]);
                app.innerHTML += `
                <div class="btn user-list__item" id="user-${ user.login}" onclick="user.signin(this.id);">
                    ${ user.name}
                </div>
            `;;
            }
        } else {
            app.innerHTML = `<p>Нет зарегистрированных пользователей</p>`+ this.HTML__register_form();
        };
    },




    HTML__user_list(){
        return `
            <div class="user-list__box">
                <div class="name">${this.current.name}</div>
            </div>
        `;
    },

    HTML__register_form(){
        return `
        <div class="app-wrapper__header">
                        Users in DB are not hound!
                    </div>

                    <div class="app-wrapper__content">
                        <div class="form-reg">
                            <div class="form-reg__header">
                                Регистрация нового пользователя
                            </div>
                            <table>
                                <tr>
                                    <td><label for="form-reg_login">Логин</label></td><td><input type="text" id="form-reg_login"></td>
                                </tr>
                                <tr>
                                    <td><label for="form-reg_name">Имя</label></td><td><input type="text" id="form-reg_name"></td>
                                </tr>
                            </table>
                            <div class="form-reg__control">
                                <div class="btn" onclick="user.register();">Зарегистрироваться</div>
                            </div>
                        </div>
                    </div>
        `;

    },
};