const app=require('./app')
const config=require('./utils/config')

app.listen(5000,()=>{
    console.log('server runing on', config.PORT)
})