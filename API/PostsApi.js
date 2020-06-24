import firebase from "firebase";


export async function getPosts(postsReceived){
    var postList = [];
    var snapshot = await firebase.firestore()
    .collection('posts')
    .orderBy('timestamp')
    .get()

    snapshot.forEach((doc) => {
        postList.push(doc.data());
    });
    // console.log(postList)
   
    // 
    
    [postsReceived(postList)];
    
}

export async function getUsers(usersReceived){
    var userList = [];
    var snapshot = await firebase.firestore()
    .collection('users')
    .orderBy('uid')
    .get()

    snapshot.forEach((doc) => {
        postList.push(doc.data());
    });

    [postsReceived(userList)];
    
}
