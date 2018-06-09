// Chat Component
const chatComponent = {
    template: ` <div class="chat-box">
                   <p v-for="data in content">
                       <img v-bind:src ="data.avatar" class="circle" width="30px">
                       <span><strong>{{data.user.name}}</strong> <small>{{data.date}}</small><span>
                       <br />
                       {{data.message}}
                   </p>
               </div>`,
    props: ['content']
}

// Users Component
const usersComponent = {
    template: ` <div class="user-list">
                   <h6>Active Users ({{users.length}})</h6>
                   <ul v-for="user in users">
                       <li>
                            <img v-bind:src ="user.avatar" class="circle" width="30px">
                            <span>{{user.name}}</span>
                       </li>
                       <hr>
                   </ul>
               </div>`,
    props: ['users']
}

// Welcome Component

const welcomeUsers = {
    template : `
        <div class="welcome">
        <h3>Welcome</h3>
        <img v-bind:src= "user.avatar" style="width:4em" class="circle">
        <div>{{user.name}}</div>
        </div>
        `,

    props: ['user']
}

// failed user component

const faileduser = {

    template: ` <div>
                       <li>
                            <span>{{name}} already exits.</span>
                       </li>
                       <hr>
                   </ul>
               </div>`,
    props: ['name']
}


const socket = io()
const app = new Vue({
    el: '#chat-app',
    data: {
        loggedIn: false,
        userName: '',
        user: {},
        users: [],
        message: '',
        messages: [],
        same : false
    },
    methods: {
        joinUser: function () {
            if (!this.userName)
                return

            socket.emit('join-user', this.userName)
        },
        sendMessage: function () {
            if (!this.message)
                return

            socket.emit('send-message', { message: this.message, user: this.user })
        }
    },
    components: {
        'users-component': usersComponent,
        'chat-component': chatComponent,
        'faileduser': faileduser,
        'welcome-component': welcomeUsers
    }
})


// Client Side Socket Event
socket.on('refresh-messages', messages => {
    app.messages = messages
})
socket.on('refresh-users', users => {
    app.users = users
})

socket.on('successful-join', user => {
    // the successful-join event is emitted on all connections (open browser windows)
    // so we need to ensure the loggedIn is set to true and user is set for matching user only
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
    }

    app.users.push(user)
})

socket.on('failed-join', user => {
    app.loggedIn = false
    app.same = true

})

socket.on('successful-message', content => {
    // clear the message after success send
    app.message = ''
    app.messages.push(content)
})
