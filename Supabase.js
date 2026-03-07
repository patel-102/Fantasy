// KING Supabase Engine v3

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';

const BUCKET="king"

//////////////////////////////////////////////////
// CLIENT
//////////////////////////////////////////////////

window.supabase=createClient(
SUPABASE_URL,
SUPABASE_KEY,
{
auth:{
persistSession:true,
autoRefreshToken:true,
detectSessionInUrl:true
}
}
)

//////////////////////////////////////////////////
// AUTH LISTENER
//////////////////////////////////////////////////

supabase.auth.onAuthStateChange((event,session)=>{

if(event==="SIGNED_OUT"){
location.href="login.html"
}

})

//////////////////////////////////////////////////
// SESSION
//////////////////////////////////////////////////

async function getSession(){

const {data:{session}}=await supabase.auth.getSession()

return session

}

//////////////////////////////////////////////////
// INDEXEDDB OFFLINE CACHE
//////////////////////////////////////////////////

const DB="KING_DB"
const STORE="profiles"

function openDB(){

return new Promise((resolve,reject)=>{

let req=indexedDB.open(DB,1)

req.onupgradeneeded=e=>{
let db=e.target.result
db.createObjectStore(STORE)
}

req.onsuccess=e=>resolve(e.target.result)
req.onerror=e=>reject(e)

})

}

async function cacheSet(key,value){

let db=await openDB()

let tx=db.transaction(STORE,"readwrite")

tx.objectStore(STORE).put(value,key)

}

async function cacheGet(key){

let db=await openDB()

return new Promise(resolve=>{

let tx=db.transaction(STORE,"readonly")

let req=tx.objectStore(STORE).get(key)

req.onsuccess=()=>resolve(req.result)
req.onerror=()=>resolve(null)

})

}

//////////////////////////////////////////////////
// OFFLINE-FIRST PROFILE LOADER
//////////////////////////////////////////////////

async function loadProfile(userId){

// 1️⃣ load cached first

let cached=await cacheGet(userId)

if(cached){

// update in background

refreshProfile(userId)

return cached

}

// 2️⃣ fetch from server

return refreshProfile(userId)

}

async function refreshProfile(userId){

let {data}=await supabase
.from("profiles_view")
.select("*")
.eq("id",userId)
.single()

if(data){
cacheSet(userId,data)
}

return data

}

//////////////////////////////////////////////////
// REALTIME PROFILE UPDATE SYSTEM
//////////////////////////////////////////////////

let profileChannel

function subscribeProfile(userId,callback){

profileChannel=supabase.channel("profile-updates")

profileChannel
.on(
"postgres_changes",
{
event:"UPDATE",
schema:"public",
table:"profiles",
filter:`id=eq.${userId}`
},
payload=>{

let updated=payload.new

cacheSet(userId,updated)

if(callback) callback(updated)

}
)
.subscribe()

}

//////////////////////////////////////////////////
// PRESENCE SYSTEM
//////////////////////////////////////////////////

let presenceChannel

async function startPresence(){

let session=await getSession()

if(!session) return

let user=session.user

presenceChannel=supabase.channel("online-users")

presenceChannel
.on("presence",{event:"sync"},()=>{})

.subscribe(async status=>{

if(status==="SUBSCRIBED"){

presenceChannel.track({
user_id:user.id,
online_at:new Date().toISOString()
})

}

})

}

//////////////////////////////////////////////////
// LAST ACTIVE HEARTBEAT
//////////////////////////////////////////////////

async function updateLastActive(){

let session=await getSession()

if(!session) return

await supabase
.from("profiles")
.update({last_active:new Date()})
.eq("id",session.user.id)

}

setInterval(updateLastActive,30000)

//////////////////////////////////////////////////
// AUTO RETRY NETWORK SYSTEM
//////////////////////////////////////////////////

async function retry(fn,retries=3){

try{

return await fn()

}catch(e){

if(retries<=0) throw e

await new Promise(r=>setTimeout(r,1000))

return retry(fn,retries-1)

}

}

//////////////////////////////////////////////////
// AVATAR UPLOAD
//////////////////////////////////////////////////

async function uploadAvatar(file,userId,oldUrl){

return retry(async()=>{

let path="avatar/"+userId+"_"+Date.now()

await supabase.storage
.from(BUCKET)
.upload(path,file,{upsert:true})

let {data}=supabase.storage
.from(BUCKET)
.getPublicUrl(path)

if(oldUrl){

let old=oldUrl.split("/").pop()

await supabase.storage
.from(BUCKET)
.remove(["avatar/"+old])

}

await supabase
.from("profiles")
.update({
avatar_url:data.publicUrl
})
.eq("id",userId)

return data.publicUrl

})

}

//////////////////////////////////////////////////
// GALLERY UPLOAD
//////////////////////////////////////////////////

async function uploadGallery(file,userId,isPublic=true){

return retry(async()=>{

let path="gallery/"+userId+"_"+Date.now()

await supabase.storage
.from(BUCKET)
.upload(path,file)

let {data}=supabase.storage
.from(BUCKET)
.getPublicUrl(path)

await supabase
.from("gallery")
.insert({
user_id:userId,
image_url:data.publicUrl,
is_public:isPublic
})

return data.publicUrl

})

}

//////////////////////////////////////////////////
// DELETE GALLERY IMAGE
//////////////////////////////////////////////////

async function deleteGallery(id,url){

return retry(async()=>{

let file=url.split("/").pop()

await supabase.storage
.from(BUCKET)
.remove(["gallery/"+file])

await supabase
.from("gallery")
.delete()
.eq("id",id)

})

}

//////////////////////////////////////////////////
// AUTH HELPERS
//////////////////////////////////////////////////

async function login(email,password){

let {error}=await supabase.auth.signInWithPassword({
email,
password
})

if(error) alert(error.message)
else location.href="profile.html"

}

async function register(email,password){

if(password.length<6){
alert("Password must be 6+ characters")
return
}

let {error}=await supabase.auth.signUp({
email,
password
})

if(error) alert(error.message)
else alert("Verification email sent")

}

async function logout(){

await supabase.auth.signOut()

}

//////////////////////////////////////////////////
// EXPORT
//////////////////////////////////////////////////

window.KING={

getSession,
login,
register,
logout,

startPresence,

loadProfile,
subscribeProfile,

uploadAvatar,
uploadGallery,
deleteGallery

}
