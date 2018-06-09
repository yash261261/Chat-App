

module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

    let users = []
    const messages = []

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {

        // on making a connection - load in the content already present on the server
        socket.emit('refresh-messages', messages)
        socket.emit('refresh-users', users)

        socket.on('join-user', userName => {
            let b = 'http://robohash.org/' + userName + '.png?set=set2'
            const user = {
                id: socket.id,
                name: userName,
                avatar : b
            }
            let flag =true;
            for(let i =0; i<users.length; i++)
            {
                if(users[i].name.toUpperCase() == userName.toUpperCase())
                {
                   flag =false;
                }

            }
                if(flag)
                {
                  users.push(user)
                 io.emit('successful-join', user)
                }
                else
                {
                     io.emit('failed-join', user.name)
                }
        })


        socket.on('send-message', data => {

            let a = 'http://robohash.org/' + data.user.name + '.png?set=set2'
            const content = {
                user: data.user,
                message: data.message,
                date: moment(new Date()).format('MM/DD/YY h:mm a'),
                avatar: a
            }
            console.log(content.avatar)
            messages.push(content)

            io.emit('successful-message', content)
        })

       

        socket.on('disconnect', () => {
            users = users.filter(user => {
                return user.id != socket.id
            })

            io.emit('refresh-users', users)
        })
    })
}
