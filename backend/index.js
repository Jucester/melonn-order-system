const app = require('./src/app');

app.listen(app.get('PORT'), () => {
    console.log('Server on port ', app.get('PORT'))
});